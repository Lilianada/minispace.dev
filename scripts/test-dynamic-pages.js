/**
 * Test script for dynamic page routing
 * 
 * This script simulates requests to dynamic pages using both subdomain and path-based routing
 * to verify that the custom pages system works correctly.
 */

const fetch = require('node-fetch');
const chalk = require('chalk');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_USERNAME = process.env.TEST_USERNAME || 'demo';
const SUBDOMAIN_URL = process.env.SUBDOMAIN_URL || `http://${TEST_USERNAME}.localhost:3000`;

// Test pages to check
const TEST_PAGES = [
  { slug: '', name: 'Home' },
  { slug: 'about', name: 'About' },
  { slug: 'projects', name: 'Projects' },
  { slug: 'contact', name: 'Contact' },
  { slug: 'nonexistent', name: 'Non-existent page (should 404)' },
];

/**
 * Simulates HTTP requests to test dynamic pages
 */
async function testDynamicPages() {
  console.log(chalk.cyan('Testing Dynamic Pages Routing'));
  console.log(chalk.cyan('============================'));
  console.log('');

  console.log(chalk.yellow('Path-based routing tests:'));
  for (const page of TEST_PAGES) {
    const url = `${BASE_URL}/${TEST_USERNAME}${page.slug ? '/' + page.slug : ''}`;
    try {
      console.log(chalk.gray(`Testing ${page.name} page: ${url}`));
      const response = await fetch(url);
      const status = response.status;
      
      if ((page.slug === 'nonexistent' && status === 404) || 
          (page.slug !== 'nonexistent' && status === 200)) {
        console.log(chalk.green(`✓ ${page.name} page: ${status}`));
      } else {
        console.log(chalk.red(`✗ ${page.name} page: ${status} (unexpected)`));
      }
    } catch (error) {
      console.log(chalk.red(`✗ ${page.name} page error: ${error.message}`));
    }
  }

  console.log('');
  console.log(chalk.yellow('Subdomain-based routing tests:'));
  for (const page of TEST_PAGES) {
    const url = `${SUBDOMAIN_URL}${page.slug ? '/' + page.slug : ''}`;
    try {
      console.log(chalk.gray(`Testing ${page.name} page: ${url}`));
      const response = await fetch(url);
      const status = response.status;
      
      if ((page.slug === 'nonexistent' && status === 404) || 
          (page.slug !== 'nonexistent' && status === 200)) {
        console.log(chalk.green(`✓ ${page.name} page: ${status}`));
      } else {
        console.log(chalk.red(`✗ ${page.name} page: ${status} (unexpected)`));
      }
    } catch (error) {
      console.log(chalk.red(`✗ ${page.name} page error: ${error.message}`));
    }
  }
}

// Execute tests
console.log(chalk.bold('Dynamic Pages Routing Test'));
console.log('');
console.log(`Base URL: ${BASE_URL}`);
console.log(`Subdomain URL: ${SUBDOMAIN_URL}`);
console.log(`Test username: ${TEST_USERNAME}`);
console.log('');

testDynamicPages()
  .then(() => {
    console.log('');
    console.log(chalk.green('All tests completed'));
  })
  .catch((error) => {
    console.error(chalk.red('Test execution error:'), error);
    process.exit(1);
  });
