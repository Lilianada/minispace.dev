/**
 * Theme Customization
 * 
 * Handles theme customization like colors, fonts, and toggles
 */

import { ThemeCustomization } from './theme-types';

/**
 * Generate CSS with user customizations
 */
export function generateCustomizedCSS(
  themeId: string,
  customizations: ThemeCustomization
): string {
  // Start with base CSS reset
  let customCSS = ':root {\n';
  
  // Add color customizations
  if (customizations.colors) {
    Object.entries(customizations.colors).forEach(([id, value]) => {
      customCSS += `  --ms-${id}: ${value};\n`;
    });
  }
  
  // Add font customizations
  if (customizations.fonts) {
    Object.entries(customizations.fonts).forEach(([id, value]) => {
      customCSS += `  --ms-font-${id}: ${value};\n`;
    });
  }
  
  customCSS += '}\n\n';
  
  // Add toggle classes
  if (customizations.toggles && customizations.toggles.length > 0) {
    customCSS += '/* Toggle customizations */\n';
    // These would be defined in the theme's CSS already
  }
  
  return customCSS;
}
