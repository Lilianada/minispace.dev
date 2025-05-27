#!/usr/bin/env node
/**
 * Firebase Admin Subdomain Test
 * 
 * This script tests Firebase Admin initialization in both standard and subdomain routing modes
 * to ensure consistent behavior across both routing approaches.
 */

const http = require('http');
const { URL } = require('url');
const { execSync } = require('child_process');

// Configuration
const TEST_USERS = ['demouser', 'test', 'dev'];
const TEST_ROUTES = [
  '/',              // Home page
  '/posts',         // Posts listing
  '/post/welcome',  // Single post
  '/about'          // About page
];
const PORT = 3000;

console.log('========================================================');
console.log('FIREBASE ADMIN SUBDOMAIN ROUTING TEST');
console.log('========================================================');
console.log('Testing Firebase Admin availability across different routes');
console.log('and comparing subdomain vs. path-based routing behavior.');
console.log('');

// Function to fetch a URL and test for Firebase Admin errors
async function testRoute(hostname, path) {
  return new Promise((resolve) => {
    const url = new URL(`http://${hostname}:${PORT}${path}`);
    console.log(`Testing: ${url.toString()}`);
    
    const req = http.request(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Check for specific Firebase Admin errors
        const hasFirebaseError = 
          data.includes('Firebase Admin not available') ||
          data.includes('Error loading user') ||
          data.includes('adminDb is not defined') ||
          data.includes('Cannot read properties of undefined (reading \'collection\')');
          
        const result = {
          statusCode: res.statusCode,
          success: (res.statusCode >= 200 && res.statusCode < 300),
          url: url.toString(),
          hasFirebaseError,
          hasContent: data.length > 0
        };
        
        console.log(`Status: ${result.statusCode} | Firebase Error: ${result.hasFirebaseError ? 'YES' : 'NO'}`);
        resolve(result);
      });
    });
    
    req.on('error', (error) => {
      console.log(`Error: ${error.message}`);
      resolve({
        statusCode: 0,
        success: false,
        url: url.toString(),
        hasFirebaseError: true,
        error: error.message
      });
    });
    
    req.end();
  });
}

// Run tests for all combinations
async function runTests() {
  const results = {
    subdomain: { success: 0, firebaseErrors: 0, total: 0 },
    pathBased: { success: 0, firebaseErrors: 0, total: 0 }
  };
  
  // Test each user
  for (const user of TEST_USERS) {
    console.log(`\n=== Testing user: ${user} ===`);
    
    // Test each route
    for (const route of TEST_ROUTES) {
      console.log(`\n--- Route: ${route} ---`);
      
      // Test subdomain routing
      console.log('Subdomain routing:');
      const subdomainResult = await testRoute(`${user}.localhost`, route);
      results.subdomain.total++;
      if (subdomainResult.success) results.subdomain.success++;
      if (subdomainResult.hasFirebaseError) results.subdomain.firebaseErrors++;
      
      // Test path-based routing
      console.log('\nPath-based routing:');
      const pathBasedResult = await testRoute('localhost', `/${user}${route}`);
      results.pathBased.total++;
      if (pathBasedResult.success) results.pathBased.success++;
      if (pathBasedResult.hasFirebaseError) results.pathBased.firebaseErrors++;
      
      // Check for parity (only concerned with Firebase errors, not redirects)
      // For the root path, path-based routing often returns a 308 redirect, which is expected
      const isRootPathRedirect = (route === '/' && pathBasedResult.statusCode === 308);
      const hasParity = 
        // Either both have same success status OR it's an expected root path redirect
        ((subdomainResult.success === pathBasedResult.success) || isRootPathRedirect) &&
        // Firebase errors should always match
        (subdomainResult.hasFirebaseError === pathBasedResult.hasFirebaseError);
                        
      if (!hasParity) {
        console.log('\n⚠️ INCONSISTENCY DETECTED: Different behavior between subdomain and path-based routing');
        console.log(`Subdomain: Success=${subdomainResult.success}, Firebase Error=${subdomainResult.hasFirebaseError}, Status=${subdomainResult.statusCode}`);
        console.log(`Path-based: Success=${pathBasedResult.success}, Firebase Error=${pathBasedResult.hasFirebaseError}, Status=${pathBasedResult.statusCode}`);
      } else {
        // Special message for expected redirects
        if (isRootPathRedirect) {
          console.log('\n✅ Expected redirect for root path in path-based routing (308)');
        } else {
          console.log('\n✅ Consistent behavior between subdomain and path-based routing');
        }
      }
      
      console.log('-'.repeat(60));
    }
  }
  
  // Print summary
  console.log('\n========================================================');
  console.log('TEST SUMMARY');
  console.log('========================================================');
  
  console.log('\nSubdomain Routing:');
  console.log(`Total tests: ${results.subdomain.total}`);
  console.log(`Successful responses: ${results.subdomain.success} (${Math.round((results.subdomain.success / results.subdomain.total) * 100)}%)`);
  console.log(`Firebase errors: ${results.subdomain.firebaseErrors} (${Math.round((results.subdomain.firebaseErrors / results.subdomain.total) * 100)}%)`);
  
  console.log('\nPath-based Routing:');
  console.log(`Total tests: ${results.pathBased.total}`);
  console.log(`Successful responses: ${results.pathBased.success} (${Math.round((results.pathBased.success / results.pathBased.total) * 100)}%)`);
  console.log(`Firebase errors: ${results.pathBased.firebaseErrors} (${Math.round((results.pathBased.firebaseErrors / results.pathBased.total) * 100)}%)`);
  
  // For overall consistency, we only care about Firebase errors, not success rates
  // This is because redirects are expected for path-based routing in some cases
  const firebaseConsistency = results.subdomain.firebaseErrors === results.pathBased.firebaseErrors;
  
  // Calculate Firebase error rate
  const overallFirebaseErrorRate = ((results.subdomain.firebaseErrors + results.pathBased.firebaseErrors) / 
                                    (results.subdomain.total + results.pathBased.total) * 100).toFixed(1);
    
  console.log('\nOverall Firebase Admin Consistency:');
  if (firebaseConsistency) {
    if (results.subdomain.firebaseErrors === 0 && results.pathBased.firebaseErrors === 0) {
      console.log('✅ PERFECT: No Firebase Admin errors detected in either routing mode');
    } else {
      console.log(`⚠️ CONSISTENT ERRORS: Both routing modes have the same number of Firebase Admin errors (${results.subdomain.firebaseErrors})`);
      console.log(`Firebase error rate: ${overallFirebaseErrorRate}%`);
    }
  } else {
    console.log('⚠️ INCONSISTENT: Firebase Admin errors differ between subdomain and path-based routing');
    console.log(`Subdomain Firebase errors: ${results.subdomain.firebaseErrors}`);
    console.log(`Path-based Firebase errors: ${results.pathBased.firebaseErrors}`);
    console.log('This indicates an issue with Firebase Admin initialization in one of the routing modes.');
  }
}

// Run the tests
console.log('Starting tests...\n');
runTests().catch(console.error);
