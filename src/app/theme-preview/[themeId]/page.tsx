import { notFound } from 'next/navigation';
import { allThemes } from '@/themes';
import ThemePreviewClient from './page.client';

interface ThemePreviewPageProps {
  params: {
    themeId: string;
  };
}

export default async function ThemePreviewPage({ params }: ThemePreviewPageProps) {
  // Await the params object to fix the Next.js warning
  const paramsObj = await Promise.resolve(params);
  let themeId = decodeURIComponent(paramsObj.themeId);
  
  if (!themeId) {
    return notFound();
  }
  
  let category, themeName;
  
  // Handle both URL formats: 'category/themeName' and just 'themeId'
  if (themeId.includes('/')) {
    // Format: 'category/themeName'
    [category, themeName] = themeId.split('/');
  } else {
    // Try to find the theme directly by ID
    const theme = allThemes.find(t => t.id === themeId);
    if (theme) {
      category = theme.category;
      themeName = theme.name;
    }
  }
  
  if (!category || !themeName) {
    return notFound();
  }
  
  // Find the theme by category and name (case insensitive)
  const theme = allThemes.find(theme => 
    theme.category.toLowerCase() === category.toLowerCase() && 
    theme.name.toLowerCase() === themeName.toLowerCase()
  );
  
  if (!theme || !theme.preview) {
    return notFound();
  }
  
  // Pass the theme to the client component
  return <ThemePreviewClient theme={theme} />;
}
