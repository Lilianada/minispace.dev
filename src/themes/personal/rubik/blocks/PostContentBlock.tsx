'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PostContentBlockProps {
  content?: {
    text?: string;
    showTableOfContents?: boolean;
  };
  post?: {
    content: string;
    coverImage?: string;
  };
}

export default function PostContentBlock({ content = {}, post }: PostContentBlockProps) {
  const { showTableOfContents = false } = content;
  
  // Default post content for preview
  const defaultContent = `
# This is a sample blog post

Welcome to this sample blog post. This demonstrates how your content will look when published.

## Formatting Examples

You can use **bold text** or *italic text* to emphasize important points.

### Code Examples

\`\`\`javascript
// Here's a simple JavaScript function
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('Reader'));
\`\`\`

### Lists

Here's a list of things you can do with Markdown:

- Create headings
- Format text
- Add code blocks
- Create lists like this one
- [Add links](https://example.com)

### Quotes

> The best way to predict the future is to invent it.
> — Alan Kay

### Images

You can also add images to your posts.

Thank you for reading this sample post!
`;

  const markdownContent = post?.content || defaultContent;
  
  // Extract headings for table of contents
  const headings: {id: string; text: string; level: number}[] = [];
  if (showTableOfContents) {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    let match;
    while ((match = headingRegex.exec(markdownContent)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      headings.push({ id, text, level });
    }
  }
  
  return (
    <article className="py-6">
      {post?.coverImage && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img 
            src={post.coverImage} 
            alt="Post cover" 
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      )}
      
      {showTableOfContents && headings.length > 0 && (
        <div className="mb-8 p-4 bg-muted rounded-lg">
          <h4 className="text-lg font-medium mb-2">Table of Contents</h4>
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li 
                key={heading.id} 
                className={`${heading.level === 2 ? 'ml-0' : 'ml-4'} text-secondary hover:text-primary`}
              >
                <a href={`#${heading.id}`} className="hover:underline">
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            code({ node, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              const inline = !match;
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  wrapLongLines={true}
                  showLineNumbers={true}
                  {...props}
                  className="rounded-md !bg-[#282c34] my-6"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={`${className || ''} bg-muted px-1.5 py-0.5 rounded text-sm`} {...props}>
                  {children}
                </code>
              );
            },
            a: ({ node, ...props }) => (
              <a 
                {...props} 
                className="text-primary hover:underline transition-colors"
                target={props.href?.startsWith('http') ? '_blank' : undefined}
                rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              />
            ),
            h1: ({ node, children, ...props }) => {
              const id = children?.toString().toLowerCase().replace(/[^\w]+/g, '-');
              return <h1 id={id} {...props} className="text-3xl font-bold mt-10 mb-4" />;
            },
            h2: ({ node, children, ...props }) => {
              const id = children?.toString().toLowerCase().replace(/[^\w]+/g, '-');
              return <h2 id={id} {...props} className="text-2xl font-bold mt-8 mb-3 pb-2 border-b border-border" />;
            },
            h3: ({ node, children, ...props }) => {
              const id = children?.toString().toLowerCase().replace(/[^\w]+/g, '-');
              return <h3 id={id} {...props} className="text-xl font-bold mt-6 mb-3" />;
            },
            p: ({ node, ...props }) => <p {...props} className="my-4 leading-relaxed text-secondary" />,
            ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-6 my-4 text-secondary" />,
            ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-6 my-4 text-secondary" />,
            li: ({ node, ...props }) => <li {...props} className="mb-2" />,
            blockquote: ({ node, ...props }) => (
              <blockquote
                {...props}
                className="border-l-4 border-primary/30 bg-primary/5 pl-4 py-2 italic my-6 text-secondary rounded-r-md"
              />
            ),
            img: ({ node, ...props }) => (
              <img
                {...props}
                className="max-w-full h-auto rounded-lg my-6 shadow-sm"
                loading="lazy"
              />
            ),
            hr: ({ node, ...props }) => <hr {...props} className="my-8 border-border" />,
            table: ({ node, ...props }) => <table {...props} className="w-full border-collapse my-6" />,
            th: ({ node, ...props }) => <th {...props} className="border border-border bg-muted p-2 text-left" />,
            td: ({ node, ...props }) => <td {...props} className="border border-border p-2" />,
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
      
      <div className="mt-12 pt-6 border-t border-border">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-secondary">Share this post:</span>
            <div className="flex space-x-2">
              <a href="#" className="text-secondary hover:text-primary transition-colors" aria-label="Share on Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-secondary hover:text-primary transition-colors" aria-label="Share on Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-secondary hover:text-primary transition-colors" aria-label="Share on LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
          <button className="text-sm text-secondary hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy link
          </button>
        </div>
      </div>
    </article>
  );
}
