/**
 * Test script for dynamic navigation links
 * Tests both standard and custom navigation items
 */

// Import the navigation utilities (mockup for testing)
const { createNavigationContext, generateNavigationHtml, updateNavigationLinks } = require('../src/lib/navigation-utils');

// Mock implementation for testing
function mockGenerateNavigationHtml(context, customNavLinks) {
  const { username, currentPage = 'home', isSubdomain = true } = context;

  // Use custom nav links if provided, otherwise use defaults
  const navLinks = customNavLinks || [
    { href: '/', label: 'Home' },
    { href: '/posts', label: 'Writing' },
    { href: '/about', label: 'About' }
  ];

  const navigationHtml = navLinks.map(link => {
    const pageName = link.href === '/' ? 'home' : link.href.replace(/^\//, '').split('/')[0];
    const isActive = currentPage === pageName || 
                    (link.href === '/' && currentPage === 'home') ||
                    (link.isActive === true);

    const actualHref = isSubdomain ? link.href : `/${username}${link.href}`;
    const activeClass = isActive ? ' active' : '';

    return `<a href="${actualHref}" class="nav-link${activeClass}">${link.label}</a>`;
  }).join('');

  return navigationHtml;
}

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

  // For path-based routing: convert all relative links to username-prefixed links
  return html
    .replace(/href="\/"(?!\w)/g, `href="/${username}"`)
    .replace(/href="\/([^\/"][^"]*)"(?!\w)/g, (match, section) => {
      if (section.startsWith(username + '/') || section === username) {
        return match;
      }
      return `href="/${username}/${section}"`;
    });
}

// Run tests
(function runTests() {
  console.log("=== TESTING DYNAMIC NAVIGATION LINKS ===");
  
  // Test Case 1: Default navigation with subdomain
  const context1 = {
    username: "johndoe",
    currentPage: "home",
    isSubdomain: true
  };
  
  console.log("\nTest Case 1: Default navigation with subdomain");
  const html1 = mockGenerateNavigationHtml(context1);
  console.log(html1);
  
  // Test Case 2: Default navigation with path-based routing
  const context2 = {
    username: "johndoe",
    currentPage: "posts",
    isSubdomain: false
  };
  
  console.log("\nTest Case 2: Default navigation with path-based routing");
  const html2 = mockGenerateNavigationHtml(context2);
  console.log(html2);
  
  // Test Case 3: Custom navigation items
  const context3 = {
    username: "johndoe",
    currentPage: "projects",
    isSubdomain: true
  };
  
  const customNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/posts', label: 'Blog' },
    { href: '/projects', label: 'Projects' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' }
  ];
  
  console.log("\nTest Case 3: Custom navigation items");
  const html3 = mockGenerateNavigationHtml(context3, customNavLinks);
  console.log(html3);
  
  // Test Case 4: Transform complex HTML with updateNavigationLinks
  const sampleHTML = `
    <div class="main-content">
      <nav>
        <a href="/">Home</a>
        <a href="/posts">Blog</a>
        <a href="/projects">Projects</a>
        <a href="/gallery/photos">Photos</a>
        <a href="https://external.com">External</a>
        <a href="/contact#form">Contact Form</a>
      </nav>
      <main>
        <h1>Welcome to My Page</h1>
        <p>Check out my <a href="/projects/web-dev">web development projects</a>.</p>
        <p>Or browse my <a href="/gallery">gallery</a>.</p>
      </main>
    </div>
  `;
  
  // Test subdomain transformation
  console.log("\nTest Case 4a: Transform HTML for subdomain");
  const transformedSubdomain = mockUpdateNavigationLinks(sampleHTML, {
    username: "johndoe",
    isSubdomain: true
  });
  console.log(transformedSubdomain);
  
  // Test path-based transformation
  console.log("\nTest Case 4b: Transform HTML for path-based routing");
  const transformedPathBased = mockUpdateNavigationLinks(sampleHTML, {
    username: "johndoe",
    isSubdomain: false
  });
  console.log(transformedPathBased);
  
  console.log("\n=== TESTS COMPLETE ===");
})();
