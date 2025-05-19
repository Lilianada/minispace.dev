'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
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
  
  // Function to open theme preview in a new page
  const openInNewPage = () => {
    // Create a URL for the theme preview page
    const previewUrl = `/theme-preview/${themeId}`;
    window.open(previewUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
          <DialogTitle>Preview {theme.name} Theme</DialogTitle>
          <Button variant="outline" size="sm" onClick={openInNewPage} className="flex items-center gap-1">
            <ExternalLink className="h-4 w-4" />
            Open in New Page
          </Button>
        </DialogHeader>
        <div className="p-0">
          <ThemePreviewComponent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
