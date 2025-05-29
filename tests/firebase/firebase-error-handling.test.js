/**
 * Firebase Error Handling Tests
 * 
 * This test suite validates the error handling patterns for Firebase operations.
 */

const { 
  handleFirebaseOperation, 
  parseFirebaseError, 
  getReadableErrorMessage 
} = require('../../src/lib/firebase/error-handler');

// Mock Firebase Error class
class FirebaseError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = 'FirebaseError';
  }
}

describe('Firebase Error Handler', () => {
  describe('handleFirebaseOperation', () => {
    test('should return success and data when operation succeeds', async () => {
      // Arrange
      const mockData = { id: '123', name: 'Test User' };
      const mockOperation = jest.fn().mockResolvedValue(mockData);
      
      // Act
      const result = await handleFirebaseOperation(mockOperation);
      
      // Assert
      expect(result).toEqual({
        success: true,
        data: mockData
      });
      expect(mockOperation).toHaveBeenCalled();
    });
    
    test('should return failure and error when operation fails', async () => {
      // Arrange
      const mockError = new FirebaseError('auth/user-not-found', 'User not found');
      const mockOperation = jest.fn().mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Act
      const result = await handleFirebaseOperation(mockOperation);
      
      // Assert
      expect(result).toEqual({
        success: false,
        error: {
          code: 'auth/user-not-found',
          message: 'No account found with this email.',
          originalError: mockError,
        }
      });
      expect(consoleSpy).toHaveBeenCalled();
      expect(mockOperation).toHaveBeenCalled();
      
      // Cleanup
      consoleSpy.mockRestore();
    });
  });
  
  describe('parseFirebaseError', () => {
    test('should correctly parse Firebase errors', () => {
      // Arrange
      const firebaseError = new FirebaseError(
        'auth/wrong-password', 
        'Wrong password'
      );
      
      // Act
      const result = parseFirebaseError(firebaseError);
      
      // Assert
      expect(result).toEqual({
        code: 'auth/wrong-password',
        message: 'Incorrect password. Please try again.',
        originalError: firebaseError
      });
    });
    
    test('should handle non-Firebase errors', () => {
      // Arrange
      const genericError = new Error('Something went wrong');
      
      // Act
      const result = parseFirebaseError(genericError);
      
      // Assert
      expect(result).toEqual({
        code: 'unknown',
        message: 'Something went wrong',
        originalError: genericError
      });
    });
    
    test('should handle null/undefined errors', () => {
      // Act
      const result = parseFirebaseError(null);
      
      // Assert
      expect(result).toEqual({
        code: 'unknown',
        message: 'An unknown error occurred',
        originalError: null
      });
    });
  });
  
  describe('getReadableErrorMessage', () => {
    test('should return readable messages for common auth errors', () => {
      // Test a few common error codes
      const errorCases = [
        { 
          code: 'auth/email-already-in-use', 
          expected: 'This email is already being used by another account.' 
        },
        { 
          code: 'auth/wrong-password', 
          expected: 'Incorrect password. Please try again.' 
        },
        { 
          code: 'permission-denied', 
          expected: 'You don\'t have permission to perform this operation.' 
        }
      ];
      
      errorCases.forEach(({ code, expected }) => {
        const error = new FirebaseError(code, 'Original message');
        expect(getReadableErrorMessage(error)).toBe(expected);
      });
    });
    
    test('should return original message for unknown Firebase errors', () => {
      const error = new FirebaseError(
        'unknown/error-code', 
        'Some unknown error'
      );
      expect(getReadableErrorMessage(error)).toBe('Some unknown error');
    });
    
    test('should handle non-Firebase errors', () => {
      const error = new Error('Generic error');
      expect(getReadableErrorMessage(error)).toBe('Generic error');
    });
  });
});
