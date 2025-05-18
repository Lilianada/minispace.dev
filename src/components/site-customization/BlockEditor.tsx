'use client';

import { useState, useEffect } from 'react';
import { Block } from './PageBlocksEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';

interface BlockEditorProps {
  block: Block;
  onUpdate: (data: Record<string, any>) => void;
}

export function BlockEditor({ block, onUpdate }: BlockEditorProps) {
  const [data, setData] = useState<Record<string, any>>(block.data);

  // Update local state when block data changes
  useEffect(() => {
    setData(block.data);
  }, [block.data]);

  const handleChange = (key: string, value: any) => {
    const newData = { ...data, [key]: value };
    setData(newData);
    onUpdate(newData);
  };

  const renderFieldsByBlockType = () => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={data.heading || ''}
                onChange={(e) => handleChange('heading', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="subheading">Subheading</Label>
              <Input
                id="subheading"
                value={data.subheading || ''}
                onChange={(e) => handleChange('subheading', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={data.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="buttonLink">Button Link</Label>
              <Input
                id="buttonLink"
                value={data.buttonLink || ''}
                onChange={(e) => handleChange('buttonLink', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="backgroundImage">Background Image URL</Label>
              <Input
                id="backgroundImage"
                value={data.backgroundImage || ''}
                onChange={(e) => handleChange('backgroundImage', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="heading">Heading (Optional)</Label>
              </div>
              <Input
                id="heading"
                value={data.heading || ''}
                onChange={(e) => handleChange('heading', e.target.value)}
                placeholder="Section Title (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content (Supports Markdown)</Label>
              <Tabs defaultValue="edit">
                <TabsList className="mb-2">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                  <Textarea
                    id="content"
                    value={data.content || ''}
                    onChange={(e) => handleChange('content', e.target.value)}
                    rows={10}
                    placeholder="# Markdown Supported

Write your content here using **markdown** formatting.

- Bullet points
- *Italic text*
- **Bold text**
- [Links](https://example.com)

### Subheadings too!"
                    className="font-mono text-sm"
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <Card className="border p-4 min-h-[200px] overflow-auto">
                    <CardContent className="p-0">
                      {data.content ? (
                        <ReactMarkdown>
                          {data.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="text-muted-foreground">No content to preview</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              <p className="text-xs text-muted-foreground">Markdown formatting is supported for rich text content.</p>
            </div>
            <div>
              <Label htmlFor="alignment">Text Alignment</Label>
              <Select
                value={data.alignment || 'left'}
                onValueChange={(value) => handleChange('alignment', value)}
              >
                <SelectTrigger id="alignment">
                  <SelectValue placeholder="Select alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="src">Image URL</Label>
              <Input
                id="src"
                value={data.src || ''}
                onChange={(e) => handleChange('src', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={data.alt || ''}
                onChange={(e) => handleChange('alt', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="caption">Caption (optional)</Label>
              <Input
                id="caption"
                value={data.caption || ''}
                onChange={(e) => handleChange('caption', e.target.value)}
              />
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="columns">Columns</Label>
              <Select
                value={String(data.columns || 2)}
                onValueChange={(value) => handleChange('columns', Number(value))}
              >
                <SelectTrigger id="columns">
                  <SelectValue placeholder="Select number of columns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Images</Label>
              {(data.images || []).map((image: any, index: number) => (
                <div key={index} className="mb-4 p-4 border rounded-md">
                  <div className="mb-2">
                    <Label htmlFor={`image-${index}-src`}>Image URL</Label>
                    <Input
                      id={`image-${index}-src`}
                      value={image.src || ''}
                      onChange={(e) => {
                        const newImages = [...(data.images || [])];
                        newImages[index] = { ...image, src: e.target.value };
                        handleChange('images', newImages);
                      }}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`image-${index}-alt`}>Alt Text</Label>
                    <Input
                      id={`image-${index}-alt`}
                      value={image.alt || ''}
                      onChange={(e) => {
                        const newImages = [...(data.images || [])];
                        newImages[index] = { ...image, alt: e.target.value };
                        handleChange('images', newImages);
                      }}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const newImages = [...(data.images || []), { src: '', alt: `Gallery image ${(data.images || []).length + 1}` }];
                  handleChange('images', newImages);
                }}
              >
                Add Image
              </Button>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={data.heading || ''}
                onChange={(e) => handleChange('heading', e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-2 block">Features</Label>
              {(data.features || []).map((feature: any, index: number) => (
                <div key={index} className="mb-4 p-4 border rounded-md">
                  <div className="mb-2">
                    <Label htmlFor={`feature-${index}-title`}>Title</Label>
                    <Input
                      id={`feature-${index}-title`}
                      value={feature.title || ''}
                      onChange={(e) => {
                        const newFeatures = [...(data.features || [])];
                        newFeatures[index] = { ...feature, title: e.target.value };
                        handleChange('features', newFeatures);
                      }}
                    />
                  </div>
                  <div className="mb-2">
                    <Label htmlFor={`feature-${index}-description`}>Description</Label>
                    <Textarea
                      id={`feature-${index}-description`}
                      value={feature.description || ''}
                      onChange={(e) => {
                        const newFeatures = [...(data.features || [])];
                        newFeatures[index] = { ...feature, description: e.target.value };
                        handleChange('features', newFeatures);
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`feature-${index}-icon`}>Icon</Label>
                    <Input
                      id={`feature-${index}-icon`}
                      value={feature.icon || ''}
                      onChange={(e) => {
                        const newFeatures = [...(data.features || [])];
                        newFeatures[index] = { ...feature, icon: e.target.value };
                        handleChange('features', newFeatures);
                      }}
                      placeholder="✨"
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const newFeatures = [...(data.features || []), {
                    title: `Feature ${(data.features || []).length + 1}`,
                    description: 'Description of this feature',
                    icon: '✨'
                  }];
                  handleChange('features', newFeatures);
                }}
              >
                Add Feature
              </Button>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={data.heading || ''}
                onChange={(e) => handleChange('heading', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={data.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                type="email"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showForm"
                checked={data.showForm || false}
                onCheckedChange={(checked) => handleChange('showForm', checked)}
              />
              <Label htmlFor="showForm">Show contact form</Label>
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={data.heading || ''}
                onChange={(e) => handleChange('heading', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="subheading">Subheading</Label>
              <Input
                id="subheading"
                value={data.subheading || ''}
                onChange={(e) => handleChange('subheading', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={data.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="buttonLink">Button Link</Label>
              <Input
                id="buttonLink"
                value={data.buttonLink || ''}
                onChange={(e) => handleChange('buttonLink', e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-muted rounded-md">
            <p className="text-muted-foreground">No editor available for this block type.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 p-4">
      {renderFieldsByBlockType()}
    </div>
  );
}
