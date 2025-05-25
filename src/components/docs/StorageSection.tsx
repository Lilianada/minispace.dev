'use client';

import React from 'react';
import Link from 'next/link';

export default function StorageSection() {
  return (
    <section id="storage" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Storage</h2>
      
      <div className="space-y-6">
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <h3 className="font-medium">Storage Overview</h3>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-sm">
              Minispace provides cloud storage for all your site assets, including images, videos, documents, and other files.
              Your storage allocation depends on your account plan.
            </p>
            
            <div className="bg-background border border-border rounded-md p-4">
              <h4 className="font-medium text-sm mb-2">Storage Limits by Plan</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <h5 className="font-medium">Free</h5>
                  <p className="text-muted-foreground">500 MB</p>
                </div>
                <div>
                  <h5 className="font-medium">Pro</h5>
                  <p className="text-muted-foreground">5 GB</p>
                </div>
                <div>
                  <h5 className="font-medium">Business</h5>
                  <p className="text-muted-foreground">20 GB</p>
                </div>
              </div>
            </div>
            
            <p className="text-sm mt-4">
              You can view your current storage usage in your <Link href="/dashboard/settings/storage" className="text-primary hover:underline">Dashboard → Settings → Storage</Link>.
            </p>
          </div>
        </div>
        
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <h3 className="font-medium">Uploading Files</h3>
          </div>
          <div className="p-4">
            <p className="text-sm mb-3">
              There are several ways to upload files to your Minispace storage:
            </p>
            
            <h4 className="font-medium text-sm mt-4">1. Media Manager</h4>
            <ol className="space-y-2 text-sm mt-2">
              <li className="flex items-start">
                <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">
                  1
                </div>
                <div>
                  Go to <strong>Dashboard</strong> → <strong>Media</strong>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">
                  2
                </div>
                <div>
                  Click <strong>Upload</strong> or drag and drop files
                </div>
              </li>
            </ol>
            
            <h4 className="font-medium text-sm mt-4">2. Post Editor</h4>
            <p className="text-sm">
              When creating or editing a post, you can upload images directly from the editor by:
            </p>
            <ul className="list-disc pl-5 text-sm mt-1">
              <li>Clicking the image icon in the toolbar</li>
              <li>Using the "Add Media" button</li>
              <li>Dragging and dropping images into the editor</li>
            </ul>
            
            <h4 className="font-medium text-sm mt-4">3. API (for developers)</h4>
            <p className="text-sm">
              Minispace provides an API for programmatically uploading files. Documentation is available in the <Link href="/docs/api" className="text-primary hover:underline">API Reference</Link>.
            </p>
          </div>
        </div>
        
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <h3 className="font-medium">Managing Files</h3>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-sm">
              The Media Manager provides tools to organize and manage your files:
            </p>
            
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Create folders to organize files</li>
              <li>Rename files and folders</li>
              <li>Move files between folders</li>
              <li>Delete unused files to free up space</li>
              <li>Search for specific files</li>
              <li>Filter by file type (images, videos, documents, etc.)</li>
            </ul>
            
            <div className="bg-muted p-4 rounded-lg my-4 text-sm">
              <p><strong>Best practice:</strong> Regularly clean up unused files to optimize your storage usage and keep your media library organized.</p>
            </div>
          </div>
        </div>
        
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <h3 className="font-medium">CDN Delivery</h3>
          </div>
          <div className="p-4">
            <p className="text-sm">
              All files uploaded to Minispace are automatically served through our global Content Delivery Network (CDN),
              ensuring fast load times for your visitors regardless of their geographic location.
            </p>
            
            <div className="mt-4 text-sm">
              <h4 className="font-medium">Benefits:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Faster page load times</li>
                <li>Reduced bandwidth usage</li>
                <li>Higher reliability and uptime</li>
                <li>Automatic image optimization</li>
              </ul>
            </div>
            
            <div className="bg-muted p-4 rounded-lg my-4 text-sm">
              <p><strong>Pro Tip:</strong> For even better performance, consider using WebP image format which offers superior compression and quality.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
