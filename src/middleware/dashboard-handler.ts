/**
 * Dashboard Handler
 * 
 * Middleware helper for processing dashboard-specific routes
 */
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handle dashboard access control
 */
export function handleDashboard(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  
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
  
  return null;
}
