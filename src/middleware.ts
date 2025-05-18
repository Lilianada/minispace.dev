import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;
  
  // Check if user is trying to access a dashboard route
  if (pathname.includes('/dashboard')) {
    // Get username from path (format: /{username}/dashboard/*)
    const username = pathname.split('/')[1];
    
    // For now, we'll just log access and allow all requests through
    // This will fix the immediate loading issue
    console.log(`Middleware: Allowing access to ${pathname} for user ${username}`);
    
    // In the future, you should implement a proper server-side authentication check
    // using either JWT tokens in cookies or a session-based approach
    
    // IMPORTANT: Client-side auth (localStorage) can't be reliably checked in middleware
    // because middleware runs on the server and can't access client localStorage
  }
  
  return NextResponse.next();
}

// Only run this middleware on dashboard routes
export const config = {
  matcher: ['/:username/dashboard/:path*'],
};
