'use client';

import React from 'react';
import Link from 'next/link';

export default function PostsSection() {
  return (
    <section id="posts" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Posts & Pages</h2>
      
      <div className="space-y-6">
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <h3 className="font-medium">Working with Posts</h3>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-sm">
              Posts are the main content type in Minispace. You can create blog posts, articles, or any other type of content.
            </p>
            
            <h4 className="font-medium mt-4">Creating a New Post</h4>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start">
                <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">
                  1
                </div>
                <div>
                  Navigate to your <strong>Dashboard</strong> → <strong>Posts</strong>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">
                  2
                </div>
                <div>
                  Click the <strong>New Post</strong> button
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">
                  3
                </div>
                <div>
                  Enter a title, content, and optionally add tags and a featured image
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">
                  4
                </div>
                <div>
                  Click <strong>Publish</strong> to make your post live, or <strong>Save Draft</strong> to continue working on it later
                </div>
              </li>
            </ol>
            
            <h4 className="font-medium mt-4">Managing Posts</h4>
            <p className="text-sm">
              From the Posts page in your dashboard, you can:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Edit existing posts</li>
              <li>Delete unwanted posts</li>
              <li>Schedule posts for future publishing</li>
              <li>Organize posts with tags</li>
              <li>Check post analytics</li>
            </ul>
          </div>
        </div>
        
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <h3 className="font-medium">Static Pages</h3>
          </div>
          <div className="p-4">
            <p className="text-sm">
              In addition to posts, you can create static pages for content that doesn't change frequently, such as:
            </p>
            <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
              <li>About page</li>
              <li>Contact page</li>
              <li>Services/Products pages</li>
              <li>Custom landing pages</li>
            </ul>
            
            <div className="bg-muted p-4 rounded-lg my-4 text-sm">
              <p><strong>Tip:</strong> Unlike posts, pages don't appear in your blog feed and are usually accessed via navigation menus.</p>
            </div>
            
            <p className="text-sm">
              To create a page, go to <strong>Dashboard</strong> → <strong>Pages</strong> → <strong>New Page</strong>
            </p>
          </div>
        </div>
        
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <h3 className="font-medium">Markdown Support</h3>
          </div>
          <div className="p-4">
            <p className="text-sm">
              Minispace supports Markdown formatting in both posts and pages. You can use Markdown to format text, add links, images, and more.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Example Markdown</h4>
                <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                  <code>{`# Heading 1
## Heading 2

**Bold text** and *italic text*

[Link to Minispace](https://minispace.dev)

- List item 1
- List item 2

> Blockquote example

\`\`\`
Code block
\`\`\``}</code>
                </pre>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Rendered Output</h4>
                <div className="bg-background border border-border p-3 rounded-md text-xs h-full">
                  <h1 className="text-base font-bold">Heading 1</h1>
                  <h2 className="text-sm font-bold">Heading 2</h2>
                  <p className="my-1"><strong>Bold text</strong> and <em>italic text</em></p>
                  <p className="my-1"><a href="#" className="text-primary hover:underline">Link to Minispace</a></p>
                  <ul className="list-disc pl-4 my-1">
                    <li>List item 1</li>
                    <li>List item 2</li>
                  </ul>
                  <blockquote className="border-l-2 border-muted-foreground pl-2 my-1">Blockquote example</blockquote>
                  <div className="bg-muted rounded-sm p-1 mt-1">Code block</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
