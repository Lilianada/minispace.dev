/**
 * Theme Service
 * 
 * Manages static HTML/CSS themes and provides utilities for
 * rendering themes and handling user customizations
 */

import fs from 'fs';
import path from 'path';
import { renderTemplate, RenderContext } from './theme-renderer';

// Base paths for themes
const SRC_THEMES_PATH = path.join(process.cwd(), 'src', 'themes');
const PUBLIC_THEMES_PATH = path.join(process.cwd(), 'public', 'themes');
const ROOT_THEMES_PATH = path.join(process.cwd(), 'themes');

/**
 * Theme manifest interface
 */
export interface ThemeManifest {
  id?: string;
  name: string;
  description: string;
  version: string;
  author: string;
  thumbnail?: string;
  templates: {
    layout: string;
    home: string;
    about: string;
    posts: string;
    post: string;
    [key: string]: string;
  };
  customization: {
    colors: Record<string, ThemeColorOption>;
    fonts: Record<string, ThemeFontOption>;
    options: Record<string, ThemeToggleOption>;
  };
  defaultContent?: any;
}

export interface ThemeColorOption {
  label: string;
  value: string;
  variable: string;
}

export interface ThemeFontOption {
  label: string;
  value: string;
  variable: string;
}

export interface ThemeToggleOption {
  label: string;
  type: string;
  value: boolean | string | number;
  options?: {id: string, label: string, value: string}[];
}

/**
 * Get all available themes
 */
export async function getAvailableThemes(): Promise<ThemeManifest[]> {
  try {
    const themes: ThemeManifest[] = [];
    
    // Check root themes folder for JSON manifests
    if (fs.existsSync(ROOT_THEMES_PATH)) {
      const rootThemesFolders = fs.readdirSync(ROOT_THEMES_PATH);
      
      for (const folder of rootThemesFolders) {
        // Skip if not a directory
        if (!fs.statSync(path.join(ROOT_THEMES_PATH, folder)).isDirectory()) {
          continue;
        }

        // Check if manifest exists as JSON
        const manifestPath = path.join(ROOT_THEMES_PATH, folder, 'manifest.json');
        if (fs.existsSync(manifestPath)) {
          try {
            // Load the JSON manifest
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            manifest.id = folder;
            themes.push(manifest);
          } catch (error) {
            console.error(`Error loading theme manifest for ${folder}:`, error);
          }
        }
      }
    }
    
    return themes;
  } catch (error) {
    console.error('Error loading themes:', error);
    return [];
  }
}

/**
 * Get a specific theme by ID
 */
export async function getThemeById(themeId: string): Promise<ThemeManifest | null> {
  try {
    const themes = await getAvailableThemes();
    return themes.find(theme => theme.id === themeId) || null;
  } catch (error) {
    console.error(`Error getting theme ${themeId}:`, error);
    return null;
  }
}

/**
 * Load a theme template file
 */
export function loadThemeTemplate(themeId: string, templatePath: string): string {
  try {
    // First try loading from src/themes
    const srcPath = path.join(SRC_THEMES_PATH, themeId, templatePath);
    if (fs.existsSync(srcPath)) {
      return fs.readFileSync(srcPath, 'utf-8');
    }
    
    // Then try root themes folder
    const rootPath = path.join(ROOT_THEMES_PATH, themeId, templatePath);
    if (fs.existsSync(rootPath)) {
      return fs.readFileSync(rootPath, 'utf-8');
    }
    
    // If not found in src or root, try public/themes
    const publicPath = path.join(PUBLIC_THEMES_PATH, themeId, templatePath);
    if (fs.existsSync(publicPath)) {
      return fs.readFileSync(publicPath, 'utf-8');
    }
    
    throw new Error(`Template file not found in any theme paths`);
  } catch (error) {
    console.error(`Error loading template ${templatePath} for theme ${themeId}:`, error);
    return '<!-- Error loading template -->';
  }
}

/**
 * Generate CSS with user customizations
 */
export function generateCustomizedCSS(
  themeId: string,
  customizations: {
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
    toggles?: string[];
  }
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

/**
 * Render a page using a theme
 */
export async function renderThemePage(
  themeId: string,
  page: string,
  context: RenderContext,
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
    if (!pageTemplatePath) {
      throw new Error(`Page template ${page} not found in theme ${themeId}`);
    }
    
    // Load the templates
    const layoutTemplate = loadThemeTemplate(themeId, theme.templates.layout);
    const pageTemplate = loadThemeTemplate(themeId, pageTemplatePath);
    
    // Render the page content first
    const pageContent = renderTemplate(pageTemplate, context);
    
    // Then render the full layout with the page content
    const fullContext = {
      ...context,
      content: pageContent,
      userCSS: userCustomCSS,
      currentYear: new Date().getFullYear(),
    };
    
    return renderTemplate(layoutTemplate, fullContext);
  } catch (error) {
    console.error(`Error rendering page ${page} with theme ${themeId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return `<h1>Error rendering page</h1><p>${errorMessage}</p>`;
  }
}

const DEFAULT_THEME = 'simple'; 
