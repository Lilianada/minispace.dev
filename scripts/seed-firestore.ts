import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query
} from 'firebase/firestore';

// Your Firebase config from environment variables or directly
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Post content and seed data is from the previous code

async function seed() {
  try {
    // Clear existing data
    const clearCollection = async (collectionName: string) => {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(query(collectionRef));
      
      const deletePromises = snapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      
      await Promise.all(deletePromises);
      console.log(`Cleared ${snapshot.size} documents from ${collectionName}`);
    };
    
    await clearCollection('posts');
    await clearCollection('users');
    await clearCollection('tags');
    
    // Create default author
    const authorId = 'demo-user';
    await setDoc(doc(db, 'users', authorId), {
      name: 'Demo User',
      email: 'demo@minispace.dev',
      image: 'https://avatars.githubusercontent.com/u/12345678',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Created demo user');
    
    // Create tags
    const tags = [
      'nextjs', 'react', 'tutorial', 'markdown', 'blog', 
      'state-management', 'redux', 'context-api', 'css', 
      'tailwind', 'styling', 'authentication', 'security', 'nextauth'
    ];
    
    for (const tag of tags) {
      await setDoc(doc(db, 'tags', tag), {
        name: tag,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    console.log('Created tags');
    
    // Create posts - reuse the post content from the Prisma seed
    const posts = [
      {
        id: 'post-1',
        title: 'Getting Started with Next.js',
        slug: 'getting-started-with-nextjs',
        content: `# Getting Started with Next.js

Learn how to build modern web applications with Next.js, the React framework for production.

## What is Next.js?

Next.js is a React framework that enables functionality such as server-side rendering, static site generation, and API routes.

## Key Features

- **Server-side Rendering**: Pre-render pages on the server for better performance and SEO
- **Static Site Generation**: Generate static HTML at build time
- **File-based Routing**: Create routes based on the file system
- **API Routes**: Build API endpoints as Node.js serverless functions
- **Built-in CSS Support**: Use CSS Modules, Sass, or any CSS-in-JS solution
- **Fast Refresh**: See changes instantly without losing component state

## Getting Started

To create a new Next.js project, run:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

Then, navigate to your project directory and start the development server:

\`\`\`bash
cd my-app
npm run dev
\`\`\`

Visit http://localhost:3000 to see your application.
`,
        excerpt: 'Learn how to build modern web applications with Next.js',
        status: 'published',
        publishedAt: new Date('2025-04-10T10:00:00Z'),
        createdAt: new Date('2025-04-08T08:00:00Z'),
        updatedAt: new Date('2025-04-12T15:30:00Z'),
        views: 1250,
        authorId: authorId,
        tags: ['nextjs', 'react', 'tutorial']
      },
      {
        id: 'post-2',
        title: 'Building a Blog with Markdown',
        slug: 'building-a-blog-with-markdown',
        content: `# Building a Blog with Markdown and Next.js

In this tutorial, we'll build a high-performance blog using Markdown and Next.js.

## Why Markdown?

Markdown is a lightweight markup language that makes it easy to write and format content. It's widely used by developers and content creators for its simplicity and flexibility.

## Setting Up the Project

First, create a new Next.js project:

\`\`\`bash
npx create-next-app@latest markdown-blog
cd markdown-blog
\`\`\`

## Installing Dependencies

We'll need a few packages to work with Markdown:

\`\`\`bash
npm install gray-matter remark remark-html
\`\`\`

- **gray-matter**: Parse front matter from markdown files
- **remark**: Process markdown content
- **remark-html**: Convert markdown to HTML

## Creating the Blog Structure

Create a \`_posts\` directory in the root of your project to store your markdown files.

\`\`\`bash
mkdir _posts
\`\`\`

## Adding Markdown Content

Create your first post in \`_posts/hello-world.md\`:

\`\`\`markdown
---
title: 'Hello World'
date: '2023-01-01'
---

This is my first blog post using **Markdown** and _Next.js_!
\`\`\`

## Processing Markdown Files

Now let's create a utility function to read and parse markdown files.
`,
        excerpt: 'Create a high-performance blog using Markdown and Next.js',
        status: 'published',
        publishedAt: new Date('2025-03-22T09:15:00Z'),
        createdAt: new Date('2025-03-20T09:00:00Z'),
        updatedAt: new Date('2025-03-25T11:20:00Z'),
        views: 892,
        authorId: authorId,
        tags: ['markdown', 'blog', 'nextjs']
      },
      // Include the remaining posts here
    ];
    
    // Create each post in Firestore
    for (const post of posts) {
      const { id, ...postData } = post;
      await setDoc(doc(db, 'posts', id), postData);
    }
    
    console.log('Created posts');
    console.log('Database has been seeded!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seed function
seed().then(() => process.exit(0));