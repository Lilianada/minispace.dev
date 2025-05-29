'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Globe, 
  Users, 
  Eye, 
  TrendingUp, 
  Calendar,
  ExternalLink,
  AlertCircle,
  Loader,
  Clock
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';

interface AnalyticsPageClientProps {
  params: { username: string };
}

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  topPages: Array<{ path: string; views: number; }>;
  trafficSources: Array<{ source: string; percentage: number; }>;
  countries: Array<{ country: string; percentage: number; }>;
  devices: Array<{ device: string; percentage: number; }>;
  lastUpdated?: string;
}

export default function AnalyticsPageClient({ params }: AnalyticsPageClientProps) {
  const { user, loading } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVercelAnalyticsAvailable, setIsVercelAnalyticsAvailable] = useState(false);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/signin';
    }
  }, [user, loading]);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setIsLoading(true);
        setError(null);

        // Try to fetch from Vercel Analytics API
        const response = await fetch('/api/analytics/vercel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            username: params.username,
            domain: `${params.username}.minispace.dev` 
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setAnalyticsData(data);
          setIsVercelAnalyticsAvailable(true);
        } else {
          // Fallback to mock data for now
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
          
          const mockData: AnalyticsData = {
            pageViews: 1247,
            uniqueVisitors: 892,
            topPages: [
              { path: '/', views: 456 },
              { path: '/about', views: 234 },
              { path: '/blog', views: 187 },
              { path: '/contact', views: 92 },
            ],
            trafficSources: [
              { source: 'Search Engines', percentage: 45 },
              { source: 'Social Media', percentage: 32 },
              { source: 'Direct', percentage: 15 },
              { source: 'Referrals', percentage: 8 },
            ],
            countries: [
              { country: 'United States', percentage: 38 },
              { country: 'United Kingdom', percentage: 22 },
              { country: 'Canada', percentage: 15 },
              { country: 'Germany', percentage: 12 },
              { country: 'Others', percentage: 13 },
            ],
            devices: [
              { device: 'Desktop', percentage: 58 },
              { device: 'Mobile', percentage: 35 },
              { device: 'Tablet', percentage: 7 },
            ],
            lastUpdated: new Date().toISOString(),
          };
          
          setAnalyticsData(mockData);
          setIsVercelAnalyticsAvailable(false);
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    }

    if (user && params.username) {
      fetchAnalytics();
    }
  }, [user, params.username]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Site Analytics</h1>
            <p className="text-muted-foreground">Track your site performance and visitor insights</p>
          </div>
        </div>
        
        <div className="flex justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader className="h-6 w-6 animate-spin" />
            <span>Loading analytics data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Site Analytics</h1>
            <p className="text-muted-foreground">Track your site performance and visitor insights</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">Failed to Load Analytics</h3>
                  <p className="text-muted-foreground">{error}</p>
                </div>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Site Analytics</h1>
          <p className="text-muted-foreground">
            Track your site performance and visitor insights
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {!isVercelAnalyticsAvailable && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>Demo Data</span>
            </Badge>
          )}
          <Button variant="outline" size="sm" asChild>
            <a 
              href={`https://${params.username}.minispace.dev`} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1"
            >
              <Globe className="h-4 w-4" />
              <span>Visit Site</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>

      {/* Analytics Status Alert */}
      {!isVercelAnalyticsAvailable && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-medium text-amber-800 dark:text-amber-200">
                  Analytics Coming Soon
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Real-time analytics with Vercel Analytics integration is currently in development. 
                  The data shown below is for demonstration purposes. Once available, you'll be able to see:
                </p>
                <ul className="text-sm text-amber-700 dark:text-amber-300 list-disc list-inside space-y-1 ml-2">
                  <li>Real-time page views and unique visitors</li>
                  <li>Traffic sources and referrers</li>
                  <li>Geographic distribution of visitors</li>
                  <li>Device and browser analytics</li>
                  <li>Page performance metrics</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.pageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m 34s</div>
            <p className="text-xs text-muted-foreground">
              Average duration
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.3%</div>
            <p className="text-xs text-muted-foreground">
              Below average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Traffic Sources</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.trafficSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{source.source}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${source.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
                          {source.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Device Types</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.devices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{device.device}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${device.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
                          {device.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <p className="text-sm text-muted-foreground">
                Most visited pages on your site
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{page.path === '/' ? 'Home' : page.path}</p>
                        <p className="text-sm text-muted-foreground">{page.path}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{page.views.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">views</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources Breakdown</CardTitle>
              <p className="text-sm text-muted-foreground">
                Where your visitors are coming from
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analyticsData.trafficSources.map((source, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{source.source}</h4>
                      <span className="text-sm font-medium">{source.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-primary h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((source.percentage / 100) * analyticsData.pageViews)} page views
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audience Geography</CardTitle>
              <p className="text-sm text-muted-foreground">
                Geographic distribution of your visitors
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.countries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <span className="font-medium">{country.country}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${country.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium min-w-[3rem] text-right">
                        {country.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Info */}
      {analyticsData.lastUpdated && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Last updated: {new Date(analyticsData.lastUpdated).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
