// Test setup file
require('dotenv').config({ path: '.env.local' });

// Global setup for tests
beforeAll(() => {
  console.log('Starting tests...');
  // Any global test setup goes here
});

// Global teardown for tests
afterAll(() => {
  console.log('Finished tests.');
  // Any global test teardown goes here
});

// Add Jest extended matchers if needed
// require('jest-extended');
