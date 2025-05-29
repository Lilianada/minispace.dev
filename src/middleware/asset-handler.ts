/**
 * Static Asset Handler
 * 
 * Middleware helper for handling static assets and skipping rewrite logic for them
 */
import { NextRequest, NextResponse } from 'next/server';

/**
 * Checks if the request is for a static asset and should skip middleware processing
 */
export function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/themes/') ||
    pathname.includes('/favicon.ico') ||
    pathname.includes('.png') ||
    pathname.includes('.jpg') ||
    pathname.includes('.svg') ||
    pathname.includes('.css') ||
    pathname.includes('.js')
  );
}

/**
 * Process static asset requests by simply passing through
 */
export function handleStaticAsset(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  
  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }
  
  return null;
}
