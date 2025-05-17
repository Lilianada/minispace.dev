/**
 * Get the user's dashboard URL with the username in the path
 * For client-side use, this will prioritize:
 * 1. Username from localStorage
 * 2. Redirect to login if no username is available (instead of using a broken fallback)
 */
export function getDashboardUrl(): string {
  // For server-side rendering, we'll handle redirection at the component level
  if (typeof window === 'undefined') {
    return '/signin?redirect=dashboard';
  }
  
  const username = localStorage.getItem('username');
  if (!username) {
    console.warn('Username not found in localStorage, redirecting to signin');
    // If no username exists, we should redirect to login instead of using a non-existent route
    return '/signin?redirect=dashboard';
  }
  
  console.log(`Generated dashboard URL for username: ${username}`);
  return `/${username}/dashboard`;
}

/**
 * Get dashboard path segments with username
 * Useful for building sub-paths like /username/dashboard/posts
 */
export function getDashboardPath(subpath: string = ''): string {
  // Remove leading slash from subpath if it exists
  const cleanSubpath = subpath.startsWith('/') ? subpath.substring(1) : subpath;
  
  // For server-side rendering, handle at component level
  if (typeof window === 'undefined') {
    return '/signin?redirect=dashboard';
  }
  
  const username = localStorage.getItem('username');
  if (!username) {
    console.warn('Username not found in localStorage, redirecting to signin');
    return '/signin?redirect=dashboard';
  }
  
  const path = cleanSubpath ? `/${username}/dashboard/${cleanSubpath}` : `/${username}/dashboard`;
  console.log(`Generated dashboard path: ${path}`);
  return path;
}
