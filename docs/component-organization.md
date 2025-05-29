# Component Organization Guidelines

This document outlines the standardized component organization pattern for the Minispace.dev project.

## Directory Structure

Components are organized into three main categories:

```
src/
  ├── components/
  │   ├── common/        # Shared components used across multiple features
  │   ├── features/      # Feature-specific components
  │   └── ui/            # Base UI components (buttons, cards, etc.)
  ├── layouts/           # Layout components used across pages
  └── app/               # Next.js app router pages
```

## Component Categories

### UI Components (`/components/ui`)

Basic UI building blocks following design system principles. These components:
- Are the most reusable components
- Are not tied to specific business logic
- Focus purely on presentation
- Accept data and callbacks via props

Examples:
- Button, Card, Input, Modal, etc.

### Common Components (`/components/common`) 

Reusable components shared across multiple features. These components:
- May contain business logic
- Can use hooks and context
- Are used in multiple features
- Can compose UI components

Examples:
- UserAvatar, NavigationBar, Footer, etc.

### Feature Components (`/components/features`)

Components specific to a particular feature area. These components:
- Are organized in subdirectories by feature
- Contain feature-specific business logic
- Can use hooks and context
- Can compose UI and common components

Examples:
- `/components/features/posts/PostList.tsx`
- `/components/features/dashboard/ActivityFeed.tsx`
- `/components/features/auth/SignupForm.tsx`

## Component Naming Conventions

- Use PascalCase for component files and function names
- Be descriptive but concise
- Use consistent prefixes within feature areas

## Code Organization Within Components

1. Import statements
2. Type definitions and interfaces
3. Component function
4. Helper functions (if small)
5. Export statement

## State Management Guidelines

- Use React hooks for component-level state
- Use Context for sharing state across components in a feature
- Consider using composition over deep prop drilling
- Keep state as close as possible to where it's needed

## Example Component

```tsx
// filepath: src/components/features/posts/PostCard.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/common/UserAvatar';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Post } from '@/types/posts';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  
  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };
  
  return (
    <Card className="my-4 p-4">
      <div className="flex items-center mb-3">
        <UserAvatar user={post.author} size="sm" />
        <div className="ml-3">
          <h3 className="font-medium">{post.author.displayName}</h3>
          <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
        </div>
      </div>
      
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      
      <div className={isExpanded ? 'mb-4' : 'mb-4 line-clamp-3'}>
        {post.content}
      </div>
      
      {post.content.length > 200 && (
        <Button variant="ghost" onClick={toggleExpand}>
          {isExpanded ? 'Show less' : 'Read more'}
        </Button>
      )}
      
      <div className="flex justify-between mt-4">
        <Button 
          variant="outline"
          onClick={() => onLike(post.id)}
          disabled={!user}
        >
          Like ({post.likes})
        </Button>
      </div>
    </Card>
  );
}
```
