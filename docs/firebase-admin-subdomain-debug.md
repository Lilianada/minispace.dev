# Firebase Admin and Subdomain Routing Debugging Guide

This guide helps troubleshoot Firebase Admin initialization issues when using subdomain routing in Minispace.dev, particularly when accessing routes like `/posts` from a subdomain (e.g., `demouser.localhost:3000/posts`).

## Common Issue: "Firebase Admin not available" Error

This error occurs when the Firebase Admin SDK is not properly initialized when accessing certain routes through subdomain URLs.

### Root Causes

1. **Environment Detection Issues**: Firebase Admin may not properly detect development mode in subdomain context
2. **DNS Configuration**: Local development subdomain setup may be incomplete
3. **Firebase Admin Initialization**: The initialization process may fail in certain routing contexts

## Troubleshooting Steps

### 1. Setup Local Subdomains

First, make sure your local development environment is properly configured for subdomain testing:

```bash
# Set up local subdomain entries in /etc/hosts
sudo scripts/setup-local-subdomains.sh

# Verify the entries were added correctly
grep "localhost" /etc/hosts | grep -v "^#"
```

This script adds entries to your `/etc/hosts` file for common test usernames (demouser, test, admin, dev) so you can access them via subdomain URLs like `demouser.localhost:3000`.

### 2. Test Subdomain Resolution

Run the test script to verify subdomain resolution works correctly:

```bash
node scripts/test-subdomain-resolution.js
```

### 3. Test Subdomain Posts Route Specifically

We've created a special test script for the posts route which is commonly affected:

```bash
node scripts/test-subdomain-posts.js
```

This will test access to `/posts` through both subdomain and path-based routing for comparison.

### 4. Check Firebase Admin Initialization

The Firebase Admin SDK should recognize development mode and provide demo content even when actual credentials aren't available. Look for these log entries:

```
[Firebase Admin] isAdminAvailable() called - adminInitialized: development, adminAuth: false, adminDb: false, result: false
[Firebase Admin] Admin not available but in development mode - allowing demo content
```

If you don't see this behavior, there might be an issue with the development mode detection.

### 5. Restart Development Server

Sometimes a clean restart can fix initialization issues:

```bash
# Kill any running Next.js development servers
pkill -f "node.*next"

# Start a fresh development server
npm run dev
```

## Key Files

If you need to modify the code, here are the key files involved:

1. `/src/lib/firebase/admin.ts` - Firebase Admin initialization and availability checks
2. `/src/app/[username]/posts/page.tsx` - Posts page component that uses Firebase Admin
3. `/src/middleware.ts` - Handles subdomain routing and path rewrites
4. `/src/lib/navigation-utils.ts` - Utilities for navigation context and subdomain detection

## Advanced Debugging

### Enable Extra Logging

You can enable more detailed logging by setting the `DEBUG` environment variable:

```bash
DEBUG=minispace:* npm run dev
```

### Check for Subdomain Detection

The middleware should detect subdomains and rewrite the URL correctly. Look for log entries like:

```
[SUBDOMAIN-DEBUG] Rewriting URL:
  - From: http://demouser.localhost:3000/posts
  - To pathname: /demouser/posts
  - Full new URL: http://localhost:3000/demouser/posts
```

### Test Firebase Admin in Isolation

You can test the Firebase Admin initialization in isolation:

```bash
# Test Firebase Admin initialization
node test-firebase-admin.js
```

## Recent Improvements

Recent code changes have addressed several issues:

1. Enhanced `isAdminAvailable()` function to be more permissive in development mode
2. Added special handling for subdomain requests
3. Improved error reporting in Posts page
4. Added comprehensive logging for debugging

If you're still experiencing issues after going through these steps, please open an issue on GitHub with detailed logs from the server console.
