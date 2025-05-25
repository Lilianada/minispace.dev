'use client';

import React from 'react';
import Link from 'next/link';

export default function SupportSection() {
  return (
    <section id="support" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Support</h2>
      
      <div className="space-y-6">
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <h3 className="font-medium">Getting Help</h3>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-sm">
              We offer multiple support channels to help you get the most out of Minispace.
              Choose the option that works best for you:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="border border-border rounded-md p-4">
                <h4 className="font-medium text-sm">Documentation</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Comprehensive guides and tutorials to help you use all features of Minispace.
                </p>
                <div className="mt-3">
                  <Link href="/docs" className="text-xs text-primary hover:underline">
                    Browse Documentation →
                  </Link>
                </div>
              </div>
              
              <div className="border border-border rounded-md p-4">
                <h4 className="font-medium text-sm">Knowledge Base</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Find answers to common questions and troubleshooting guides.
                </p>
                <div className="mt-3">
                  <Link href="/help/kb" className="text-xs text-primary hover:underline">
                    Visit Knowledge Base →
                  </Link>
                </div>
              </div>
              
              <div className="border border-border rounded-md p-4">
                <h4 className="font-medium text-sm">Community Forum</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Connect with other Minispace users, share tips, and get community help.
                </p>
                <div className="mt-3">
                  <Link href="https://community.minispace.dev" className="text-xs text-primary hover:underline">
                    Join the Community →
                  </Link>
                </div>
              </div>
              
              <div className="border border-border rounded-md p-4">
                <h4 className="font-medium text-sm">Email Support</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Get direct assistance from our support team for specific issues.
                </p>
                <div className="mt-3">
                  <Link href="mailto:support@minispace.dev" className="text-xs text-primary hover:underline">
                    Contact Support →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <h3 className="font-medium">Support Plans</h3>
          </div>
          <div className="p-4">
            <p className="text-sm mb-4">
              Different account levels receive different levels of support:
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Feature</th>
                    <th className="px-4 py-2 text-center font-medium">Free</th>
                    <th className="px-4 py-2 text-center font-medium">Pro</th>
                    <th className="px-4 py-2 text-center font-medium">Business</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-2">Documentation Access</td>
                    <td className="px-4 py-2 text-center">✅</td>
                    <td className="px-4 py-2 text-center">✅</td>
                    <td className="px-4 py-2 text-center">✅</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Community Support</td>
                    <td className="px-4 py-2 text-center">✅</td>
                    <td className="px-4 py-2 text-center">✅</td>
                    <td className="px-4 py-2 text-center">✅</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Email Support</td>
                    <td className="px-4 py-2 text-center">❌</td>
                    <td className="px-4 py-2 text-center">✅</td>
                    <td className="px-4 py-2 text-center">✅</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Priority Response</td>
                    <td className="px-4 py-2 text-center">❌</td>
                    <td className="px-4 py-2 text-center">❌</td>
                    <td className="px-4 py-2 text-center">✅</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Dedicated Support Rep</td>
                    <td className="px-4 py-2 text-center">❌</td>
                    <td className="px-4 py-2 text-center">❌</td>
                    <td className="px-4 py-2 text-center">✅</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Response Time</td>
                    <td className="px-4 py-2 text-center">N/A</td>
                    <td className="px-4 py-2 text-center">48 hours</td>
                    <td className="px-4 py-2 text-center">24 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-sm">
              <Link href="/pricing" className="text-primary hover:underline">View full plan comparison →</Link>
            </div>
          </div>
        </div>
        
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <h3 className="font-medium">Custom Domain Support</h3>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-sm">
              If you're having issues with custom domain setup, we've created a detailed guide to help:
            </p>
            
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium text-sm">Common Domain Issues</h4>
              <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                <li>DNS propagation delays (can take up to 48 hours)</li>
                <li>Incorrect DNS records configuration</li>
                <li>SSL certificate issues</li>
                <li>Domain registrar-specific settings</li>
              </ul>
            </div>
            
            <p className="text-sm">
              For step-by-step guidance on setting up your custom domain, visit our <Link href="/docs/domain-setup" className="text-primary hover:underline">Domain Setup Guide</Link>.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-lg text-center">
        <h3 className="font-medium mb-2">Need additional help?</h3>
        <p className="text-sm mb-4">Our support team is ready to assist you with any questions or issues.</p>
        <Link 
          href="mailto:support@minispace.dev" 
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
        >
          Contact Support
        </Link>
      </div>
    </section>
  );
}
