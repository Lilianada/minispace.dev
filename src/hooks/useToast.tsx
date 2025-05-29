'use client';

import { useToast as useShadcnToast } from './useToast.ts';

/**
 * Custom hook to access toast functionality
 * 
 * This is a simple wrapper around the useToast hook that
 * makes it easy to import from one location
 */
export default function useToast() {
  return useShadcnToast();
}