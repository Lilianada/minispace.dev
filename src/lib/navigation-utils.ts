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
 */
export function generateNavigationHtml(context: NavigationContext): string {
  const { username, currentPage = 'home', isSubdomain = true } = context;

  // Define the basic navigation structure
  const navLinks: NavigationLink[] = [
    { href: '/', label: 'Home' },
    { href: '/posts', label: 'Writing' },
    { href: '/about', label: 'About' }
  ];

  // Generate HTML for each link
  const navigationHtml = navLinks.map(link => {
    const isActive = (
      (link.href === '/' && currentPage === 'home') ||
      (link.href === '/posts' && currentPage === 'posts') ||
      (link.href === '/about' && currentPage === 'about')
    );

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
 */
export function createNavigationContext(username: string, headers?: { host?: string }, pathname?: string): NavigationContext {
  // Get the host from headers
  const host = headers?.host || '';
  
  // More robust subdomain detection
  const isSubdomain = host.startsWith(`${username}.`) || 
                      host.includes(`${username}.localhost`) ||
                      host.includes(`${username}.minispace.dev`);
  
  console.log(`[Navigation Utils] Creating context for ${username}, host: ${host}, isSubdomain: ${isSubdomain}`);
  
  // Determine current page from pathname
  let currentPage = 'home';
  if (pathname) {
    if (pathname.includes('/posts')) currentPage = 'posts';
    else if (pathname.includes('/about')) currentPage = 'about';
    else if (pathname.includes('/post/')) currentPage = 'post';
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
 */
export function updateNavigationLinks(html: string, context: NavigationContext): string {
  const { username, isSubdomain } = context;
  
  console.log(`[Navigation Utils] Updating links for ${username}, isSubdomain: ${isSubdomain}`);
  
  if (isSubdomain) {
    // For subdomain routing, we need to transform any username-prefixed links to relative links
    // This ensures that links like /username/posts become /posts on the subdomain
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
    .replace(/href="\/"/g, `href="/${username}"`);
}
