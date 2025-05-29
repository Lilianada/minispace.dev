# Error Handling Guide for Minispace

This document outlines the error handling patterns and best practices used in the Minispace application.

## Table of Contents
- [Firebase Error Handling](#firebase-error-handling)
- [React Error Boundaries](#react-error-boundaries)
- [Debug Components](#debug-components)
- [Error Reporting](#error-reporting)

## Firebase Error Handling

We've implemented a standardized approach to Firebase error handling using the `handleFirebaseOperation` utility.

### Basic Pattern

```typescript
import { handleFirebaseOperation, FirebaseResult } from "@/lib/firebase/error-handler";

// Using the Firebase error handler
async function getUserData(userId: string): Promise<FirebaseResult<UserData>> {
  return handleFirebaseOperation(async () => {
    // Firebase operations here
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    return userDoc.data() as UserData;
  });
}
```

### Result Type

All Firebase operations return a standardized `FirebaseResult<T>` type:

```typescript
type FirebaseResult<T> = {
  success: boolean;    // Did the operation succeed?
  data?: T;            // Return data (when success is true)
  error?: {            // Error details (when success is false)
    code: string;      // Error code (e.g., "auth/user-not-found")
    message: string;   // User-friendly error message
    originalError?: any; // Original error object (for debugging)
  };
};
```

### Using in Components

When using Firebase operations in components, handle both success and error states:

```typescript
const { data, loading, error } = useFirebaseQuery(() => getUserData(userId));

if (loading) return <LoadingSpinner />;
if (error) return <ErrorAlert message={error.message} />;
return <UserProfile user={data} />;
```

For a more declarative approach, use the `FirebaseDataWrapper` component:

```jsx
<FirebaseDataWrapper 
  fetchData={() => getUserData(userId)}
  loadingComponent={<LoadingSpinner />}
  errorComponent={(err) => <ErrorAlert message={err.message} />}
>
  {(userData) => <UserProfile user={userData} />}
</FirebaseDataWrapper>
```

## React Error Boundaries

Error boundaries catch JavaScript errors in React component trees.

### Using Error Boundaries

Wrap components that might throw errors in error boundaries:

```jsx
// Using the HOC pattern
const SafeComponent = withErrorBoundary(RiskyComponent);

// Using the component directly
<ErrorBoundary>
  <RiskyComponent />
</ErrorBoundary>

// Using the WithErrorBoundary component (recommended)
<WithErrorBoundary 
  onError={(error, info) => console.error(error, info)}
>
  <RiskyComponent />
</WithErrorBoundary>
```

### Creating Error Boundary Fallbacks

Custom fallbacks can be provided for different scenarios:

```jsx
<WithErrorBoundary
  fallback={
    <div>
      <h2>Something went wrong while loading posts</h2>
      <Button onClick={retry}>Try Again</Button>
    </div>
  }
>
  <Posts />
</WithErrorBoundary>
```

## Debug Components

Debug components are only shown in development environments or when explicitly enabled.

### Creating Debug Components

Debug components should:
1. Use the debug configuration system
2. Be conditionally rendered
3. Not affect production performance

Example:

```jsx
import { isDev, isDebugFeatureEnabled } from '@/lib/debug-config';

export function DebugPanel() {
  if (!isDev && !isDebugFeatureEnabled('showDebugPanel')) {
    return null;
  }
  
  return (
    <div className="debug-panel">
      {/* Debug information */}
    </div>
  );
}
```

### Enabling Debug Features

In development, most debug features are enabled by default.

In production:
- Add `?debug_mode=true` to the URL to enable all debug features
- Add `?debug_featureName=true` for specific features
- Set localStorage configuration using `saveDebugConfig({ featureName: true })`

## Error Reporting

For critical errors that should be reported:

```typescript
function reportError(error, context = {}) {
  console.error('Error:', error, context);
  
  // In production, send to an error monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example with a hypothetical error service
    errorService.report(error, {
      ...context,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  }
}
```

## Best Practices

1. **Always handle Firebase operation errors** using `handleFirebaseOperation`
2. **Wrap components that fetch data** with error boundaries
3. **Use user-friendly error messages** that guide users on what to do next
4. **Log detailed error information** for debugging, but show simplified messages to users
5. **Make debug components conditionally rendered** based on environment
