# API Standardization Plan

## Overview

This document outlines the plan for standardizing API routes in the Minispace.dev project to use the new API middleware service.

## Current Status

- Created `services/api-middleware.ts` with standardized utilities:
  - `withAuth`: For route authentication
  - `withErrorHandler`: For consistent error handling
  - `successResponse`: For standardized success responses
  - `errorResponse`: For standardized error responses
  - `validateRequestBody`: For validating request data against type schema
  - `withValidation`: Higher-order function for request validation
  - `TypeValidator`: Type definition for validation functions

- Implemented patterns:
  - Consistent response formatting (status, data/error, message)
  - Type-safe API handlers
  - Proper error handling and validation
  - Separation of authentication, validation and business logic

- Updated `/app/api/user/profile/route.ts` to use these utilities and patterns

## Next Steps

### Phase 1: Critical API Routes

Update the following critical API routes first:

- [ ] `/app/api/posts/route.ts`
- [ ] `/app/api/posts/[id]/route.ts`
- [ ] `/app/api/user/theme-settings/route.ts`
- [ ] `/app/api/themes/route.ts`

### Phase 2: Secondary API Routes

Update the following secondary API routes:

- [ ] `/app/api/analytics/route.ts`
- [ ] `/app/api/discover/route.ts`
- [ ] `/app/api/theme-preview/route.ts`
- [ ] `/app/api/theme-preview/[themeId]/route.ts`

### Phase 3: Utility API Routes

Update the remaining utility API routes:

- [ ] `/app/api/debug/route.ts`
- [ ] `/app/api/analytics/vercel/route.ts`

## Implementation Guidelines

1. Replace direct imports from `@/lib/firebase/admin` with `@/services/firebase/admin-service`
2. Replace manual auth checks with `withAuth` middleware
3. Replace manual error handling with `withErrorHandler` middleware
4. Replace custom response formatting with `successResponse` and `errorResponse`
5. Implement proper type validation:
   - Define clear interface for request/response data
   - Use TypeValidator pattern for request validation
   - Use type guards to ensure type safety
6. Structure API handlers consistently:
   - Split logic into specific handler functions (GET, POST, etc.)
   - Use middleware composition for complex flows
   - Properly handle sensitive data
   - Return standardized responses

## Testing Plan

After each phase:
1. Run local development server to test API routes
2. Verify authentication is working correctly
3. Verify error handling is working correctly
4. Verify responses match the expected format

## Timeline

- Phase 1: Short-term priority
- Phase 2: Medium-term priority
- Phase 3: Long-term priority
