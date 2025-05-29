'use client';

/**
 * Firebase Database Operations
 * 
 * This component encapsulates common Firebase database operations with 
 * proper error handling and provides UI for data management.
 */

import { useState } from 'react';
import { handleFirebaseOperation } from '@/lib/firebase/error-handler';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Save } from 'lucide-react';
import { WithErrorBoundary } from '@/components/ui/error-boundary-helpers';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface FirebaseDatabaseOperationsProps {
  collectionPath: string;
  documentId?: string;
  initialData?: Record<string, any>;
  onSave?: (data: Record<string, any>) => void;
  onError?: (error: any) => void;
}

export function FirebaseDatabaseOperations({
  collectionPath,
  documentId,
  initialData = {},
  onSave,
  onError
}: FirebaseDatabaseOperationsProps) {
  const [data, setData] = useState<Record<string, string>>(
    Object.entries(initialData || {})
      .filter(([_, value]) => typeof value === 'string')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  
  // Add a new field
  const addField = () => {
    setData(prev => ({
      ...prev,
      [`field_${Object.keys(prev).length + 1}`]: ''
    }));
  };
  
  // Remove a field
  const removeField = (key: string) => {
    setData(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };
  
  // Update a field
  const updateField = (key: string, value: string) => {
    setData(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Save data to Firestore
  const saveData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const result = await handleFirebaseOperation(async () => {
        // This is where you would call your actual Firebase save function
        // For example:
        // const db = getFirestore();
        // if (documentId) {
        //   await updateDoc(doc(db, collectionPath, documentId), data);
        // } else {
        //   await addDoc(collection(db, collectionPath), data);
        // }
        
        // For demo purposes, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate an error for specific inputs
        if (Object.values(data).includes('error')) {
          throw new Error('Data contains invalid values');
        }
        
        return { id: documentId || 'new-doc-id', ...data };
      });
      
      if (result.success) {
        setSuccess(true);
        if (onSave) {
          onSave(result.data);
        }
      } else {
        setError(result.error);
        if (onError) {
          onError(result.error);
        }
      }
    } catch (err) {
      setError(err);
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <WithErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle>
            {documentId ? 'Edit Document' : 'Create Document'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error.message || 'An unknown error occurred'}
                </AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert variant="success" className="bg-green-50 text-green-700 border-green-200">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Document saved successfully
                </AlertDescription>
              </Alert>
            )}
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Collection: <code className="bg-muted px-1 rounded">{collectionPath}</code>
                {documentId && (
                  <> • Document: <code className="bg-muted px-1 rounded">{documentId}</code></>
                )}
              </p>
            </div>
            
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="grid grid-cols-[1fr_auto] gap-2">
                <div className="space-y-1">
                  <Label htmlFor={key}>{key}</Label>
                  <Input 
                    id={key} 
                    value={value} 
                    onChange={(e) => updateField(key, e.target.value)} 
                    disabled={loading} 
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeField(key)}
                  disabled={loading}
                  className="self-end"
                >
                  ✕
                </Button>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              onClick={addField}
              disabled={loading}
              className="w-full"
            >
              Add Field
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={saveData} 
            disabled={loading}
            className="w-full flex items-center gap-2"
          >
            {loading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
            Save Document
          </Button>
        </CardFooter>
      </Card>
    </WithErrorBoundary>
  );
}
