'use client';

/**
 * Firebase Data Wrapper
 * 
 * A component that safely fetches and displays Firebase data with built-in error handling.
 * Uses the ErrorBoundary component for UI errors and the Firebase error handler for operation errors.
 */

import { ReactNode, useState, useEffect } from 'react';
import { WithErrorBoundary } from '@/components/ui/error-boundary-helpers';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { FirebaseResult } from '@/lib/firebase/error-handler';
import { isDev } from '@/lib/debug-config';

type FetchFunction<T> = () => Promise<FirebaseResult<T>>;

interface FirebaseDataWrapperProps<T> {
  fetchData: FetchFunction<T>;
  children: (data: T) => ReactNode;
  loadingComponent?: ReactNode;
  errorComponent?: (error: any) => ReactNode;
  emptyComponent?: ReactNode;
  onError?: (error: any) => void;
}

/**
 * A wrapper component that handles data fetching from Firebase with proper error handling
 */
export function FirebaseDataWrapper<T>({
  fetchData,
  children,
  loadingComponent,
  errorComponent,
  emptyComponent,
  onError,
}: FirebaseDataWrapperProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchDataAndHandle = async () => {
      try {
        setLoading(true);
        const result = await fetchData();
        
        if (result.success && result.data) {
          setData(result.data as T);
        } else {
          // Handle Firebase operation errors
          setError(result.error || new Error('Unknown error occurred'));
          if (onError) {
            onError(result.error);
          }
        }
      } catch (err) {
        // Handle unexpected errors
        setError(err);
        if (onError) {
          onError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndHandle();
  }, [fetchData, onError]);

  // Loading state
  if (loading) {
    return loadingComponent || <LoadingSpinner />;
  }

  // Error state
  if (error) {
    if (errorComponent) {
      return errorComponent(error);
    }
    
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Data</AlertTitle>
        <AlertDescription>
          {error.message || 'An unknown error occurred while loading data.'}
          {isDev && error.code && (
            <div className="text-xs mt-2 opacity-80">
              Error code: {error.code}
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (!data) {
    return emptyComponent || <div>No data available</div>;
  }

  // Success state - render children with data
  return (
    <WithErrorBoundary>
      {children(data)}
    </WithErrorBoundary>
  );
}
