'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import useAuth from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlockEditor } from './BlockEditor';
import { BlockPreview } from './BlockPreview';

export interface Block {
  id: string;
  type: string;
  data: Record<string, any>;
}

interface PageBlocksEditorProps {
  page: {
    slug: string;
    title: string;
    blocks: Block[];
  };
  userId: string;
}

const AVAILABLE_BLOCK_TYPES = [
  { id: 'hero', name: 'Hero', description: 'Full-width banner with heading' },
  { id: 'text', name: 'Text', description: 'Rich text content' },
  { id: 'image', name: 'Image', description: 'Single image with caption' },
  { id: 'gallery', name: 'Gallery', description: 'Multiple images in a grid' },
  { id: 'features', name: 'Features', description: 'Feature list with icons' },
  { id: 'contact', name: 'Contact', description: 'Contact form or details' },
  { id: 'cta', name: 'Call to Action', description: 'Conversion-focused section' },
];

export default function PageBlocksEditor({ page, userId }: PageBlocksEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(page.blocks || []);
  const [isSaving, setIsSaving] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  
  // Update blocks when page changes
  useEffect(() => {
    setBlocks(page.blocks || []);
    // Reset active block when switching pages
    setActiveBlockId(null);
  }, [page]);

  const handleSave = async () => {
    if (!user || user.uid !== userId) {
      setErrorMessage('Permission denied. You can only update your own site pages.');
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    try {
      setIsSaving(true);
      
      // Use the correct collection name 'Users' instead of 'users'
      const siteCustomizationRef = doc(db, 'Users', userId, 'siteCustomization', 'pages');
      
      // Check if the document exists first
      const docSnap = await getDoc(siteCustomizationRef);
      
      if (!docSnap.exists()) {
        // Document doesn't exist, create it first with initial data
        await setDoc(siteCustomizationRef, {
          pages: {
            [page.slug]: {
              ...page,
              blocks,
            }
          }
        });
      } else {
        // Document exists, update it
        await updateDoc(siteCustomizationRef, {
          [`pages.${page.slug}`]: {
            ...page,
            blocks,
          },
        });
      }

      setSuccessMessage('Page updated successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
      
      // Refresh the page to show the changes
      router.refresh();
    } catch (error) {
      console.error('Error updating page blocks:', error);
      setErrorMessage('Failed to update page. Please try again.');
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const moveBlockUp = (index: number) => {
    if (index <= 0) return;
    
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index - 1];
    newBlocks[index - 1] = temp;
    
    setBlocks(newBlocks);
  };
  
  const moveBlockDown = (index: number) => {
    if (index >= blocks.length - 1) return;
    
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + 1];
    newBlocks[index + 1] = temp;
    
    setBlocks(newBlocks);
  };

  const handleAddBlock = (blockType: string) => {
    const newBlock: Block = {
      id: `block_${Date.now()}`,
      type: blockType,
      data: getDefaultDataForBlockType(blockType),
    };
    
    setBlocks([...blocks, newBlock]);
    setIsAddingBlock(false);
    setActiveBlockId(newBlock.id);
  };

  const handleUpdateBlock = (blockId: string, data: Record<string, any>) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, data } : block
    ));
  };

  const handleRemoveBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
    if (activeBlockId === blockId) {
      setActiveBlockId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Page Blocks</h2>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>
          Add and arrange content blocks to build your page. 
          Each block can be customized with your own content.
        </p>
      </div>

      <div>
        {errorMessage && (
          <div className="p-4 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="p-4 mb-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
        
        <div className="space-y-4">
          {blocks.length === 0 ? (
            <div className="p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground mb-4">This page has no content blocks yet.</p>
              <Button onClick={() => setIsAddingBlock(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Block
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <Card key={block.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium capitalize">
                        {block.type} Block
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveBlockUp(index)}
                          disabled={index === 0}
                          className="h-8 w-8"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveBlockDown(index)}
                          disabled={index === blocks.length - 1}
                          className="h-8 w-8"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setActiveBlockId(block.id)}
                          className="h-8 w-8"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveBlock(block.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <BlockPreview block={block} />
                  </CardContent>
                </Card>
              ))}
              <div className="flex justify-center">
                <Button onClick={() => setIsAddingBlock(true)} variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Add Block
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Block Dialog */}
      <Dialog open={isAddingBlock} onOpenChange={setIsAddingBlock}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Content Block</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {AVAILABLE_BLOCK_TYPES.map((blockType) => (
              <Button
                key={blockType.id}
                onClick={() => handleAddBlock(blockType.id)}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2"
              >
                <span>{blockType.name}</span>
                <span className="text-xs text-muted-foreground">{blockType.description}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Block Dialog */}
      <Dialog open={!!activeBlockId} onOpenChange={(open) => !open && setActiveBlockId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit {activeBlockId && blocks.find(b => b.id === activeBlockId)?.type} Block
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="edit">
            <TabsList className="mb-4">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              {activeBlockId && (
                <BlockEditor
                  block={blocks.find(b => b.id === activeBlockId)!}
                  onUpdate={(data) => handleUpdateBlock(activeBlockId, data)}
                />
              )}
            </TabsContent>
            <TabsContent value="preview">
              {activeBlockId && (
                <BlockPreview block={blocks.find(b => b.id === activeBlockId)!} />
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to get default data for each block type
function getDefaultDataForBlockType(blockType: string): Record<string, any> {
  switch (blockType) {
    case 'hero':
      return {
        heading: 'Welcome to My Site',
        subheading: 'This is a hero section with a call to action',
        buttonText: 'Learn More',
        buttonLink: '#',
        backgroundImage: '',
      };
    case 'text':
      return {
        heading: 'Section Title',
        content: 'This is a paragraph of text. You can edit this to add your own content.',
        alignment: 'left',
      };
    case 'image':
      return {
        src: '',
        alt: 'Image description',
        caption: '',
      };
    case 'gallery':
      return {
        images: [
          { src: '', alt: 'Gallery image 1' },
          { src: '', alt: 'Gallery image 2' },
        ],
        columns: 2,
      };
    case 'features':
      return {
        heading: 'Features',
        features: [
          { title: 'Feature 1', description: 'Description of feature 1', icon: '✨' },
          { title: 'Feature 2', description: 'Description of feature 2', icon: '🚀' },
        ],
      };
    case 'contact':
      return {
        heading: 'Get in Touch',
        email: 'your@email.com',
        showForm: true,
      };
    case 'cta':
      return {
        heading: 'Ready to Get Started?',
        subheading: 'Join thousands of users today',
        buttonText: 'Sign Up Now',
        buttonLink: '#',
      };
    default:
      return {};
  }
}
