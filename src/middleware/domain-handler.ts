/**
 * Domain Handler
 * 
 * Middleware helper for domain analysis and subdomain detection
 */
import { NextRequest, NextResponse } from 'next/server';

/**
 * Get domain information for the current request
 */
export function getDomainInfo(hostname: string) {
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
    
  // Check if this is a subdomain request
  const isMainDomain = hostname === currentDomain || 
                      hostname === `www.${currentDomain}` || 
                      hostname.includes('vercel.app') ||
                      devDomains.includes(hostname) ||
                      devDomainsWithPort.includes(hostname);
  
  const isSubdomain = !isMainDomain;
  
  return {
    isProd,
    prodDomain,
    devDomain, 
    currentDomain,
    devDomains,
    devDomainsWithPort,
    isMainDomain,
    isSubdomain
  };
}

/**
 * Handle specific development domain cases
 */
export function handleDevDomain(request: NextRequest): NextResponse | null {
  const isProd = process.env.NODE_ENV === 'production';
  const hostname = request.headers.get('host') || '';
  
  // In development, check if this is actually localhost itself (not a subdomain)
  if (!isProd && (hostname === 'localhost:3000' || hostname === 'localhost')) {
    console.log('Main localhost domain detected, no rewrite needed');
    return NextResponse.next();
  }
  
  return null;
}
