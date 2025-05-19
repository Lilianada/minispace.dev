import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname, host } = url;
  
  // Check for subdomain access
  const hostname = host.split(':')[0];
  const isProd = process.env.NODE_ENV === 'production';
  const mainDomain = isProd ? 'minispace.dev' : 'localhost';
  
  // Handle subdomain routing
  if (hostname !== mainDomain && !hostname.includes('vercel.app')) {
    // Extract username from subdomain (e.g., username.minispace.dev)
    const subdomain = hostname.replace(`.${mainDomain}`, '');
    
    // Skip if this is a special subdomain like 'www' or 'api'
    if (['www', 'api', 'admin'].includes(subdomain)) {
      return NextResponse.next();
    }
    
    // Create a new URL with the path format
    const newUrl = new URL(`/${subdomain}${pathname === '/' ? '' : pathname}`, url);
    return NextResponse.rewrite(newUrl);
  }
  
  // Handle dashboard access control
  if (pathname.includes('/dashboard')) {
    // Get username from path (format: /{username}/dashboard/*)
    const username = pathname.split('/')[1];
    
    // For now, we'll just log access and allow all requests through
    console.log(`Middleware: Allowing access to ${pathname} for user ${username}`);
    
    // In the future, you should implement a proper server-side authentication check
    // using either JWT tokens in cookies or a session-based approach
  }
  
  return NextResponse.next();
}

// Run middleware on all routes
export const config = {
  matcher: [
    // Dashboard routes
    '/:username/dashboard/:path*',
    // All routes for subdomain handling
    '/(.*)',
  ],
};
