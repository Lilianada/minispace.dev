import { notFound } from 'next/navigation';
import { allThemes } from '@/themes';

interface ThemePreviewPageProps {
  params: {
    themeId: string;
  };
}

export default async function ThemePreviewPage({ params }: ThemePreviewPageProps) {
  // Await the params object to fix the Next.js warning
  const paramsObj = await Promise.resolve(params);
  const themeId = paramsObj.themeId;
  
  if (!themeId) {
    return notFound();
  }
  
  // Parse the theme ID to get category and theme name
  const [category, themeName] = themeId.split('/');
  
  // Find the theme
  const theme = allThemes.find(
    t => t.category === category && t.name.toLowerCase() === themeName
  );
  
  if (!theme || !theme.preview) {
    return notFound();
  }
  
  const ThemePreviewComponent = theme.preview;
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b py-4 px-6 bg-background sticky top-0 z-10 flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {theme.name} Theme Preview
        </h1>
        <div className="text-sm text-muted-foreground">
          Category: {theme.category}
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        <ThemePreviewComponent />
      </main>
    </div>
  );
}
