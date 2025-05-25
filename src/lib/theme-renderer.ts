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
  
  // Handle loops first (loops will handle their own conditionals and variables)
  template = processLoops(template, context);
  
  // Handle remaining conditionals (those not inside loops)
  template = processConditionals(template, context);
  
  // Replace remaining variables
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
  
  // Handle triple braces for unescaped HTML first: {{{variable}}}
  const tripleVariableRegex = /\{\{\{([^}]+?)\}\}\}/g;
  template = template.replace(tripleVariableRegex, (_, path) => {
    const value = getValueFromPath(path.trim(), context);
    if (value === undefined || value === null) {
      return '';
    }
    // Return unescaped HTML
    return String(value);
  });
  
  // Then handle simple variables: {{variable}}
  const variableRegex = /\{\{([^#\/][^}]*?)\}\}/g;
  
  return template.replace(variableRegex, (_, path) => {
    const value = getValueFromPath(path.trim(), context);
    
    if (value === undefined || value === null) {
      return '';
    }
    
    // Return escaped HTML
    return escapeHtml(String(value));
  });
}

/**
 * Process helper functions like {{formatDate date}} or {{eq value1 value2}}
 */
function processHelpers(template: string, context: RenderContext): string {
  // Match {{helperName argument argument2...}} pattern
  const helperRegex = /\{\{(\w+)\s+([^}]+)\}\}/g;
  
  return template.replace(helperRegex, (_, helperName, argsString) => {
    // Check if we have a helper with this name
    const helper = templateHelpers[helperName];
    if (!helper) {
      return `{{${helperName} ${argsString}}}`;
    }
    
    // Parse arguments - split by spaces but handle quoted strings
    const args = argsString.trim().split(/\s+/);
    
    // Get the argument values
    /**
     * Parse helper argument strings into their corresponding values
     * @param {string[]} args - Raw argument strings from the template
     * @param {RenderContext} context - Current template context
     * @returns {any[]} - Array of resolved argument values
     */
    const argValues: any[] = args.map((arg: string) => {
      // Remove quotes if present
      if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
      return arg.slice(1, -1);
      }
      return getValueFromPath(arg, context);
    });
    
    // Call the helper with the arguments
    try {
      if (helperName === 'eq' && argValues.length >= 2) {
        return helper(argValues[0], argValues[1]);
      } else {
        return helper(argValues[0], context);
      }
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
  
  // Check if two values are equal
  eq: (value1: any, value2: any) => {
    return String(value1) === String(value2) ? 'true' : '';
  },
};
