'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import PostEditor from './PostEditor';
import PostMetadataForm from './PostMetadataForm';
import { getDashboardPath } from '@/lib/route-utils';
import { getDashboardUrl } from '@/lib/route-utils';

// Form validation schema
const postFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type PostFormValues = z.infer<typeof postFormSchema>;

interface PostFormProps {
  initialData?: PostFormValues & { id?: string };
  isEditing?: boolean;
}

export default function PostForm({ initialData, isEditing = false }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values or existing post data
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: initialData || {
      title: '',
      content: '',
      slug: '',
      excerpt: '',
      tags: [],
    },
  });

  // Add debug logging
  useEffect(() => {
    console.log("PostForm initialized with:", { 
      isEditing, 
      initialDataId: initialData?.id,
      hasTitle: !!initialData?.title
    });
  }, [isEditing, initialData]);

  // In the onSubmit function, ensure we're sending the correct data structure
  const onSubmit = async (data: z.infer<typeof postFormSchema>) => {
    try {
      console.log("Form submitted with values:", {
        title: data.title,
        contentLength: data.content?.length || 0,
        excerptLength: data.excerpt?.length || 0,
        tagsCount: data.tags?.length || 0,
        slug: data.slug
      });
      
      setIsSubmitting(true);
      
      // Ensure required fields are present
      if (!data.title) {
        toast({
          title: 'Error',
          description: 'Title is required',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      // Log what we're sending for debugging
      console.log('Submitting post data:', data);
      
      let response;
      if (isEditing && initialData?.id) {
        response = await fetch(`/api/posts/${initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: data.title,
            content: data.content,
            excerpt: data.excerpt,
            tags: data.tags,
            slug: data.slug,
          }),
        });
      } else {
        response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: data.title,
            content: data.content,
            excerpt: data.excerpt,
            tags: data.tags,
            status: 'draft',
          }),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to save post');
      }
      
      const responseData = await response.json();
      console.log('API response:', responseData);
      
      toast({
        title: 'Success',
        description: isEditing ? 'Post updated successfully' : 'Post created successfully',
        variant: 'success',
      });
      
      setTimeout(() => {
        // Use the improved getDashboardPath function for proper subpath handling
        const postsUrl = getDashboardPath('posts');
        router.push(postsUrl);
      }, 1000);
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save post',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Post Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter post title"
                      className="text-sm font-medium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="content" className="w-full">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="mt-4">
            <PostEditor form={form} />
          </TabsContent>
          <TabsContent value="metadata" className="mt-4">
            <PostMetadataForm form={form} />
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                Saving...
              </>
            ) : (
              isEditing ? 'Update Post' : 'Publish Post'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}