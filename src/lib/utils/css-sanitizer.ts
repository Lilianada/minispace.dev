/**
 * Sanitizes user-provided CSS to prevent malicious code and ensure it's properly scoped
 * 
 * This function:
 * 1. Removes potentially dangerous selectors (html, body, script, etc.)
 * 2. Ensures all CSS is scoped to .site-wrapper
 * 3. Removes any @import statements
 * 4. Limits the size of the CSS
 * 
 * @param css The user-provided CSS string
 * @returns Sanitized CSS string
 */
export function sanitizeCSS(css: string): string {
  if (!css) return '';
  
  // Limit CSS size
  const MAX_CSS_LENGTH = 10000; // 10KB limit
  if (css.length > MAX_CSS_LENGTH) {
    css = css.substring(0, MAX_CSS_LENGTH);
  }
  
  // Remove comments
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Remove @import statements
  css = css.replace(/@import\s+[^;]*;/g, '');
  
  // Remove other potentially dangerous at-rules
  css = css.replace(/@(document|namespace|supports|page|keyframes|media|font-face|charset)[^{]*\{[^}]*\}/g, '');
  
  // Dangerous selectors to remove
  const dangerousSelectors = [
    'html', 'body', 'head', 'meta', 'link', 'script', 'style', 
    'title', 'iframe', 'object', 'embed', '*', ':root'
  ];
  
  // Remove dangerous selectors
  const selectorRegex = new RegExp(
    `(^|[^\\w.#-])(?:${dangerousSelectors.join('|')})(?=[^\\w-]|$)`, 'gi'
  );
  css = css.replace(selectorRegex, '$1.safe-replacement');
  
  // Remove url() references that aren't to allowed domains
  css = css.replace(
    /url\s*\(\s*(['"]?)(?!data:image\/|https:\/\/minispace\.dev\/)(.*?)\1\s*\)/gi,
    'url($1https://minispace.dev/placeholder-image.jpg$1)'
  );
  
  // Ensure all CSS is scoped to .site-wrapper if not already
  // Split the CSS into rule blocks
  const cssBlocks = css.match(/[^{}]+\{[^{}]*\}/g) || [];
  
  const scopedCSS = cssBlocks.map(block => {
    // Split each block into selector and rules
    const parts = block.match(/([^{]+)(\{[^}]*\})/);
    if (!parts) return block;
    
    const [, selector, rules] = parts;
    
    // Check if selector already contains .site-wrapper
    if (selector.includes('.site-wrapper')) {
      return block;
    }
    
    // Add .site-wrapper to the beginning of each selector
    const scopedSelector = selector
      .split(',')
      .map(s => `.site-wrapper ${s.trim()}`)
      .join(', ');
    
    return `${scopedSelector} ${rules}`;
  }).join('\n');
  
  return scopedCSS;
}
