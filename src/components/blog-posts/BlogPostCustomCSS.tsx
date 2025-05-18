'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Code } from 'lucide-react';
import DOMPurify from 'isomorphic-dompurify';

interface BlogPostCustomCSSProps {
  form: UseFormReturn<{
    title: string;
    content: string;
    slug: string;
    excerpt?: string;
    tags?: string[];
    coverImage?: string;
    customCSS?: string;
  }, unknown>;
}

export default function BlogPostCustomCSS({ form }: BlogPostCustomCSSProps) {
  const [activeTab, setActiveTab] = useState<string>('edit');
  const customCSS = form.watch('customCSS') || '';
  
  // Clean the CSS to prevent XSS attacks
  const sanitizeCSS = (css: string): string => {
    // Use DOMPurify to sanitize the CSS
    return DOMPurify.sanitize(css, {
      ALLOWED_TAGS: [], // No HTML tags allowed
      ALLOWED_ATTR: [] // No attributes allowed
    });
  };
  
  // Generate a preview of the CSS
  const previewCSS = () => {
    const sanitizedCSS = sanitizeCSS(customCSS);
    
    // Create a style element with scoped CSS
    const styleContent = `
      .blog-post-preview {
        ${sanitizedCSS}
      }
    `;
    
    return styleContent;
  };
  
  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">
                <Code className="h-4 w-4 mr-2" />
                Edit CSS
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="mt-4">
              <FormField
                control={form.control}
                name="customCSS"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Custom CSS</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ''}
                        placeholder="Add custom CSS for your blog post..."
                        className="font-mono text-sm h-[200px] resize-y"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-2">
                      CSS will be scoped to your blog post only and won't affect the rest of the site.
                    </p>
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="preview" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-base font-medium">CSS Preview</h3>
                
                {customCSS ? (
                  <>
                    <style dangerouslySetInnerHTML={{ __html: previewCSS() }} />
                    
                    <div className="border rounded-md p-6 blog-post-preview">
                      <h1>Sample Blog Post Title</h1>
                      <p>This is a paragraph of text to demonstrate your custom CSS.</p>
                      <ul>
                        <li>List item one</li>
                        <li>List item two</li>
                      </ul>
                      <blockquote>This is a blockquote example</blockquote>
                      <a href="#">This is a sample link</a>
                      <pre><code>// This is a code block</code></pre>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No custom CSS added yet
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="text-xs text-muted-foreground">
        <p className="font-medium">CSS Best Practices:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>Use specific selectors to avoid conflicts</li>
          <li>Keep your CSS minimal and focused on your content</li>
          <li>Test your styles in both light and dark modes</li>
          <li>Consider mobile responsiveness</li>
        </ul>
      </div>
    </div>
  );
}
