/**
 * Error Boundary Helpers
 * 
 * Provides utilities to make using the ErrorBoundary component easier.
 */

'use client';

import React, { useState, useCallback, ReactNode } from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface WithErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

/**
 * Functional component wrapper for ErrorBoundary
 * Makes it easier to use the error boundary with state resets
 */
export function WithErrorBoundary({ children, fallback, onError }: WithErrorBoundaryProps) {
  const [key, setKey] = useState(0);
  
  const handleReset = useCallback(() => {
    // Change the key to force a re-render of children
    setKey(prevKey => prevKey + 1);
  }, []);
  
  return (
    <ErrorBoundary 
      key={key}
      fallback={fallback}
      onReset={handleReset}
      onError={onError}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * HOC (Higher Order Component) to wrap any component with an error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorFallback?: ReactNode,
  onError?: (error: Error, info: React.ErrorInfo) => void
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <WithErrorBoundary fallback={errorFallback} onError={onError}>
        <Component {...props} />
      </WithErrorBoundary>
    );
  };
}
