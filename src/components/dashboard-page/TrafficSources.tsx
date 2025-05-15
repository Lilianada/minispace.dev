'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';

interface TrafficSource {
  name: string;
  percentage: number;
}

export default function TrafficSources() {
  const [trafficData, setTrafficData] = useState<TrafficSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        // For now, use mock data - in production, this would be a real API call
        // to your backend that processes Vercel Analytics data
        // const response = await fetch('/api/analytics/traffic-sources');
        // const data = await response.json();
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData = [
          { name: 'Search Engines', percentage: 45 },
          { name: 'Social Media', percentage: 32 },
          { name: 'Direct Links', percentage: 15 },
          { name: 'Referrals', percentage: 8 }
        ];
        
        setTrafficData(mockData);
        setIsLoading(false);
      } catch (err) {
        setError((err as Error).message || 'Failed to fetch analytics');
        setIsLoading(false);
      }
    }
    
    fetchAnalytics();
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Traffic Sources</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            Error loading analytics: {error}
          </div>
        ) : (
          <div className="space-y-3">
            {trafficData.map((source, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{source.name}</span>
                  <span className="text-muted-foreground">{source.percentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}