'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PostMetadataFormProps {
  form: UseFormReturn<{
    title: string;
    content: string;
    slug: string;
    urlPath?: string;
    excerpt?: string;
    tags?: string[];
    coverImage?: string;
    customCSS?: string;
  }, unknown>;
}

export default function PostMetadataForm({ form }: PostMetadataFormProps) {
  const [tagInput, setTagInput] = useState('');
  const tags = form.watch('tags') || [];

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tagInput.trim()) return;
    
    // Convert to lowercase and remove special characters
    const formattedTag = tagInput.trim().toLowerCase().replace(/[^\w\s-]/g, '');
    
    // Check if tag already exists
    if (!tags.includes(formattedTag) && formattedTag) {
      form.setValue('tags', [...tags, formattedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="urlPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">URL Path</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground mr-2">/</span>
                      <Input
                        {...field}
                        value={field.value || 'blog'}
                        placeholder="blog"
                        className="text-sm w-32"
                      />
                      <span className="text-sm text-muted-foreground mx-2">/</span>
                    </div>
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    Customize the URL path for this post (e.g., blog, writing, notes)
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">URL Slug</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground mr-2">/{form.watch('urlPath') || 'blog'}/</span>
                      <Input
                        {...field}
                        value={field.value || ''}
                        placeholder="your-post-url"
                        className="text-sm"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Excerpt</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    placeholder="A brief summary of your post (appears in previews)"
                    className="resize-none h-24"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Cover Image URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ''}
                    placeholder="https://example.com/image.jpg"
                    className="text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div>
            <FormLabel className="text-base">Tags</FormLabel>
            <div className="mt-2">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  className="text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(e);
                    }
                  }}
                />
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline"
                  onClick={handleAddTag}
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tags added yet</p>
              ) : (
                tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-2 py-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
