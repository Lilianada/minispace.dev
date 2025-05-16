/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/firestore';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

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
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id as string;
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