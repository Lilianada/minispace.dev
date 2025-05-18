'use client';

import React from 'react';
import { Check } from 'lucide-react';

export default function HostingOptionsSection() {
  return (
    <section id="hosting-options" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Hosting Options</h2>
      <div className="prose max-w-none">
        <p>
          Minispace gives you multiple options for hosting your site, so you can choose what works best for your needs and budget.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Option 1: Minispace Hosting (Default)</h3>
        <p>
          Every Minispace account comes with free hosting on our global CDN with a subdomain (username.minispace.dev).
        </p>
        <ul className="space-y-2 my-4">
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
            <span><strong>Free Tier:</strong> 100MB storage</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
            <span><strong>Pro Tier:</strong> 10GB storage, custom domain support, priority support</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
            <span><strong>Benefits:</strong> Zero configuration, automatic SSL, global CDN</span>
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Option 2: Self-Hosting</h3>
        <p>
          Export your Minispace site as static HTML, CSS, and JavaScript files to host on any web server.
        </p>
        <ul className="space-y-2 my-4">
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
            <span><strong>Cost:</strong> Depends on your hosting provider</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
            <span><strong>Storage:</strong> Unlimited (based on your hosting plan)</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
            <span><strong>Benefits:</strong> Complete control, use any hosting provider</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
