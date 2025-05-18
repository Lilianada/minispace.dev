'use client';

import React from 'react';
import Link from 'next/link';

export default function DomainSetupSection() {
  return (
    <section id="domain-setup" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Domain Setup Guide</h2>
      
      <div className="bg-muted p-4 rounded-lg mb-6 flex items-start">
        <div className="mr-3 text-amber-500 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-sm"><strong>Pro Feature:</strong> Custom domain support is available for Pro tier accounts only. <Link href="#" className="text-primary hover:underline">Upgrade to Pro</Link> to use this feature.</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <SubdomainSetup />
        <CustomDomainSetup />
      </div>
    </section>
  );
}

function SubdomainSetup() {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="bg-muted px-4 py-3 border-b border-border">
        <h3 className="font-medium">Subdomain Setup</h3>
      </div>
      <div className="p-4">
        <p className="mb-4 text-sm text-muted-foreground">Every Minispace user gets a free subdomain in the format:</p>
        
        <div className="bg-background border border-border rounded-md p-3 mb-4 font-mono text-sm">
          <span className="text-blue-500">username</span>.minispace.dev
        </div>
        
        <p className="mb-4 text-sm">You can customize your subdomain in your dashboard settings:</p>
        
        <ol className="space-y-3 text-sm">
          <li className="flex items-start">
            <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">
              1
            </div>
            <div>
              Go to your <strong>Dashboard</strong> → <strong>Settings</strong> → <strong>Domain</strong>
            </div>
          </li>
          <li className="flex items-start">
            <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">
              2
            </div>
            <div>
              Enter your desired subdomain in the <strong>Subdomain</strong> field
            </div>
          </li>
          <li className="flex items-start">
            <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">
              3
            </div>
            <div>
              Click <strong>Save Changes</strong>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}

function CustomDomainSetup() {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="bg-muted px-4 py-3 border-b border-border">
        <h3 className="font-medium">Custom Domain Setup</h3>
      </div>
      <div className="p-4">
        <p className="mb-4 text-sm text-muted-foreground">Pro users can connect their own custom domain to their Minispace site:</p>
        
        <ol className="space-y-3 text-sm mb-6">
          <li className="flex items-start">
            <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">
              1
            </div>
            <div>
              Go to your <strong>Dashboard</strong> → <strong>Settings</strong> → <strong>Domain</strong>
            </div>
          </li>
          <li className="flex items-start">
            <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">
              2
            </div>
            <div>
              Enter your custom domain in the <strong>Custom Domain</strong> field
            </div>
          </li>
          <li className="flex items-start">
            <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">
              3
            </div>
            <div>
              Click <strong>Save Changes</strong>
            </div>
          </li>
        </ol>
        
        <h4 className="font-medium mb-2">DNS Configuration</h4>
        <p className="mb-4 text-sm">After saving your custom domain, you'll need to configure your DNS settings at your domain registrar:</p>
        
        <div className="bg-background border border-border rounded-md p-3 mb-4 overflow-x-auto">
          <table className="text-sm w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium">Record Type</th>
                <th className="text-left py-2 pr-4 font-medium">Name</th>
                <th className="text-left py-2 pr-4 font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">A</td>
                <td className="py-2 pr-4">@</td>
                <td className="py-2 pr-4">76.76.21.21</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">CNAME</td>
                <td className="py-2 pr-4">www</td>
                <td className="py-2 pr-4">your-subdomain.minispace.dev</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4 className="font-medium mb-2">Verify Your Domain</h4>
        <p className="mb-4 text-sm">After configuring your DNS settings, return to the Domain Settings page and click <strong>Verify Domain</strong>. It may take up to 48 hours for DNS changes to propagate.</p>
      </div>
    </div>
  );
}
