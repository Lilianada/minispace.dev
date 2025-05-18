'use client';

import React, { useState, useEffect } from 'react';
import { calculateStorageUsage, formatBytes, StorageUsageData } from '@/lib/storage-utils';
import { useAuth } from '@/lib/auth-context';
import { Button } from './button';
import { Skeleton } from './skeleton';
import Link from 'next/link';

interface StorageUsageProps {
  compact?: boolean;
  showCategories?: boolean;
  className?: string;
}

export function StorageUsage({ compact = false, showCategories = false, className = '' }: StorageUsageProps) {
  const { user } = useAuth();
  const [storageData, setStorageData] = useState<StorageUsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStorageData() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await calculateStorageUsage(user.uid);
        setStorageData(data);
      } catch (error) {
        console.error('Error fetching storage data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStorageData();
  }, [user]);

  if (isLoading) {
    return (
      <div className={`rounded-md bg-muted/50 p-3 ${className}`}>
        <p className="mb-1 text-xs text-muted-foreground">Storage used</p>
        <Skeleton className="w-full h-1.5 rounded-full" />
        <Skeleton className="mt-1 w-24 h-4" />
      </div>
    );
  }

  if (!storageData) {
    return (
      <div className={`rounded-md bg-muted/50 p-3 ${className}`}>
        <p className="mb-1 text-xs text-muted-foreground">Storage used</p>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div className="bg-primary h-1.5 rounded-full w-0"></div>
        </div>
        <p className="mt-1 text-xs">0% of 100MB used</p>
      </div>
    );
  }

  const { totalUsed, totalLimit, usedPercentage, categories } = storageData;
  
  // Determine color based on usage percentage
  let barColor = 'bg-primary';
  if (usedPercentage > 90) {
    barColor = 'bg-destructive';
  } else if (usedPercentage > 70) {
    barColor = 'bg-warning';
  }

  return (
    <div className={`rounded-md bg-muted/50 p-3 ${className}`}>
      <p className="mb-1 text-xs text-muted-foreground">Storage used</p>
      <div className="w-full bg-muted rounded-full h-1.5">
        <div 
          className={`${barColor} h-1.5 rounded-full`} 
          style={{ width: `${Math.min(usedPercentage, 100)}%` }}
        ></div>
      </div>
      <p className="mt-1 text-xs">
        {usedPercentage.toFixed(1)}% of {formatBytes(totalLimit)} used
        <span className="text-muted-foreground ml-1">({formatBytes(totalUsed)})</span>
      </p>
      
      {showCategories && categories.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium mb-2">Storage breakdown:</p>
          <ul className="space-y-1">
            {categories.map((category, index) => (
              category.size > 0 && (
                <li key={index} className="flex justify-between text-xs">
                  <span>{category.name}</span>
                  <span className="text-muted-foreground">
                    {formatBytes(category.size)} ({category.percentage.toFixed(1)}%)
                  </span>
                </li>
              )
            ))}
          </ul>
        </div>
      )}
      
      {!compact && usedPercentage > 70 && (
        <div className="mt-3 flex gap-2">
          <Link href="/docs/hosting" target="_blank">
            <Button variant="outline" size="sm" className="text-xs h-7">
              Self-host
            </Button>
          </Link>
          <Button variant="default" size="sm" className="text-xs h-7">
            Upgrade
          </Button>
        </div>
      )}
    </div>
  );
}

export function StorageUpgradePrompt({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-md bg-primary/10 p-3 ${className}`}>
      <p className="mb-1 text-sm font-medium text-primary">Upgrade to Pro</p>
      <p className="text-xs text-muted-foreground">
        Get access to all features and more storage:
      </p>
      <ul className="mt-2 text-xs text-muted-foreground space-y-1">
        <li>• 10GB storage (100x more)</li>
        <li>• Custom domain support</li>
        <li>• Advanced analytics</li>
        <li>• Priority support</li>
      </ul>
      <div className="mt-3 flex gap-2">
        <Link href="/docs/hosting" target="_blank">
          <Button variant="outline" size="sm" className="text-xs">
            Learn more
          </Button>
        </Link>
        <Button className="text-xs">Upgrade</Button>
      </div>
    </div>
  );
}
