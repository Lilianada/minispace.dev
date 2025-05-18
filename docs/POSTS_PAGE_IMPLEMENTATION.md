# Posts Page Implementation

This document outlines the implementation of the dashboard posts page in Minispace.

## Architecture

The posts page consists of the following components:

1. **Main Page Component** (`/app/[username]/dashboard/posts/page.tsx`)
   - Simple container that renders the PostsList component

2. **PostsList Component** (`/components/posts-page/PostsList.tsx`)
   - Handles fetching posts with filters and pagination
   - Manages state for posts, loading, errors, and pagination
   - Renders the UI for the posts list, including filters and empty states

3. **PostItem Component** (`/components/posts-page/PostItem.tsx`)
   - Displays individual post items with actions
   - Handles post actions: edit, view, delete, publish/unpublish

4. **PostsFilters Component** (`/components/posts-page/PostFilters.tsx`)
   - Provides UI for filtering and searching posts
   - Handles status filters, sorting options, and search functionality

5. **API Implementation** (`/lib/api/dashboard-posts.ts`)
   - Contains functions for interacting with Firestore
   - Handles fetching, deleting, and updating posts

## Firestore Indexes

The posts page requires several Firestore indexes to support the various filtering and sorting options. These indexes are defined in `firestore.indexes.json`:

```json
{
  "collectionGroup": "posts",
  "queryScope": "COLLECTION",
  "fields": [
    {
      "fieldPath": "authorId",
      "order": "ASCENDING"
    },
    {
      "fieldPath": "createdAt",
      "order": "DESCENDING"
    }
  ]
}
```

Additional indexes are required for:
- Filtering by status and sorting by creation date
- Sorting by title (A-Z and Z-A)
- Sorting by views (most viewed)

## Data Model

The Post interface is defined as:

```typescript
interface Post {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  status: 'published' | 'draft';
  createdAt: any;
  updatedAt: any;
  authorId: string;
  author?: Author;
  tags?: string[];
  slug: string;
  readTime?: number;
  wordCount?: number;
  publishedAt?: string;
  views?: number;
}
```

## Key Features

1. **Filtering and Sorting**
   - Filter posts by status (all, published, draft)
   - Sort posts by newest, oldest, A-Z, Z-A, most viewed

2. **Search**
   - Search posts by title, excerpt, content, or tags

3. **Pagination**
   - Navigate through pages of posts
   - Display total posts and current page information

4. **Post Actions**
   - Edit posts
   - View/preview posts
   - Publish/unpublish posts
   - Delete posts with confirmation

## Error Handling

The implementation includes robust error handling for:
- Authentication errors
- Firestore index errors
- General database errors
- Empty states for no posts found

## Performance Considerations

1. **Efficient Queries**
   - Uses Firestore composite indexes for efficient filtering and sorting
   - Implements pagination to limit the number of documents fetched

2. **Loading States**
   - Shows skeleton loading UI during data fetching
   - Implements timeout handling to prevent indefinite loading states

3. **Client-side Filtering**
   - Uses client-side filtering for search to avoid complex Firestore queries
   - Server-side filtering for status and sorting to leverage indexes

## Future Improvements

Potential improvements for the posts page:
- Implement server-side search with Algolia or Firebase Extensions
- Add batch operations for managing multiple posts
- Implement analytics for post performance
- Add draft autosave functionality
