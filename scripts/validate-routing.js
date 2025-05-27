/**
 * Route Validator Script
 * 
 * This script validates subdomain and path-based routing by making requests to different
 * URL patterns and checking for 404 errors or other issues.
 * 
 * Run with: node scripts/validate-routing.js <username>
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');
const readline = require('readline');

// Configuration
const isProd = process.env.NODE_ENV === 'production';
const config = {
  // Main domain configuration
  mainDomain: isProd ? 'minispace.dev' : 'localhost',
  port: isProd ? 443 : 3000,
  protocol: isProd ? 'https:' : 'http:',
  
  // For development, use 127.0.0.1 instead of localhost for subdomain testing
  // This is because *.localhost doesn't resolve properly without special DNS configuration
  devSubdomainHost: '127.0.0.1',
  
  // Testing settings
  requestTimeout: 10000, // 10 seconds (increased for slower connections)
  maxConcurrentRequests: 3, // Reduced to avoid overwhelming the server
  
  // Route patterns to test (will be prefixed with username for path-based routing)
  routePatterns: [
    '/',
    '/posts',
    '/about',
    '/post/sample-post', // Assumes a post with this slug exists
  ],
  
  // HTTP client to use based on protocol
  httpClient: isProd ? https : http,

  // Username to test with
  username: process.argv[2] || 'demouser' // Default to demouser if not specified
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Request a URL and return a promise with the response
function requestUrl(url) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Request timed out for ${url}`));
    }, config.requestTimeout);
    
    const options = {
      headers: {
        'User-Agent': 'Minispace-Route-Validator/1.0'
      }
    };
    
    const req = config.httpClient.get(url, options, (res) => {
      clearTimeout(timeout);
      
      // Collect the response data
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          url,
          statusCode: res.statusCode,
          headers: res.headers,
          data: data.substring(0, 1000) // Just get the first 1000 chars
        });
      });
    });
    
    req.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

// Generate test URLs for both subdomain and path-based routing
function generateTestUrls() {
  const urls = [];
  const { username, mainDomain, devSubdomainHost, port, protocol, routePatterns } = config;
  
  console.log(`${colors.bright}Generating test URLs for username: ${colors.cyan}${username}${colors.reset}`);
  
  // Subdomain URLs - in dev mode, use IP address instead of localhost
  let subdomainHost;
  if (isProd) {
    subdomainHost = `${username}.${mainDomain}`;
  } else {
    // For development, we need to handle subdomain testing differently
    // Add entries to /etc/hosts notice for the user
    console.log(`${colors.yellow}Note: For subdomain testing in development, you need to add entries to your /etc/hosts file:${colors.reset}`);
    console.log(`${colors.cyan}127.0.0.1 ${username}.localhost${colors.reset}`);
    
    // We'll try both localhost and IP for maximum compatibility
    subdomainHost = `${username}.localhost`;
  }
  
  const subdomainBase = `${protocol}//${subdomainHost}${isProd ? '' : ':' + port}`;
  
  routePatterns.forEach(pattern => {
    urls.push({
      url: `${subdomainBase}${pattern}`,
      type: 'subdomain',
      pattern
    });
  });
  
  // Path-based URLs
  const pathBase = `${protocol}//${mainDomain}${isProd ? '' : ':' + port}`;
  
  routePatterns.forEach(pattern => {
    const pathPattern = pattern === '/' ? `/${username}` : `/${username}${pattern}`;
    urls.push({
      url: `${pathBase}${pathPattern}`,
      type: 'path-based',
      pattern: pathPattern
    });
  });
  
  console.log(`${colors.bright}Generated ${urls.length} test URLs${colors.reset}`);
  return urls;
}

// Process URLs in batches to avoid overwhelming the server
async function processUrlBatch(urls) {
  const results = [];
  
  for (let i = 0; i < urls.length; i += config.maxConcurrentRequests) {
    const batch = urls.slice(i, i + config.maxConcurrentRequests);
    
    console.log(`${colors.bright}Testing batch of ${batch.length} URLs (${i+1} to ${i+batch.length} of ${urls.length})${colors.reset}`);
    
    const batchPromises = batch.map(async (urlInfo) => {
      try {
        process.stdout.write(`Testing ${urlInfo.type} URL: ${urlInfo.url} ... `);
        
        const response = await requestUrl(urlInfo.url);
        
        let status;
        if (response.statusCode === 200) {
          status = `${colors.green}OK (200)${colors.reset}`;
        } else if (response.statusCode >= 300 && response.statusCode < 400) {
          status = `${colors.yellow}REDIRECT (${response.statusCode})${colors.reset}`;
        } else if (response.statusCode === 404) {
          status = `${colors.red}NOT FOUND (404)${colors.reset}`;
        } else {
          status = `${colors.red}ERROR (${response.statusCode})${colors.reset}`;
        }
        
        console.log(status);
        
        // Check for routing issues
        const routingIssues = [];
        
        // Check if there's X-Minispace headers in the response
        if (urlInfo.type === 'subdomain') {
          if (!response.headers['x-minispace-rewritten-from-subdomain']) {
            routingIssues.push('Missing X-Minispace-Rewritten-From-Subdomain header');
          }
          
          if (response.headers['x-minispace-username'] !== config.username) {
            routingIssues.push(`Username mismatch in headers: expected ${config.username}, got ${response.headers['x-minispace-username']}`);
          }
        }
        
        return {
          ...urlInfo,
          statusCode: response.statusCode,
          success: response.statusCode === 200,
          redirect: response.statusCode >= 300 && response.statusCode < 400,
          error: response.statusCode >= 400,
          routingIssues,
          responseHeaders: response.headers,
        };
      } catch (error) {
        console.log(`${colors.red}ERROR: ${error.message}${colors.reset}`);
        return {
          ...urlInfo,
          error: true,
          errorMessage: error.message
        };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
}

// Compare subdomain and path-based results to check for inconsistencies
function analyzeResults(results) {
  const subdomainResults = results.filter(r => r.type === 'subdomain');
  const pathResults = results.filter(r => r.type === 'path-based');
  
  console.log('\n');
  console.log(`${colors.bright}${colors.magenta}====== ROUTING VALIDATION RESULTS ======${colors.reset}`);
  console.log('\n');
  
  // Check for 404s
  const subdomain404s = subdomainResults.filter(r => r.statusCode === 404);
  const path404s = pathResults.filter(r => r.statusCode === 404);
  
  if (subdomain404s.length > 0) {
    console.log(`${colors.red}${colors.bright}⚠️ Found ${subdomain404s.length} 404 errors in subdomain routing:${colors.reset}`);
    subdomain404s.forEach(r => {
      console.log(`  - ${r.url}`);
    });
    console.log('\n');
  }
  
  if (path404s.length > 0) {
    console.log(`${colors.red}${colors.bright}⚠️ Found ${path404s.length} 404 errors in path-based routing:${colors.reset}`);
    path404s.forEach(r => {
      console.log(`  - ${r.url}`);
    });
    console.log('\n');
  }
  
  // Check for inconsistencies between subdomain and path-based
  console.log(`${colors.bright}Checking for inconsistencies between subdomain and path routing...${colors.reset}`);
  
  subdomainResults.forEach(subdomainResult => {
    // Find the equivalent path-based result
    const equivalentPathResult = pathResults.find(pr => {
      return pr.pattern === `/${config.username}${subdomainResult.pattern === '/' ? '' : subdomainResult.pattern}`;
    });
    
    if (!equivalentPathResult) {
      console.log(`${colors.yellow}⚠️ No equivalent path-based route for subdomain route: ${subdomainResult.url}${colors.reset}`);
      return;
    }
    
    // Check if one worked but the other didn't
    if (subdomainResult.statusCode !== equivalentPathResult.statusCode) {
      console.log(`${colors.red}⚠️ Status code mismatch:${colors.reset}`);
      console.log(`  Subdomain: ${subdomainResult.url} - ${subdomainResult.statusCode}`);
      console.log(`  Path-based: ${equivalentPathResult.url} - ${equivalentPathResult.statusCode}`);
    }
  });
  
  // Summary
  const totalRequests = results.length;
  const successful = results.filter(r => r.success).length;
  const redirects = results.filter(r => r.redirect).length;
  const errors = results.filter(r => r.error).length;
  
  console.log('\n');
  console.log(`${colors.bright}${colors.magenta}====== SUMMARY ======${colors.reset}`);
  console.log(`${colors.bright}Total requests: ${totalRequests}${colors.reset}`);
  console.log(`${colors.green}✅ Successful (200): ${successful}${colors.reset}`);
  console.log(`${colors.yellow}➡️ Redirects (3xx): ${redirects}${colors.reset}`);
  console.log(`${colors.red}❌ Errors (4xx/5xx): ${errors}${colors.reset}`);
  
  // Overall status
  if (errors === 0) {
    console.log(`\n${colors.green}${colors.bright}✅ All routes validated successfully!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}${colors.bright}❌ Found ${errors} routing errors that need to be fixed.${colors.reset}`);
  }
}

// Interactive mode to test custom URLs
async function interactiveMode() {
  console.log(`\n${colors.bright}${colors.magenta}====== INTERACTIVE MODE ======${colors.reset}`);
  console.log(`${colors.bright}Enter URLs to test, one per line. Type "exit" to quit.${colors.reset}\n`);
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const askForUrl = () => {
    rl.question(`${colors.bright}Enter URL to test: ${colors.reset}`, async (input) => {
      if (input.toLowerCase() === 'exit') {
        rl.close();
        return;
      }
      
      try {
        // Parse the URL to validate it
        let url = input;
        if (!url.startsWith('http')) {
          url = `${config.protocol}//${url}`;
        }
        
        const parsedUrl = new URL(url);
        
        // Test the URL
        const response = await requestUrl(url);
        
        console.log(`${colors.bright}Status: ${response.statusCode === 200 ? colors.green : colors.red}${response.statusCode}${colors.reset}`);
        console.log(`${colors.bright}Headers: ${colors.reset}`);
        Object.entries(response.headers).forEach(([key, value]) => {
          if (key.startsWith('x-minispace')) {
            console.log(`  ${colors.cyan}${key}: ${value}${colors.reset}`);
          }
        });
        
        // Show a bit of the response body
        console.log(`${colors.bright}Response preview:${colors.reset}`);
        console.log(response.data.substring(0, 200) + '...');
      } catch (error) {
        console.log(`${colors.red}Error: ${error.message}${colors.reset}`);
      }
      
      askForUrl();
    });
  };
  
  askForUrl();
}

// Run the validation
async function runValidation() {
  try {
    console.log(`${colors.bright}${colors.magenta}====== MINISPACE ROUTING VALIDATOR ======${colors.reset}`);
    console.log(`${colors.bright}Mode: ${isProd ? 'Production' : 'Development'}${colors.reset}`);
    console.log(`${colors.bright}Username: ${colors.cyan}${config.username}${colors.reset}`);
    console.log('\n');
    
    const urls = generateTestUrls();
    const results = await processUrlBatch(urls);
    
    analyzeResults(results);
    
    // Offer interactive mode
    console.log('\n');
    console.log(`${colors.bright}${colors.magenta}Would you like to test specific URLs interactively? (y/n)${colors.reset}`);
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        rl.close();
        interactiveMode();
      } else {
        rl.close();
      }
    });
  } catch (error) {
    console.error(`${colors.red}${colors.bright}Error running validation: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Start the validation
runValidation();
