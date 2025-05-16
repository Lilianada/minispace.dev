/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/firestore';

/**
 * GET handler for /api/posts endpoint
 */
export async function GET(request: Request) {
  // Get URL to parse search params
  const { searchParams } = new URL(request.url);
  
  // Parse query parameters
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const status = searchParams.get('status') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';
  
  try {
    // Use Firestore to fetch posts
    const result = await firestore.posts.getAll({
      page,
      limit,
      status,
      search,
      sort
    });
    
    // Return response
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for /api/posts endpoint
 * Creates a new post
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, excerpt, status, tags } = body;
    
    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    // Create a new post using Firestore
    const post = await firestore.posts.create({
      title,
      content,
      excerpt,
      status,
      tags
    });
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}