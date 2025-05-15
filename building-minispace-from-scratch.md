# Building Minispace: A Bear Blog Alternative

This guide provides step-by-step instructions for building Minispace from scratch. The goal is to create a blazing-fast blogging platform similar to Bear Blog, but with enhanced features and better UI/UX.

## Step 1: Project Setup (1-2 days)

### 1.1 Initialize the Next.js Project

```bash
# Create a new Next.js project with App Router
mkdir minispace
cd minispace
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir

# Install essential dependencies
npm install firebase firebase-admin
npm install lucide-react @radix-ui/react-icons
npm install next-themes @vercel/analytics
npm install nanoid slugify date-fns
```

### 1.2 Create Basic Project Structure

```
src/
  app/
    layout.tsx           # Root layout with theme provider
    page.tsx             # Landing page
    [username]/          # Dynamic routes for blogs
      page.tsx           # User blog home
      [slug]/            # Dynamic routes for blog posts
        page.tsx         # Individual blog post
    dashboard/           # Admin dashboard
    api/                 # API routes
  components/            # UI components
  lib/                   # Utilities and services
```

### 1.3 Set Up Firebase

```bash
# Setup Firebase project
npm install -g firebase-tools
firebase login
firebase init
```

Create a Firebase configuration file:

```tsx
// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let auth;
let db;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  // Set longer persistence
  if (typeof window !== "undefined") {
    setPersistence(auth, browserLocalPersistence);
  }
  db = getFirestore(app);
}

export { app, auth, db };
```

Create Firebase admin configuration:

```tsx
// src/lib/firebase-admin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
function initAdmin() {
  if (!getApps().length) {
    // Decode Firebase admin credentials
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_ADMIN_CREDENTIALS || '', 'base64').toString()
    );
    
    initializeApp({
      credential: cert(serviceAccount),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
  }
  
  return {
    db: getFirestore(),
    auth: getAuth(),
  };
}

export const getAdminApp = initAdmin;
```

### 1.4 Set Up Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_ADMIN_CREDENTIALS=your_base64_encoded_admin_credentials
```

## Step 2: Authentication System (2-3 days)

### 2.1 Create Authentication Context

```tsx
// src/lib/auth-context.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type AuthContextType = {
  user: User | null;
  userData: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'Users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Signup function
  const signup = async (email: string, username: string, password: string) => {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, 'Users', user.uid), {
      uid: user.uid,
      email,
      username,
      displayName: username,
      createdAt: new Date(),
      updatedAt: new Date(),
      enableBlog: true,
      blogSettings: {
        title: username,
        description: "",
        footerText: `© ${new Date().getFullYear()} ${username}`,
        navStyle: "minimal",
        showDates: true,
        showTags: true,
        defaultLayout: "stream"
      },
      stylePreferences: {
        fontFamily: "system-ui",
        fontSize: "16px",
        textColor: "#000000",
        backgroundColor: "#ffffff",
        accentColor: "#3b82f6"
      }
    });
  };

  // Logout function
  const logout = async () => {
    await signOut(auth);
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, login, signup, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 2.2 Create Login and Signup Pages

```tsx
// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Login to Minispace</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        
        <div className="mt-6 text-center">
          <p>
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

Create similar pages for signup and password reset.

### 2.3 Create Authentication Middleware

```tsx
// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  // Get path and URL
  const path = request.nextUrl.pathname;
  
  // List of paths that require authentication
  const protectedPaths = ["/dashboard"];
  
  // List of paths for non-authenticated users
  const authPaths = ["/login", "/signup", "/forgot-password"];
  
  // Check for auth cookie
  const sessionCookie = request.cookies.get("session");
  const isAuthenticated = !!sessionCookie?.value;
  
  // Handle protected routes
  if (protectedPaths.some(pp => path.startsWith(pp)) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  // Handle login/signup pages when already authenticated
  if (authPaths.some(ap => path === ap) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/forgot-password"],
};
```

## Step 3: Database Schema and Core Functionality (3-4 days)

### 3.1 Define Database Schema

```typescript
// User schema
interface User {
  uid: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  enableBlog: boolean;
  customDomain?: string;
  blogSettings: {
    title: string;
    description: string;
    footerText: string;
    navStyle: 'minimal' | 'centered' | 'sidebar';
    showDates: boolean;
    showTags: boolean;
    defaultLayout: string;
  };
  stylePreferences: {
    fontFamily: string;
    fontSize: string;
    textColor: string;
    backgroundColor: string;
    accentColor: string;
  };
  socialLinks?: Record<string, string>;
  theme?: string;
}

// Post schema
interface Post {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// Page schema
interface Page {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  content: string;
  layout: string;
  isHomePage: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.2 Create Data Service Layer

```typescript
// src/lib/services/blog-service.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// Get all posts for a user
export async function getUserPosts(userId: string, includeUnpublished = false) {
  const postsQuery = query(
    collection(db, "Articles"),
    where("authorId", "==", userId),
    includeUnpublished ? where("published", "in", [true, false]) : where("published", "==", true),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(postsQuery);
  
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Get a single post by slug
export async function getPostBySlug(userId: string, slug: string) {
  const postsQuery = query(
    collection(db, "Articles"),
    where("authorId", "==", userId),
    where("slug", "==", slug)
  );

  const querySnapshot = await getDocs(postsQuery);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  };
}

// Create a new post
export async function createPost(post) {
  return addDoc(collection(db, "Articles"), {
    ...post,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// Update a post
export async function updatePost(postId, data) {
  const postRef = doc(db, "Articles", postId);
  return updateDoc(postRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete a post
export async function deletePost(postId) {
  const postRef = doc(db, "Articles", postId);
  return deleteDoc(postRef);
}
```

Create similar service files for pages and users.

### 3.3 Create Core UI Components

```tsx
// src/components/ui/button.tsx
// Create reusable UI components using shadcn/ui approach
// or build your own component library

// Example button component
import { forwardRef } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    // Define styles based on variant and size
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
    
    const variantStyles = {
      primary: "bg-primary text-white hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-input hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    };
    
    const sizeStyles = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-6 text-lg",
    };
    
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ""}`;
    
    return (
      <button className={combinedClassName} ref={ref} disabled={isLoading} {...props}>
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
```

## Step 4: Blog Frontend - The Static Optimized Blog (3-4 days)

### 4.1 Create User Blog Page

```tsx
// src/app/[username]/page.tsx
import { notFound } from "next/navigation";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { unstable_cache } from "next/cache";

// Cache user data fetch
const getUserByUsername = unstable_cache(
  async (username) => {
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const userDoc = querySnapshot.docs[0];
    return {
      id: userDoc.id,
      ...userDoc.data(),
    };
  },
  ["user-by-username"],
  { revalidate: 3600 } // Revalidate every hour
);

// Cache blog post fetch
const getUserPosts = unstable_cache(
  async (userId) => {
    const postsRef = collection(db, "Articles");
    const q = query(
      postsRef,
      where("authorId", "==", userId),
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
  ["user-posts"],
  { revalidate: 3600 } // Revalidate every hour
);

// Generate static params for all users
export async function generateStaticParams() {
  const usersRef = collection(db, "Users");
  const querySnapshot = await getDocs(usersRef);
  
  return querySnapshot.docs.map(doc => ({
    username: doc.data().username,
  }));
}

export default async function UserBlog({ params }) {
  const { username } = params;
  
  // Get user data
  const user = await getUserByUsername(username);
  
  if (!user) {
    notFound();
  }
  
  // Get blog posts
  const posts = await getUserPosts(user.id);
  
  // Find homepage if set
  const homePagePost = posts.find(post => post.isHomePage);
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{user.blogSettings?.title || user.username}</h1>
        {user.blogSettings?.description && (
          <p className="mt-2 text-gray-600">{user.blogSettings.description}</p>
        )}
      </header>
      
      <main>
        {homePagePost ? (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: homePagePost.content }} />
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map(post => (
              <article key={post.id} className="border-b pb-6">
                <h2 className="text-2xl font-semibold">
                  <a href={`/${username}/${post.slug}`} className="hover:underline">
                    {post.title}
                  </a>
                </h2>
                {post.excerpt && <p className="mt-2">{post.excerpt}</p>}
                <div className="mt-4 text-sm text-gray-500">
                  {new Date(post.createdAt.seconds * 1000).toLocaleDateString()}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      
      <footer className="mt-12 pt-6 border-t text-center text-sm text-gray-500">
        {user.blogSettings?.footerText || `© ${new Date().getFullYear()} ${user.username}`}
      </footer>
    </div>
  );
}
```

### 4.2 Create Blog Post Page

```tsx
// src/app/[username]/[slug]/page.tsx
import { notFound } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { unstable_cache } from "next/cache";

// Cache post fetch with username and slug
const getPostBySlug = unstable_cache(
  async (username, slug) => {
    // First get user ID
    const usersRef = collection(db, "Users");
    const userQuery = query(usersRef, where("username", "==", username));
    const userSnapshot = await getDocs(userQuery);
    
    if (userSnapshot.empty) {
      return null;
    }
    
    const userId = userSnapshot.docs[0].id;
    
    // Then get the post
    const postsRef = collection(db, "Articles");
    const postQuery = query(
      postsRef,
      where("authorId", "==", userId),
      where("slug", "==", slug),
      where("published", "==", true)
    );
    
    const postSnapshot = await getDocs(postQuery);
    
    if (postSnapshot.empty) {
      return null;
    }
    
    const postDoc = postSnapshot.docs[0];
    return {
      id: postDoc.id,
      ...postDoc.data(),
      user: {
        username,
        displayName: userSnapshot.docs[0].data().displayName,
      }
    };
  },
  ["post-by-slug"],
  { revalidate: 3600 } // Revalidate every hour
);

// Generate static params for all published posts
export async function generateStaticParams() {
  const postsRef = collection(db, "Articles");
  const publishedQuery = query(postsRef, where("published", "==", true));
  const postsSnapshot = await getDocs(publishedQuery);
  
  const paths = [];
  
  // For each post, get the username and slug
  for (const postDoc of postsSnapshot.docs) {
    const post = postDoc.data();
    
    const usersRef = collection(db, "Users");
    const userQuery = query(usersRef, where("uid", "==", post.authorId));
    const userSnapshot = await getDocs(userQuery);
    
    if (!userSnapshot.empty) {
      paths.push({
        username: userSnapshot.docs[0].data().username,
        slug: post.slug,
      });
    }
  }
  
  return paths;
}

export default async function BlogPost({ params }) {
  const { username, slug } = params;
  
  // Get the post data
  const post = await getPostBySlug(username, slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <article className="prose max-w-none">
        <h1>{post.title}</h1>
        <div className="text-sm text-gray-500 mb-6">
          {post.publishedAt?.seconds ? new Date(post.publishedAt.seconds * 1000).toLocaleDateString() : 
            post.createdAt?.seconds ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : ''}
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
      
      <div className="mt-12 pt-6 border-t">
        <a href={`/${username}`} className="text-blue-600 hover:underline">
          &larr; Back to {post.user.displayName}'s blog
        </a>
      </div>
    </div>
  );
}
```

### 4.3 Create Minimal CSS

For optimal performance, create a minimal CSS approach using system fonts and efficient styling.

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
              "Helvetica Neue", Arial, sans-serif;
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
  font-family: var(--font-sans);
}

/* Base blog styles */
.prose {
  max-width: 65ch;
  line-height: 1.6;
}

.prose h1 {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.prose h2 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose p {
  margin-bottom: 1.25rem;
}

.prose ul, .prose ol {
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose a {
  color: #3b82f6;
  text-decoration: underline;
}

.prose blockquote {
  border-left: 3px solid #e5e7eb;
  padding-left: 1rem;
  font-style: italic;
  margin: 1.5rem 0;
}

.prose code {
  font-family: monospace;
  background-color: #f3f4f6;
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.9em;
}

.prose pre {
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}
```

## Step 5: Dashboard / Admin UI (4-5 days)

### 5.1 Create Dashboard Layout

```tsx
// src/components/dashboard/dashboard-shell.tsx
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Sidebar } from "@/components/sidebar";

interface DashboardShellProps {
  children: ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1">
        <header className="h-14 border-b flex items-center justify-between px-6">
          <div className="flex items-center">
            <Link href="/dashboard" className="font-bold text-lg">
              Minispace
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm">{user.email}</span>
                <button
                  onClick={() => logout()}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
        
        <main>{children}</main>
      </div>
    </div>
  );
}
```

### 5.2 Create Post Editor

```tsx
// src/app/dashboard/posts/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { updatePost } from "@/lib/services/blog-service";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import MarkdownEditor from "@/components/markdown-editor";

export default function EditPost() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [published, setPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        
        const postDoc = await getDoc(doc(db, "Articles", id));
        
        if (!postDoc.exists()) {
          setError("Post not found");
          return;
        }
        
        const postData = postDoc.data();
        
        // Check if user owns this post
        if (postData.authorId !== user?.uid) {
          setError("You don't have permission to edit this post");
          return;
        }
        
        setTitle(postData.title || "");
        setSlug(postData.slug || "");
        setContent(postData.content || "");
        setExcerpt(postData.excerpt || "");
        setPublished(postData.published || false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Error loading post");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchPost();
    }
  }, [id, router, user, loading]);
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      await updatePost(id, {
        title,
        slug,
        content,
        excerpt,
        published,
      });
      
      router.push("/dashboard/posts");
    } catch (error) {
      console.error("Error saving post:", error);
      setError("Error saving post");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <DashboardShell>
        <div className="container py-6">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </DashboardShell>
    );
  }
  
  if (error) {
    return (
      <DashboardShell>
        <div className="container py-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </DashboardShell>
    );
  }
  
  return (
    <DashboardShell>
      <div className="container py-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Edit Post</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/dashboard/posts")}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full border rounded-md px-3 py-2"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <MarkdownEditor value={content} onChange={setContent} />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="published">Published</label>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
```

Create similar pages for creating new posts and listing posts.

### 5.3 Create Settings Pages

```tsx
// src/app/dashboard/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function SettingsPage() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  
  // Site settings state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [footerText, setFooterText] = useState("");
  const [navStyle, setNavStyle] = useState("minimal");
  const [showDates, setShowDates] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    
    if (userData) {
      // Load blog settings
      setTitle(userData.blogSettings?.title || userData.username || "");
      setDescription(userData.blogSettings?.description || "");
      setFooterText(userData.blogSettings?.footerText || `© ${new Date().getFullYear()}`);
      setNavStyle(userData.blogSettings?.navStyle || "minimal");
      setShowDates(userData.blogSettings?.showDates !== false);
      setShowTags(userData.blogSettings?.showTags !== false);
    }
  }, [user, userData, router, loading]);
  
  const handleSaveSettings = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Update user document in Firestore
      const userDoc = doc(db, "Users", user.uid);
      await updateDoc(userDoc, {
        blogSettings: {
          title,
          description,
          footerText,
          navStyle,
          showDates,
          showTags,
          updatedAt: new Date(),
        },
      });
      
      // Show success message
      alert("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading) {
    return (
      <DashboardShell>
        <div className="container py-6">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-40 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </DashboardShell>
    );
  }
  
  return (
    <DashboardShell>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-sm font-medium mb-1">Blog Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border rounded-md px-3 py-2"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Footer Text</label>
                <input
                  type="text"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Navigation Style</label>
                <select
                  value={navStyle}
                  onChange={(e) => setNavStyle(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="minimal">Minimal</option>
                  <option value="centered">Centered</option>
                  <option value="sidebar">Sidebar</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showDates"
                  checked={showDates}
                  onChange={(e) => setShowDates(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="showDates">Show dates on posts</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showTags"
                  checked={showTags}
                  onChange={(e) => setShowTags(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="showTags">Show tags on posts</label>
              </div>
              
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </TabsContent>
          
          {/* Add other tabs for appearance and integrations */}
        </Tabs>
      </div>
    </DashboardShell>
  );
}
```

Add additional settings pages for appearance, account settings, etc.

## Step 6: Optimization and Performance (4-5 days)

### 6.1 Setup Static Generation

Extend the static generation capabilities to cover more pages and optimize revalidation strategies.

### 6.2 Implement Server Components

Convert more components to server components where possible to reduce client-side JavaScript.

### 6.3 Add Edge Middleware

Implement edge middleware for authentication, caching, and routing to improve performance.

### 6.4 Optimize Images and Assets

Use Next.js Image component with proper optimization settings.

### 6.5 Implement Code Splitting

Add dynamic imports for non-critical components.

## Step 7: Advanced Features (3-4 days)

### 7.1 Add Custom Domain Support

Create functionality for users to connect custom domains.

### 7.2 Implement Analytics

Add server-side analytics tracking with a lightweight dashboard.

### 7.3 Create SEO Features

Add SEO optimization tools and structured data support.

### 7.4 Add Theme System

Create a themeable blog system with multiple layout options.

## Step 8: Testing and Measurement (2-3 days)

### 8.1 Implement Core Web Vitals Tracking

Add monitoring for performance metrics.

### 8.2 Set Up Performance Testing

Create automated tests for performance benchmarking.

### 8.3 Add User Feedback System

Create ways for users to provide feedback on the platform.

## Step 9: Launch Preparation (2-3 days)

### 9.1 Finalize Documentation

Create comprehensive documentation for users.

### 9.2 Setup Continuous Integration

Add CI/CD pipeline for automated testing and deployment.

### 9.3 Final Performance Review

Conduct a final performance review and optimization.

## Step 10: Launch (1 day)

Deploy the application and make it publicly available.

---

By following this step-by-step guide, you'll create a high-performance blogging platform that rivals Bear Blog in speed while offering enhanced features and a better user experience. The focus on performance first, with incremental feature additions, ensures that the core blogging experience remains fast and reliable even as you add more advanced functionality.

Remember to measure performance at each step to ensure you're maintaining Bear Blog's level of optimization even as you add more features.
