import { NextRequest, NextResponse } from 'next/server';
import { analyzeCurrentPath, detectIncorrectPaths } from './lib/path-analyzer';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;
  
  // Get hostname (e.g. username.minispace.dev, username.localhost:3000)
  const hostname = request.headers.get('host') || '';
  
  // Detailed logging for subdomain debugging
  console.log(`[SUBDOMAIN-DEBUG] *** Middleware processing request ***
    - Full URL: ${request.url}
    - Hostname: ${hostname}
    - Pathname: ${pathname}
    - Headers: ${JSON.stringify(Object.fromEntries(request.headers), null, 2)}`);
  
  try {
    // Use the path analyzer to get detailed information about the current path
    const pathAnalysis = analyzeCurrentPath(request);
    console.log(`[SUBDOMAIN-DEBUG] Path analysis:`, JSON.stringify(pathAnalysis, null, 2));
  
  // Define environment variables
  const isProd = process.env.NODE_ENV === 'production';
  const prodDomain = 'minispace.dev';
  const devDomain = 'localhost';
  const currentDomain = isProd ? prodDomain : devDomain;
  
  // Additional domains to check for development environments
  const devDomains = ['localhost', '127.0.0.1']; // Support IP-based localhost 
  const devDomainsWithPort = devDomains.map(d => `${d}:3000`);
  
  console.log(`[SUBDOMAIN-DEBUG] Environment:
    - isProd: ${isProd}
    - prodDomain: ${prodDomain}
    - devDomains: ${devDomains.join(', ')}
    - currentDomain: ${currentDomain}`);
  
  // Skip static assets and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('/favicon.ico') ||
    pathname.includes('.png') ||
    pathname.includes('.jpg') ||
    pathname.includes('.svg') ||
    pathname.includes('.css') ||
    pathname.includes('.js')
  ) {
    return NextResponse.next();
  }
  
  // Log request details for debugging
  console.log(`Middleware processing: ${hostname}${pathname}`);
  
  // In development, check if this is actually localhost itself (not a subdomain)
  if (!isProd && (hostname === 'localhost:3000' || hostname === 'localhost')) {
    console.log('Main localhost domain detected, no rewrite needed');
    return NextResponse.next();
  }
  
  // Check if this is a subdomain request
  const isMainDomain = hostname === currentDomain || 
                      hostname === `www.${currentDomain}` || 
                      hostname.includes('vercel.app') ||
                      devDomains.includes(hostname) ||
                      devDomainsWithPort.includes(hostname);
  
  const isSubdomain = !isMainDomain;
                     
  console.log(`[Middleware] Is subdomain check: ${hostname}, result: ${isSubdomain}`);
  
  if (isSubdomain) {
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
  
  // Handle dashboard access control
  if (pathname.includes('/dashboard')) {
    // Get username from path (format: /{username}/dashboard/*)
    const username = pathname.split('/')[1];
    
    console.log(`Dashboard access: ${pathname} for user ${username}`);
    
    // Special handling for demouser for debugging
    if (username === 'demouser') {
      console.log('Demo user dashboard access detected');
      // Make sure to verify the URL structure is correct
      const pathParts = pathname.split('/');
      console.log('Path parts:', pathParts);
      
      // Ensure the page exists by constructing a valid path
      // No rewrite needed, just validate the request can be processed
    }
    
    return NextResponse.next();
  }
  
  return NextResponse.next();
  
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

// Run middleware on all routes, but exclude static files and API routes
export const config = {
  matcher: [
    // Dashboard routes
    '/:username/dashboard/:path*',
    // All routes for subdomain handling, except Next.js static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
