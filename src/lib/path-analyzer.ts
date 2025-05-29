/**
 * Path Analyzer
 * 
 * Helper utilities to analyze and troubleshoot paths in both subdomain and path-based routing.
 * This module is critical for the proper functioning of the subdomain routing system.
 * 
 * @module path-analyzer
 */

import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

/**
 * Represents the complete analysis of a path including subdomain detection,
 * username extraction, and path normalization.
 * 
 * @interface PathAnalysis
 */
export interface PathAnalysis {
  detectedUsername: string | null;
  isSubdomain: boolean;
  pathInfo: {
    originalPath: string;
    normalizedPath: string;  // Path with username removed if subdomain
    pathSegments: string[];
    pageType: string;  // 'home', 'posts', 'post', 'about', etc.
  };
  hostInfo: {
    hostname: string;
        /** Array of domain parts (e.g. ['username', 'minispace', 'dev']) */
    domainParts: string[];
    /** Whether we're in production or development environment */
    isProd: boolean;
  };
  /** Record of links that were transformed during processing */
  transformedLinks?: {
    /** Original link before transformation */
    original: string;
    /** Transformed link after processing */
    transformed: string;
  }[];
}

/**
 * Creates a standardized analysis of the current path and routing context.
 * This function is the core of the path analysis system and is used by the
 * middleware to determine how to handle requests.
 * 
 * @param request - Optional Next.js request object. If not provided, will
 *                 attempt to get information from headers().
 * @returns A Promise resolving to a complete path analysis
 */
export async function analyzeCurrentPath(request?: NextRequest): Promise<PathAnalysis> {
  // Get hostname from headers or request
  let hostname = '';
  let fullUrl = '';
  let originalPath = '';
  
  // Server-side
  if (!request) {
    try {
      const headersList = await headers();
      hostname = headersList.get('host') || '';
      originalPath = headersList.get('x-pathname') || 
                   headersList.get('x-original-pathname') || 
                   headersList.get('x-url') || '';
      
      // If we couldn't get the path from headers, try to get it from the current URL
      if (!originalPath && typeof window !== 'undefined') {
        originalPath = window.location.pathname;
      }
    } catch (error) {
      console.error('[Path Analyzer] Error getting headers:', error);
    }
  } 
  // Using NextRequest
  else {
    hostname = request.headers.get('host') || '';
    fullUrl = request.url;
    originalPath = new URL(request.url).pathname;
  }
  
  // Determine if we're in production or development
  const isProd = process.env.NODE_ENV === 'production';
  const domainParts = hostname.split('.');
  
  // Check if this is a subdomain request
  const isSubdomain = (isProd && domainParts.length > 2 && domainParts[1] === 'minispace') ||
                     (!isProd && domainParts.length > 1 && domainParts[1].startsWith('localhost'));
  
  // Extract username
  let detectedUsername: string | null = null;
  
  if (isSubdomain) {
    // From subdomain
    detectedUsername = domainParts[0];
  } else if (originalPath.startsWith('/')) {
    // From path (format: /{username}/...)
    const pathSegments = originalPath.split('/').filter(Boolean);
    
    // Skip auth-related paths and other system paths
    const systemPaths = [
      'signin', 'signup', 'forgot-password', 
      'api', 'docs', 'terms', 'privacy', 'contact', 'about', 
      'favicon', 'favicon.ico', '_next', 'themes'
    ];
    
    // Check for special file extensions that should never be usernames
    const isSpecialFile = pathSegments.length > 0 && (
      pathSegments[0].endsWith('.ico') ||
      pathSegments[0].endsWith('.png') ||
      pathSegments[0].endsWith('.jpg') ||
      pathSegments[0].endsWith('.svg') ||
      pathSegments[0].endsWith('.css') ||
      pathSegments[0].endsWith('.js')
    );
    
    if (pathSegments.length > 0 && !systemPaths.includes(pathSegments[0]) && !isSpecialFile) {
      detectedUsername = pathSegments[0];
    }
  }
  
  // Determine normalized path (without username if subdomain)
  let normalizedPath = originalPath;
  
  if (isSubdomain && detectedUsername && originalPath.startsWith(`/${detectedUsername}`)) {
    // For subdomain, we shouldn't have the username in the path
    // This might indicate a potential routing issue
    normalizedPath = originalPath === `/${detectedUsername}` 
      ? '/' 
      : originalPath.replace(`/${detectedUsername}`, '');
      
    console.warn(`[Path Analyzer] Detected potential routing issue - username in path despite being on subdomain:
      - Original path: ${originalPath}
      - Normalized path: ${normalizedPath}
      - Username: ${detectedUsername}`);
  } else if (isSubdomain) {
    // Normal subdomain case, path is already correct
    normalizedPath = originalPath;
  } else if (detectedUsername) {
    // Path-based routing, keep the path as is
    normalizedPath = originalPath;
  }
  
  // Get path segments for further analysis
  const pathSegments = normalizedPath.split('/').filter(Boolean);
  
  // Determine page type
  let pageType = 'home';
  if (pathSegments.length > 0) {
    if (isSubdomain) {
      // In subdomain mode, first segment is the page type
      pageType = pathSegments[0] || 'home';
    } else {
      // In path mode, second segment is the page type (first is username)
      pageType = pathSegments.length > 1 ? pathSegments[1] : 'home';
    }
  }
  
  // Special case for post/slug
  if (pageType === 'post' && pathSegments.length > (isSubdomain ? 1 : 2)) {
    pageType = 'post-single';
  }
  
  return {
    detectedUsername,
    isSubdomain,
    pathInfo: {
      originalPath,
      normalizedPath,
      pathSegments,
      pageType,
    },
    hostInfo: {
      hostname,
      domainParts,
      isProd,
    }
  };
}

/**
 * Fixes paths that may have been incorrectly formatted and returns the corrected path for redirects.
 * This function is used by the middleware to handle path corrections automatically.
 * 
 * There are two main cases it handles:
 * 1. Subdomain mode: Remove username from path (e.g. username.mini.dev/username/page -> username.mini.dev/page)
 * 2. Path mode: Add username to path (e.g. mini.dev/page -> mini.dev/username/page)
 * 
 * @param analysis - The path analysis object from analyzeCurrentPath
 * @returns The corrected path for redirect, or null if no correction is needed
 */
export function detectIncorrectPaths(analysis: PathAnalysis): string | null {
  const { detectedUsername, isSubdomain, pathInfo } = analysis;
  
  if (!detectedUsername) {
    return null; // Cannot fix without a username
  }
  
  // Case 1: On a subdomain but path still includes username
  if (isSubdomain && pathInfo.originalPath.startsWith(`/${detectedUsername}`)) {
    if (pathInfo.originalPath === `/${detectedUsername}`) {
      return '/';
    } else {
      return pathInfo.originalPath.replace(`/${detectedUsername}`, '');
    }
  }
  
  // Case 2: Not on subdomain but path doesn't include username
  if (!isSubdomain && !pathInfo.originalPath.startsWith(`/${detectedUsername}`)) {
    // Only fix if this isn't already a root path
    if (pathInfo.pathSegments.length > 0) {
      return `/${detectedUsername}${pathInfo.originalPath}`;
    }
  }
  
  return null; // No correction needed
}

/**
 * Generate comprehensive debug information about the current path
 * This function is used by the debugging tools to display detailed information
 * about the current routing state.
 * 
 * @param analysis - The path analysis object from analyzeCurrentPath
 * @returns A detailed object with all path information and potential issues
 */
export function getPathDebugInfo(analysis: PathAnalysis): Record<string, any> {
  return {
    ...analysis,
    possibleIssues: [
      {
        type: 'subdomain_with_username_in_path',
        detected: analysis.isSubdomain && analysis.pathInfo.originalPath.startsWith(`/${analysis.detectedUsername}`),
        fix: analysis.isSubdomain && analysis.pathInfo.originalPath.startsWith(`/${analysis.detectedUsername}`) 
          ? analysis.pathInfo.originalPath.replace(`/${analysis.detectedUsername}`, '') || '/'
          : null
      },
      {
        type: 'path_based_missing_username',
        detected: !analysis.isSubdomain && 
                  analysis.detectedUsername && 
                  !analysis.pathInfo.originalPath.startsWith(`/${analysis.detectedUsername}`),
        fix: !analysis.isSubdomain && 
             analysis.detectedUsername && 
             !analysis.pathInfo.originalPath.startsWith(`/${analysis.detectedUsername}`)
          ? `/${analysis.detectedUsername}${analysis.pathInfo.originalPath}`
          : null
      }
    ],
    correctPath: detectIncorrectPaths(analysis),
    pageResolution: {
      resolvedPageType: analysis.pathInfo.pageType,
      expectedFullPath: analysis.isSubdomain 
        ? analysis.pathInfo.originalPath 
        : `/${analysis.detectedUsername}${analysis.pathInfo.normalizedPath === '/' ? '' : analysis.pathInfo.normalizedPath}`
    }
  };
}
