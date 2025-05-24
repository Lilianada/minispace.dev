import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getThemeById } from '@/lib/theme-service';
import ThemePreviewer from '@/components/theme/ThemePreviewer';

export const metadata: Metadata = {
  title: 'Theme Preview | Minispace',
  description: 'Preview themes for your personal site',
};

export default async function ThemePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (!id) {
    return notFound();
  }
  
  // Check if theme exists
  const theme = await getThemeById(id);
  if (!theme) {
    return notFound();
  }
  
  return (
    <div className="theme-preview-page h-screen flex flex-col">
      <div className="theme-preview-header p-4 border-b">
        <h1 className="text-xl font-semibold">{theme.name} Theme</h1>
        <p className="text-sm text-gray-500">{theme.description}</p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ThemePreviewer themeId={id} />
      </div>
    </div>
  );
}
