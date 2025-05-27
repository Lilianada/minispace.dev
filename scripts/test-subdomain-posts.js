#!/usr/bin/env node
/**
 * Test the Posts page in subdomain mode
 * 
 * This script simulates HTTP requests to the posts page via subdomains
 * to help debug issues with Firebase Admin availability
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');
const { execSync } = require('child_process');

// Configuration
const TEST_USERS = ['demouser', 'test', 'admin', 'dev'];
const PORT = 3000; // Default port
const LOCAL_DOMAIN = 'localhost';
const PROD_DOMAIN = 'minispace.dev';

// Determine if we need to test production domain
const isProd = process.argv.includes('--prod');
const domain = isProd ? PROD_DOMAIN : LOCAL_DOMAIN;
const protocol = isProd ? 'https' : 'http';
const httpModule = isProd ? https : http;

// Allow overriding the port for testing
const customPort = process.argv.find(arg => arg.startsWith('--port='));
const port = customPort ? parseInt(customPort.split('=')[1], 10) : PORT;

// Output header
console.log('='.repeat(80));
console.log(`TESTING SUBDOMAIN POSTS ROUTE (${isProd ? 'PRODUCTION' : 'DEVELOPMENT'} MODE)`);
console.log('='.repeat(80));
console.log(`Base domain: ${domain}, Protocol: ${protocol}`);
console.log('');

// Print the current /etc/hosts configuration for reference
console.log('Current /etc/hosts subdomain entries:');
try {
  const hostsContent = execSync('grep -A 10 "Minispace local subdomain testing" /etc/hosts').toString();
  console.log(hostsContent);
} catch (error) {
  console.log('No Minispace subdomain entries found in /etc/hosts');
  console.log('Run: sudo scripts/setup-local-subdomains.sh to configure');
}
console.log('-'.repeat(80));

// Test specific routes for each user
async function testRoute(hostname, path) {
  return new Promise((resolve) => {
    const url = new URL(`${protocol}://${hostname}${isProd ? '' : `:${port}`}${path}`);
    console.log(`Testing: ${url.toString()}`);
    
    const req = httpModule.request(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✅ Success');
          
          // Check if there's an error message in the HTML that would indicate Firebase Admin issues
          if (data.includes('Firebase Admin not available') || 
              data.includes('Error loading user posts page')) {
            console.log('⚠️ WARNING: Found error message in content (Firebase Admin issue)');
            resolve(false);
          } else if (
            // Check for posts page content - various patterns
            data.includes('<h1>Posts</h1>') || 
            data.includes('Welcome to Minispace') ||
            data.includes('Building with Firebase') ||
            data.includes('The Art of Learning') ||
            data.includes('Blog') ||
            // Content structure indicators
            data.includes('<article') ||
            data.includes('post-title') ||
            data.includes('post-excerpt')
          ) {
            console.log('✅ Posts page content found - success!');
            resolve(true);
          } else {
            console.log('⚠️ WARNING: Unexpected content (not a posts page)');
            // Uncomment for debugging
            // console.log('First 500 chars:', data.substring(0, 500));
            resolve(false);
          }
        } else {
          console.log('❌ Failed');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Error: ${error.message}`);
      resolve(false);
    });
    
    req.end();
  });
}

// Run the tests for all users
async function runTests() {
  const results = {
    success: 0,
    failed: 0,
    total: 0
  };
  
  for (const user of TEST_USERS) {
    console.log(`\nTesting user: ${user}`);
    console.log('-'.repeat(40));
    
    // Test subdomain posts route
    const subdomainSuccess = await testRoute(`${user}.${domain}`, '/posts');
    results.total++;
    if (subdomainSuccess) {
      results.success++;
    } else {
      results.failed++;
    }
    
    // For comparison, test path-based route too
    console.log('\nTesting equivalent path-based route:');
    const pathBasedSuccess = await testRoute(domain, `/${user}/posts`);
    results.total++;
    if (pathBasedSuccess) {
      results.success++;
    } else {
      results.failed++;
    }
    
    console.log('-'.repeat(80));
  }
  
  // Print summary
  console.log('\n=== SUMMARY ===');
  console.log(`Total tests: ${results.total}`);
  console.log(`Successful: ${results.success}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Success rate: ${Math.round((results.success / results.total) * 100)}%`);
  
  if (results.failed > 0) {
    console.log('\n⚠️ Some tests failed. Try these troubleshooting steps:');
    console.log('1. Run setup-local-subdomains.sh to configure subdomain DNS entries');
    console.log('2. Restart the Next.js development server');
    console.log('3. Check for errors in the server logs');
    console.log('4. Verify Firebase Admin configuration');
  }
}

// Run all the tests
runTests().catch(console.error);
