# Minispace.dev Architecture

## Overview

This document outlines the architectural patterns and best practices used in the Minispace.dev project. Minispace is a lightweight blogging platform with a focus on performance, minimalism, and user experience.

## Project Structure

```
├── app/             # Next.js App Router pages
├── components/      # React components organized by type
│   ├── common/      # Shared components used across features
│   ├── debug/       # Development-only debugging components
│   ├── features/    # Feature-specific components
│   └── ui/          # Base UI components (design system)
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── lib/             # Core utilities and configuration
│   ├── firebase/    # Firebase configuration and utilities
│   └── theme/       # Theme management utilities
├── middleware/      # Middleware modules for routing/auth
├── services/        # Service modules for external interactions
├── tests/           # Test suite organized by feature areas
└── types/           # TypeScript type definitions
```

## Core Architectural Patterns

### Component Organization

Components follow a clear organization pattern:

1. **UI Components** (`/components/ui`): Design system building blocks with error boundaries
2. **Common Components** (`/components/common`): Shared components across features
3. **Feature Components**: Specific to functional areas (posts, profiles, etc.)
4. **Debug Components**: Development-only components for debugging
3. **Feature Components** (`/components/features`): Feature-specific components

See [Component Organization Guidelines](./docs/component-organization.md) for details.

### Provider Structure

The application uses a structured provider hierarchy:

1. **Global Providers** (`/components/common/Providers.tsx`): Application-wide context providers
   - AuthProvider: Authentication state management
   - ToastProvider: Custom toast notification system
   
2. **UI Providers**: Component-specific UI providers
   - TooltipProvider: For tooltip UI components
   - Toaster: For displaying toast notifications

See [Provider Structure](./docs/provider-structure.md) for details.

### API Patterns

The application uses consistent API patterns:

1. **Service Layer**: All external interactions go through service modules
2. **API Routes**: Next.js API routes follow standard patterns using API middleware
3. **API Middleware**: Standard utilities for authentication, error handling, and response formatting
   - Located in `services/api-middleware.ts`
   - Provides `withAuth`, `withErrorHandler`, `successResponse`, `errorResponse`
   - Includes type validation utilities: `withValidation`, `validateRequestBody`
   - Ensures consistent response formatting and error handling
4. **Client API Service**: Consistent API client for frontend-to-API communication
   - Located in `services/api-service.ts`
   - Handles authentication tokens and request formatting

### Authentication

Authentication follows a centralized pattern:

1. **AuthContext**: Single source of truth for authentication state
2. **Firebase Auth**: Backend authentication through Firebase
3. **API Auth**: Consistent auth checks in API routes

### Data Type Standardization

To ensure consistency throughout the application, we follow these type standards:

1. **Core Data Types**: Defined in the services layer (e.g., `UserData` in `services/firebase/auth-service.ts`)
2. **Type Adapters**: Used for converting between different data representations (`lib/type-adapters.ts`)
   - `adaptUserData`: Converts data from various sources to standard UserData type
   - `isUserData`: Type guard for checking if an object conforms to the UserData interface
   - `isAuthContextUserData`: Backward compatibility alias for isUserData
3. **Type Imports**: Components always import types from their canonical source
4. **Consistent Properties**: Required properties (e.g., `uid` in `UserData`) are never optional

### State Management

State is managed according to these principles:

1. **React Context**: For shared state across component trees
2. **React Hooks**: For component-level state
3. **Composition**: To avoid prop drilling
4. **Services**: To handle external data and side effects

## Best Practices

1. **File Size**: Keep code files under 250 lines
2. **Component Responsibility**: Each component should have a single responsibility
3. **Service Abstraction**: Abstract external services for easy replacement/testing
4. **Consistent Patterns**: Follow established patterns for new features
5. **Type Safety**: Use TypeScript types for all components and functions

## Error Handling

The application implements a multi-layered approach to error handling:

1. **Firebase Error Handling**: 
   - Using `handleFirebaseOperation` wrapper for consistent error handling
   - Standardized `FirebaseResult<T>` type with success/error states
   - Unified error message formatting for user-friendly messages

2. **React Error Boundaries**:
   - Global error boundary in layout with fallback UI
   - Component-level error boundaries for critical features
   - Error reporting and recovery mechanisms

3. **API Error Handling**:
   - Consistent error response formats
   - HTTP status codes aligned with error types
   - Structured error payloads with actionable information

For implementation details, see our [Error Handling Guide](./error-handling-guide.md).

### Debug Configuration System

The application includes a flexible debug configuration system for development purposes:

1. **Core Debug Utilities**:
   - Located in `/src/lib/debug-config.ts`
   - Environment-aware feature toggles
   - Persistent configuration via localStorage

2. **Debug Features**:
   - `showRoutingOverlay`: Displays routing information for debugging
   - `showPerformanceMetrics`: Displays performance metrics
   - `showFirebaseDebug`: Enables verbose Firebase logging
   - `verboseLogging`: Enables extended console logging
   - `showThemeDebug`: Displays theme-related debug information

3. **Enabling Debug Features**:
   - In development: Most features enabled by default
   - In production:
     - Via URL parameters: `?debug_mode=true` or `?debug_featureName=true`
     - Via localStorage configuration
   
4. **Debug Components**:
   - All debug components check for appropriate debug flags
   - Conditionally rendered based on environment and configuration
   - Zero impact on production bundle when disabled

5. **Usage Example**:
   ```typescript
   import { isDev, isDebugFeatureEnabled } from '@/lib/debug-config';

   // Conditional rendering based on debug flags
   if (isDev || isDebugFeatureEnabled('showRoutingOverlay')) {
     // Display debug component
   }
   ```

For more details on working with the debug system, see the [Error Handling Guide](./error-handling-guide.md).

## Development Workflow

1. **Feature Development**: Create components in appropriate directories
2. **Service Integration**: Use service layer for external interactions
3. **Testing**: Ensure proper test coverage
4. **Documentation**: Update this document for architectural changes

## Future Refactoring Opportunities

1. **Toast System Consolidation**: The application currently has two separate toast notification systems:
   - Custom toast system in `/contexts/ToastContext.tsx`
   - Shadcn UI toast system in `/components/ui/toast.tsx`
   
   These should be consolidated into a single toast notification system to improve maintainability.

2. **Provider Structure Simplification**: Review the provider hierarchy to ensure optimal performance and organization.

3. **Authentication Logic Improvements**: Look for opportunities to simplify the authentication flow and reduce duplicate code.

## Technical Stack

- **Frontend**: React, Next.js, TypeScript
- **Backend**: Next.js API Routes, Firebase
- **Authentication**: Firebase Authentication
- **Database**: Firestore
- **Deployment**: Vercel

## Additional Resources

- [Component Organization Guidelines](./docs/component-organization.md)
- [Firebase Setup Guide](./docs/firebase-setup.md)
- [Subdomain Routing Guide](./docs/subdomain-routing-guide.md)
