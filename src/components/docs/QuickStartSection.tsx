'use client';

import React from 'react';

export default function QuickStartSection() {
  return (
    <section id="quick-start" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Quick Start Guide</h2>
      <div className="prose max-w-none">
        <ol className="space-y-4">
          <li className="flex items-start">
            <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              1
            </div>
            <div>
              <strong>Create an account</strong> - Sign up with your email or Google account
            </div>
          </li>
          <li className="flex items-start">
            <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              2
            </div>
            <div>
              <strong>Choose a theme</strong> - Select from our collection of minimal, fast-loading themes
            </div>
          </li>
          <li className="flex items-start">
            <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              3
            </div>
            <div>
              <strong>Add content</strong> - Create posts and pages using our Markdown editor
            </div>
          </li>
          <li className="flex items-start">
            <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              4
            </div>
            <div>
              <strong>Customize your site</strong> - Adjust colors, fonts, and layout to match your style
            </div>
          </li>
          <li className="flex items-start">
            <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              5
            </div>
            <div>
              <strong>Publish</strong> - Your site will be live at username.minispace.dev
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
