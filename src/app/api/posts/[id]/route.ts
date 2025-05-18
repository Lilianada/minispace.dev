import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/firestore';
import { auth } from '@/lib/auth';
import { getIdToken } from 'firebase/auth';

/**
 * GET handler for /api/posts/[postId] endpoint
 */
export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params.postId;
    
    // Use findById to get the post without needing to know the userId
    const post = await firestore.posts.findById(postId);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for /api/posts/[postId] endpoint
 */
export async function PUT(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params.postId;
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Extract token from Authorization header
    const token = authHeader.split('Bearer ')[1];
    
    // Verify the token and get the user ID
    // In a real implementation, you would verify this token with Firebase Admin SDK
    // For now, we'll extract the user ID from the request body
    const body = await request.json();
    const userId = body.authorId;
    
    // Update the post
    const updatedPost = await firestore.posts.update(userId, postId, body);
    
    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Post not found or you do not have permission to edit it' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for /api/posts/[postId] endpoint
 */
export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params.postId;
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
    // and extract the user ID from the token
    // For simplicity, we'll use the current user from auth
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    const userId = currentUser.uid;
    
    // Delete the post
    const deletedPost = await firestore.posts.delete(userId, postId);
    
    if (!deletedPost) {
      return NextResponse.json(
        { error: 'Post not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      deletedPost
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}