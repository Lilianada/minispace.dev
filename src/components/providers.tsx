'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';

export interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Wrapper for all global context providers
 * 
 * This component organizes all providers in a single place,
 * making it easier to manage the provider hierarchy and dependencies.
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  );
}
