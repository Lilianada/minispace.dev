'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SiteCustomizationProps } from './types';

export default function ThemesSection({ userSettings, updateSettings, params }: SiteCustomizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Theme</CardTitle>
        <CardDescription>
          Choose and customize the visual theme for your blog
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border rounded-lg bg-blue-50">
          <h4 className="font-semibold mb-2">Current Theme</h4>
          <p className="text-sm text-gray-600 mb-3">
            {userSettings?.theme || 'Simple'} theme is currently applied to your blog
          </p>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/${params.username}/dashboard/themes`}>
                Browse All Themes
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/customize/theme?theme=${userSettings?.theme || 'simple'}`}>
                Customize Current Theme
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h5 className="font-medium mb-2">Theme Mode</h5>
            <select 
              className="w-full p-2 border rounded"
              value={userSettings?.mode || 'light'}
              onChange={(e) => updateSettings({ mode: e.target.value as 'light' | 'dark' | 'auto' })}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h5 className="font-medium mb-2">Custom CSS</h5>
            <textarea 
              className="w-full p-2 border rounded h-20 text-sm font-mono"
              placeholder="/* Add your custom CSS here */"
              value={userSettings?.customCSS || ''}
              onChange={(e) => updateSettings({ customCSS: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
