# Subdomain Routing Debug Guide

This document provides instructions on how to use the debug tools we've added to diagnose 404 errors with subdomain routing in Minispace.dev.

## Available Debug Tools

1. **Debug Logging in Source Files**
   - Enhanced console logs with `[SUBDOMAIN-DEBUG]` prefix
   - Detailed information about request handling and link transformations

2. **Debug Overlay Component**
   - Visual debugging overlay showing routing information
   - Available in production by adding `?debug_routing=true` to any URL

3. **API Debug Endpoint**
   - `/api/debug` - Returns detailed request and routing information

4. **Theme Rendering Debugger**
   - Analyzes theme HTML for link patterns
   - Detects potential routing issues

5. **Error Monitoring**
   - Script to monitor and analyze 404 errors
   - Identifies patterns in routing failures

## How to Enable Debugging

### In Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Enable the debug overlay:
   - Add `?debug_routing=true` to any URL
   - Or click "Always Show" in the debug overlay (once visible)

3. Monitor errors by running:
   ```bash
   ./scripts/start-monitoring.sh
   ```

### In Production

1. Enable the debug overlay:
   - Add `?debug_routing=true` to any URL
   
2. Check browser console for detailed logs
   - All logs are prefixed with `[SUBDOMAIN-DEBUG]`
   
3. Use the API debug endpoint:
   - Navigate to `/api/debug` to see raw request data

## Diagnosing Common Issues

### 1. Links Leading to 404 Errors

Check the debug overlay to see:
- If the site is correctly detected as a subdomain
- What username is being extracted
- How links are being transformed

Look for these patterns in the console logs:
```
[SUBDOMAIN-DEBUG] Links before transformation:
/username/posts
/username/about

[SUBDOMAIN-DEBUG] Links after transformation:
/posts
/about
```

### 2. Incorrect Subdomain Detection

Check the middleware logs:
```
[SUBDOMAIN-DEBUG] Is subdomain check: username.minispace.dev, result: true
```

If this shows `false` when it should be `true`, check:
- Hostname format
- DNS configuration
- Middleware subdomain detection logic

### 3. Wrong Username Extraction

Check these logs:
```
[SUBDOMAIN-DEBUG] Extracted from standard dev subdomain: username
```

If the username is incorrect, check:
- Hostname parsing
- Subdomain structure
- Username extraction logic

## Using the Error Monitor

The error monitor will automatically detect patterns of 404 errors and provide insights:

```
⚠️  SUBDOMAIN ROUTING ALERT ⚠️
8 404 errors detected in the last minute!

URL patterns in 404 errors:
  - posts: 5 occurrences
  - about: 3 occurrences

Subdomain errors: 8
Path-based errors: 0

Sample subdomain 404 errors:
  - https://username.minispace.dev/posts
  - https://username.minispace.dev/about
  - https://username.minispace.dev/post/hello-world
```

## Additional Testing Tools

1. **Link Pattern Testing**:
   ```bash
   node scripts/test-subdomain-routing.js
   ```

2. **Navigation Link Testing**:
   ```bash
   node scripts/test-navigation-links.js
   ```

## Looking at HTML Source for Debug Info

View the page source in any rendered page to find the debug comment:

```html
<!-- 
MINISPACE DEBUG INFO:
  Theme: altay
  Page: home
  Username: username
  Is subdomain: true
  Timestamp: 2025-05-27T12:34:56.789Z
-->
```

This will help identify if the page was rendered with the correct routing context.
