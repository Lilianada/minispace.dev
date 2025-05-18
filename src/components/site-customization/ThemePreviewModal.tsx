'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { allThemes } from '@/themes';

interface ThemePreviewModalProps {
  themeId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemePreviewModal({ themeId, isOpen, onClose }: ThemePreviewModalProps) {
  // Parse the theme ID to get category and theme name
  const [category, themeName] = themeId.split('/');
  
  // Find the theme
  const theme = allThemes.find(
    t => t.category === category && t.name.toLowerCase() === themeName
  );
  
  if (!theme || !theme.preview) {
    return null;
  }
  
  const ThemePreviewComponent = theme.preview;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Preview {theme.name} Theme</DialogTitle>
        </DialogHeader>
        <div className="p-0">
          <ThemePreviewComponent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
