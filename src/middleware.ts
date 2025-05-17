import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;
  
  // Check for authentication tokens in cookies
  const hasAuthToken = request.cookies.has('authToken');
  
  // Check if user is trying to access a dashboard route
  if (pathname.includes('/dashboard')) {
    // Get username from path (format: /{username}/dashboard/*)
    const username = pathname.split('/')[1];
    
    // If no username in path or no auth token, redirect to sign in
    if (!username || !hasAuthToken) {
      console.log(`Middleware: Redirecting unauthorized access to signin. Path: ${pathname}, Username: ${username}, HasToken: ${hasAuthToken}`);
      const url = new URL('/signin', request.url);
      url.searchParams.set('redirect', 'dashboard');
      return NextResponse.redirect(url);
    }
    
    // Username exists and token exists - let the user through
    // But log that we're allowing access
    console.log(`Middleware: Allowing access to ${pathname} for user ${username}`);
  }
  
  return NextResponse.next();
}

// Only run this middleware on dashboard routes
export const config = {
  matcher: ['/:username/dashboard/:path*'],
};
