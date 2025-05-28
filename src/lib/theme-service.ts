/**
 * Theme Service
 * 
 * Main entry point for theme functionality
 */

import type { RenderContext } from './theme-renderer';
import type { NavigationContext } from './navigation-utils';
import type { ThemeRenderContext } from './theme/theme-types';

// Import modules from new structure
import './theme/theme-types';
import { getThemeById, loadThemeTemplate } from './theme/theme-loader';
import { generateCustomizedCSS } from './theme/theme-customization';
import { 
  renderPageWithTemplate,
  createDebugHtmlComment
} from './theme/theme-renderer-service';

// Re-export types and functions that should be available from the main service
export * from './theme/theme-types';
export { getAvailableThemes, getThemeById } from './theme/theme-loader';
export { generateCustomizedCSS } from './theme/theme-customization';

/**
 * Render a page using a theme with navigation context
 */
export async function renderThemePage(
  themeId: string,
  page: string,
  context: RenderContext & { navigationContext?: NavigationContext },
  userCustomCSS?: string
): Promise<string> {
  try {
    // Get the theme manifest
    const theme = await getThemeById(themeId);
    if (!theme) {
      throw new Error(`Theme ${themeId} not found`);
    }
    
    // Check if the page template exists
    const pageTemplatePath = theme.templates[page];
    
    // If the specific page template doesn't exist, fall back to a generic content template
    if (!pageTemplatePath) {
      console.log(`[ThemeService] Page template '${page}' not found in theme '${themeId}', using generic template`);
      
      // First try to use a 'custom' template if it exists
      if (theme.templates.custom) {
        console.log(`[ThemeService] Using 'custom' template for page '${page}'`);
        const layoutTemplate = loadThemeTemplate(themeId, theme.templates.layout);
        const pageTemplate = loadThemeTemplate(themeId, theme.templates.custom);
        const renderedHtml = renderPageWithTemplate(
          themeId, layoutTemplate, pageTemplate, context as ThemeRenderContext, page, userCustomCSS
        );
        return createDebugHtmlComment(themeId, page, context as ThemeRenderContext, renderedHtml);
      }
      
      // Otherwise use the 'about' template as a fallback for custom pages
      if (theme.templates.about) {
        console.log(`[ThemeService] Using 'about' template as fallback for page '${page}'`);
        const layoutTemplate = loadThemeTemplate(themeId, theme.templates.layout);
        const pageTemplate = loadThemeTemplate(themeId, theme.templates.about);
        const renderedHtml = renderPageWithTemplate(
          themeId, layoutTemplate, pageTemplate, context as ThemeRenderContext, page, userCustomCSS
        );
        return createDebugHtmlComment(themeId, page, context as ThemeRenderContext, renderedHtml);
      }
      
      throw new Error(`No suitable template found for page '${page}' in theme '${themeId}'`);
    }
    
    // Load the templates
    const layoutTemplate = loadThemeTemplate(themeId, theme.templates.layout);
    const pageTemplate = loadThemeTemplate(themeId, pageTemplatePath);
    
    // Render the page and add debug info
    const renderedHtml = renderPageWithTemplate(
      themeId, layoutTemplate, pageTemplate, context as ThemeRenderContext, page, userCustomCSS
    );
    return createDebugHtmlComment(themeId, page, context as ThemeRenderContext, renderedHtml);
    
  } catch (error) {
    console.error(`Error rendering page ${page} with theme ${themeId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return `<h1>Error rendering page</h1><p>${errorMessage}</p>`;
  }
}
