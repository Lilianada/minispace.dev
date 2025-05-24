import { NextRequest, NextResponse } from 'next/server';
import { getAvailableThemes } from '@/lib/theme-service';

export async function GET(request: NextRequest) {
  try {
    const themes = await getAvailableThemes();
    return NextResponse.json(themes);
  } catch (error) {
    console.error('Error listing themes:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
