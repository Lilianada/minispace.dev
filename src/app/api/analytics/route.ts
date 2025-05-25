/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';

export async function GET() {
  // Enhanced mock analytics data for demonstration
  // In production, this would integrate with real analytics services
  
  try {
    const data = {
      // Traffic source data (compatible with existing TrafficSources component)
      trafficSources: [
        { name: 'Search Engines', percentage: 45 },
        { name: 'Social Media', percentage: 32 },
        { name: 'Direct Links', percentage: 15 },
        { name: 'Referrals', percentage: 8 }
      ],
      
      // Extended analytics data for comprehensive dashboard
      overview: {
        pageViews: 1247,
        uniqueVisitors: 892,
        avgSessionDuration: '2m 34s',
        bounceRate: 24.3,
        totalSessions: 1105,
        pagesPerSession: 2.8
      },
      
      topPages: [
        { path: '/', views: 456, percentage: 36.6 },
        { path: '/about', views: 234, percentage: 18.8 },
        { path: '/blog', views: 187, percentage: 15.0 },
        { path: '/contact', views: 92, percentage: 7.4 },
        { path: '/projects', views: 78, percentage: 6.3 }
      ],
      
      countries: [
        { country: 'United States', percentage: 38, visitors: 338 },
        { country: 'United Kingdom', percentage: 22, visitors: 196 },
        { country: 'Canada', percentage: 15, visitors: 134 },
        { country: 'Germany', percentage: 12, visitors: 107 },
        { country: 'Others', percentage: 13, visitors: 117 }
      ],
      
      devices: [
        { device: 'Desktop', percentage: 58, sessions: 641 },
        { device: 'Mobile', percentage: 35, sessions: 387 },
        { device: 'Tablet', percentage: 7, sessions: 77 }
      ],
      
      timeRange: '30d',
      lastUpdated: new Date().toISOString(),
      
      // Meta information
      meta: {
        isDemo: true,
        note: 'This is demonstration data. Real analytics integration is coming soon.',
        features: {
          realTimeData: false,
          subdomainSpecific: false,
          customEvents: false
        }
      }
    };
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}