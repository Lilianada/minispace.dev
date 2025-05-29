/**
 * Environment Variable Validation
 * 
 * This module validates environment variables on app startup to ensure proper configuration.
 */

// Required environment variables list
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

// Optional environment variables with their default values
const optionalEnvVars = {
  'NEXT_PUBLIC_BASE_URL': 'http://localhost:3000',
  'NEXT_PUBLIC_USE_EMULATOR': 'false',
  'NEXT_PUBLIC_DEBUG_MODE': 'false',
};

/**
 * Validate required environment variables
 * @returns {boolean} Whether all required variables are present
 */
export function validateRequiredEnvVars(): boolean {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error(`⚠️ Missing required environment variables: ${missing.join(', ')}`);
    console.error('Please check your .env.local file');
    return false;
  }
  
  return true;
}

/**
 * Set default values for optional environment variables if not already defined
 */
export function setDefaultEnvVars(): void {
  Object.entries(optionalEnvVars).forEach(([key, defaultValue]) => {
    if (!process.env[key]) {
      process.env[key] = defaultValue;
      console.info(`Setting default value for ${key}: ${defaultValue}`);
    }
  });
}

/**
 * Initialize environment variables
 * @returns {boolean} Whether initialization was successful
 */
export function initializeEnv(): boolean {
  const validationPassed = validateRequiredEnvVars();
  setDefaultEnvVars();
  
  if (process.env.NODE_ENV === 'development') {
    console.info('✅ Environment variables initialized in development mode');
  }
  
  return validationPassed;
}

// For use in client components or pages
export function getClientEnv() {
  return {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    firebaseConfig: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    },
    useEmulator: process.env.NEXT_PUBLIC_USE_EMULATOR === 'true',
    debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  };
}
