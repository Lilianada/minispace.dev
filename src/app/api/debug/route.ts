import { NextRequest, NextResponse } from 'next/server';
import { analyzeCurrentPath, getPathDebugInfo } from '../../../lib/path-analyzer';

/**
 * API endpoint for collecting routing debug information
 * This can be accessed client-side to get more detailed routing information
 * than what's available in the browser environment
 */
export async function GET(request: NextRequest) {
  const headers = request.headers;
  const headerObj: Record<string, string> = {};
  headers.forEach((value, key) => {
    headerObj[key] = value;
  });

  // Get URL and hostname information
  const { pathname, search, hash, host, hostname, protocol } = new URL(request.url);

  // Get detailed path analysis
  const pathAnalysis = analyzeCurrentPath(request);
  const pathDebugInfo = getPathDebugInfo(pathAnalysis);
  
  // Extract key information for backward compatibility
  const isSubdomain = pathAnalysis.isSubdomain;
  const extractedUsername = pathAnalysis.detectedUsername;

  // Original URL reconstruction for backward compatibility
  let originalUrl = '';
  if (isSubdomain && extractedUsername) {
    // If it's a subdomain, the original URL would be relative
    const pathWithoutUsername = pathname === `/${extractedUsername}` 
      ? '/' 
      : pathname.startsWith(`/${extractedUsername}/`)
        ? pathname.substring(extractedUsername.length + 1)
        : pathname;
        
    originalUrl = `${protocol}//${hostname}${pathWithoutUsername}${search}${hash}`;
  }
  
  // Build enhanced debug info
  const debugInfo = {
    timestamp: new Date().toISOString(),
    url: request.url,
    method: request.method,
    pathname,
    search,
    hash,
    host,
    hostname,
    isSubdomain,
    extractedUsername,
    originalUrl: originalUrl || null,
    headers: headerObj,
    environment: {
      isProd: process.env.NODE_ENV === 'production',
      prodDomain: 'minispace.dev',
      devDomain: 'localhost',
      nodeEnv: process.env.NODE_ENV,
    },
    // Include enhanced path analysis
    pathAnalysis: pathDebugInfo,
    routingIssues: pathDebugInfo.possibleIssues.filter(issue => issue.detected),
    correctPath: pathDebugInfo.correctPath
  };
  
  return NextResponse.json(debugInfo);
}
