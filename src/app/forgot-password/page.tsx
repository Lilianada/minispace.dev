'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';
import { AuthContextType } from '@/contexts/AuthContext';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  // Use type assertion to address TypeScript issue with the auth context
  const auth = useAuth() as {
    user: any;
    userData: any;
    resetPassword: (email: string) => Promise<void>;
    [key: string]: any;
  };
  const { user, userData, resetPassword } = auth;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // If the user is already logged in, redirect to dashboard
    if (user) {
      if (userData?.username) {
        router.push(`/${userData.username}/dashboard`);
      } else {
        router.push('/');
      }
    }
  }, [user, userData, router]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      setError('');
      setSuccess(false);
      
      await resetPassword(data.email);
      
      setSuccess(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for a link to reset your password.",
        variant: "success"
      });
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to send password reset email. Please check if the email is correct.');
      toast({
        title: "Password reset failed",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left: Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/cloud.png"
          alt="Cloud background"
          fill
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 mix-blend-multiply" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-white">Reset your password</h1>
            <p className="mt-6 text-xl text-white">
              We&apos;ll send you a link to reset your password.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-foreground">Reset your password</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/signin" className="font-medium text-primary hover:text-primary/90">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 border-green-600 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Email sent</AlertTitle>
                <AlertDescription className="text-green-700">
                  Check your email for a link to reset your password.
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="you@example.com" 
                          type="email" 
                          autoComplete="email" 
                          disabled={loading || success}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || success}
                  >
                    {loading ? 'Sending link...' : 'Send reset link'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
