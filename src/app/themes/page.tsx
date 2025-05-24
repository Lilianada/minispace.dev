import { Metadata } from 'next';
import Link from 'next/link';
import { getAvailableThemes } from '@/lib/theme-service';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Themes | Minispace',
  description: 'Choose a theme for your personal site',
};

export default async function ThemesPage() {
  const themes = await getAvailableThemes();
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Themes</h1>
          <p className="text-muted-foreground">Choose a theme for your personal site</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map(theme => (
          <Card key={theme.id} className="overflow-hidden flex flex-col">
            <div className="theme-thumbnail aspect-video bg-muted relative">
              {theme.thumbnail ? (
                <img 
                  src={`/themes/${theme.id}/assets/thumbnail.svg`} 
                  alt={`${theme.name} theme`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No preview available
                </div>
              )}
            </div>
            
            <CardHeader>
              <CardTitle>{theme.name}</CardTitle>
              <CardDescription>By {theme.author}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1">
              <p className="text-sm">{theme.description}</p>
            </CardContent>
            
            <CardFooter className="flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/preview/theme/${theme.id}`}>Preview</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href={`/customize/theme?theme=${theme.id}`}>Customize</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {themes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No themes available</p>
        </div>
      )}
    </div>
  );
}
