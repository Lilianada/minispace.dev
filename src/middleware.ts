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
    
    // If no username in path or no auth token, redirect to discover page
    if (!username || !hasAuthToken) {
      console.log(`Middleware: Redirecting unauthorized access to discover page. Path: ${pathname}, Username: ${username}, HasToken: ${hasAuthToken}`);
      const url = new URL('/discover', request.url);
      return NextResponse.redirect(url);
    }
    
    // Check if the username in the URL matches the username in localStorage
    // We can't access localStorage directly in middleware, but we can check cookies
    const storedUsername = request.cookies.get('username')?.value;
    
    // If the username in the URL doesn't match the stored username, redirect to discover
    if (storedUsername && username !== storedUsername) {
      console.log(`Middleware: Username mismatch. URL: ${username}, Stored: ${storedUsername}`);
      const url = new URL('/discover', request.url);
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
