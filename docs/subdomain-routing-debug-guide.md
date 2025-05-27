# Subdomain Routing Debug Guide

## Overview

This guide provides instructions for diagnosing and fixing 404 errors in subdomain routing. The primary issue occurs when navigating between pages on a user's subdomain (e.g., `username.minispace.dev`), where links may be incorrectly formatted, causing 404 errors in navigation.

## Debugging Tools

### 1. Client-side Debugging Overlay

The routing debug overlay provides real-time information about the current routing context:

- **How to activate**: Add `?debug_routing=true` to any URL, or use the Always Show button to enable it permanently
- **Features**:
  - Displays hostname, pathname, username detection
  - Shows subdomain status
  - Provides quick test links
  - Displays custom routing headers

Example:
```
https://username.minispace.dev/posts?debug_routing=true
```

### 2. Server-side Debugging API

Access detailed information about how a request is being processed:

- **Endpoint**: `/api/debug`
- **Returns**: JSON with detailed routing analysis
- **Usage**: Access directly in browser or via fetch in console

Example:
```javascript
// In browser console
fetch('/api/debug').then(r => r.json()).then(console.log)
```

### 3. Path Analysis Utilities

The `path-analyzer.ts` module provides utilities for detecting and fixing routing issues:

- **analyzeCurrentPath()**: Analyzes the current URL path for routing issues
- **detectIncorrectPaths()**: Determines if a path needs correction
- **getPathDebugInfo()**: Provides comprehensive debug info for a path

### 4. Link Verification

The system automatically verifies and corrects links during theme rendering:

- **verifyNavigationLinks()**: Checks if links are formatted correctly
- **fixIncorrectLinks()**: Corrects incorrectly formatted links

### 5. Route Validation Script

A dedicated script for validating routes across different routing modes:

- **Location**: `/scripts/validate-routing.js`
- **Usage**: `node scripts/validate-routing.js <username>`
- **Features**:
  - Tests both subdomain and path-based routes
  - Compares responses for consistency
  - Highlights 404 errors and inconsistencies
  - Provides interactive mode for testing specific URLs

## Common 404 Issues and Solutions

### 1. Problem: Username appears in path despite being on subdomain

Example: User on `username.minispace.dev/username/about` (should be just `/about`)

**Solution**: The system now detects this issue and automatically redirects to the correct path.

### 2. Problem: Links in themes have incorrect format

Example: On subdomain, links are still prefixed with username (`/username/posts` instead of `/posts`)

**Solution**: 
- Enhanced link verification in `updateNavigationLinks()`
- Additional verification and fixing with `verifyNavigationLinks()` and `fixIncorrectLinks()`

### 3. Problem: Client-side navigation breaks subdomain routing

**Solution**:
- Added clearer context in HTML to improve client-side routing
- Added debugging comments to HTML source
- Implemented path correction to maintain consistent routing

## Troubleshooting Process

1. **Enable the debug overlay** by adding `?debug_routing=true` to the URL
2. **Inspect link issues** in the browser console (look for [SUBDOMAIN-DEBUG] logs)
3. **Use the validate-routing.js script** to identify specific route issues
4. **Check for redirection patterns** when navigating between pages
5. **Analyze server logs** for middleware rewrites and transformations

## Environment-specific Notes

### Development Environment

- Subdomains follow the pattern `username.localhost:3000`
- **Local hostname configuration required**:
  ```bash
  # Add to /etc/hosts file:
  127.0.0.1 username.localhost
  
  # Or use our helper script:
  sudo ./scripts/setup-local-subdomains.sh username
  ```
- Alternatively, you can use IP-based subdomains: `username.127.0.0.1:3000`
- Debug logs are more verbose in development
- Run `node scripts/test-subdomain-resolution.js username` to test your setup

### Production Environment

- Subdomains follow the pattern `username.minispace.dev`
- DNS must be properly configured
- Vercel deployment may require domain verification

## DNS and Configuration Requirements

For proper subdomain routing:

1. **Wildcard DNS record** must be configured:
   ```
   *.minispace.dev  A  <server-ip>
   ```

2. **Vercel domain verification**:
   - Verify the main domain (`minispace.dev`)
   - Add wildcard domain (`*.minispace.dev`)

## Reporting Issues

When reporting subdomain routing issues:

1. **Include debug overlay screenshot**
2. **Share validate-routing.js output**
3. **Describe exact navigation steps** that caused the 404
4. **Include browser console logs** with [SUBDOMAIN-DEBUG] messages

## Future Improvements

- Additional test coverage for edge cases
- Browser extension for advanced debugging
- Performance optimization for link transformation
- Improved caching strategy for subdomain routes
