# Minispace Testing Suite

This directory contains the testing suite for the Minispace.dev project. Tests are organized by feature area and use Jest as the test runner.

## Directory Structure

- `/setup.js` - Global test setup file with environment configuration
- `/components/` - Tests for React components
- `/firebase/` - Tests for Firebase integration
- `/navigation/` - Tests for navigation and routing
- `/routing/` - Tests for URL routing and subdomain handling

## Running Tests

You can run tests using the following npm scripts:

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run specific test categories
npm run test:routing    # Run routing tests
npm run test:firebase   # Run Firebase tests
npm run test:navigation # Run navigation tests
```

## Writing Tests

### Component Tests

Component tests should focus on component functionality, not implementation details:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with the correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Firebase Tests

Use mocking to avoid making real Firebase calls:

```tsx
import { getUserData } from '@/lib/firebase/user-service';

// Mock the firebase modules
jest.mock('@/lib/firebase/config', () => ({
  db: {
    collection: jest.fn(),
  }
}));

describe('User Service', () => {
  it('handles user not found correctly', async () => {
    // Setup mock return values
    const mockGet = jest.fn().mockResolvedValue({ exists: false });
    const mockDoc = jest.fn().mockReturnValue({ get: mockGet });
    require('@/lib/firebase/config').db.collection.mockReturnValue({
      doc: mockDoc
    });
    
    const result = await getUserData('non-existent-id');
    expect(result).toBeNull();
  });
});
```

### Routing Tests

Routing tests should verify the core subdomain and path-based routing logic:

```js
const { analyzeCurrentPath } = require('../../src/lib/path-analyzer');

describe('Path Analysis', () => {
  it('detects username from subdomain', async () => {
    const mockRequest = {
      headers: new Map([['host', 'testuser.minispace.dev']]),
      nextUrl: { pathname: '/about' },
      url: 'https://testuser.minispace.dev/about'
    };
    
    const result = await analyzeCurrentPath(mockRequest);
    
    expect(result.detectedUsername).toBe('testuser');
    expect(result.isSubdomain).toBe(true);
  });
});
```

## Best Practices

1. **Test in isolation** - Use mocks for external dependencies
2. **Focus on behavior**, not implementation details
3. **Test edge cases** - Include error cases and boundary conditions
4. **Keep tests simple** - Each test should verify one specific behavior
5. **Use descriptive test names** - The test name should clearly describe what is being tested

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
