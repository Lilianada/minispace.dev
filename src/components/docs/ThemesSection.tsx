'use client';

import React from 'react';
import Link from 'next/link';

export default function ThemesSection() {
  return (
    <section id="themes" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Themes</h2>
      
      <div className="space-y-6">
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <h3 className="font-medium">Working with Themes</h3>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-sm">
              Minispace offers a variety of themes to customize the appearance of your site.
              Themes control the layout, colors, typography, and overall design of your website.
            </p>
            
            <h4 className="font-medium mt-4">Selecting a Theme</h4>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start">
                <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">
                  1
                </div>
                <div>
                  Navigate to your <strong>Dashboard</strong> → <strong>Site Customization</strong> → <strong>Themes</strong>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">
                  2
                </div>
                <div>
                  Browse available themes and click on a theme to preview it
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">
                  3
                </div>
                <div>
                  Click <strong>Apply Theme</strong> to activate it on your site
                </div>
              </li>
            </ol>
            
            <div className="bg-muted p-4 rounded-lg my-4 text-sm">
              <p><strong>Pro Tip:</strong> You can preview how each theme looks with your existing content before applying it to your live site.</p>
            </div>
          </div>
        </div>
        
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <h3 className="font-medium">Available Themes</h3>
          </div>
          <div className="p-4">
            <p className="text-sm mb-4">
              Minispace currently offers the following themes:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="border border-border rounded-md overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                <div className="p-3">
                  <h4 className="font-medium text-sm">Altay</h4>
                  <p className="text-xs text-muted-foreground">Modern, minimalist design with clean typography</p>
                </div>
              </div>
              
              <div className="border border-border rounded-md overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-green-500 to-emerald-600"></div>
                <div className="p-3">
                  <h4 className="font-medium text-sm">Aurora</h4>
                  <p className="text-xs text-muted-foreground">Bold and vibrant with modern aesthetics</p>
                </div>
              </div>
              
              <div className="border border-border rounded-md overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-amber-500 to-orange-600"></div>
                <div className="p-3">
                  <h4 className="font-medium text-sm">Horizon</h4>
                  <p className="text-xs text-muted-foreground">Classic blog layout with modern touches</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-sm">
              <p><Link href="/themes" className="text-primary hover:underline">View all available themes →</Link></p>
            </div>
          </div>
        </div>
        
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <h3 className="font-medium">Customizing Themes</h3>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-sm">
              You can further customize any theme to match your brand or personal style:
            </p>
            
            <h4 className="font-medium text-sm mt-2">Basic Customizations</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Change color scheme</li>
              <li>Adjust typography settings</li>
              <li>Modify layout options</li>
              <li>Update header and footer content</li>
            </ul>
            
            <h4 className="font-medium text-sm mt-4">Advanced Customizations</h4>
            <p className="text-sm">
              Pro users can access additional customization options:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Custom CSS for fine-grained control</li>
              <li>JavaScript customizations</li>
              <li>Custom font integration</li>
              <li>Layout editor for drag-and-drop design</li>
            </ul>
            
            <div className="bg-muted p-4 rounded-lg my-4 text-sm">
              <p><strong>Note:</strong> Some advanced customization options are only available on Pro and Business plans.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
