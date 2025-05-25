'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SiteCustomizationProps } from './types';

export default function LayoutSection({ userSettings, updateSettings }: Omit<SiteCustomizationProps, 'params'>) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Navigation Settings</CardTitle>
          <CardDescription>
            Configure what appears in your blog's navigation menu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="showHome"
                checked={userSettings?.navigation?.showHome !== false}
                onCheckedChange={(checked) => updateSettings({
                  navigation: { ...userSettings?.navigation, showHome: checked }
                })}
              />
              <Label htmlFor="showHome">Show Home</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showPosts"
                checked={userSettings?.navigation?.showPosts !== false}
                onCheckedChange={(checked) => updateSettings({
                  navigation: { ...userSettings?.navigation, showPosts: checked }
                })}
              />
              <Label htmlFor="showPosts">Show Posts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showAbout"
                checked={userSettings?.navigation?.showAbout !== false}
                onCheckedChange={(checked) => updateSettings({
                  navigation: { ...userSettings?.navigation, showAbout: checked }
                })}
              />
              <Label htmlFor="showAbout">Show About</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout & Design</CardTitle>
          <CardDescription>
            Customize your blog's layout and visual structure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="headerStyle">Header Style</Label>
              <Select
                value={userSettings?.layout?.headerStyle || 'minimal'}
                onValueChange={(value: 'minimal' | 'centered' | 'sidebar') => 
                  updateSettings({
                    layout: { ...userSettings?.layout, headerStyle: value }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select header style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="centered">Centered</SelectItem>
                  <SelectItem value="sidebar">Sidebar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="footerStyle">Footer Style</Label>
              <Select
                value={userSettings?.layout?.footerStyle || 'minimal'}
                onValueChange={(value: 'minimal' | 'full') => 
                  updateSettings({
                    layout: { ...userSettings?.layout, footerStyle: value }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select footer style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="showSidebar"
              checked={userSettings?.layout?.showSidebar || false}
              onCheckedChange={(checked) => updateSettings({
                layout: { ...userSettings?.layout, showSidebar: checked }
              })}
            />
            <Label htmlFor="showSidebar">Enable Sidebar</Label>
          </div>
          
          {userSettings?.layout?.showSidebar && (
            <div className="space-y-2">
              <Label htmlFor="sidebarPosition">Sidebar Position</Label>
              <Select
                value={userSettings?.layout?.sidebarPosition || 'right'}
                onValueChange={(value: 'left' | 'right') => 
                  updateSettings({
                    layout: { ...userSettings?.layout, sidebarPosition: value }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sidebar position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
