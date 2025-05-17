import React from 'react';
import WelcomeSection from '../../../components/dashboard-page/WelcomeSection';
import QuickLinks from '../../../components/dashboard-page/QuickLinks';
import RecentPosts from '../../../components/dashboard-page/RecentPosts';
import { Metadata } from 'next';
import TrafficSources from '@/components/dashboard-page/TrafficSources';

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
        <div className="bg-background rounded-lg border border-border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start pb-4 border-b border-border/50 last:border-0 last:pb-0">
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mr-3">
                  {i % 3 === 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  ) : i % 3 === 1 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm">
                    {i % 3 === 0 ? (
                      <>New comment on <a href="#" className="text-primary hover:underline">Getting Started with Minispace</a></>
                    ) : i % 3 === 1 ? (
                      <>Someone viewed <a href="#" className="text-primary hover:underline">Best Practices for Blog SEO</a></>
                    ) : (
                      <>New subscriber to your blog</>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {i === 0 ? '5 minutes ago' : i === 1 ? '1 hour ago' : i === 2 ? '3 hours ago' : i === 3 ? 'Yesterday' : '2 days ago'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Traffic sources */}
        <TrafficSources />
      </div>
    </div>
  );
}