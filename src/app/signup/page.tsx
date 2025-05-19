'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { signUp } from '@/lib/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getDashboardPath } from '@/lib/route-utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import LoadingScreen from '@/components/LoadingScreen';

// Form schema
const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userData, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get username from URL query params if available
  const usernameFromQuery = searchParams.get('username');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: usernameFromQuery || '',
      email: '',
      password: '',
    },
  });

  // Use useEffect for redirection instead of doing it during render
  useEffect(() => {
    if (user && userData) {
      // Get the username-based dashboard URL
      const dashboardUrl = getDashboardPath();
      router.push(dashboardUrl);
    }
  }, [user, userData, router]);

  // Show loading screen while redirecting if user is already signed in
  if (authLoading || (user && !userData)) {
    return (
      <LoadingScreen />
    );
  }
  
  if (user && userData) {
    const dashboardUrl = getDashboardPath();
    router.push(dashboardUrl);
    return null;
  }

  async function onSubmit(data: FormValues) {
    setError('');
    setLoading(true);

    try {
      await signUp(data.email, data.password, data.username);
      
      // Username should be stored in localStorage during signup
      const username = localStorage.getItem('username');
      if (!username) {
        console.error('Username missing after signup, using fallback');
        localStorage.setItem('username', data.username.toLowerCase());
      }
      
      // Navigate to the username-based dashboard URL
      const dashboardUrl = getDashboardPath();
      console.log(`Redirecting to dashboard after signup: ${dashboardUrl}`);
      router.push(dashboardUrl);
    } catch (err) {
      console.error('Signup error:', err);
      setError((err as Error).message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your Minispace account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm mb-4">
              {error}
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Username <span className="text-destructive">*</span>
                    </FormLabel>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Choose a username"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-destructive">*</span>
                    </FormLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password <span className="text-destructive">*</span>
                    </FormLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Create a password (min. 6 characters)"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" isLoading={loading}>
                Create Account
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/signin" className="text-accent hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}