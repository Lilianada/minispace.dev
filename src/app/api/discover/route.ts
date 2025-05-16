import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/firestore';

/**
 * GET handler for the /api/discover endpoint
 * Returns published posts from all users for discovery
 */
export async function GET(request: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'newest';
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';
    
    // Determine how to fetch posts
    let result;
    
    if (tag) {
      // If a tag is specified, use the tag-specific endpoint
      const posts = await firestore.tags.getPostsByTag(tag);
      
      // Manually handle pagination for tag-filtered results
      const total = posts.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      result = {
        posts: posts.slice(startIndex, endIndex),
        total,
        totalPages,
        currentPage: page
      };
    } else {
      // Otherwise, use the discover endpoint
      result = await firestore.posts.discover({
        page,
        limit,
        status: 'published', // Only published posts for discovery
        search,
        sort
      });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in discover endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch discovery posts' },
      { status: 500 }
    );
  }
}