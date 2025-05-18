'use client';

import { Block } from './PageBlocksEditor';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

interface BlockPreviewProps {
  block: Block;
  compact?: boolean;
}

export function BlockPreview({ block, compact = false }: BlockPreviewProps) {
  const renderBlockPreview = () => {
    switch (block.type) {
      case 'hero':
        return compact ? (
          <div className="p-4 bg-muted rounded-md">
            {data.heading && <h3 className="text-lg font-semibold">{data.heading}</h3>}
            {data.content && <p className="text-sm text-muted-foreground truncate">{data.content}</p>}
            {data.subheading && <p className="text-xs text-muted-foreground">{data.subheading}</p>}
          </div>
        ) : (
          <div 
            className={`relative p-8 rounded-lg overflow-hidden ${data.cssClass || ''}`}
            style={{
              backgroundImage: data.backgroundImage ? `url(${data.backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {data.backgroundImage && (
              <div className="absolute inset-0 bg-black/40" />
            )}
            <div className={`relative z-10 space-y-4 text-${data.alignment || 'center'}`}>
              {data.heading && (
                <h2 className={`text-3xl font-bold ${data.backgroundImage ? 'text-white' : ''}`}>
                  {data.heading}
                </h2>
              )}
              
              {data.content && (
                <div className={`prose ${data.backgroundImage ? 'prose-invert' : ''} max-w-none`}>
                  <ReactMarkdown>
                    {data.content}
                  </ReactMarkdown>
                </div>
              )}
              
              {data.subheading && (
                <p className={`text-lg ${data.backgroundImage ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {data.subheading}
                </p>
              )}
              
              {data.buttonText && (
                <div>
                  <Button>
                    {data.buttonText}
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 'text':
        return compact ? (
          <div className="p-4 bg-muted rounded-md">
            {data.heading && <h3 className="text-lg font-semibold">{data.heading}</h3>}
            <p className="text-sm text-muted-foreground truncate">{data.content || 'Text content...'}</p>
          </div>
        ) : (
          <div className={`space-y-4 text-${data.alignment || 'left'} ${data.cssClass || ''}`}>
            {data.heading && <h2 className="text-2xl font-bold">{data.heading}</h2>}
            <div className="prose dark:prose-invert max-w-none">
              {data.content ? (
                <ReactMarkdown>
                  {data.content}
                </ReactMarkdown>
              ) : (
                <p>This is a paragraph of text. You can edit this to add your own content.</p>
              )}
            </div>
          </div>
        );

      case 'image':
        return compact ? (
          <div className="p-4 bg-muted rounded-md flex items-center">
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center mr-3">
              <span className="text-gray-400">IMG</span>
            </div>
            <div>
              <p className="text-sm truncate">{data.alt || 'Image'}</p>
              {data.caption && <p className="text-xs text-muted-foreground truncate">{data.caption}</p>}
            </div>
          </div>
        ) : (
          <div className={`space-y-2 ${data.cssClass || ''}`}>
            <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
              {data.src ? (
                <img
                  src={data.src}
                  alt={data.alt || ''}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">No image source provided</p>
                </div>
              )}
            </div>
            {data.caption && (
              <p className="text-sm text-center text-muted-foreground">{data.caption}</p>
            )}
          </div>
        );

      case 'gallery':
        return compact ? (
          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm">Gallery: {(data.images || []).length} images</p>
            <p className="text-xs text-muted-foreground">{data.columns || 2} columns</p>
          </div>
        ) : (
          <div>
            <div className={`grid grid-cols-${data.columns || 2} gap-4`}>
              {(data.images || []).map((image: any, index: number) => (
                <div key={index} className="relative aspect-square bg-muted rounded-md overflow-hidden">
                  {image.src ? (
                    <img
                      src={image.src}
                      alt={image.alt || ''}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-muted-foreground">Image {index + 1}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'features':
        return compact ? (
          <div className="p-4 bg-muted rounded-md">
            <h3 className="text-lg font-semibold">{data.heading || 'Features'}</h3>
            <p className="text-sm text-muted-foreground">
              {(data.features || []).length} features
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">{data.heading || 'Features'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(data.features || []).map((feature: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{feature.icon || '✨'}</span>
                    <h3 className="text-xl font-semibold">{feature.title || `Feature ${index + 1}`}</h3>
                  </div>
                  <p className="text-muted-foreground">
                    {feature.description || 'Description of this feature'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return compact ? (
          <div className="p-4 bg-muted rounded-md">
            <h3 className="text-lg font-semibold">{data.heading || 'Contact'}</h3>
            <p className="text-sm text-muted-foreground">{data.email || 'Email contact'}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{data.heading || 'Get in Touch'}</h2>
            <p className="text-muted-foreground">
              Email: <a href={`mailto:${data.email}`} className="text-primary">{data.email || 'your@email.com'}</a>
            </p>
            {data.showForm && (
              <div className="space-y-4 border p-4 rounded-md">
                <p className="text-sm text-muted-foreground">Contact form will appear here</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-muted rounded-md" />
                  <div className="h-10 bg-muted rounded-md" />
                </div>
                <div className="h-24 bg-muted rounded-md" />
                <Button disabled>Send Message</Button>
              </div>
            )}
          </div>
        );

      case 'cta':
        return compact ? (
          <div className="p-4 bg-muted rounded-md">
            <h3 className="text-lg font-semibold">{data.heading || 'Call to Action'}</h3>
            <p className="text-sm text-muted-foreground">{data.buttonText || 'Button'}</p>
          </div>
        ) : (
          <div className="p-8 bg-muted rounded-lg text-center space-y-4">
            <h2 className="text-2xl font-bold">{data.heading || 'Ready to Get Started?'}</h2>
            <p className="text-muted-foreground">
              {data.subheading || 'Join thousands of users today'}
            </p>
            <Button size="lg">
              {data.buttonText || 'Sign Up Now'}
            </Button>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-muted rounded-md">
            <p className="text-muted-foreground">Unknown block type: {block.type}</p>
          </div>
        );
    }
  };

  const { data } = block;

  return (
    <div className={compact ? 'max-h-24 overflow-hidden' : ''}>
      {renderBlockPreview()}
    </div>
  );
}
