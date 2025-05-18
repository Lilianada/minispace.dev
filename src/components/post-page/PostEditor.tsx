'use client';

import { useCallback, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { EnhancedMarkdownRenderer } from '@/components/ui/enhanced-markdown-renderer';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Heading2, Code, Link, AlignCenter, AlignLeft, AlignRight, Palette, Type } from 'lucide-react';

interface PostEditorProps {
  form: UseFormReturn<{
    title: string;
    content: string;
    slug?: string;
    excerpt?: string;
    tags?: string[];
    coverImage?: string;
  }, unknown>;
  preview?: boolean;
}

export default function PostEditor({ form, preview = false }: PostEditorProps) {
  const content = form.watch('content') || '';
  
  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    form.setValue('content', e.target.value);
  }, [form]);

  // Memoize the preview content to avoid unnecessary re-renders
  const previewContent = useMemo(() => content, [content]);

  // Helper functions to insert markdown syntax
  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    let newText;
    if (selectedText) {
      newText = beforeText + syntax.replace(placeholder, selectedText) + afterText;
    } else {
      newText = beforeText + syntax + afterText;
    }
    
    form.setValue('content', newText);
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + syntax.indexOf(placeholder) + (selectedText ? selectedText.length : 0);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 pb-2">
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={() => insertMarkdown('## Heading', 'Heading')}
        >
          <Heading2 className="h-4 w-4 mr-1" />
          Heading
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={() => insertMarkdown('**bold**', 'bold')}
        >
          <Bold className="h-4 w-4 mr-1" />
          Bold
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={() => insertMarkdown('*italic*', 'italic')}
        >
          <Italic className="h-4 w-4 mr-1" />
          Italic
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={() => insertMarkdown('- List item', 'List item')}
        >
          <List className="h-4 w-4 mr-1" />
          List
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={() => insertMarkdown('1. Numbered item', 'Numbered item')}
        >
          <ListOrdered className="h-4 w-4 mr-1" />
          Numbered
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={() => insertMarkdown('`code`', 'code')}
        >
          <Code className="h-4 w-4 mr-1" />
          Code
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={() => insertMarkdown('[link text](https://example.com)', 'link text')}
        >
          <Link className="h-4 w-4 mr-1" />
          Link
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={() => insertMarkdown('\n\n---\n\n')}
        >
          Divider
        </Button>
        
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={() => insertMarkdown('{color:red}colored text{/color}', 'colored text')}
        >
          <Palette className="h-4 w-4 mr-1" />
          Color
        </Button>
        
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={() => insertMarkdown('{align:center}centered text{/align}', 'centered text')}
        >
          <AlignCenter className="h-4 w-4 mr-1" />
          Center
        </Button>
        
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={() => insertMarkdown('{size:large}larger text{/size}', 'larger text')}
        >
          <Type className="h-4 w-4 mr-1" />
          Size
        </Button>
      </div>
      
      <Tabs defaultValue={preview ? "preview" : "write"} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="mt-2">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => {
                      field.onChange(e);
                      handleTextareaChange(e);
                    }}
                    placeholder="Write your blog post content here using Markdown..."
                    className="min-h-[400px] lg:min-h-[600px] font-mono text-sm resize-y"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-2">
          <div className="min-h-[400px] lg:min-h-[600px] p-6 border rounded-md overflow-auto bg-white dark:bg-gray-950">
            {previewContent ? (
              <EnhancedMarkdownRenderer content={previewContent} className="prose-headings:mt-4 prose-headings:mb-2" allowHtml={true} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No content to preview
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="text-xs text-muted-foreground">
        <p>Use Markdown to format your content. You can use the toolbar above or write Markdown directly.</p>
      </div>
    </div>
  );
}
