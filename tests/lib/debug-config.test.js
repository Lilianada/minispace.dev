/**
 * Debug Configuration Tests
 * 
 * This test suite validates the behavior of the debug configuration system.
 */

// Mock localStorage for testing
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock URL search params
const mockURLSearchParams = {
  get: jest.fn(param => null),
};

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    search: '',
  },
  writable: true,
});

// Mock URLSearchParams
global.URLSearchParams = jest.fn(() => mockURLSearchParams);

// Import after mocks are set up
const { 
  isDev, 
  isDebugFeatureEnabled, 
  saveDebugConfig, 
  toggleDebugFeature,
  shouldShowDebugComponent 
} = require('../../src/lib/debug-config');

describe('Debug Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Reset process.env.NODE_ENV for each test
    jest.resetModules();
  });

  describe('isDev', () => {
    test('should be true when NODE_ENV is development', () => {
      // Set NODE_ENV
      process.env.NODE_ENV = 'development';
      
      // Re-import the module to get updated isDev value
      const { isDev } = require('../../src/lib/debug-config');
      
      expect(isDev).toBe(true);
    });

    test('should be false when NODE_ENV is production', () => {
      // Set NODE_ENV
      process.env.NODE_ENV = 'production';
      
      // Re-import the module to get updated isDev value
      const { isDev } = require('../../src/lib/debug-config');
      
      expect(isDev).toBe(false);
    });
  });

  describe('isDebugFeatureEnabled', () => {
    test('should return true for features when in development', () => {
      // Set NODE_ENV
      process.env.NODE_ENV = 'development';
      
      // Re-import the module
      const { isDebugFeatureEnabled } = require('../../src/lib/debug-config');
      
      expect(isDebugFeatureEnabled('showRoutingOverlay')).toBe(true);
    });

    test('should respect localStorage settings', () => {
      // Set NODE_ENV
      process.env.NODE_ENV = 'development';
      
      // Set localStorage
      localStorageMock.setItem(
        'minispace_debug_config', 
        JSON.stringify({ showRoutingOverlay: false })
      );
      
      // Re-import the module
      const { isDebugFeatureEnabled } = require('../../src/lib/debug-config');
      
      expect(isDebugFeatureEnabled('showRoutingOverlay')).toBe(false);
    });

    test('should respect URL parameters', () => {
      // Set NODE_ENV
      process.env.NODE_ENV = 'production';
      
      // Mock URL parameters
      mockURLSearchParams.get.mockImplementation(param => {
        if (param === 'debug_showRoutingOverlay') return 'true';
        return null;
      });
      
      // Re-import the module
      const { isDebugFeatureEnabled } = require('../../src/lib/debug-config');
      
      expect(isDebugFeatureEnabled('showRoutingOverlay')).toBe(true);
    });
  });

  describe('saveDebugConfig and toggleDebugFeature', () => {
    test('should save config to localStorage', () => {
      // Set config
      saveDebugConfig({ showRoutingOverlay: true });
      
      // Check localStorage was updated
      expect(localStorageMock.setItem).toHaveBeenCalled();
      expect(JSON.parse(localStorageMock.setItem.mock.calls[0][1])).toEqual(
        expect.objectContaining({ showRoutingOverlay: true })
      );
    });

    test('toggleDebugFeature should toggle feature state', () => {
      // Setup mock localStorage with initial state
      localStorageMock.setItem(
        'minispace_debug_config', 
        JSON.stringify({ showRoutingOverlay: false })
      );
      
      // Toggle the feature
      toggleDebugFeature('showRoutingOverlay');
      
      // Check it was toggled
      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData.showRoutingOverlay).toBe(true);
      
      // Toggle again
      toggleDebugFeature('showRoutingOverlay');
      
      // Check it was toggled back
      const updatedData = JSON.parse(localStorageMock.setItem.mock.calls[1][1]);
      expect(updatedData.showRoutingOverlay).toBe(false);
    });
  });
  
  describe('shouldShowDebugComponent', () => {
    test('should return true in development', () => {
      // Set NODE_ENV
      process.env.NODE_ENV = 'development';
      
      // Re-import the module
      const { shouldShowDebugComponent } = require('../../src/lib/debug-config');
      
      expect(shouldShowDebugComponent()).toBe(true);
    });
    
    test('should respect URL debug_mode parameter', () => {
      // Set NODE_ENV
      process.env.NODE_ENV = 'production';
      
      // Mock URL parameters
      mockURLSearchParams.get.mockImplementation(param => {
        if (param === 'debug_mode') return 'true';
        return null;
      });
      
      // Re-import the module
      const { shouldShowDebugComponent } = require('../../src/lib/debug-config');
      
      expect(shouldShowDebugComponent()).toBe(true);
    });
  });
});
