import { NextRequest, NextResponse } from 'next/server';
import { getThemeById } from '@/lib/theme-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Theme ID is required' },
        { status: 400 }
      );
    }
    
    // Get the theme
    const theme = await getThemeById(id);
    if (!theme) {
      return NextResponse.json(
        { error: `Theme '${id}' not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(theme);
  } catch (error) {
    console.error('Error in theme API:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
