/**
 * Navigation utilities for generating proper links in themes
 * Handles both subdomain routing (username.minispace.dev) and path-based routing (/username)
 */

export interface NavigationLink {
  href: string;
  label: string;
  isActive?: boolean;
}

export interface NavigationContext {
  username: string;
  currentPage?: string;
  isSubdomain?: boolean;
}

/**
 * Generate navigation links for theme templates
 * Returns HTML string for navigation that works with both subdomain and path-based routing
 * 
 * @param context The navigation context (username, currentPage, isSubdomain)
 * @param customNavLinks Optional custom navigation links to override default ones
 */
export function generateNavigationHtml(context: NavigationContext, customNavLinks?: NavigationLink[]): string {
  const { username, currentPage = 'home', isSubdomain = true } = context;

  // Use custom nav links if provided, otherwise use defaults
  const navLinks: NavigationLink[] = customNavLinks || [
    { href: '/', label: 'Home' },
    { href: '/posts', label: 'Writing' },
    { href: '/about', label: 'About' }
  ];

  // Generate HTML for each link
  const navigationHtml = navLinks.map(link => {
    // More flexible active state detection
    const pageName = link.href === '/' ? 'home' : link.href.replace(/^\//, '').split('/')[0];
    const isActive = currentPage === pageName || 
                    (link.href === '/' && currentPage === 'home') ||
                    (link.isActive === true);

    // Build the actual href based on routing type
    const actualHref = isSubdomain ? link.href : `/${username}${link.href}`;
    const activeClass = isActive ? ' active' : '';

    return `<a href="${actualHref}" class="nav-link${activeClass}">${link.label}</a>`;
  }).join('');

  return navigationHtml;
}

/**
 * Generate a post link based on routing context
 */
export function generatePostLink(slug: string, context: NavigationContext): string {
  const { username, isSubdomain = true } = context;
  
  if (isSubdomain) {
    return `/post/${slug}`;
  } else {
    return `/${username}/post/${slug}`;
  }
}

/**
 * Create navigation context from request headers or pathname
 * 
 * @param username The username for the context
 * @param headers Optional request headers containing host information
 * @param pathname Optional pathname to determine current page
 * @returns NavigationContext with username, currentPage, and isSubdomain flag
 */
export function createNavigationContext(username: string, headers?: { host?: string }, pathname?: string): NavigationContext {
  // Get the host from headers
  const host = headers?.host || '';
  
  // More robust subdomain detection with enhanced localhost handling
  const isSubdomain = host.startsWith(`${username}.`) || 
                      host.includes(`${username}.localhost`) || 
                      host.includes(`${username}.127.0.0.1`) || // Support IP-based subdomain testing
                      host.includes(`${username}.minispace.dev`);
  
  console.log(`[SUBDOMAIN-DEBUG] Creating navigation context:
    - Username: ${username}
    - Host: ${host}
    - Is subdomain detected: ${isSubdomain}
    - Original pathname: ${pathname || '/'}`);
  
  // Determine current page from pathname using more flexible extraction
  let currentPage = 'home';
  if (pathname) {
    // If we're at root path
    if (pathname === '/' || pathname === `/${username}`) {
      currentPage = 'home';
    } else {
      // Extract page name from path, handling both subdomain and path-based routes
      // Remove leading slash, then username (if present), then get first path segment
      const cleanPath = pathname.replace(/^\//, ''); // Remove leading slash
      const pathWithoutUsername = cleanPath.startsWith(username + '/') ? 
        cleanPath.substring(username.length + 1) : cleanPath;
      
      console.log(`[SUBDOMAIN-DEBUG] Path processing:
        - Clean path: ${cleanPath}
        - Path without username: ${pathWithoutUsername}
        - Username check: ${username}
        - Starts with username?: ${cleanPath.startsWith(username + '/')}`);
      
      if (pathWithoutUsername) {
        const segments = pathWithoutUsername.split('/');
        currentPage = segments[0] || 'home';
        
        // Special case for post single pages
        if (currentPage === 'post' && segments.length > 1) {
          currentPage = 'post';
        }
        
        console.log(`[SUBDOMAIN-DEBUG] Page detection:
          - Path segments: [${segments.join(', ')}]
          - Selected page: ${currentPage}`);
      }
    }
  }

  console.log(`[SUBDOMAIN-DEBUG] Final navigation context: 
    - Username: ${username}
    - Current page: ${currentPage}
    - Is subdomain: ${isSubdomain}`);

  return {
    username,
    currentPage,
    isSubdomain
  };
}

/**
 * Update existing HTML content to fix navigation links
 * This is used as a post-processing step for theme templates
 * 
 * Dynamically handles any route pattern, not just hardcoded ones
 */
export function updateNavigationLinks(html: string, context: NavigationContext): string {
  const { username, isSubdomain } = context;
  
  console.log(`[SUBDOMAIN-DEBUG] Updating navigation links:
    - Username: ${username}
    - Is subdomain: ${isSubdomain}
    - HTML length: ${html.length}
    - First 100 chars: ${html.substring(0, 100)}...`);
  
  // Extract and log all href links for debugging
  const hrefRegex = /href="([^"]*)"/g;
  const links = [];
  const transformedLinks = [];
  let match;
  
  // Create a copy of the HTML that we'll modify
  let result = html;
  
  // First collect all original links for debugging
  while ((match = hrefRegex.exec(html)) !== null) {
    links.push(match[1]);
  }
  
  console.log(`[SUBDOMAIN-DEBUG] Links found in HTML before transformation:
    ${links.slice(0, 10).join('\n    ')}`);
  
  if (isSubdomain) {
    // For subdomain routing: handle different link patterns that need transformation
    
    // 1. First transform username-prefixed links to relative links
    // Example: /username/any-page -> /any-page
    //          /username -> /
    const usernamePattern = new RegExp(`href="\\/${username}(\\/[^"]*|\\/?)?"`, 'g');
    
    console.log(`[SUBDOMAIN-DEBUG] Subdomain mode - transforming username-prefixed links to relative links
    - Username pattern: ${usernamePattern}`);
    
    result = result.replace(usernamePattern, (match, path = '') => {
      const original = match;
      let transformed;
      
      // If path is empty or just a slash, return root path
      if (!path || path === '/') {
        transformed = 'href="/"';
        console.log(`[SUBDOMAIN-DEBUG] Transforming "${original}" to "${transformed}"`);
        transformedLinks.push({ original, transformed });
        return transformed;
      }
      
      transformed = `href="${path}"`;
      console.log(`[SUBDOMAIN-DEBUG] Transforming "${original}" to "${transformed}"`);
      transformedLinks.push({ original, transformed });
      return transformed;
    });
    
    // 2. Fix links that might be incorrectly formatted with double slashes or other issues
    // This can happen if the HTML template already has relative links but our code tries to transform them
    result = result.replace(/href="\/\//g, (match) => {
      console.log(`[SUBDOMAIN-DEBUG] Fixing double slash: "${match}" to "href="/"`);
      transformedLinks.push({ original: match, transformed: 'href="/' });
      return 'href="/';
    });
    
    // 3. Special case for post links - ensure they have the correct format
    // For subdomain, post links should be /post/slug not /username/post/slug
    const postPattern = new RegExp(`href="\\/${username}\\/post\\/([^"]+)"`, 'g');
    result = result.replace(postPattern, (match, slug) => {
      const transformed = `href="/post/${slug}"`;
      console.log(`[SUBDOMAIN-DEBUG] Transforming post link: "${match}" to "${transformed}"`);
      transformedLinks.push({ original: match, transformed });
      return transformed;
    });
    
    // Log the transformed links
    console.log(`[SUBDOMAIN-DEBUG] Links after subdomain transformation:
      ${JSON.stringify(transformedLinks.slice(0, 10), null, 2)}`);
      
    return result;
  }

  // For path-based routing: convert all relative links to username-prefixed links
  // Need to handle different cases:
  // 1. href="/" -> href="/username"
  // 2. href="/page" -> href="/username/page"
  // 3. But don't affect external links, anchors, etc.
  
  console.log(`[SUBDOMAIN-DEBUG] Path-based mode - transforming relative links to username-prefixed links`);
  
  const transformations = [];
  
  // Regular expression explanation:
  // - Match href="/ followed by:
  //   - Not a slash (avoids matching protocol like href="//example.com")
  //   - Not a hash (avoids matching href="/#section")
  //   - Not already prefixed with username
  
  // Fix root links: href="/" -> href="/username"
  result = html.replace(/href="\/"(?!\w)/g, (match) => {
    const transformed = `href="/${username}"`;
    console.log(`[SUBDOMAIN-DEBUG] Transforming root link "${match}" to "${transformed}"`);
    transformations.push({ original: match, transformed });
    return transformed;
  });
  
  // Fix section links: href="/section" -> href="/username/section"
  // But avoid double-applying to links that already have username
  result = result.replace(/href="\/([^\/"][^"]*)"(?!\w)/g, (match, section) => {
    // Skip if it's already prefixed with username or it's an external URL
    if (section.startsWith(username + '/') || section === username || section.includes('://')) {
      console.log(`[SUBDOMAIN-DEBUG] Skipping already username-prefixed or external link: ${match}`);
      return match;
    }
    
    // Skip special paths like _next, api, etc.
    if (section.startsWith('_') || section.startsWith('api/') || section.startsWith('static/')) {
      console.log(`[SUBDOMAIN-DEBUG] Skipping special path: ${match}`);
      return match;
    }
    
    const transformed = `href="/${username}/${section}"`;
    console.log(`[SUBDOMAIN-DEBUG] Transforming section link "${match}" to "${transformed}"`);
    transformations.push({ original: match, transformed });
    return transformed;
  });
  
  // Additional fix for post links - ensure they're properly prefixed with username
  // For path-based routing, post links should be /username/post/slug
  const postPattern = new RegExp(`href="\\/post\\/([^"]+)"`, 'g');
  result = result.replace(postPattern, (match, slug) => {
    const transformed = `href="/${username}/post/${slug}"`;
    console.log(`[SUBDOMAIN-DEBUG] Transforming post link: "${match}" to "${transformed}"`);
    transformations.push({ original: match, transformed });
    return transformed;
  });
  
  // Log the transformed links
  const extractedLinks = [];
  let transformedMatch;
  const hrefRegexFinal = /href="([^"]*)"/g;
  while ((transformedMatch = hrefRegexFinal.exec(result)) !== null) {
    extractedLinks.push(transformedMatch[1]);
  }
  
  console.log(`[SUBDOMAIN-DEBUG] Links after path-based transformation:
    ${JSON.stringify(transformations.slice(0, 10), null, 2)}`);
  
  // Ensure we don't have any double slashes in the URLs
  result = result.replace(/href="\/+/g, 'href="/');
    
  return result;
}