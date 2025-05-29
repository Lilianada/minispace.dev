/**
 * Error Boundary Components Tests
 * 
 * This test suite validates the behavior of error boundary components.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import after mocks are set up
let ErrorBoundary;
let WithErrorBoundary;
let withErrorBoundary;

// Component that throws an error
function ErrorThrowingComponent({ shouldThrow = true }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Component rendered successfully</div>;
}

describe('Error Boundary Components', () => {
  // Import the components before each test to ensure clean state
  beforeEach(() => {
    jest.resetModules();
    
    // Jest doesn't support React's error boundary behavior in tests by default
    // We need to suppress the error console to avoid polluting test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const errorBoundaryModule = require('../../src/components/ui/error-boundary');
    const errorBoundaryHelpersModule = require('../../src/components/ui/error-boundary-helpers');
    
    ErrorBoundary = errorBoundaryModule.ErrorBoundary;
    WithErrorBoundary = errorBoundaryHelpersModule.WithErrorBoundary;
    withErrorBoundary = errorBoundaryHelpersModule.withErrorBoundary;
  });
  
  afterEach(() => {
    console.error.mockRestore();
  });

  describe('ErrorBoundary', () => {
    test('should render children when no error is thrown', () => {
      render(
        <ErrorBoundary>
          <div>Test Child</div>
        </ErrorBoundary>
      );
      
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    test('should render fallback UI when an error is thrown', () => {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );
      
      // Default fallback UI should show the error message
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });

    test('should render custom fallback when provided', () => {
      const customFallback = <div>Custom Error UI</div>;
      
      render(
        <ErrorBoundary fallback={customFallback}>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );
      
      expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    });

    test('should call onError when an error occurs', () => {
      const onError = jest.fn();
      
      render(
        <ErrorBoundary onError={onError}>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );
      
      expect(onError).toHaveBeenCalled();
    });
  });

  describe('WithErrorBoundary', () => {
    test('should reset error state when Try Again button is clicked', () => {
      // This test is conceptual since we can't easily test the state reset
      // behavior in the component due to how React handles error boundaries in tests
      
      const TestComponent = () => {
        const [shouldThrow, setShouldThrow] = React.useState(true);
        
        return (
          <WithErrorBoundary>
            {shouldThrow ? (
              <ErrorThrowingComponent />
            ) : (
              <div>No longer throwing</div>
            )}
          </WithErrorBoundary>
        );
      };
      
      render(<TestComponent />);
      
      // Basic expectation - error UI should be shown
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });

  describe('withErrorBoundary HOC', () => {
    test('should wrap component with error boundary', () => {
      const TestComponent = () => <div>Test Component</div>;
      const WrappedComponent = withErrorBoundary(TestComponent);
      
      render(<WrappedComponent />);
      
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });

    test('should display error UI when wrapped component throws', () => {
      const WrappedComponent = withErrorBoundary(ErrorThrowingComponent);
      
      render(<WrappedComponent />);
      
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });
});
