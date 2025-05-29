/**
 * Debug Configuration Utilities
 * 
 * Provides utilities for managing debug features with environment-aware toggles.
 */

// Check if we're in a development environment
export const isDev = process.env.NODE_ENV === 'development';

// Debug feature flags with defaults
interface DebugFeatures {
  showRoutingOverlay: boolean;
  showPerformanceMetrics: boolean;
  showFirebaseDebug: boolean;
  verboseLogging: boolean;
  showThemeDebug: boolean;
}

// Default debug configuration
const defaultDebugConfig: DebugFeatures = {
  showRoutingOverlay: false,
  showPerformanceMetrics: false, 
  showFirebaseDebug: false,
  verboseLogging: false,
  showThemeDebug: false
};

// Initialize debug configuration from localStorage if available
function getDebugConfig(): DebugFeatures {
  if (typeof window === 'undefined') {
    // Server-side - return defaults based on environment
    return {
      ...defaultDebugConfig,
      // Enable some features automatically in development
      showRoutingOverlay: isDev,
      verboseLogging: isDev
    };
  }
  
  try {
    // Try to load from localStorage
    const savedConfig = localStorage.getItem('minispace_debug_config');
    if (savedConfig) {
      return {
        ...defaultDebugConfig,
        ...JSON.parse(savedConfig)
      };
    }
  } catch (error) {
    console.warn('Failed to load debug configuration', error);
  }
  
  // Default configuration based on environment
  return {
    ...defaultDebugConfig,
    showRoutingOverlay: isDev,
    verboseLogging: isDev
  };
}

// Save debug configuration to localStorage
export function saveDebugConfig(config: Partial<DebugFeatures>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const currentConfig = getDebugConfig();
    const newConfig = { ...currentConfig, ...config };
    localStorage.setItem('minispace_debug_config', JSON.stringify(newConfig));
  } catch (error) {
    console.warn('Failed to save debug configuration', error);
  }
}

// Toggle a specific debug feature
export function toggleDebugFeature(feature: keyof DebugFeatures): void {
  const config = getDebugConfig();
  saveDebugConfig({ [feature]: !config[feature] });
}

// Check if a debug feature is enabled
export function isDebugFeatureEnabled(feature: keyof DebugFeatures): boolean {
  // In production, check for query param or localStorage setting
  if (process.env.NODE_ENV === 'production') {
    // Allow enabling via query param for specific page loads
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const specificFeature = params.get(`debug_${feature}`);
      if (specificFeature === 'true') return true;
      
      // Check global debug mode
      const debugMode = params.get('debug_mode');
      if (debugMode === 'true') return true;
    }
    
    // Check saved configuration
    const config = getDebugConfig();
    return config[feature] === true;
  }
  
  // In development, features are enabled by default
  // but can be explicitly disabled in localStorage
  const config = getDebugConfig();
  return config[feature] !== false; // Default to true in development
}

// Toggle the debug panel visibility
export function shouldShowDebugComponent(): boolean {
  // First priority: check URL query param (allows temporary enabling)
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const debugMode = params.get('debug_mode');
    if (debugMode === 'true') return true;
    if (debugMode === 'false') return false;
  }
  
  // Second priority: check localStorage configuration
  const config = getDebugConfig();
  
  // Third priority: development environment default
  return isDev || config.showRoutingOverlay;
}
