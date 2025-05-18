'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useToast } from '@/hooks/use-toast';

interface CustomCSSManagerProps {
  userId: string;
  pageSlug: string;
}

export default function CustomCSSManager({ userId, pageSlug }: CustomCSSManagerProps) {
  const [css, setCSS] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [previewCSS, setPreviewCSS] = useState<string>('');
  const { toast } = useToast();

  // Load custom CSS for this page
  useEffect(() => {
    const loadCustomCSS = async () => {
      try {
        const customCSSRef = doc(db, 'Users', userId, 'customCSS', pageSlug);
        const customCSSSnap = await getDoc(customCSSRef);
        
        if (customCSSSnap.exists()) {
          const cssData = customCSSSnap.data();
          setCSS(cssData.css || '');
          setPreviewCSS(cssData.css || '');
        } else {
          // No custom CSS for this page yet
          setCSS('');
          setPreviewCSS('');
        }
      } catch (error) {
        console.error('Error loading custom CSS:', error);
      }
    };

    if (userId && pageSlug) {
      loadCustomCSS();
    }
  }, [userId, pageSlug]);

  const handleSave = async () => {
    if (!userId) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save custom CSS',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      
      const customCSSRef = doc(db, 'Users', userId, 'customCSS', pageSlug);
      await setDoc(customCSSRef, {
        css,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setPreviewCSS(css);
      
      toast({
        title: 'Success',
        description: 'Custom CSS saved successfully',
      });
    } catch (error) {
      console.error('Error saving custom CSS:', error);
      toast({
        title: 'Error',
        description: 'Failed to save custom CSS',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    setPreviewCSS(css);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Custom CSS for {pageSlug}</h3>
      <p className="text-sm text-muted-foreground">
        Add custom CSS to style your page and blocks. Use the block class names you defined in your blocks.
      </p>
      
      <Tabs defaultValue="edit">
        <TabsList>
          <TabsTrigger value="edit">Edit CSS</TabsTrigger>
          <TabsTrigger value="help">Help</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-css">CSS Code</Label>
            <Textarea 
              id="custom-css"
              value={css}
              onChange={(e) => setCSS(e.target.value)}
              placeholder={`.my-hero-section {
  background-color: #f5f5f5;
}

.my-text-section h2 {
  color: #3b82f6;
  font-size: 2rem;
}

/* Use the class names you defined in your blocks */`}
              className="font-mono text-sm min-h-[300px]"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={handlePreview} variant="outline">
              Preview
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save CSS'}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="help">
          <Card className="p-4">
            <h4 className="font-medium mb-2">How to use custom CSS</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Add CSS class names to your blocks in the block editor</li>
              <li>Use those class names in your CSS code here</li>
              <li>Preview to see your changes</li>
              <li>Save when you're happy with the result</li>
            </ol>
            
            <h4 className="font-medium mt-4 mb-2">Example</h4>
            <pre className="bg-muted p-2 rounded text-xs overflow-auto">
{`.my-hero-section {
  background-color: #f5f5f5;
  border-radius: 8px;
}

.my-text-section h2 {
  color: #3b82f6;
  font-size: 2rem;
  border-bottom: 2px solid #ddd;
  padding-bottom: 0.5rem;
}`}
            </pre>
          </Card>
        </TabsContent>
      </Tabs>
      
      {previewCSS && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">CSS Preview</h4>
          <style dangerouslySetInnerHTML={{ __html: previewCSS }} />
        </div>
      )}
    </div>
  );
}
