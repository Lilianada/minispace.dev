'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface PostMetadataFormProps {
  form: UseFormReturn<{
    title: string;
    content: string;
    slug?: string;
    excerpt?: string;
    tags?: string[];
  }, unknown>;
}

export default function PostMetadataForm({ form }: PostMetadataFormProps) {
  const [tagInput, setTagInput] = useState('');
  const tags = form.watch('tags') || [];
  
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      
      const newTag = tagInput.trim().toLowerCase();
      if (!newTag) return;
      
      if (!tags.includes(newTag)) {
        form.setValue('tags', [...tags, newTag]);
      }
      
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };
  
  // Generate slug from title if not already set
  const handleGenerateSlug = () => {
    const title = form.watch('title');
    if (!title) return;
    
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
      .trim();
    
    form.setValue('slug', slug);
  };
  
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>URL Slug</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateSlug}
                >
                  Generate from Title
                </Button>
              </div>
              <FormControl>
                <div className="flex">
                  <span className="bg-muted/50 px-3 flex items-center border border-r-0 rounded-l-md text-muted-foreground">
                    yoursite.com/
                  </span>
                  <Input
                    {...field}
                    value={field.value || ''}
                    className="rounded-l-none"
                    placeholder="post-url-slug"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ''}
                  placeholder="A brief summary of your post (shown in search results and post lists)"
                  className="resize-none h-24"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <Label htmlFor="tags">Tags</Label>
          <div className="mt-1 mb-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="mr-1">
                {tag}
                <button
                  type="button"
                  className="ml-1 text-muted-foreground hover:text-foreground"
                  onClick={() => handleRemoveTag(tag)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags (press Enter or comma to add)"
              className="w-full"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Separate tags with comma or press Enter
          </p>
        </div>
      </CardContent>
    </Card>
  );
}