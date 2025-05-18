import { Post } from '../src/lib/api/dashboard-posts';

export const mockPosts: Post[] = [
  {
    id: 'mock-1',
    title: 'Getting Started with Minispace: A Beginner\'s Guide',
    excerpt: 'Learn how to set up your Minispace profile, create your first post, and connect with other users in this comprehensive guide for beginners.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.',
    authorId: 'user1',
    author: {
      username: 'johndoe',
      displayName: 'John Doe'
    },
    tags: ['minispace', 'guide', 'beginner'],
    wordCount: 203,
    readTime: 2,
    createdAt: new Date(2025, 4, 10).toISOString(),
    updatedAt: new Date(2025, 4, 10).toISOString(),
    status: 'published',
    slug: 'getting-started-with-minispace-a-beginners-guide',
    views: 0
  },
  {
    id: 'mock-2',
    title: 'How to Write Engaging Content That Readers Love',
    excerpt: 'Discover proven techniques for creating content that captivates your audience and keeps them coming back for more.',
    content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.',
    authorId: 'user2',
    author: {
      username: 'janedoe',
      displayName: 'Jane Doe'
    },
    tags: ['writing', 'content', 'blog'],
    wordCount: 275,
    readTime: 2,
    createdAt: new Date(2025, 4, 12).toISOString(),
    updatedAt: new Date(2025, 4, 15).toISOString(),
    status: 'published',
    slug: 'how-to-write-engaging-content-that-readers-love',
    views: 0
  },
  {
    id: 'mock-3',
    title: 'The Future of Personal Blogging in 2025',
    excerpt: 'An analysis of current trends and predictions for how personal blogging will evolve in the coming years.',
    content: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi.',
    authorId: 'user3',
    author: {
      username: 'techguru',
      displayName: 'Tech Guru'
    },
    tags: ['blogging', 'future', 'trends'],
    wordCount: 171,
    readTime: 1,
    createdAt: new Date(2025, 4, 5).toISOString(),
    updatedAt: new Date(2025, 4, 5).toISOString(),
    status: 'published',
    slug: 'the-future-of-personal-blogging-in-2025',
    views: 0
  },
  {
    id: 'mock-4',
    title: 'Minimalism in Web Design: Less is More',
    excerpt: 'Explore how minimalist principles can improve user experience and engagement on your personal website or blog.',
    content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
    authorId: 'user4',
    author: {
      username: 'designpro',
      displayName: 'Design Pro'
    },
    tags: ['design', 'minimalism', 'ux'],
    wordCount: 258,
    readTime: 2,
    createdAt: new Date(2025, 4, 1).toISOString(),
    updatedAt: new Date(2025, 4, 2).toISOString(),
    status: 'published',
    slug: 'minimalism-in-web-design-less-is-more',
    views: 0
  },
  {
    id: 'mock-5',
    title: 'Building a Community Around Your Content',
    excerpt: 'Learn strategies for fostering engagement and building a loyal community of readers who interact with your content.',
    content: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
    authorId: 'user5',
    author: {
      username: 'communitybuilder',
      displayName: 'Community Builder'
    },
    tags: ['community', 'engagement', 'content'],
    wordCount: 217,
    readTime: 2,
    createdAt: new Date(2025, 3, 28).toISOString(),
    updatedAt: new Date(2025, 3, 30).toISOString(),
    status: 'published',
    slug: 'building-a-community-around-your-content',
    views: 0
  }
];