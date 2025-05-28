/**
 * Theme Renderer Service
 * 
 * Handles the actual rendering of pages with templates
 */

import { renderTemplate } from '../theme-renderer';
import { generateNavigationHtml } from '../navigation-utils';
import { debugThemeRendering } from '../theme-debug';
import { verifyNavigationLinks, fixIncorrectLinks } from '../link-verification';
import { ThemeRenderContext, ThemeDebugContext } from './theme-types';
import { loadThemeTemplate } from './theme-loader';

/**
 * Helper function to render a page with the given layout and page templates
 */
export function renderPageWithTemplate(
  themeId: string,
  layoutTemplate: string,
  pageTemplate: string, 
  context: ThemeRenderContext,
  page: string,
  userCustomCSS?: string
): string {
  // Generate navigation HTML if navigation context is provided
  let navigationHtml = context.navigation || '';
  if (context.navigationContext) {
    // Check if we have custom pages to include in navigation
    const userCustomPages = context.customPages || [];
    navigationHtml = generateNavigationHtml(
      context.navigationContext,
      undefined, // Use default navigation links
      userCustomPages
    );
  }
  
  // Render the page content first
  const pageContent = renderTemplate(pageTemplate, {
    ...context,
    navigation: navigationHtml,
    pageType: page // Add this so templates can know what page type they're rendering
  });
  
  // Pre-render debugging
  const debugContext: ThemeDebugContext = {
    theme: themeId,
    pageType: page,
    navigationContext: context.navigationContext,
    site: context.site
  };
  debugThemeRendering('pre-render', debugContext);
  
  // Then render the full layout with the page content
  const fullContext = {
    ...context,
    content: pageContent,
    navigation: navigationHtml,
    userCSS: userCustomCSS,
    currentYear: new Date().getFullYear(),
    pageType: page // Add this so layouts can know what page type they're rendering
  };
  
  let renderedHtml = renderTemplate(layoutTemplate, fullContext);
  
  // Post-render debugging
  debugThemeRendering('post-render', debugContext, renderedHtml);
  
  // Post-process navigation links if navigation context is provided
  if (context.navigationContext) {
    // Check for and fix any incorrect links
    const verificationResult = verifyNavigationLinks(renderedHtml, context.navigationContext);
    if (verificationResult.incorrectLinks.length > 0) {
      renderedHtml = fixIncorrectLinks(renderedHtml, context.navigationContext, verificationResult);
    }
  }
  
  return renderedHtml;
}

/**
 * Create debug info HTML comment block
 */
export function createDebugHtmlComment(
  themeId: string,
  page: string,
  context: ThemeRenderContext,
  renderedHtml: string
): string {
  // Add comments for debugging in HTML source
  const debuggedHtml = `
<!-- 
MINISPACE DEBUG INFO:
  Theme: ${themeId}
  Page: ${page}
  Username: ${context.navigationContext?.username || 'unknown'}
  Is subdomain: ${context.navigationContext?.isSubdomain || false}
  Timestamp: ${new Date().toISOString()}
-->
${renderedHtml}`;
  
  console.log(`[SUBDOMAIN-DEBUG] Final rendered HTML size: ${debuggedHtml.length} bytes`);
  return debuggedHtml;
}
