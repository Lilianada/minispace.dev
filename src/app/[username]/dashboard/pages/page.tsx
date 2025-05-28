'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { doc, collection, getDocs, setDoc, deleteDoc, updateDoc, getFirestore } from 'firebase/firestore';
import dynamic from 'next/dynamic';

// Import the rich text editor (client-side only)
const RichTextEditor = dynamic(() => import('../components/RichTextEditor'), { 
  ssr: false,
  loading: () => <div className="animate-pulse p-4 bg-gray-100 rounded-md h-64">Loading editor...</div>
});

// Page types with templates
const PAGE_TEMPLATES = {
  'blank': { title: 'Untitled Page', content: '<p>Add your content here...</p>' },
  'about': { title: 'About Me', content: '<h1>About Me</h1><p>Tell your story here...</p>' },
  'projects': { title: 'My Projects', content: '<h1>Projects</h1><p>Showcase your work...</p>' },
  'contact': { title: 'Contact', content: '<h1>Contact</h1><p>How people can reach you...</p>' },
  'resume': { title: 'Resume', content: '<h1>Resume</h1><p>Your professional experience...</p>' },
  'blog': { title: 'Blog', content: '<h1>Blog</h1><p>Your writing will appear here...</p>' }
};

interface Page {
  id: string;
  title: string;
  content: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export default function ManagePagesPage({ params }: { params: { username: string } }) {
  const { username } = params;
  const { user } = useAuth();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  
  // Check if current user owns this profile
  const isOwner = user?.uid === username;
  
  // Redirect if not the owner
  useEffect(() => {
    if (user && !isOwner) {
      router.push(`/${username}`);
    }
  }, [user, isOwner, router, username]);
  
  // Fetch pages when component mounts
  useEffect(() => {
    const fetchPages = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const db = getFirestore();
        const pagesCollection = collection(db, 'users', username, 'pages');
        const pagesSnapshot = await getDocs(pagesCollection);
        
        const pagesData = pagesSnapshot.docs.map(doc => ({
          id: doc.id,
          slug: doc.id,
          ...doc.data()
        })) as Page[];
        
        setPages(pagesData);
        setError('');
      } catch (err) {
        console.error('Error fetching pages:', err);
        setError('Failed to load pages. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPages();
  }, [user, username]);
  
  // Generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Remove consecutive hyphens
      .trim();
  };
  
  // Create new page
  const createPage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }
    
    const generatedSlug = slug || generateSlug(title);
    
    // Check if slug already exists
    if (pages.some(page => page.slug === generatedSlug)) {
      setError(`A page with slug "${generatedSlug}" already exists`);
      return;
    }
    
    try {
      const db = getFirestore();
      const now = new Date().toISOString();
      
      const newPage: Omit<Page, 'id'> = {
        title,
        content,
        slug: generatedSlug,
        description: description || `${title} - ${username}'s page`,
        createdAt: now,
        updatedAt: now,
        published: isPublished
      };
      
      await setDoc(doc(db, 'users', username, 'pages', generatedSlug), newPage);
      
      // Add to local state
      setPages(prev => [...prev, { ...newPage, id: generatedSlug }]);
      
      // Reset form
      setTitle('');
      setContent('');
      setSlug('');
      setDescription('');
      setShowNewPageForm(false);
      
      // Show success message
      alert('Page created successfully!');
    } catch (err) {
      console.error('Error creating page:', err);
      setError('Failed to create page. Please try again.');
    }
  };
  
  // Update existing page
  const updatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPage || !title || !content) {
      setError('Title and content are required');
      return;
    }
    
    try {
      const db = getFirestore();
      const now = new Date().toISOString();
      
      const updatedPage = {
        title,
        content,
        description: description || `${title} - ${username}'s page`,
        updatedAt: now,
        published: isPublished
      };
      
      await updateDoc(doc(db, 'users', username, 'pages', selectedPage.slug), updatedPage);
      
      // Update local state
      setPages(prev => 
        prev.map(page => 
          page.id === selectedPage.id 
            ? { ...page, ...updatedPage } 
            : page
        )
      );
      
      // Reset form
      setSelectedPage(null);
      setIsEditing(false);
      setTitle('');
      setContent('');
      setDescription('');
      
      // Show success message
      alert('Page updated successfully!');
    } catch (err) {
      console.error('Error updating page:', err);
      setError('Failed to update page. Please try again.');
    }
  };
  
  // Delete page
  const deletePage = async (pageId: string) => {
    if (!window.confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return;
    }
    
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, 'users', username, 'pages', pageId));
      
      // Update local state
      setPages(prev => prev.filter(page => page.id !== pageId));
      
      // If deleting the selected page, reset form
      if (selectedPage?.id === pageId) {
        setSelectedPage(null);
        setIsEditing(false);
      }
      
      // Show success message
      alert('Page deleted successfully!');
    } catch (err) {
      console.error('Error deleting page:', err);
      setError('Failed to delete page. Please try again.');
    }
  };
  
  // Edit page
  const editPage = (page: Page) => {
    setSelectedPage(page);
    setTitle(page.title);
    setContent(page.content);
    setSlug(page.slug);
    setDescription(page.description || '');
    setIsPublished(page.published);
    setIsEditing(true);
    setShowNewPageForm(true);
  };
  
  // Use template
  const useTemplate = (templateKey: keyof typeof PAGE_TEMPLATES) => {
    const template = PAGE_TEMPLATES[templateKey];
    setTitle(template.title);
    setContent(template.content);
    setSlug(generateSlug(template.title));
  };
  
  // Reset form
  const resetForm = () => {
    setTitle('');
    setContent('');
    setSlug('');
    setDescription('');
    setIsPublished(true);
    setSelectedPage(null);
    setIsEditing(false);
    setShowNewPageForm(false);
    setError('');
  };
  
  // Helper component to display theme compatibility info
  const ThemeCompatibilityInfo = () => (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
      <h3 className="text-sm font-medium text-blue-800">Page Layout Compatibility</h3>
      <p className="text-sm text-blue-600">
        For consistent layouts, some page types will display using your default page template. 
        Common pages like <strong>about</strong>, <strong>projects</strong>, and <strong>contact</strong> 
        are fully supported by all themes.
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-green-50 p-2 rounded border border-green-100">
          <span className="font-medium text-green-700">Fully Compatible Pages:</span>
          <ul className="mt-1 text-green-600">
            <li>about - About Me</li>
            <li>projects - Projects</li>
            <li>contact - Contact</li>
            <li>resume - Resume</li>
            <li>blog - Blog</li>
          </ul>
        </div>
        <div className="bg-yellow-50 p-2 rounded border border-yellow-100">
          <span className="font-medium text-yellow-700">Adaptable Pages:</span>
          <p className="mt-1 text-yellow-600">
            Custom pages will render using fallback templates, ensuring consistent layout across your site.
          </p>
        </div>
      </div>
    </div>
  );
  
  // If user is not authenticated or is not the owner, show loading
  if (!user || (user && !isOwner && !isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Pages</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Pages</h2>
              <button
                onClick={() => {
                  resetForm();
                  setShowNewPageForm(!showNewPageForm);
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 dec"
              >
                {showNewPageForm ? 'Cancel' : 'New Page'}
              </button>
            </div>
            
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ) : pages.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p>No pages created yet.</p>
                <button
                  onClick={() => setShowNewPageForm(true)}
                  className="mt-2 text-blue-500 hover:underline"
                >
                  Create your first page
                </button>
              </div>
            ) : (
              <ul className="divide-y">
                {pages.map(page => (
                  <li key={page.id} className="py-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{page.title}</h3>
                        <p className="text-sm text-gray-500">{`/${page.slug}`}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editPage(page)}
                          className="p-1 text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deletePage(page.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center text-xs">
                      <span className={`inline-block rounded-full h-2 w-2 mr-2 ${page.published ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      <span>{page.published ? 'Published' : 'Draft'}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Templates Section */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Page Templates</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(PAGE_TEMPLATES).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => {
                    useTemplate(key as keyof typeof PAGE_TEMPLATES);
                    setShowNewPageForm(true);
                  }}
                  className="p-2 border border-gray-200 rounded hover:bg-gray-50 text-left"
                >
                  <p className="font-medium">{template.title}</p>
                  <p className="text-xs text-gray-500">{key}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Page Editor */}
        {showNewPageForm && (
          <div className="w-full md:w-2/3">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? 'Edit Page' : 'Create New Page'}
              </h2>
              
              <form onSubmit={isEditing ? updatePage : createPage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!isEditing && !slug) {
                        setSlug(generateSlug(e.target.value));
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Page Title"
                    required
                  />
                </div>
                
                {!isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug (URL Path)
                    </label>
                    <div className="flex items-center">
                      <span className="mr-1 text-gray-500">/{username}/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.replace(/\s+/g, '-').toLowerCase())}
                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        placeholder="page-url"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      This will be the URL of your page: {username}.minispace.dev/{slug || 'page-url'}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of this page"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <RichTextEditor 
                    value={content} 
                    onChange={setContent} 
                    placeholder="Page content..."
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="published" className="ml-2 text-sm text-gray-700">
                    Published (page is visible to visitors)
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {isEditing ? 'Update Page' : 'Create Page'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      
      {/* Theme Compatibility Info */}
      <ThemeCompatibilityInfo />
    </div>
  );
}
