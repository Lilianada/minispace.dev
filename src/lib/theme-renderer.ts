/**
 * Static Theme Renderer
 * 
 * This utility handles rendering HTML templates with data using a 
 * lightweight approach similar to Handlebars or EJS.
 */

export interface RenderContext {
  [key: string]: any;
}

/**
 * Renders a template using a simple handlebars-like syntax
 * 
 * Supports:
 * - Variable interpolation: {{variable}}
 * - Conditionals: {{#if condition}}...{{/if}}
 * - Each loops: {{#each items}}...{{/each}}
 * - Root context access: {{@root.variable}}
 */
export function renderTemplate(template: string, context: RenderContext): string {
  // For debugging
  const isDebug = process.env.DEBUG_TEMPLATES === 'true';
  
  // Handle conditionals first
  template = processConditionals(template, context);
  
  // Handle loops
  template = processLoops(template, context);
  
  // Replace variables
  template = processVariables(template, context);
  
  if (isDebug) {
    console.log('Template context:', JSON.stringify(context, null, 2));
    console.log('Rendered template:', template.substring(0, 500) + '...');
  }
  
  return template;
}

/**
 * Process conditional statements in the template
 */
function processConditionals(template: string, context: RenderContext): string {
  // Match {{#if condition}}...{{/if}} or {{#if condition}}...{{else}}...{{/if}}
  const conditionalRegex = /\{\{#if\s+(.+?)\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/if\}\}/g;
  
  return template.replace(conditionalRegex, (_, condition, trueContent, falseContent = '') => {
    // Evaluate the condition with the current context
    const isTrue = evaluateCondition(condition, context);
    return isTrue ? trueContent : falseContent;
  });
}

/**
 * Process loop statements in the template
 */
function processLoops(template: string, context: RenderContext): string {
  // Match {{#each items}}...{{/each}}
  const loopRegex = /\{\{#each\s+(.+?)\}\}([\s\S]*?)\{\{\/each\}\}/g;
  
  return template.replace(loopRegex, (_, itemsPath, content) => {
    const items = getValueFromPath(itemsPath, context);
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return '';
    }
    
    // Process each item in the loop
    return items.map((item, index) => {
      // Create a context for the loop iteration, including access to @root
      const loopContext = {
        ...item,
        '@index': index,
        '@first': index === 0,
        '@last': index === items.length - 1,
        '@root': context
      };
      
      // Process the content for this loop item
      let itemContent = content;
      // Handle conditionals within the loop
      itemContent = processConditionals(itemContent, loopContext);
      // Replace variables with their values
      itemContent = processVariables(itemContent, loopContext);
      
      return itemContent;
    }).join('');
  });
}

/**
 * Replace {{variable}} placeholders with their values
 */
function processVariables(template: string, context: RenderContext): string {
  // First handle helper functions like {{formatDate date}}
  template = processHelpers(template, context);
  
  // Then handle simple variables: {{variable}}
  const variableRegex = /\{\{([^#\/][^}]*?)\}\}/g;
  
  return template.replace(variableRegex, (_, path) => {
    // Handle triple braces for unescaped HTML
    const isUnescaped = path.startsWith('{') && path.endsWith('}');
    if (isUnescaped) {
      path = path.slice(1, -1).trim();
    }
    
    const value = getValueFromPath(path.trim(), context);
    
    if (value === undefined || value === null) {
      return '';
    }
    
    // Return the value, escaped if needed
    return isUnescaped ? String(value) : escapeHtml(String(value));
  });
}

/**
 * Process helper functions like {{formatDate date}}
 */
function processHelpers(template: string, context: RenderContext): string {
  // Match {{helperName argument}} pattern
  const helperRegex = /\{\{(\w+)\s+([^}]+)\}\}/g;
  
  return template.replace(helperRegex, (_, helperName, argPath) => {
    // Check if we have a helper with this name
    const helper = templateHelpers[helperName];
    if (!helper) {
      return `{{${helperName} ${argPath}}}`;
    }
    
    // Get the argument value
    const argValue = getValueFromPath(argPath.trim(), context);
    
    // Call the helper with the argument
    try {
      return helper(argValue, context);
    } catch (error) {
      console.error(`Error in template helper ${helperName}:`, error);
      return '';
    }
  });
}

/**
 * Evaluate a condition expression against the context
 */
function evaluateCondition(condition: string, context: RenderContext): boolean {
  // Simple condition evaluation - just check if the value exists
  const value = getValueFromPath(condition, context);
  
  // Check for empty arrays
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  
  // Check for empty objects
  if (value && typeof value === 'object') {
    return Object.keys(value).length > 0;
  }
  
  return Boolean(value);
}

/**
 * Get a value from a dot-notation path in an object
 */
function getValueFromPath(path: string, context: RenderContext): any {
  // Handle @root access
  if (path.startsWith('@root.')) {
    const rootPath = path.substring(6);
    const rootContext = context['@root'] || context;
    return getValueFromPath(rootPath, rootContext);
  }
  
  // Handle nested properties
  const parts = path.split('.');
  let value = context;
  
  for (const part of parts) {
    if (value === null || value === undefined) {
      return undefined;
    }
    
    value = value[part];
  }
  
  return value;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Built-in template helpers
 */
const templateHelpers: Record<string, (value: any, context: RenderContext) => string> = {
  // Format a date string
  formatDate: (date: string | Date) => {
    if (!date) return '';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return String(date);
    }
  },
};
