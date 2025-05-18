'use client';

import React from 'react';
import { Check } from 'lucide-react';

export default function GitHubPagesSection() {
  return (
    <section id="github-pages" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">GitHub Pages Integration</h2>
      <div className="prose max-w-none">
        <p>
          Connect your Minispace site to GitHub and deploy automatically to GitHub Pages.
        </p>
        <ul className="space-y-2 my-4">
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
            <span><strong>Cost:</strong> Free</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
            <span><strong>Storage:</strong> 1GB (GitHub Pages limit)</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
            <span><strong>Benefits:</strong> Free hosting, version control, automated deployments</span>
          </li>
        </ul>
        
        <div className="bg-muted p-4 rounded-lg mt-6">
          <p className="text-sm"><strong>Coming Soon:</strong> GitHub Pages integration is currently in development and will be available soon.</p>
        </div>
      </div>
    </section>
  );
}
