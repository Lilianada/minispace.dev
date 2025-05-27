/**
 * Debug utilities for Minispace.dev
 * 
 * This file contains utility functions for debugging, especially for subdomain routing.
 */

/**
 * Logs details of the current request with all relevant routing information
 */
export function logSubdomainRequestDetails(
  message: string,
  data: Record<string, any>
): void {
  const timestamp = new Date().toISOString();
  const requestId = Math.random().toString(36).substring(2, 15);
  
  console.log(`
=================================================
[SUBDOMAIN-DEBUG] ${timestamp} | REQ: ${requestId}
${message}
-------------------------------------------------
${Object.entries(data)
  .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}`)
  .join('\n')}
=================================================
`);
}

/**
 * Extract current page from pathname
 * More verbose version for debugging
 */
export function extractCurrentPage(pathname: string, username: string): {
  currentPage: string;
  cleanPath: string;
  pathWithoutUsername: string;
  segments: string[];
} {
  // Remove leading slash
  const cleanPath = pathname.replace(/^\//, '');
  
  // Remove username if path starts with username
  const pathWithoutUsername = cleanPath.startsWith(username + '/') 
    ? cleanPath.substring(username.length + 1)
    : cleanPath;
  
  // Extract the path segments
  const segments = pathWithoutUsername ? pathWithoutUsername.split('/') : [];
  
  // Determine current page
  let currentPage = 'home';
  
  if (pathname === '/' || pathname === `/${username}`) {
    currentPage = 'home';
  } else if (segments.length > 0) {
    currentPage = segments[0] || 'home';
  }
  
  return {
    currentPage,
    cleanPath,
    pathWithoutUsername,
    segments
  };
}

/**
 * Log all links found in HTML content
 */
export function logLinksInHtml(html: string, label: string = 'Links in HTML'): void {
  const links: string[] = [];
  const hrefRegex = /href="([^"]*)"/g;
  let match;
  
  while ((match = hrefRegex.exec(html)) !== null) {
    if (links.length < 20) { // Limit to avoid huge logs
      links.push(match[1]);
    }
  }
  
  console.log(`[SUBDOMAIN-DEBUG] ${label} (first ${links.length}):`);
  links.forEach((link, i) => console.log(`  ${i+1}. ${link}`));
}

/**
 * Test navigation link transformation
 */
export function testLinkTransformation(
  link: string, 
  username: string, 
  isSubdomain: boolean
): { 
  original: string;
  transformed: string;
  analysis: string;
} {
  let transformed: string;
  
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
