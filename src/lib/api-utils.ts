/**
 * Utility functions for API requests with authentication
 */

/**
 * Add authentication token to fetch options
 * This function will use the cookie-based token if available,
 * falling back to localStorage only if needed
 */
export async function createAuthFetchOptions(options: RequestInit = {}): Promise<RequestInit> {
  // Create headers object if not provided
  const headers = options.headers || {};
  
  // First try to get token from cookies (preferred and more secure)
  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift();
    }
    return undefined;
  };
  
  const authToken = getCookie('authToken');
  
  // Fall back to localStorage only if cookie not found (legacy support)
  if (!authToken) {
    const localToken = localStorage.getItem('authToken');
    if (localToken) {
      console.warn('Using localStorage token for API request - consider updating to cookie-based auth');
      return {
        ...options,
        headers: {
          ...headers,
          'Authorization': `Bearer ${localToken}`,
        },
      };
    }
    console.warn('No authentication token found - request will be unauthenticated');
    return options;
  }
  
  // Return options with authorization header
  return {
    ...options,
    headers: {
      ...headers,
      'Authorization': `Bearer ${authToken}`,
    },
    // Include credentials to send cookies
    credentials: 'include',
  };
}

/**
 * Make an authenticated API request
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const authOptions = await createAuthFetchOptions(options);
  return fetch(url, authOptions);
}
