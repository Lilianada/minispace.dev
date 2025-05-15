'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import PostEditor from './PostEditor';
import PostMetadataForm from './PostMetadataForm';
import { createPost, updatePost } from '@/lib/api/posts';

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

  async function onSubmit(data: PostFormValues) {
    try {
      setIsSubmitting(true);
      
      if (isEditing && initialData?.id) {
        // Update existing post
        await updatePost(initialData.id, data);
        toast({
          title: 'Success',
          description: 'Your post has been updated',
        });
      } else {
        // Create new post
        await createPost(data);
        toast({
          title: 'Success',
          description: 'Your post has been created',
        });
      }
      
      // Redirect to posts list
      router.push('/dashboard/posts');
      router.refresh();
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: 'Error',
        description: 'Failed to save post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

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
                      className="text-lg font-medium"
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