import { NextRequest, NextResponse } from 'next/server';
import { handleStaticAsset } from './middleware/asset-handler';
import { getDomainInfo, handleDevDomain } from './middleware/domain-handler';
import { handleSubdomain } from './middleware/subdomain-handler';
import { handleDashboard } from './middleware/dashboard-handler';
import { analyzeCurrentPath } from './lib/path-analyzer';

/**
 * Main middleware function that processes all incoming requests
 * Uses modular handlers for different aspects of request processing
 */
export async function middleware(request: NextRequest) {
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
    
    // 1. Handle static assets (images, JS, CSS, etc.)
    const staticResult = handleStaticAsset(request);
    if (staticResult) return staticResult;
    
    // Log request details for debugging
    console.log(`Middleware processing: ${hostname}${pathname}`);
    
    // 2. Handle development domain cases
    const devResult = handleDevDomain(request);
    if (devResult) return devResult;
    
    // 3. Get domain information and determine if this is a subdomain
    const domainInfo = getDomainInfo(hostname);
    console.log(`[Middleware] Is subdomain check: ${hostname}, result: ${domainInfo.isSubdomain}`);
    
    // 4. Process subdomain requests
    const subdomainResult = await handleSubdomain(request, domainInfo.isSubdomain);
    if (subdomainResult) return subdomainResult;
    
    // 5. Handle dashboard access control
    const dashboardResult = handleDashboard(request);
    if (dashboardResult) return dashboardResult;
    
    // Default response
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
