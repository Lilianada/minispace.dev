/**
 * Subdomain Handler
 * 
 * Middleware helper for processing subdomain-based routing
 */
import { NextRequest, NextResponse } from 'next/server';
import { PathAnalysis, analyzeCurrentPath, detectIncorrectPaths } from '../lib/path-analyzer';

/**
 * Process subdomain requests and handle necessary rewrites
 */
export async function handleSubdomain(request: NextRequest, isSubdomain: boolean): Promise<NextResponse | null> {
  if (!isSubdomain) {
    return null;
  }
  
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  console.log(`[SUBDOMAIN-DEBUG] Processing subdomain request: ${hostname}${pathname}`);
  
  // Use the path analyzer to get detailed information about the current path
  const pathAnalysis = await analyzeCurrentPath(request);
  
  // Use the username extracted from path analysis
  const username = pathAnalysis.detectedUsername;
  
  // Safety check - if no username was detected, we can't proceed
  if (!username) {
    console.log(`[SUBDOMAIN-DEBUG] No username detected from subdomain, cannot proceed with rewrite`);
    return NextResponse.next();
  }
  
  // Skip special subdomains
  if (['www', 'api', 'admin', 'app', 'dashboard'].includes(username)) {
    console.log(`[SUBDOMAIN-DEBUG] Skipping special subdomain: ${username}`);
    return NextResponse.next();
  }
  
  console.log(`[SUBDOMAIN-DEBUG] Subdomain request detected:
    - Username: ${username}
    - Original pathname: ${pathname}
    - Is root path: ${pathname === '/'}`);
  
  // Check if there's a path correction needed (e.g., subdomain with username in path)
  const correctPath = detectIncorrectPaths(pathAnalysis);
  
  if (correctPath) {
    console.log(`[SUBDOMAIN-DEBUG] Path correction needed:
      - From: ${pathname}
      - To: ${correctPath}`);
      
    // Redirect to the correct path instead of rewrite
    // This ensures the URL in the browser is updated and avoids 404s on client-side navigation
    const redirectUrl = new URL(correctPath, request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Rewrite the URL to the username route
  // e.g., username.minispace.dev/about -> minispace.dev/username/about
  const newPathname = `/${username}${pathname === '/' ? '' : pathname}`;
  const newUrl = new URL(newPathname, request.url);
  
  console.log(`[SUBDOMAIN-DEBUG] Rewriting URL:
    - From: ${request.url}
    - To pathname: ${newUrl.pathname}
    - Full new URL: ${newUrl.toString()}`);
  
  // Add custom headers to track that this request was rewritten
  const response = NextResponse.rewrite(newUrl);
  response.headers.set('X-Minispace-Rewritten-From-Subdomain', 'true');
  response.headers.set('X-Minispace-Original-Host', hostname);
  response.headers.set('X-Minispace-Username', username);
  
  // Add detailed path analysis info for debugging
  response.headers.set('X-Minispace-Path-Analysis', JSON.stringify({
    originalPath: pathname,
    normalizedPath: pathAnalysis.pathInfo.normalizedPath,
    pageType: pathAnalysis.pathInfo.pageType
  }));
  
  return response;
}
