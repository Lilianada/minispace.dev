/**
 * User API Service
 * 
 * Handles all API requests related to user profiles and settings.
 * Provides a clean interface for user-related operations.
 */

import { apiRequest } from '@/services/api-service';

// Types
export interface UserProfile {
  uid: string;
  username: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  socialLinks?: {
    website?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    instagram?: string;
  };
  createdAt?: string | Date;
}

export interface ThemeSettings {
  themeId: string;
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
    accent?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
  layout?: {
    showHeader?: boolean;
    showFooter?: boolean;
    showSidebar?: boolean;
  };
  customCSS?: string;
}

/**
 * Get current user's profile
 */
export async function getCurrentUserProfile() {
  return await apiRequest<UserProfile>('/api/user/profile');
}

/**
 * Update current user's profile
 */
export async function updateUserProfile(profileData: Partial<UserProfile>) {
  return await apiRequest<UserProfile>('/api/user/profile', {
    method: 'PATCH',
    body: profileData
  });
}

/**
 * Upload user profile photo
 */
export async function uploadProfilePhoto(file: File) {
  const formData = new FormData();
  formData.append('photo', file);
  
  return await apiRequest<{ photoURL: string }>('/api/user/profile-photo', {
    method: 'POST',
    body: formData,
    headers: {} // Let browser set content-type with boundary
  });
}

/**
 * Get a user's public profile by username
 */
export async function getPublicUserProfile(username: string) {
  return await apiRequest<UserProfile>(`/api/users/${username}`, {
    requireAuth: false
  });
}

/**
 * Get current user's theme settings
 */
export async function getUserThemeSettings() {
  return await apiRequest<ThemeSettings>('/api/user/theme-settings');
}

/**
 * Update user's theme settings
 */
export async function updateThemeSettings(settings: Partial<ThemeSettings>) {
  return await apiRequest<ThemeSettings>('/api/user/theme-settings', {
    method: 'PATCH',
    body: settings
  });
}

/**
 * Check if a username is available
 */
export async function checkUsernameAvailability(username: string) {
  return await apiRequest<{ available: boolean }>(`/api/username-availability?username=${encodeURIComponent(username)}`, {
    requireAuth: false
  });
}
