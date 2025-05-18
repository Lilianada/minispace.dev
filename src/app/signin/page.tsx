/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { signIn } from '@/lib/auth';
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
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignIn() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Use useEffect for redirection instead of doing it during render
  useEffect(() => {
    if (user && userData) {
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
  
  // If user is already signed in, show loading screen while useEffect handles redirection
  if (user && userData) {
    return <LoadingScreen />;
  }

  async function onSubmit(data: FormValues) {
    setError('');
    setLoading(true);

    try {
      await signIn(data.email, data.password);
      
      // Store login timestamp for token expiration checks
      localStorage.setItem('authTokenTimestamp', Date.now().toString());
      console.log('Auth token timestamp set');
      
      // Get the username from localStorage (should be set during login)
      const username = localStorage.getItem('username');
      if (!username) {
        console.error('Username missing after login, using fallback redirection');
        router.push('/signin?error=missing-username');
        return;
      }
      
      // Get the username-based dashboard URL
      const dashboardUrl = getDashboardPath();
      console.log(`Redirecting to dashboard: ${dashboardUrl}`);
      router.push(dashboardUrl);
    } catch (err) {
      console.error('Login error:', err);
      setError((err as Error).message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Log In</CardTitle>
          <CardDescription>Welcome back to Minispace</CardDescription>
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
                    <div className="flex items-center justify-between">
                      <FormLabel>
                        Password <span className="text-destructive">*</span>
                      </FormLabel>
                      <Link href="/forgot-password" className="text-sm text-accent hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" isLoading={loading}>
                Log In
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="text-accent hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}