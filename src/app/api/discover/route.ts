import { NextResponse } from 'next/server';
// Import firestore with a try/catch to handle initialization errors
let firestore;
try {
  firestore = require('@/lib/firebase/firestore').firestore;
} catch (error) {
  console.error('Error importing firestore:', error);
}

/**
 * GET handler for the /api/discover endpoint
 * Returns published posts from all users for discovery
 */
export async function GET(request: Request) {
  try {
    // Check if firestore is initialized
    if (!firestore) {
      return NextResponse.json(
        { error: 'Firestore is not initialized', posts: [], total: 0, totalPages: 0, currentPage: 1 },
        { status: 200 }
      );
    }

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
    // Return an empty result instead of an error
    return NextResponse.json(
      { posts: [], total: 0, totalPages: 0, currentPage: 1 },
      { status: 200 }
    );
  }
}