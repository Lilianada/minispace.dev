/**
 * Subdomain Request Simulator
 * 
 * This script simulates requests to both subdomain and path-based routes
 * to help diagnose routing issues by comparing responses
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

// Configuration
const TEST_USERNAME = 'testuser';  // Change this to an actual username in your system
const PATHS_TO_TEST = [
  '/',
  '/posts',
  '/about',
  '/post/sample-post',
  '/projects',  // Testing a potentially custom route
];

// Test environments
const ENVIRONMENTS = [
  {
    name: 'Development (Path-based)',
    baseUrl: `http://localhost:3000/${TEST_USERNAME}`,
    headers: {
      'Host': 'localhost:3000'
    }
  },
  {
    name: 'Development (Subdomain)',
    baseUrl: `http://${TEST_USERNAME}.localhost:3000`,
    headers: {
      'Host': `${TEST_USERNAME}.localhost:3000`
    }
  },
  {
    name: 'Production (Path-based)',
    baseUrl: `https://minispace.dev/${TEST_USERNAME}`,
    headers: {
      'Host': 'minispace.dev'
    }
  },
  {
    name: 'Production (Subdomain)',
    baseUrl: `https://${TEST_USERNAME}.minispace.dev`,
    headers: {
      'Host': `${TEST_USERNAME}.minispace.dev`
    }
  }
];

// Track results
const results = {
  success: 0,
  failure: 0,
  details: []
};

/**
 * Make an HTTP request with custom headers
 */
function makeRequest(url, headers) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: headers
    };

    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

/**
 * Test a specific route in a specific environment
 */
async function testRoute(environment, path) {
  const url = environment.baseUrl + (path === '/' && environment.baseUrl.endsWith('/') ? '' : path);
  console.log(`Testing [${environment.name}]: ${url}`);
  
  try {
    const response = await makeRequest(url, environment.headers);
    
    const success = response.statusCode >= 200 && response.statusCode < 300;
    const result = {
      environment: environment.name,
      url,
      path,
      statusCode: response.statusCode,
      success,
      contentLength: response.data.length,
      contentPreview: response.data.substring(0, 100) + '...'
    };
    
    if (success) {
      results.success++;
      console.log(`  ✅ Status: ${response.statusCode}, Size: ${response.data.length} bytes`);
      
      // Check for signs of proper rendering
      const hasBody = response.data.includes('<body');
      const hasContent = response.data.includes(`${TEST_USERNAME}`);
      if (!hasBody || !hasContent) {
        console.log(`  ⚠️  Warning: Response may not be properly rendered HTML`);
        result.warning = 'Response may not be properly rendered HTML';
      }
    } else {
      results.failure++;
      console.log(`  ❌ Status: ${response.statusCode}`);
      result.error = 'Non-success status code';
    }
    
    results.details.push(result);
    return result;
  } catch (error) {
    results.failure++;
    const result = {
      environment: environment.name,
      url,
      path,
      success: false,
      error: error.message
    };
    results.details.push(result);
    console.log(`  ❌ Error: ${error.message}`);
    return result;
  }
}

/**
 * Compare results between path-based and subdomain routing for the same path
 */
function analyzeResults() {
  console.log('\n=== ANALYSIS SUMMARY ===');
  console.log(`Total tests: ${results.success + results.failure}`);
  console.log(`✅ Successful: ${results.success}`);
  console.log(`❌ Failed: ${results.failure}`);
  
  // Group by path for comparison
  const pathResults = {};
  
  results.details.forEach(result => {
    if (!pathResults[result.path]) {
      pathResults[result.path] = [];
    }
    pathResults[result.path].push(result);
  });
  
  console.log('\n=== PATH COMPARISONS ===');
  
  Object.entries(pathResults).forEach(([path, results]) => {
    console.log(`\n📝 Path: ${path}`);
    
    const devPath = results.find(r => r.environment === 'Development (Path-based)');
    const devSubdomain = results.find(r => r.environment === 'Development (Subdomain)');
    const prodPath = results.find(r => r.environment === 'Production (Path-based)');
    const prodSubdomain = results.find(r => r.environment === 'Production (Subdomain)');
    
    // Compare dev results
    if (devPath && devSubdomain) {
      const devMatches = devPath.success === devSubdomain.success;
      console.log(`  Development: ${devMatches ? '✅ Consistent' : '❌ Inconsistent'}`);
      
      if (!devMatches) {
        console.log(`    Path-based: ${devPath.success ? 'Success' : `Failed (${devPath.statusCode || devPath.error})`}`);
        console.log(`    Subdomain: ${devSubdomain.success ? 'Success' : `Failed (${devSubdomain.statusCode || devSubdomain.error})`}`);
      }
      
      // If both succeeded, compare content length
      if (devPath.success && devSubdomain.success) {
        const sizeDiff = Math.abs(devPath.contentLength - devSubdomain.contentLength);
        const percentDiff = (sizeDiff / devPath.contentLength) * 100;
        
        if (percentDiff > 10) {
          console.log(`    ⚠️  Content size differs by ${percentDiff.toFixed(1)}%`);
        }
      }
    }
    
    // Compare prod results
    if (prodPath && prodSubdomain) {
      const prodMatches = prodPath.success === prodSubdomain.success;
      console.log(`  Production: ${prodMatches ? '✅ Consistent' : '❌ Inconsistent'}`);
      
      if (!prodMatches) {
        console.log(`    Path-based: ${prodPath.success ? 'Success' : `Failed (${prodPath.statusCode || prodPath.error})`}`);
        console.log(`    Subdomain: ${prodSubdomain.success ? 'Success' : `Failed (${prodSubdomain.statusCode || prodSubdomain.error})`}`);
      }
      
      // If both succeeded, compare content length
      if (prodPath.success && prodSubdomain.success) {
        const sizeDiff = Math.abs(prodPath.contentLength - prodSubdomain.contentLength);
        const percentDiff = (sizeDiff / prodPath.contentLength) * 100;
        
        if (percentDiff > 10) {
          console.log(`    ⚠️  Content size differs by ${percentDiff.toFixed(1)}%`);
        }
      }
    }
  });
  
  console.log('\n=== SUBDOMAIN ROUTING ISSUES ===');
  
  // Check for consistent subdomain failures
  const subdomainFailures = results.details.filter(r => 
    r.environment.includes('Subdomain') && !r.success
  );
  
  if (subdomainFailures.length > 0) {
    console.log(`Found ${subdomainFailures.length} subdomain routing failures:`);
    
    subdomainFailures.forEach(failure => {
      console.log(`  ❌ [${failure.environment}] ${failure.url}: ${failure.statusCode || failure.error}`);
    });
    
    console.log('\nPotential issues:');
    console.log('1. DNS configuration - Make sure wildcard DNS (*.minispace.dev) is properly configured');
    console.log('2. Middleware rewrite rules - Verify subdomain detection and path rewriting');
    console.log('3. Link transformation - Check if links in HTML match the current routing mode');
    console.log('4. Vercel configuration - Ensure proper handling of subdomains in vercel.json');
  } else {
    console.log('✅ No subdomain routing failures detected!');
  }
  
  console.log('\n=== TEST COMPLETE ===');
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('=== TESTING SUBDOMAIN ROUTING ===');
  console.log(`Username: ${TEST_USERNAME}`);
  console.log(`Paths to test: ${PATHS_TO_TEST.join(', ')}`);
  console.log(`Environments: ${ENVIRONMENTS.map(e => e.name).join(', ')}`);
  console.log('=================================\n');
  
  // Test each path in each environment
  for (const env of ENVIRONMENTS) {
    console.log(`\n[${env.name}]`);
    for (const path of PATHS_TO_TEST) {
      await testRoute(env, path);
    }
  }
  
  // Compare and analyze results
  analyzeResults();
}

// Start the tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
