'use client';

import { useState } from 'react';
import { User, sendEmailVerification } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EmailVerificationProps {
  user: User | null;
}

export function EmailVerification({ user }: EmailVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user email is verified
  const isEmailVerified = user?.emailVerified || false;
  
  const handleSendVerification = async () => {
    if (!user || !user.email) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await sendEmailVerification(user);
      setVerificationSent(true);
    } catch (error) {
      console.error('Error sending verification email:', error);
      setError('Failed to send verification email. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Verification</CardTitle>
        <CardDescription>
          Verify your email address to enhance account security.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isEmailVerified ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Email Verified</AlertTitle>
            <AlertDescription className="text-green-700">
              Your email address has been verified.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive" className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Email Not Verified</AlertTitle>
            <AlertDescription className="text-amber-700">
              Please verify your email address to ensure account security and receive important notifications.
            </AlertDescription>
          </Alert>
        )}
        
        {verificationSent && (
          <Alert className="mt-4 bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Verification Email Sent</AlertTitle>
            <AlertDescription className="text-blue-700">
              A verification email has been sent to {user?.email}. Please check your inbox and follow the instructions.
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      {!isEmailVerified && (
        <CardFooter>
          <Button 
            onClick={handleSendVerification} 
            disabled={isLoading || verificationSent}
          >
            {isLoading ? 'Sending...' : verificationSent ? 'Email Sent' : 'Send Verification Email'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
