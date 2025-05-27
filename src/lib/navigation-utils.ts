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
  
  // More robust subdomain detection
  const isSubdomain = host.startsWith(`${username}.`) || 
                      host.includes(`${username}.localhost`) ||
                      host.includes(`${username}.minispace.dev`);
  
  console.log(`[Navigation Utils] Creating context for ${username}, host: ${host}, isSubdomain: ${isSubdomain}`);
  
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
      
      if (pathWithoutUsername) {
        const segments = pathWithoutUsername.split('/');
        currentPage = segments[0] || 'home';
        
        // Special case for post single pages
        if (currentPage === 'post' && segments.length > 1) {
          currentPage = 'post';
        }
      }
    }
  }

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
  
  console.log(`[Navigation Utils] Updating links for ${username}, isSubdomain: ${isSubdomain}`);
  
  if (isSubdomain) {
    // For subdomain routing: convert all username-prefixed links to relative links
    // Example: /username/any-page -> /any-page
    //          /username -> /
    const usernamePattern = new RegExp(`href="\\/${username}(\\/[^"]*|\\/?)?"`, 'g');
    return html.replace(usernamePattern, (match, path = '') => {
      // If path is empty or just a slash, return root path
      if (!path || path === '/') {
        return 'href="/"';
      }
      return `href="${path}"`;
    });
  }

  // For path-based routing: convert all relative links to username-prefixed links
  // Need to handle different cases:
  // 1. href="/" -> href="/username"
  // 2. href="/page" -> href="/username/page"
  // 3. But don't affect external links, anchors, etc.
  
  // Regular expression explanation:
  // - Match href="/ followed by:
  //   - Not a slash (avoids matching protocol like href="//example.com")
  //   - Not a hash (avoids matching href="/#section")
  //   - Not already prefixed with username
  return html
    // Fix root links: href="/" -> href="/username"
    .replace(/href="\/"(?!\w)/g, `href="/${username}"`)
    
    // Fix section links: href="/section" -> href="/username/section"
    // But avoid double-applying to links that already have username
    .replace(/href="\/([^\/"][^"]*)"(?!\w)/g, (match, section) => {
      // Skip if it's already prefixed with username
      if (section.startsWith(username + '/') || section === username) {
        return match;
      }
      return `href="/${username}/${section}"`;
    });
}