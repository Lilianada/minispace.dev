/**
 * Script to test subdomain routing edge cases
 * This script simulates different URL patterns and tests the link transformation logic
 */

// Local implementation of testLinkTransformation since we can't import from TypeScript modules in Node.js directly
function testLinkTransformation(link, username, isSubdomain) {
  let transformed;
  
  if (isSubdomain) {
    // For subdomain: transform /username/* to /*
    if (link === `/${username}`) {
      transformed = '/';
    } else if (link.startsWith(`/${username}/`)) {
      transformed = link.substring(username.length + 1);
    } else {
      transformed = link; // No change needed
    }
  } else {
    // For path-based: transform /* to /username/*
    if (link === '/') {
      transformed = `/${username}`;
    } else if (!link.startsWith(`/${username}/`) && link.startsWith('/')) {
      transformed = `/${username}${link}`;
    } else {
      transformed = link; // No change needed
    }
  }
  
  // Analyze the transformation
  let analysis = 'No change needed';
  if (transformed !== link) {
    analysis = isSubdomain
      ? `Transformed from path-based to subdomain format`
      : `Transformed from subdomain to path-based format`;
  }
  
  return {
    original: link,
    transformed,
    analysis
  };
}

/**
 * Mock implementation of updateNavigationLinks for testing
 */
function mockUpdateNavigationLinks(html, context) {
  const { username, isSubdomain } = context;
  
  if (isSubdomain) {
    // For subdomain routing: convert all username-prefixed links to relative links
    const usernamePattern = new RegExp(`href="\\/${username}(\\/[^"]*|\\/?)?"`, 'g');
    return html.replace(usernamePattern, (match, path = '') => {
      if (!path || path === '/') {
        return 'href="/"';
      }
      return `href="${path}"`;
    });
  }

  // For path-based routing: convert all relative links to username-prefixed ones
  return html
    .replace(/href="\/"(?!\w)/g, `href="/${username}"`)
    .replace(/href="\/([^\/"][^"]*)"(?!\w)/g, (match, section) => {
      if (section.startsWith(username + '/') || section === username) {
        return match;
      }
      return `href="/${username}/${section}"`;
    });
}

/**
 * Test cases for subdomain routing
 */
function testSubdomainRouting() {
  console.log("===== TESTING SUBDOMAIN ROUTING EDGE CASES =====\n");
  
  const username = 'testuser';
  
  // Test cases for individual links
  const testLinks = [
    '/',
    '/posts',
    '/about',
    '/post/hello-world',
    '/projects',
    `/${username}`,
    `/${username}/posts`,
    `/${username}/about`,
    `/${username}/post/hello-world`,
    '/dashboard',
    '/#section',
    '/posts#comments',
    '//example.com',
    'https://external.com',
    './relative',
    '../parent',
    'javascript:void(0)',
    'mailto:user@example.com'
  ];
  
  console.log("1. TESTING INDIVIDUAL LINK TRANSFORMATIONS\n");
  
  console.log("1.1. SUBDOMAIN MODE (username.minispace.dev)");
  testLinks.forEach(link => {
    const result = testLinkTransformation(link, username, true);
    console.log(`${link} -> ${result.transformed} (${result.analysis})`);
  });
  
  console.log("\n1.2. PATH-BASED MODE (minispace.dev/username)");
  testLinks.forEach(link => {
    const result = testLinkTransformation(link, username, false);
    console.log(`${link} -> ${result.transformed} (${result.analysis})`);
  });
  
  // Test cases for HTML content
  const sampleHTML = `
    <div class="main-content">
      <nav>
        <a href="/">Home</a>
        <a href="/posts">Posts</a>
        <a href="/about">About</a>
        <a href="/post/hello-world">Read Post</a>
        <a href="/projects">Projects</a>
        <a href="/${username}">Username Home</a>
        <a href="/${username}/posts">Username Posts</a>
        <a href="https://external.com">External</a>
        <a href="/#section">Section</a>
      </nav>
    </div>
  `;
  
  console.log("\n\n2. TESTING HTML TRANSFORMATIONS\n");
  
  console.log("2.1. SUBDOMAIN MODE (username.minispace.dev)");
  const subdomainHtml = mockUpdateNavigationLinks(sampleHTML, { username, isSubdomain: true });
  console.log(subdomainHtml);
  
  console.log("\n2.2. PATH-BASED MODE (minispace.dev/username)");
  const pathBasedHtml = mockUpdateNavigationLinks(sampleHTML, { username, isSubdomain: false });
  console.log(pathBasedHtml);
  
  console.log("\n===== TESTING COMPLETE =====");
}

// Run the tests
testSubdomainRouting();
