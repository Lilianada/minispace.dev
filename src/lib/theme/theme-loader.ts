/**
 * Theme Loader
 * 
 * Handles loading theme manifests and templates
 */

import fs from 'fs';
import path from 'path';
import { ThemeManifest } from './theme-types';

// Base paths for themes
const SRC_THEMES_PATH = path.join(process.cwd(), 'src', 'themes');
const PUBLIC_THEMES_PATH = path.join(process.cwd(), 'public', 'themes');
const ROOT_THEMES_PATH = path.join(process.cwd(), 'themes');

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
