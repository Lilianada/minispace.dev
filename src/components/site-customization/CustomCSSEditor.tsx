'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import useAuth from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { sanitizeCSS } from '@/lib/utils/css-sanitizer';

interface CustomCSSEditorProps {
  initialCSS: string;
  userId: string;
}

export default function CustomCSSEditor({ initialCSS, userId }: CustomCSSEditorProps) {
  const [css, setCSS] = useState(initialCSS || '');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('edit');
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Create a sanitized version of the CSS for the preview
  const sanitizedCSS = sanitizeCSS(css);

  const handleSave = async () => {
    if (!user || user.uid !== userId) {
      toast({
        title: 'Permission denied',
        description: 'You can only update your own site settings.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Sanitize CSS before saving to prevent malicious code
      const sanitized = sanitizeCSS(css);
      
      const userSettingsRef = doc(db, 'users', userId, 'userSettings', 'customization');
      
      await updateDoc(userSettingsRef, {
        customCSS: sanitized,
      });

      toast({
        title: 'Custom CSS saved',
        description: 'Your custom styles have been updated successfully.',
      });
      
      // Refresh the page to apply the new CSS
      router.refresh();
    } catch (error) {
      console.error('Error saving custom CSS:', error);
      toast({
        title: 'Save failed',
        description: 'There was an error saving your custom CSS. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Example content for the preview
  const previewContent = (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Page Title</h1>
        <p className="text-muted-foreground">This is a subtitle or description text.</p>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Section Heading</h2>
        <p>This is a paragraph of text that demonstrates how your custom CSS will affect the content on your site. You can style elements like paragraphs, headings, links, and more.</p>
        <a href="#" className="text-primary hover:underline">This is a link</a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-card rounded-lg border">Card element 1</div>
        <div className="p-4 bg-card rounded-lg border">Card element 2</div>
      </div>
      
      <div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Button Example</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Custom CSS</h2>
        <p className="text-muted-foreground">
          Add custom CSS to personalize your site. All CSS will be scoped to your site only.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Edit CSS</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="space-y-4">
          <div className="relative">
            <textarea
              value={css}
              onChange={(e) => setCSS(e.target.value)}
              className="w-full h-80 font-mono text-sm p-4 bg-muted rounded-md resize-none"
              placeholder=".site-wrapper {
  /* Your custom CSS here */
  --custom-color: #6366f1;
}

.site-wrapper h1 {
  color: var(--custom-color);
}

.site-wrapper .custom-section {
  background-color: #f3f4f6;
  padding: 2rem;
  border-radius: 0.5rem;
}"
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Tips:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Use <code className="bg-muted px-1 rounded">.site-wrapper</code> to scope your CSS to your site</li>
              <li>Define custom variables with <code className="bg-muted px-1 rounded">--variable-name</code></li>
              <li>Global selectors like <code className="bg-muted px-1 rounded">body</code>, <code className="bg-muted px-1 rounded">html</code> are not allowed</li>
            </ul>
          </div>
          
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save CSS'}
          </Button>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card className="p-6 mb-4">
            <div className="site-wrapper">
              <style dangerouslySetInnerHTML={{ __html: sanitizedCSS }} />
              {previewContent}
            </div>
          </Card>
          
          <div className="text-sm text-muted-foreground">
            This is a preview of how your custom CSS will look on your site. Switch back to the Edit tab to make changes.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
