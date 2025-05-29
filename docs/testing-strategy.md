# Testing Strategy

This document outlines the testing strategy for the Minispace.dev project.

## Testing Structure

Tests are organized in a dedicated `/tests` directory that mirrors the project structure:

```
tests/
├── components/    # Component tests
├── firebase/      # Firebase integration tests
├── navigation/    # Navigation and routing tests
├── routing/       # URL routing and subdomain tests
└── setup.js       # Test environment setup
```

## Test Types

### 1. Unit Tests

Unit tests focus on testing individual functions and components in isolation.

- **Location**: `/tests/components` and within specific feature folders
- **Libraries**: Jest and React Testing Library
- **Naming Convention**: `*.test.ts` or `*.test.tsx`

Example unit test:

```tsx
// Example component test
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders the button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls the onClick handler when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### 2. Integration Tests

Integration tests verify interactions between different parts of the system.

- **Location**: `/tests/firebase` and `/tests/navigation`
- **Focus**: Testing integration between components, services, and Firebase

Example integration test:

```tsx
// Example integration test for Firebase authentication
import { signIn, signOut } from '@/lib/firebase/auth';
import { auth } from '@/lib/firebase/config';

jest.mock('@/lib/firebase/config', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn().mockResolvedValue(true)
  }
}));

describe('Auth Service', () => {
  it('calls Firebase signInWithEmailAndPassword with correct credentials', async () => {
    await signIn('test@example.com', 'password');
    expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith(
      'test@example.com',
      'password'
    );
  });

  it('handles auth errors correctly', async () => {
    const mockError = { code: 'auth/wrong-password', message: 'Invalid password' };
    auth.signInWithEmailAndPassword.mockRejectedValueOnce(mockError);
    
    const result = await signIn('test@example.com', 'wrong');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

### 3. Routing Tests

Specialized tests to verify the routing and subdomain functionality.

- **Location**: `/tests/routing`
- **Tools**: Custom routing test utilities

Example routing test:

```js
// Example routing test
const { analyzeCurrentPath } = require('../../src/lib/path-analyzer');

describe('Path Analyzer', () => {
  it('correctly identifies a username from a subdomain', async () => {
    const mockRequest = {
      headers: { host: 'testuser.minispace.dev' },
      url: 'https://testuser.minispace.dev/some-page'
    };

    const result = await analyzeCurrentPath(mockRequest);
    
    expect(result.detectedUsername).toBe('testuser');
    expect(result.isSubdomain).toBe(true);
  });
});
```

## Running Tests

Use the following npm scripts to run tests:

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Run specific test categories
npm run test:routing    # Run routing tests
npm run test:firebase   # Run Firebase tests
npm run test:navigation # Run navigation tests
```

## Test Coverage

The project aims to maintain high test coverage for critical paths:

- Routing logic
- Authentication flows
- Firebase operations
- Core UI components

Run test coverage reports with:

```bash
npm test -- --coverage
```

## Mocking Strategy

- **Firebase Services**: Mock Firebase services to avoid making real API calls
- **Next.js Router**: Use the `next-router-mock` library to mock the router
- **Auth Context**: Provide mock authentication context for component tests

## Continuous Integration

Tests are run automatically on pull requests and merges to main branch using GitHub Actions.
