/**
 * Theme Rendering Debug Helper
 * 
 * This module adds detailed logging and debugging for theme rendering
 * to help diagnose issues with subdomain links and routing
 */

import { logLinksInHtml } from './debug-utils';

/**
 * Debug the theme rendering process, especially navigation links
 * 
 * @param phase - The phase of the rendering process
 * @param context - The rendering context
 * @param html - The HTML being rendered
 */
export function debugThemeRendering(
  phase: 'pre-render' | 'post-render' | 'post-navigation-update',
  context: any,
  html?: string
): void {
  console.log(`[THEME-DEBUG] Phase: ${phase}`);
  
  if (phase === 'pre-render') {
    // Log the context being used to render the theme
    console.log(`[THEME-DEBUG] Rendering theme: ${context.theme || 'unknown'}`);
    console.log(`[THEME-DEBUG] Page type: ${context.pageType || 'unknown'}`);
    
    if (context.navigationContext) {
      const { username, currentPage, isSubdomain } = context.navigationContext;
      console.log(`[THEME-DEBUG] Navigation context:
        - Username: ${username}
        - Current page: ${currentPage || 'home'}
        - Is subdomain: ${isSubdomain}
      `);
    }
    
    if (context.site) {
      console.log(`[THEME-DEBUG] Site context:
        - Title: ${context.site.title}
        - Username: ${context.site.username}
      `);
    }
  } 
  
  if (html && (phase === 'post-render' || phase === 'post-navigation-update')) {
    // Extract and log all links in the rendered HTML
    logLinksInHtml(html, `Links in HTML (${phase})`);
    
    // Test for potential issues
    testForRenderingIssues(html, context, phase);
  }
}

/**
 * Test for common rendering issues with themes and links
 */
function testForRenderingIssues(html: string, context: any, phase: string): void {
  const issues: string[] = [];
  const username = context.navigationContext?.username || context.site?.username;
  const isSubdomain = context.navigationContext?.isSubdomain;
  
  if (!username) {
    issues.push('Username missing in context - cannot validate links properly');
    return;
  }
  
  // Check for hardcoded links that should be dynamic
  if (html.includes('/dashboard')) {
    issues.push('Dashboard links detected in public theme - should be admin-only');
  }
  
  // Check for incorrect path structure based on routing mode
  if (isSubdomain) {
    // In subdomain mode, we shouldn't have paths like /username/... 
    // except in special cases like dashboard links
    const incorrectPathRegex = new RegExp(`href="\\/${username}\\/(?!dashboard)`, 'g');
    if (incorrectPathRegex.test(html)) {
      issues.push(`Detected incorrect path-based links (/${username}/...) in subdomain mode`);
    }
  } else {
    // In path-based mode, all internal links should be prefixed with username
    const rootRelativeLinks = /href="\/(?!api|_next|static|images|assets|favicon|\w+:)/g;
    let match;
    const problematicLinks: string[] = [];
    
    while ((match = rootRelativeLinks.exec(html)) !== null) {
      // Extract the actual link to see if it's correctly prefixed
      const linkStartIndex = match.index;
      const hrefSubstring = html.substring(linkStartIndex, linkStartIndex + 200);
      const linkMatch = /href="(\/[^"]*)"/.exec(hrefSubstring);
      
      if (linkMatch && !linkMatch[1].startsWith(`/${username}`)) {
        problematicLinks.push(linkMatch[1]);
      }
    }
    
    if (problematicLinks.length > 0) {
      issues.push(`Detected ${problematicLinks.length} root-relative links without username prefix in path-based mode: ${problematicLinks.slice(0, 3).join(', ')}${problematicLinks.length > 3 ? '...' : ''}`);
    }
  }
  
  // Log any issues found
  if (issues.length > 0) {
    console.log(`[THEME-DEBUG] ⚠️ Potential issues detected (${phase}):`);
    issues.forEach((issue, i) => {
      console.log(`  ${i+1}. ${issue}`);
    });
  } else {
    console.log(`[THEME-DEBUG] ✓ No obvious rendering issues detected (${phase})`);
  }
}
