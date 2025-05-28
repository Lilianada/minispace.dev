/**
 * Theme Types
 * 
 * Type definitions for the theming system
 */

import type { RenderContext } from '../theme-renderer';
import type { NavigationContext } from '../navigation-utils';

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
 * Theme context for rendering pages
 */
export interface ThemeRenderContext extends RenderContext {
  navigationContext?: NavigationContext;
  customPages?: any[];
  site?: any;
  navigation?: string;
}

/**
 * Customization options for themes
 */
export interface ThemeCustomization {
  colors?: Record<string, string>;
  fonts?: Record<string, string>;
  toggles?: string[];
}

/**
 * Debug context for theme rendering
 */
export interface ThemeDebugContext {
  theme: string;
  pageType: string;
  navigationContext?: NavigationContext;
  site?: any;
}

export const DEFAULT_THEME = 'simple';
