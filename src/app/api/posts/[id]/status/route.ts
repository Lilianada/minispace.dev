/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/firestore';
import { auth } from '@/lib/auth';
import { getIdToken } from 'firebase/auth';

/**
 * PATCH handler for /api/posts/[postId]/status endpoint
 * Updates the status of a post (published/draft)
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Extract token from Authorization header
    const token = authHeader.split('Bearer ')[1];
    
    // In a real implementation, you would verify this token with Firebase Admin SDK
    // For simplicity, we'll use the current user from auth
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    const userId = currentUser.uid;
    const { status } = await request.json();
    
    // Validate the status value
    if (status !== 'published' && status !== 'draft') {
      return NextResponse.json(
        { error: 'Invalid status. Must be "published" or "draft".' },
        { status: 400 }
      );
    }
    
    // Update the post status
    const updatedPost = await firestore.posts.updateStatus(userId, postId, status);
    
    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Post not found or you do not have permission to update it' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post status:', error);
    return NextResponse.json(
      { error: 'Failed to update post status' },
      { status: 500 }
    );
  }
}