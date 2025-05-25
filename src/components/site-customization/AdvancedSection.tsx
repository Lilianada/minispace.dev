'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { SiteCustomizationProps } from './types';

export default function AdvancedSection({ userSettings, updateSettings, params }: SiteCustomizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
        <CardDescription>
          Advanced customization options for your blog
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h5 className="font-medium">SEO Settings</h5>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={userSettings?.siteDescription || ''}
                onChange={(e) => updateSettings({ siteDescription: e.target.value })}
                placeholder="A brief description of your blog..."
                rows={3}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h5 className="font-medium">Analytics & Tracking</h5>
            <div className="space-y-2">
              <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
              <Input
                id="googleAnalyticsId"
                value={userSettings?.analytics?.googleAnalyticsId || ''}
                onChange={(e) => updateSettings({ 
                  analytics: { ...userSettings?.analytics, googleAnalyticsId: e.target.value }
                })}
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enableTracking"
                checked={userSettings?.analytics?.enableTracking || false}
                onCheckedChange={(checked) => updateSettings({
                  analytics: { ...userSettings?.analytics, enableTracking: checked }
                })}
              />
              <Label htmlFor="enableTracking">Enable analytics tracking</Label>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h5 className="font-medium">Custom Domain</h5>
          <div className="flex gap-2">
            <Input
              value={userSettings?.domain?.customDomain || ''}
              onChange={(e) => updateSettings({ 
                domain: { ...userSettings?.domain, customDomain: e.target.value }
              })}
              placeholder="yourdomain.com"
              className="flex-1"
            />
            <Button variant="outline">Connect Domain</Button>
          </div>
          <p className="text-sm text-gray-500">
            Current URL: minispace.dev/{params.username}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
