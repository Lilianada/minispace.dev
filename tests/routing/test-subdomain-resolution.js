/**
 * Test Subdomain Resolution
 * 
 * This script helps diagnose subdomain resolution issues for local development.
 * It checks DNS resolution and tests HTTP connections to subdomains.
 * 
 * Usage: node scripts/test-subdomain-resolution.js [username]
 */

const dns = require('dns');
const http = require('http');
const { promisify } = require('util');

const resolveIP = promisify(dns.lookup);
const DEFAULT_USERNAME = 'demouser';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  bright: '\x1b[1m'
};

// Test configurations
const username = process.argv[2] || DEFAULT_USERNAME;
const PORT = 3000;
const testDomains = [
  { name: 'Main domain', host: 'localhost' },
  { name: 'Subdomain with localhost', host: `${username}.localhost` },
  { name: 'Direct IP', host: '127.0.0.1' },
];

// Helper function to check DNS resolution
async function checkDnsResolution(hostname) {
  try {
    const result = await resolveIP(hostname);
    return {
      success: true,
      ip: result.address,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Helper function to test HTTP connection
function testHttpConnection(hostname, port, path = '/') {
  return new Promise((resolve) => {
    const url = `http://${hostname}:${port}${path}`;
    console.log(`${colors.cyan}Testing connection to ${url}${colors.reset}`);
    
    const timeoutId = setTimeout(() => {
      resolve({
        success: false,
        error: 'Connection timed out after 5 seconds'
      });
    }, 5000);
    
    const req = http.get(url, (res) => {
      clearTimeout(timeoutId);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          success: res.statusCode === 200,
          statusCode: res.statusCode,
          headers: res.headers,
          contentLength: data.length,
        });
      });
    });
    
    req.on('error', (error) => {
      clearTimeout(timeoutId);
      resolve({
        success: false,
        error: error.message
      });
    });
  });
}

async function runTests() {
  console.log(`${colors.bright}${colors.magenta}=== SUBDOMAIN RESOLUTION TEST ====${colors.reset}\n`);
  console.log(`${colors.bright}Testing subdomain resolution for username: ${colors.cyan}${username}${colors.reset}\n`);
  
  // 1. Check /etc/hosts entries
  console.log(`${colors.bright}1. Checking DNS resolution:${colors.reset}`);
  for (const domain of testDomains) {
    const resolution = await checkDnsResolution(domain.host);
    
    if (resolution.success) {
      console.log(`${colors.green}✓ ${domain.name} (${domain.host}) resolves to ${resolution.ip}${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ ${domain.name} (${domain.host}) resolution failed: ${resolution.error}${colors.reset}`);
      
      if (domain.host.includes('.localhost')) {
        console.log(`${colors.yellow}  This may be fixed by adding an entry to your /etc/hosts file:${colors.reset}`);
        console.log(`${colors.cyan}  127.0.0.1 ${domain.host}${colors.reset}`);
        console.log(`${colors.yellow}  You can run our setup script:${colors.reset}`);
        console.log(`${colors.cyan}  sudo ./scripts/setup-local-subdomains.sh ${username}${colors.reset}\n`);
      }
    }
  }
  
  console.log('');

  // 2. Test HTTP connections
  console.log(`${colors.bright}2. Testing HTTP connections:${colors.reset}`);
  
  // Test main domain
  const mainDomainResult = await testHttpConnection('localhost', PORT);
  if (mainDomainResult.success) {
    console.log(`${colors.green}✓ Main domain is responding correctly${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Main domain connection failed: ${mainDomainResult.error || mainDomainResult.statusCode}${colors.reset}`);
    console.log(`${colors.yellow}  Make sure your development server is running with:${colors.reset}`);
    console.log(`${colors.cyan}  npm run dev${colors.reset}\n`);
    
    // If the main domain isn't running, no point testing subdomains
    console.log(`${colors.red}! Skipping subdomain tests since main domain is not reachable${colors.reset}`);
    process.exit(1);
  }
  
  // Test subdomain
  const subdomainResult = await testHttpConnection(`${username}.localhost`, PORT);
  if (subdomainResult.success) {
    console.log(`${colors.green}✓ Subdomain is responding correctly${colors.reset}`);
    console.log(`${colors.green}  Status Code: ${subdomainResult.statusCode}${colors.reset}`);
    
    // Check for custom headers that indicate proper subdomain handling
    const minispaceSdHeaders = Object.keys(subdomainResult.headers)
      .filter(key => key.toLowerCase().startsWith('x-minispace'));
    
    if (minispaceSdHeaders.length > 0) {
      console.log(`${colors.green}✓ Found Minispace subdomain routing headers:${colors.reset}`);
      minispaceSdHeaders.forEach(header => {
        console.log(`${colors.cyan}  ${header}: ${subdomainResult.headers[header]}${colors.reset}`);
      });
    } else {
      console.log(`${colors.yellow}! No Minispace subdomain routing headers detected${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}✗ Subdomain connection failed: ${subdomainResult.error || subdomainResult.statusCode}${colors.reset}`);
    console.log(`${colors.yellow}  Make sure your /etc/hosts is properly configured and the server supports subdomain routing${colors.reset}`);
  }

  console.log('');
  console.log(`${colors.bright}3. Recommendations:${colors.reset}`);
  
  // Provide recommendations based on test results
  if (!mainDomainResult.success) {
    console.log(`${colors.yellow}- Start the development server with npm run dev${colors.reset}`);
  }
  
  if (mainDomainResult.success && !subdomainResult.success) {
    console.log(`${colors.yellow}- Configure your /etc/hosts file using our script:${colors.reset}`);
    console.log(`${colors.cyan}  sudo ./scripts/setup-local-subdomains.sh ${username}${colors.reset}`);
    console.log(`${colors.yellow}- Test with the 127.0.0.1 IP directly:${colors.reset}`);
    console.log(`${colors.cyan}  http://${username}.127.0.0.1:${PORT}/${colors.reset}`);
    console.log(`${colors.yellow}- Make sure middleware.ts properly handles subdomains${colors.reset}`);
  }
  
  if (mainDomainResult.success && subdomainResult.success) {
    console.log(`${colors.green}- All tests passed! Subdomain resolution is working correctly.${colors.reset}`);
    console.log(`${colors.green}- You can access your subdomain at:${colors.reset}`);
    console.log(`${colors.cyan}  http://${username}.localhost:${PORT}/${colors.reset}`);
  }
}

runTests().catch(error => {
  console.error(`${colors.red}Error running tests: ${error.message}${colors.reset}`);
});
