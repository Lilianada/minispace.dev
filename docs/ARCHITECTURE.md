# Minispace.dev Architecture

## Overview

This document outlines the architectural patterns and best practices used in the Minispace.dev project.

## Project Structure

```
src/
├── app/             # Next.js App Router pages
├── components/      # React components organized by type
│   ├── common/      # Shared components used across features
│   ├── features/    # Feature-specific components
│   └── ui/          # Base UI components (design system)
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── lib/             # Core utilities and configuration
├── middleware/      # Middleware modules for routing/auth
├── services/        # Service modules for external interactions
└── types/           # TypeScript type definitions
```

## Core Architectural Patterns

### Component Organization

Components follow a clear organization pattern:

1. **UI Components** (`/components/ui`): Design system building blocks 
2. **Common Components** (`/components/common`): Shared components across features
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
