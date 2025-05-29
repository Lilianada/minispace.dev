# Provider Structure in Minispace

## Overview

This document explains the provider structure in the Minispace application, clarifying the roles of different providers and how they interact with each other.

## Provider Components

### 1. Global Context Providers (`/components/common/Providers.tsx`)

This component wraps the entire application and provides fundamental context providers:

- **AuthProvider**: Manages authentication state throughout the application
- **ToastProvider**: Manages custom toast notifications (from contexts/ToastContext)

### 2. UI Component Providers

These are separate from the context providers and provide UI-specific functionality:

- **Toaster** (`/components/ui/toaster.tsx`): Displays toast notifications using the shadcn UI library
- **TooltipProvider** (`/components/ui/tooltip.tsx`): Manages tooltip UI components

### Toast System

The application currently has two toast systems:

1. **Custom Toast System**:
   - Context: `contexts/ToastContext.tsx`
   - Provider: `ToastProvider` from the context
   - Usage: Custom implementation for simple toast messages
   - Access via: `import { useContext } from 'react'; import { ToastContext } from '@/contexts/ToastContext';`

2. **Shadcn UI Toast System**:
   - Component: `components/ui/toast.tsx`
   - Hook: `hooks/useToast.ts`
   - Component: `Toaster` for displaying notifications
   - Usage: More feature-rich UI toast notifications
   - Access via: `import { useToast } from '@/hooks/useToast';`

#### Which Toast System to Use

Until these systems are consolidated, follow these guidelines:

- **For New Components**: Use the Shadcn UI toast system via `useToast` hook
- **For Existing Components**: Continue using the system they currently implement
- **For Features Requiring Advanced UI**: Use the Shadcn UI toast system

#### Planned Consolidation

A future refactoring task is to consolidate these two toast systems:

1. Migrate all custom toast usages to the Shadcn UI system
2. Update the `ToastProvider` in the global providers to remove the custom implementation
3. Ensure consistent toast appearance and behavior throughout the application

## Provider Hierarchy

The provider hierarchy in the root layout is designed to ensure all components have access to necessary contexts:

```
<html>
  <body>
    <ProgressBar />
    <Providers> (AuthProvider + ToastProvider)
      <TooltipProvider>
        {children}
        <Analytics />
        <Toaster />
        <RoutingDebugOverlay />
      </TooltipProvider>
    </Providers>
  </body>
</html>
```

## Context vs. UI Providers

It's important to distinguish between:

1. **Context Providers**: Manage application state (AuthContext, ToastContext)
2. **UI Providers**: Handle UI-specific features (Toaster, TooltipProvider)

The naming can be confusing because UI libraries often use "Provider" in their component names even when they're not React context providers.

## Best Practices

1. Keep the provider hierarchy as shallow as possible
2. Always import contexts from their canonical sources
3. Use the central Providers component for application-wide state
4. Use UI providers at the appropriate level of the component tree

## Extending the Provider Structure

When adding new global state or contexts to the application:

1. **Create the Context**: Create a new context file in `/contexts/` following the patterns of existing contexts
2. **Add to Providers Component**: Update the `Providers` component in `/components/common/Providers.tsx` to include your new provider
3. **Create a Custom Hook**: Create a hook in `/hooks/` that provides a clean API for consuming components
4. **Document the Provider**: Update this document to include information about the new context

Example workflow for adding a new `ThemeContext`:

```tsx
// 1. Create the context in /contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 2. Create a hook in /hooks/useTheme.ts
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 3. Update the Providers component
// in /components/common/Providers.tsx
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ToastProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
```
