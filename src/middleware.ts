import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;
  
  // Get hostname (e.g. username.minispace.dev, username.localhost:3000)
  const hostname = request.headers.get('host') || '';
  
  // Improved logging
  console.log(`Middleware processing request: ${hostname}${pathname}`);
  try {
  
  // Define environment variables
  const isProd = process.env.NODE_ENV === 'production';
  const prodDomain = 'minispace.dev';
  const devDomain = 'localhost';
  const currentDomain = isProd ? prodDomain : devDomain;
  
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
  const isSubdomain = hostname !== currentDomain && 
                     hostname !== `www.${currentDomain}` && 
                     !hostname.includes('vercel.app');
  
  if (isSubdomain) {
    let username = '';
    
    // Extract username from the hostname
    if (isProd) {
      // Production: username.minispace.dev
      username = hostname.replace(`.${prodDomain}`, '');
    } else {
      // Development: username.localhost:3000
      // First remove port if it exists
      const hostnameWithoutPort = hostname.split(':')[0];
      
      // Then extract username
      if (hostnameWithoutPort.endsWith(`.${devDomain}`)) {
        username = hostnameWithoutPort.replace(`.${devDomain}`, '');
      } else if (hostnameWithoutPort !== devDomain) {
        // Only treat as subdomain if it's not the main domain
        username = hostnameWithoutPort;
      } else {
        // This is the main domain, no rewrite needed
        return NextResponse.next();
      }
    }
    
    // Skip special subdomains
    if (['www', 'api', 'admin', 'app', 'dashboard'].includes(username)) {
      return NextResponse.next();
    }
    
    console.log(`Subdomain request detected: ${username}, pathname: ${pathname}`);
    
    
    // Rewrite the URL to the username route
    // e.g., username.minispace.dev/about -> minispace.dev/username/about
    const newUrl = new URL(`/${username}${pathname === '/' ? '' : pathname}`, request.url);
    console.log(`Rewriting to: ${newUrl.pathname}`);
    
    return NextResponse.rewrite(newUrl);
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
