/**
 * Navigation Links Test
 * 
 * This test verifies that links are correctly transformed between different routing modes.
 */

const { transformSubdomainLinks, transformPathBasedLinks } = require('../../src/lib/navigation-utils');

// Mock data for testing
const mockUsername = 'testuser';
const mockHtml = `
<!DOCTYPE html>
<html>
<body>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/testuser/dashboard">Dashboard</a>
  <a href="/post/example">Post</a>
</body>
</html>
`;

describe('Navigation Link Transformation', () => {
  describe('Subdomain Mode', () => {
    test('should transform username-prefixed links to relative links', () => {
      // When in subdomain mode (e.g. testuser.minispace.dev)
      const result = transformSubdomainLinks(mockHtml, mockUsername);
      
      // We expect /testuser/dashboard to become /dashboard
      expect(result).not.toContain('href="/testuser/dashboard"');
      expect(result).toContain('href="/dashboard"');
      
      // Root path should remain unchanged
      expect(result).toContain('href="/"');
    });
  });
  
  describe('Path-Based Mode', () => {
    test('should transform relative links to username-prefixed links', () => {
      // When in path-based mode (e.g. minispace.dev/testuser)
      const result = transformPathBasedLinks(mockHtml, mockUsername);
      
      // We expect /about to become /testuser/about
      expect(result).not.toContain('href="/about"');
      expect(result).toContain('href="/testuser/about"');
      
      // Root path should become /username
      expect(result).not.toContain('href="/"');
      expect(result).toContain('href="/testuser"');
    });
  });
});
