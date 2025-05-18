'use client';

import { useState } from 'react';
import { doc, setDoc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export interface Page {
  slug: string;
  title: string;
  blocks: any[];
}

interface PageManagerProps {
  pages: Record<string, Page>;
  userId: string;
  activePage: string | null;
  onPageChange: (pageSlug: string) => void;
  onPagesUpdated: (pages: Record<string, Page>) => void;
}

export default function PageManager({ 
  pages, 
  userId, 
  activePage, 
  onPageChange, 
  onPagesUpdated 
}: PageManagerProps) {
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [isDeletingPage, setIsDeletingPage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  };

  // Handle title change and auto-generate slug
  const handleTitleChange = (title: string) => {
    setNewPageTitle(title);
    setNewPageSlug(generateSlug(title));
  };

  // Create a new page
  const handleCreatePage = async () => {
    if (!newPageTitle.trim()) {
      setError('Page title is required');
      return;
    }

    if (!newPageSlug.trim()) {
      setError('Page slug is required');
      return;
    }

    if (pages[newPageSlug]) {
      setError('A page with this slug already exists');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const siteCustomizationRef = doc(db, 'Users', userId, 'siteCustomization', 'pages');
      
      // Check if the document exists
      const docSnap = await getDoc(siteCustomizationRef);
      
      const newPage = {
        slug: newPageSlug,
        title: newPageTitle,
        blocks: []
      };
      
      if (!docSnap.exists()) {
        // Create new document with initial page
        await setDoc(siteCustomizationRef, {
          pages: {
            [newPageSlug]: newPage
          }
        });
      } else {
        // Update existing document with new page
        await updateDoc(siteCustomizationRef, {
          [`pages.${newPageSlug}`]: newPage
        });
      }
      
      // Update local state
      const updatedPages = {
        ...pages,
        [newPageSlug]: newPage
      };
      
      onPagesUpdated(updatedPages);
      onPageChange(newPageSlug);
      
      // Reset form
      setNewPageTitle('');
      setNewPageSlug('');
      setIsAddingPage(false);
    } catch (error) {
      console.error('Error creating page:', error);
      setError('Failed to create page. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a page
  const handleDeletePage = async () => {
    if (!activePage || !pages[activePage]) return;
    
    setIsLoading(true);
    
    try {
      const siteCustomizationRef = doc(db, 'Users', userId, 'siteCustomization', 'pages');
      
      // Remove the page using deleteField()
      await updateDoc(siteCustomizationRef, {
        [`pages.${activePage}`]: deleteField()
      });
      
      // Update local state
      const updatedPages = { ...pages };
      delete updatedPages[activePage];
      
      onPagesUpdated(updatedPages);
      
      // Select another page if available, otherwise null
      const remainingPageSlugs = Object.keys(updatedPages);
      if (remainingPageSlugs.length > 0) {
        onPageChange(remainingPageSlugs[0]);
      } else {
        // If no pages remain, we can't select any page
        // Pass empty string instead of null to avoid type error
        onPageChange('');
      }
      
      setIsDeletingPage(false);
    } catch (error) {
      console.error('Error deleting page:', error);
      setError('Failed to delete page. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Edit page title/slug
  const handleEditPage = async () => {
    if (!activePage || !pages[activePage]) return;
    if (!newPageTitle.trim()) {
      setError('Page title is required');
      return;
    }
    
    if (!newPageSlug.trim()) {
      setError('Page slug is required');
      return;
    }
    
    if (newPageSlug !== activePage && pages[newPageSlug]) {
      setError('A page with this slug already exists');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const siteCustomizationRef = doc(db, 'Users', userId, 'siteCustomization', 'pages');
      
      const updatedPage = {
        ...pages[activePage],
        slug: newPageSlug,
        title: newPageTitle
      };
      
      // If slug changed, we need to delete the old entry and create a new one
      if (newPageSlug !== activePage) {
        // Create transaction to ensure atomicity
        await updateDoc(siteCustomizationRef, {
          [`pages.${newPageSlug}`]: updatedPage,
          [`pages.${activePage}`]: deleteField()
        });
        
        // Update local state
        const updatedPages = { ...pages };
        delete updatedPages[activePage];
        updatedPages[newPageSlug] = updatedPage;
        
        onPagesUpdated(updatedPages);
        onPageChange(newPageSlug);
      } else {
        // Just update the title
        await updateDoc(siteCustomizationRef, {
          [`pages.${activePage}.title`]: newPageTitle
        });
        
        // Update local state
        const updatedPages = {
          ...pages,
          [activePage]: {
            ...pages[activePage],
            title: newPageTitle
          }
        };
        
        onPagesUpdated(updatedPages);
      }
      
      setIsEditingPage(false);
    } catch (error) {
      console.error('Error updating page:', error);
      setError('Failed to update page. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startEditPage = () => {
    if (!activePage || !pages[activePage]) return;
    
    setNewPageTitle(pages[activePage].title);
    setNewPageSlug(pages[activePage].slug);
    setIsEditingPage(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Your Pages</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAddingPage(true)}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Page
        </Button>
      </div>
      
      <div className="space-y-2">
        {Object.values(pages).length === 0 ? (
          <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
            No pages yet. Create your first page to get started.
          </div>
        ) : (
          Object.values(pages).map((page) => (
            <div 
              key={page.slug}
              className="flex items-center justify-between"
            >
              <button
                onClick={() => onPageChange(page.slug)}
                className={`flex-1 text-left px-3 py-2 rounded-md ${
                  activePage === page.slug 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-secondary'
                }`}
              >
                {page.title}
              </button>
              
              {activePage === page.slug && (
                <div className="flex space-x-1 ml-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={startEditPage}
                    className="h-8 w-8"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsDeletingPage(true)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Add Page Dialog */}
      <Dialog open={isAddingPage} onOpenChange={setIsAddingPage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Page</DialogTitle>
            <DialogDescription>
              Create a new page for your site. The slug will be used in the URL.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Page Title
              </label>
              <Input
                id="title"
                value={newPageTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. About Me"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">
                Page Slug
              </label>
              <Input
                id="slug"
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
                placeholder="e.g. about-me"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                This will be used in the URL: username.minispace.dev/{newPageSlug || 'page-slug'}
              </p>
            </div>
            
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingPage(false);
                setError(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePage}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Page'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Page Dialog */}
      <Dialog open={isEditingPage} onOpenChange={setIsEditingPage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
            <DialogDescription>
              Update the title or slug for this page.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-sm font-medium">
                Page Title
              </label>
              <Input
                id="edit-title"
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-slug" className="text-sm font-medium">
                Page Slug
              </label>
              <Input
                id="edit-slug"
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Warning: Changing the slug will change the URL of this page.
              </p>
            </div>
            
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditingPage(false);
                setError(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditPage}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Page Confirmation */}
      <AlertDialog open={isDeletingPage} onOpenChange={setIsDeletingPage}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this page? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePage}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? 'Deleting...' : 'Delete Page'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
