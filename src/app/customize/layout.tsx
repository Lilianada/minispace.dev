import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customize Your Site | Minispace',
  description: 'Create and customize your personal site',
};

/**
 * Standalone layout for site customization
 * This keeps the customization UI completely separate from the main app layout
 */
export default function CustomizeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="customize-container min-h-screen">
      {children}
    </div>
  );
}
