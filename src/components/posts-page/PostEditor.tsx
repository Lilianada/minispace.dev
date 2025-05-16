'use client';

import { useCallback, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';

interface PostEditorProps {
  form: UseFormReturn<{
    title: string;
    content: string;
    slug?: string;
    excerpt?: string;
    tags?: string[];
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

  return (
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
                  placeholder="Write your post content here using Markdown..."
                  className="min-h-[300px] lg:min-h-[500px] font-mono text-sm resize-y"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>
      <TabsContent value="preview" className="mt-2">
        <div className="min-h-[300px] lg:min-h-[500px] p-4 border rounded-md overflow-auto">
          {previewContent ? (
            <MarkdownRenderer content={previewContent} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No content to preview
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}