# Dynamic Navigation Guide for Minispace.dev

This document explains how to use the dynamic navigation system in Minispace.dev to create custom navigation menus for user sites.

## Overview

Minispace supports both default navigation routes and custom user-defined routes. The navigation system works with both subdomain routing (`username.minispace.dev`) and path-based routing (`minispace.dev/username`).

## Navigation Context

The core of the system is the `NavigationContext` which provides information about:

- The username
- The current active page
- Whether we're using subdomain routing or path-based routing

```typescript
interface NavigationContext {
  username: string;
  currentPage?: string;
  isSubdomain?: boolean;
}
```

## Basic Usage

### 1. Creating Navigation Context

Generate a navigation context based on request headers and pathname:

```typescript
import { createNavigationContext } from '@/lib/navigation-utils';

// In your route handler or page component:
const navigationContext = createNavigationContext(username, {
  host: request.headers.get('host')
}, pathname);
```

### 2. Generating Default Navigation HTML

Generate HTML for the default navigation items:

```typescript
import { generateNavigationHtml } from '@/lib/navigation-utils';

const navHtml = generateNavigationHtml(navigationContext);
```

### 3. Generating Custom Navigation HTML

Provide custom navigation links:

```typescript
const customNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/posts', label: 'Blog' },
  { href: '/projects', label: 'Projects' }, // Custom page
  { href: '/gallery', label: 'Gallery' },   // Custom page
  { href: '/contact', label: 'Contact' }    // Custom page
];

const navHtml = generateNavigationHtml(navigationContext, customNavLinks);
```

## Loading Custom Navigation Links

### From User Configuration

You can load custom navigation links from user configuration stored in your database:

```typescript
// Example with Firebase
async function getUserNavLinks(username: string): Promise<NavigationLink[]> {
  const userDoc = await db.collection('users').doc(username).get();
  const userData = userDoc.data();
  
  return userData?.navigation || [
    { href: '/', label: 'Home' },
    { href: '/posts', label: 'Writing' },
    { href: '/about', label: 'About' }
  ];
}

// Then in your handler:
const customNavLinks = await getUserNavLinks(username);
const navHtml = generateNavigationHtml(navigationContext, customNavLinks);
```

### From Theme Configuration

You can also define navigation structure in each theme:

```typescript
// When loading a theme
const theme = await getThemeById(themeId);
const navLinks = theme.navigation || defaultNavLinks;

const navHtml = generateNavigationHtml(navigationContext, navLinks);
```

## Transforming HTML Content

The `updateNavigationLinks` function transforms any HTML content to ensure all links use the correct format based on routing type:

```typescript
import { updateNavigationLinks } from '@/lib/navigation-utils';

// In your theme renderer:
let renderedHtml = renderTemplate(template, data);

// Apply navigation transformations
renderedHtml = updateNavigationLinks(renderedHtml, navigationContext);
```

## Path Handling

The system automatically handles:

1. **Subdomain Routing**:
   - Converts `/username/page` links to `/page`
   - Ensures all links are relative to the subdomain

2. **Path-based Routing**:
   - Converts `/page` links to `/username/page`
   - Prefixes all relative links with username

## Example Integration with Theme Service

```typescript
export async function renderThemePage(
  themeId: string,
  page: string,
  context: RenderContext
): Promise<string> {
  // Load user custom navigation
  const customNavLinks = await getUserNavLinks(context.site.username);
  
  // Create navigation HTML
  const navigationHtml = generateNavigationHtml(
    context.navigationContext,
    customNavLinks
  );
  
  // Render the template
  let renderedHtml = renderTemplate(template, {
    ...context,
    navigation: navigationHtml
  });
  
  // Post-process to fix any remaining links
  renderedHtml = updateNavigationLinks(renderedHtml, context.navigationContext);
  
  return renderedHtml;
}
```

## Adding New Pages

To add new pages to your site:

1. Add the page to your navigation links
2. Create the corresponding route handler in your Next.js app
3. Create a template for the new page type in your theme

The dynamic navigation system will automatically handle both subdomain and path-based routing for all your custom pages.
