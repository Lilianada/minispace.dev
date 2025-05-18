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
import { getDashboardPath } from '@/lib/route-utils';
import { doc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { getAuth } from 'firebase/auth';
import BlogPostEditor from './BlogPostEditor';
import BlogPostMetadataForm from './BlogPostMetadataForm';
import BlogPostCustomCSS from './BlogPostCustomCSS';

// Form validation schema
const blogPostFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  slug: z.string().min(1, { message: 'URL slug is required' }).regex(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens'
  }),
  urlPath: z.string().regex(/^[a-z0-9-]+$/, {
    message: 'URL path can only contain lowercase letters, numbers, and hyphens'
  }).optional(),
  excerpt: z.string().max(300, { message: 'Excerpt cannot exceed 300 characters' }).optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  customCSS: z.string().max(5000, { message: 'Custom CSS cannot exceed 5000 characters' }).optional(),
});

type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;

interface BlogPostFormProps {
  initialData?: BlogPostFormValues & { id?: string };
  isEditing?: boolean;
}

export default function BlogPostForm({ initialData, isEditing = false }: BlogPostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = getAuth();

  // Initialize form with default values or existing post data
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: initialData || {
      title: '',
      content: '',
      slug: '',
      urlPath: 'blog',
      excerpt: '',
      tags: [],
      coverImage: '',
      customCSS: '',
    },
  });

  // Generate slug from title
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title' && value.title && !isEditing && !form.getValues('slug')) {
        // Create a more SEO-friendly slug
        const slug = value.title
          .toLowerCase()
          // Replace special chars with empty string
          .replace(/[^\w\s-]/g, '')
          // Replace spaces with hyphens
          .replace(/\s+/g, '-')
          // Remove consecutive hyphens
          .replace(/-+/g, '-')
          // Remove leading/trailing hyphens
          .replace(/^-+|-+$/g, '');
          
        form.setValue('slug', slug);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, isEditing]);

  // Handle publishing a post
  const handlePublish = async (data: BlogPostFormValues) => {
    try {
      setIsSubmitting(true);
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error('You must be logged in to publish a blog post');
      }

      // Prepare post data with published status
      const postData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || '',
        slug: data.slug,
        urlPath: data.urlPath || 'blog',
        tags: data.tags || [],
        coverImage: data.coverImage || '',
        customCSS: data.customCSS || '',
        authorId: user.uid,
        status: 'published',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        publishedAt: serverTimestamp(),
        views: 0
      };
      
      let postId;
      
      if (isEditing && initialData?.id) {
        // Update existing post
        const postRef = doc(db, 'posts', initialData.id);
        await updateDoc(postRef, {
          ...postData,
          updatedAt: serverTimestamp(),
        });
        postId = initialData.id;
      } else {
        // Create new post
        const postsRef = collection(db, 'posts');
        const docRef = await addDoc(postsRef, postData);
        postId = docRef.id;
      }
      
      toast({
        title: 'Success',
        description: 'Blog post published successfully',
        variant: 'success',
      });
      
      // Redirect to the blog posts page after a short delay
      setTimeout(() => {
        router.push(getDashboardPath('blog-posts'));
      }, 1000);
    } catch (error) {
      console.error('Error publishing blog post:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to publish blog post',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: BlogPostFormValues) => {
    try {
      setIsSubmitting(true);
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error('You must be logged in to create a blog post');
      }

      // Prepare post data
      const postData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || '',
        slug: data.slug,
        urlPath: data.urlPath || 'blog',
        tags: data.tags || [],
        coverImage: data.coverImage || '',
        customCSS: data.customCSS || '',
        authorId: user.uid,
        status: 'draft',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        publishedAt: null,
        views: 0
      };
      
      let postId;
      
      if (isEditing && initialData?.id) {
        // Update existing post
        const postRef = doc(db, 'posts', initialData.id);
        await updateDoc(postRef, {
          ...postData,
          updatedAt: serverTimestamp(),
        });
        postId = initialData.id;
      } else {
        // Create new post
        const postsRef = collection(db, 'posts');
        const docRef = await addDoc(postsRef, postData);
        postId = docRef.id;
      }
      
      toast({
        title: 'Success',
        description: isEditing ? 'Blog post updated successfully' : 'Blog post created successfully',
        variant: 'success',
      });
      
      // Redirect to the blog posts page after a short delay
      setTimeout(() => {
        router.push(getDashboardPath('blog-posts'));
      }, 1000);
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save blog post',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Post Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a descriptive title"
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

        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="w-full rounded-none border-b">
                <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
                <TabsTrigger value="metadata" className="flex-1">Metadata</TabsTrigger>
                <TabsTrigger value="custom-css" className="flex-1">Custom CSS</TabsTrigger>
              </TabsList>
              <div className="p-6">
                <TabsContent value="content" className="mt-0">
                  <BlogPostEditor form={form} />
                </TabsContent>
                <TabsContent value="metadata" className="mt-0">
                  <BlogPostMetadataForm form={form} />
                </TabsContent>
                <TabsContent value="custom-css" className="mt-0">
                  <BlogPostCustomCSS form={form} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.push(getDashboardPath('blog-posts'))}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </div>
            ) : (
              isEditing ? 'Update Post' : 'Save Draft'
            )}
          </Button>
          {!isEditing && (
            <Button 
              type="submit"
              variant="default"
              disabled={isSubmitting}
              onClick={() => {
                // We'll handle the published status in the onSubmit function
                const formData = form.getValues();
                handlePublish(formData);
              }}
            >
              Publish Post
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
