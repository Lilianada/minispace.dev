import React from 'react';
import WelcomeSection from '../../../components/dashboard/WelcomeSection';
import QuickLinks from '../../../components/dashboard/QuickLinks';
import RecentPosts from '../../../components/dashboard/RecentPosts';
import { Metadata } from 'next';
import RecentActivity from '@/components/dashboard/RecentActivity';

export const metadata: Metadata = {
  title: 'Dashboard | Minispace',
  description: 'Manage your Minispace blog',
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <WelcomeSection />
      <QuickLinks />
      <RecentPosts />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity feed */}
        <RecentActivity />
        
        {/* Placeholder for future traffic sources implementation */}
        <div className="bg-background rounded-lg border border-border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Traffic Sources</h2>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-muted-foreground mb-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
              />
            </svg>
            <p className="text-muted-foreground text-sm max-w-xs">
              Traffic source analytics will be available soon. Check back later for insights on where your visitors are coming from.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}