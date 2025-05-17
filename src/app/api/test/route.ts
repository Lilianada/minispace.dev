import { NextResponse } from 'next/server';
import { getApps } from 'firebase-admin/app';
import { adminDb } from '@/lib/firebase/admin';

export async function GET() {
  try {
    // Check Firebase Admin initialization
    const apps = getApps();
    
    // Try a simple Firestore operation
    let firestoreStatus = 'untested';
    try {
      const testDoc = await adminDb.collection('_test').doc('test').get();
      firestoreStatus = 'working';
    } catch (firestoreError) {
      firestoreStatus = `error: ${firestoreError instanceof Error ? firestoreError.message : String(firestoreError)}`;
    }
    
    // Check environment variables (redacted for security)
    const envStatus = {
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'set' : 'missing',
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? 'set' : 'missing',
      FIREBASE_ADMIN_CREDENTIALS: process.env.FIREBASE_ADMIN_CREDENTIALS ? 'set' : 'missing',
    };
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      adminApps: apps.length,
      firestore: firestoreStatus,
      environment: envStatus,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}