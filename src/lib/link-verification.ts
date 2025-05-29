/**
 * Navigation Link Verification and Fixing
 * 
 * Utilities to verify that links are correctly formatted for the current routing context
 * and fix any issues found.
 */

import { NavigationContext } from './navigation-utils';

interface LinkVerificationResult {
  correctLinks: LinkInfo[];
  incorrectLinks: LinkInfo[];
}

interface LinkInfo {
  href: string;
  isRelative: boolean;
  isExternal: boolean;
  isCorrect: boolean;
  path: string;
  suggestion?: string;
}

/**
 * Verify that all links in the HTML are correctly formatted for the current routing context
 */
export function verifyNavigationLinks(html: string, context: NavigationContext): LinkVerificationResult {
  const { username, isSubdomain } = context;
  const result: LinkVerificationResult = {
    correctLinks: [],
    incorrectLinks: []
  };
  
  // Extract all links from the HTML
  const hrefRegex = /href="([^"]*)"/g;
  const links = [];
  let match;
  
  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];
    
    // Skip empty links, hash links, or javascript links
    if (!href || href === '#' || href.startsWith('javascript:') || href.startsWith('mailto:')) {
      continue;
    }
    
    // Check if it's an external link
    const isExternal = href.includes('://') || href.startsWith('//');
    
    // If it's external, it's always correct
    if (isExternal) {
      result.correctLinks.push({
        href,
        isRelative: false,
        isExternal: true,
        isCorrect: true,
        path: href
      });
      continue;
    }
    
    // It's an internal link
    const isRelative = !href.startsWith('/');
    
    // If it's not a path link starting with /, it's a relative link and always correct
    if (isRelative) {
      result.correctLinks.push({
        href,
        isRelative: true,
        isExternal: false,
        isCorrect: true,
        path: href
      });
      continue;
    }
    
    // It's a path link starting with /
    const path = href;
    
    // For subdomain routing
    if (isSubdomain) {
      // In subdomain routing, links should not have the username in the path
      const hasUsername = path.startsWith(`/${username}`);
      
      if (hasUsername) {
        // This is incorrect - for subdomains, links should not have username prefix
        let suggestion = path;
        
        // Fix the path - remove username
        if (path === `/${username}`) {
          suggestion = '/';
        } else if (path.startsWith(`/${username}/`)) {
          suggestion = path.substring(username.length + 1);
        }
        
        result.incorrectLinks.push({
          href,
          isRelative: false,
          isExternal: false,
          isCorrect: false,
          path,
          suggestion
        });
      } else {
        // This is correct - path doesn't have username
        result.correctLinks.push({
          href,
          isRelative: false,
          isExternal: false,
          isCorrect: true,
          path
        });
      }
    }
    // For path-based routing
    else {
      // In path routing, links should have the username in the path
      const hasUsername = path.startsWith(`/${username}`);
      
      // Special paths that should not be prefixed with username
      const isSpecialPath = path.startsWith('/_') || 
                           path.startsWith('/api/') || 
                           path.startsWith('/themes/') || 
                           path.includes('.css') || 
                           path.includes('.js') ||
                           path.includes('.ico') ||
                           path.includes('.png') ||
                           path.includes('.jpg');
      
      console.log(`[LINK-DEBUG] Checking path: ${path}, username: ${username}, hasUsername: ${hasUsername}, isSpecialPath: ${isSpecialPath}`);
      
      if (!hasUsername && path !== '/' && !isSpecialPath) {
        // This is incorrect - for path-based routing, links should have username prefix
        // Skip special paths like /_next, etc.
        
        let suggestion = path;
        
        // Fix the path - add username
        if (path === '/') {
          suggestion = `/${username}`;
        } else {
          suggestion = `/${username}${path}`;
        }
        
        result.incorrectLinks.push({
          href,
          isRelative: false,
          isExternal: false,
          isCorrect: false,
          path,
          suggestion
        });
      } else {
        // This is correct - path has username or is a special path
        result.correctLinks.push({
          href,
          isRelative: false,
          isExternal: false,
          isCorrect: true,
          path
        });
      }
    }
  }
  
  return result;
}

/**
 * Fix incorrect links in the HTML
 */
export function fixIncorrectLinks(
  html: string, 
  context: NavigationContext, 
  verification?: LinkVerificationResult
): string {
  // If verification result is not provided, do the verification
  const result = verification || verifyNavigationLinks(html, context);
  
  // If there are no incorrect links, return the original HTML
  if (result.incorrectLinks.length === 0) {
    return html;
  }
  
  console.log(`[SUBDOMAIN-DEBUG] Fixing ${result.incorrectLinks.length} incorrect links`);
  
  // Create a copy of the HTML
  let fixedHtml = html;
  
  // Apply fixes
  for (const link of result.incorrectLinks) {
    if (link.suggestion) {
      const original = `href="${link.href}"`;
      const fixed = `href="${link.suggestion}"`;
      
      fixedHtml = fixedHtml.replace(new RegExp(escapeRegExp(original), 'g'), fixed);
      
      console.log(`[SUBDOMAIN-DEBUG] Fixed link: ${original} -> ${fixed}`);
    }
  }
  
  return fixedHtml;
}

// Helper to escape special regex characters
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
