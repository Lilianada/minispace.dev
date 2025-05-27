# Subdomain Routing Guide for Minispace.dev

This document outlines how subdomain-based routing works in Minispace.dev, allowing each user's blog to be accessible via `username.minispace.dev`.

## Architecture Overview

Subdomain routing involves several components working together:

1. **DNS Configuration**
2. **Vercel Configuration**
3. **Middleware**
4. **Dynamic Routes**
5. **Navigation Context**
6. **Theme Rendering**

## 1. DNS Configuration

For subdomain routing to work, you need a wildcard DNS record:

- Type: `A` or `CNAME`
- Host: `*`
- Value: Points to your Vercel deployment IP or domain
- TTL: 3600 (or as preferred)

## 2. Vercel Configuration

The `vercel.json` file includes rewrite rules to handle subdomain requests:

```json
{
  "rewrites": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "(?<subdomain>.*)\\.minispace\\.dev"
        }
      ],
      "destination": "/$subdomain/:path*"
    },
    {
      "source": "/",
      "has": [
        {
          "type": "host",
          "value": "(?<subdomain>.*)\\.minispace\\.dev"
        }
      ],
      "destination": "/$subdomain"
    }
  ]
}
```

Additionally, you must configure the domain in the Vercel dashboard:
1. Go to Project Settings → Domains
2. Add domain: `minispace.dev`
3. Add domain: `*.minispace.dev` (wildcard domain)
4. Verify ownership and configure DNS settings as directed

## 3. Middleware

The middleware (`/src/middleware.ts`) detects subdomain requests and rewrites them to the appropriate path:

```typescript
// Example: username.minispace.dev/about → minispace.dev/username/about
if (isSubdomain) {
  const username = extractUsernameFromHostname(hostname);
  const newUrl = new URL(`/${username}${pathname === '/' ? '' : pathname}`, request.url);
  return NextResponse.rewrite(newUrl);
}
```

## 4. Dynamic Routes

The dynamic user route (`/src/app/[username]/page.tsx`) handles both subdomain and path-based requests:

```typescript
const host = headersList.get('host') || '';
const navigationContext = createNavigationContext(username, { host }, `/`);
```

## 5. Navigation Context

The `NavigationContext` keeps track of whether we're in subdomain or path-based routing:

```typescript
interface NavigationContext {
  username: string;
  currentPage?: string;
  isSubdomain?: boolean;
}
```

The `createNavigationContext` function detects if a request is coming from a subdomain:

```typescript
const host = headers?.host || '';
const isSubdomain = host.startsWith(`${username}.`) || 
                    host.includes(`${username}.localhost`) ||
                    host.includes(`${username}.minispace.dev`);
```

## 6. Theme Rendering

When rendering themes, we modify navigation links based on the routing method:

```typescript
// For subdomain routing: /username/posts → /posts
// For path routing: /posts → /username/posts
renderedHtml = updateNavigationLinks(renderedHtml, navigationContext);
```

## Testing Subdomain Routing

### Development Environment

In development, test subdomain routing with:

1. Add to your `/etc/hosts` file:
   ```
   127.0.0.1  testuser.localhost
   ```

2. Access `testuser.localhost:3000` in your browser

### Production Environment

1. Ensure wildcard DNS is configured
2. Test accessing `yourusername.minispace.dev`
3. Verify links work correctly

## Debugging Tips

- Check the server logs for middleware processing entries
- Verify the `isSubdomain` flag is set correctly
- Test navigation links in both modes using the test script
- Examine network requests to ensure proper routing

## Common Issues and Solutions

### 404 Errors on Subdomain Navigation

**Problem:** Navigation links lead to 404 errors when accessed via subdomain.

**Solution:**
- Ensure theme templates use relative paths for subdomain mode
- Check that `updateNavigationLinks` properly transforms paths
- Verify middleware is correctly rewriting URLs

### Links Pointing to Wrong Locations

**Problem:** Links take users to incorrect URLs when switching between subdomain and path routing.

**Solution:**
- Update `generateNavigationHtml` and `updateNavigationLinks` to handle both routing modes
- Ensure consistent use of the `isSubdomain` flag throughout the codebase
