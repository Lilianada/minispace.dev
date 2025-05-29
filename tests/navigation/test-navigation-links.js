/**
 * Test script for navigation link generation
 * Tests both subdomain and path-based routing scenarios
 */

// Mock implementation of navigation-utils.ts functions for testing
const updateNavigationLinks = (html, context) => {
  const { username, isSubdomain } = context;
  
  console.log(`Testing updateNavigationLinks for ${username}, isSubdomain: ${isSubdomain}`);
  
  if (isSubdomain) {
    // For subdomain routing, we need to transform any username-prefixed links to relative links
    return html
      .replace(new RegExp(`href="/${username}/posts"`, 'g'), `href="/posts"`)
      .replace(new RegExp(`href="/${username}/about"`, 'g'), `href="/about"`)
      .replace(new RegExp(`href="/${username}/post/`, 'g'), `href="/post/`)
      .replace(new RegExp(`href="/${username}"`, 'g'), `href="/"`);
  }

  // For path-based routing, replace relative links with username-prefixed ones
  return html
    .replace(/href="\/posts"(?!\/)/g, `href="/${username}/posts"`)
    .replace(/href="\/about"(?!\/)/g, `href="/${username}/about"`)
    .replace(/href="\/post\//g, `href="/${username}/post/`)
    .replace(/href="\/"(?!\w)/g, `href="/${username}"`);
};

// Test cases
const testCases = [
  {
    description: 'Path-based routing: Convert relative links to username-prefixed links',
    html: `
      <nav>
        <a href="/">Home</a>
        <a href="/posts">Posts</a>
        <a href="/about">About</a>
        <a href="/post/hello-world">Read Post</a>
      </nav>
    `,
    context: { 
      username: 'testuser',
      isSubdomain: false
    }
  },
  {
    description: 'Subdomain routing: Convert username-prefixed links to relative links',
    html: `
      <nav>
        <a href="/testuser">Home</a>
        <a href="/testuser/posts">Posts</a>
        <a href="/testuser/about">About</a>
        <a href="/testuser/post/hello-world">Read Post</a>
      </nav>
    `,
    context: { 
      username: 'testuser',
      isSubdomain: true
    }
  },
  {
    description: 'Mixed links with subdomain routing',
    html: `
      <nav>
        <a href="/">Home</a>
        <a href="/testuser/posts">Posts</a>
        <a href="/about">About</a>
        <a href="/testuser/post/hello-world">Read Post</a>
      </nav>
    `,
    context: { 
      username: 'testuser',
      isSubdomain: true
    }
  }
];

// Run tests
testCases.forEach((testCase, index) => {
  console.log(`\nTest #${index + 1}: ${testCase.description}`);
  console.log('Input HTML:');
  console.log(testCase.html);
  
  const result = updateNavigationLinks(testCase.html, testCase.context);
  
  console.log('\nOutput HTML:');
  console.log(result);
  console.log('----------------------------------------');
});

console.log('\nTest complete!');
