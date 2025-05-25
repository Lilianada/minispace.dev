import { NextResponse } from 'next/server';
import { adminAuth, adminDb, getAuthUser } from '@/lib/firebase/admin';

/**
 * GET handler for /api/user/theme-settings endpoint
 * Retrieves user's theme settings from Firestore
 */
export async function GET(request: Request) {
  try {
    // Check if Firebase Admin is available
    if (!adminAuth || !adminDb) {
      return NextResponse.json({
        success: false,
        message: 'Firebase Admin not initialized',
        error: 'Service unavailable'
      }, { status: 503 });
    }

    // Get authenticated user
    const authUser = await getAuthUser(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = authUser.uid;

    try {
      // Get user's theme settings from Firestore
      const themeSettingsRef = adminDb.doc(`Users/${userId}/userSettings/theme`);
      const themeSettingsDoc = await themeSettingsRef.get();

      if (!themeSettingsDoc.exists) {
        // Return default theme settings if none exist
        return NextResponse.json({
          themeId: 'altay',
          themeName: 'Altay',
          themeCategory: 'personal',
          settings: {},
          updatedAt: new Date().toISOString()
        });
      }

      const themeData = themeSettingsDoc.data();
      return NextResponse.json(themeData);
    } catch (error) {
      console.error('Error fetching theme settings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch theme settings' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in GET /api/user/theme-settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for /api/user/theme-settings endpoint
 * Saves user's theme settings to Firestore
 */
export async function POST(request: Request) {
  try {
    // Check if Firebase Admin is available
    if (!adminAuth || !adminDb) {
      return NextResponse.json({
        success: false,
        message: 'Firebase Admin not initialized',
        error: 'Service unavailable'
      }, { status: 503 });
    }

    // Get authenticated user
    const authUser = await getAuthUser(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = authUser.uid;

    // Parse request body
    const data = await request.json();

    // Validate required fields
    if (!data.themeId) {
      return NextResponse.json(
        { error: 'themeId is required' },
        { status: 400 }
      );
    }

    try {
      // Prepare theme settings data
      const themeSettingsData = {
        themeId: data.themeId,
        themeName: data.themeName || data.themeId,
        themeCategory: data.themeCategory || 'personal',
        settings: data.settings || {},
        updatedAt: new Date().toISOString()
      };

      // Save to Firestore
      const themeSettingsRef = adminDb.doc(`Users/${userId}/userSettings/theme`);
      await themeSettingsRef.set(themeSettingsData, { merge: true });

      console.log(`Theme settings saved for user ${userId}:`, themeSettingsData);

      return NextResponse.json({
        success: true,
        message: 'Theme settings saved successfully',
        data: themeSettingsData
      });
    } catch (error) {
      console.error('Error saving theme settings to Firestore:', error);
      return NextResponse.json(
        { error: 'Failed to save theme settings' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/user/theme-settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}