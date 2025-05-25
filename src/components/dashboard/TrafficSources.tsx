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
        // Fetch from the enhanced analytics API
        const response = await fetch('/api/analytics');
        
        if (response.ok) {
          const data = await response.json();
          setTrafficData(data.trafficSources || []);
        } else {
          throw new Error('Failed to fetch analytics data');
        }
        
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