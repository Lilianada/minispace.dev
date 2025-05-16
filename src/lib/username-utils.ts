import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase/config';

// Validate username format - only alphanumeric characters and underscores
// Minimum 3 characters, maximum 20 characters
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

// Check if the username is already taken
export async function isUsernameTaken(username: string): Promise<boolean> {
  try {
    const usersRef = collection(db, 'Users');
    const usernameQuery = query(usersRef, where('username', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(usernameQuery);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking username:', error);
    // In case of error, assume username is taken to prevent issues
    return true;
  }
}

// Validate the username and check if it's available
export async function validateUsername(username: string): Promise<{ valid: boolean; message: string }> {
  // Check format first
  if (!isValidUsername(username)) {
    return {
      valid: false,
      message: 'Username must be 3-20 characters and can only contain letters, numbers, and underscores'
    };
  }

  // Check availability
  const taken = await isUsernameTaken(username);
  if (taken) {
    return {
      valid: false,
      message: 'This username is already taken'
    };
  }

  return {
    valid: true,
    message: 'Username is available'
  };
}
