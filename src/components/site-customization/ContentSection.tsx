'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Globe, Twitter, Github, Linkedin, Instagram } from 'lucide-react';
import { SiteCustomizationProps } from './types';

export default function ContentSection({ userSettings, updateSettings, params }: SiteCustomizationProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
          <CardDescription>
            Configure your blog's basic information and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteTitle">Site Title</Label>
              <Input
                id="siteTitle"
                value={userSettings?.siteTitle || ''}
                onChange={(e) => updateSettings({ siteTitle: e.target.value })}
                placeholder="My Awesome Blog"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteTagline">Tagline</Label>
              <Input
                id="siteTagline"
                value={userSettings?.siteTagline || ''}
                onChange={(e) => updateSettings({ siteTagline: e.target.value })}
                placeholder="Thoughts, ideas, and stories"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea
              id="siteDescription"
              value={userSettings?.siteDescription || ''}
              onChange={(e) => updateSettings({ siteDescription: e.target.value })}
              placeholder="A brief description of your blog for search engines and social media"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>
            Your social media links are managed in your profile settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Social links are configured in your profile settings
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/${params.username}/dashboard/profile?tab=social`}>
                  <Globe className="h-4 w-4 mr-2" />
                  Manage Social Links
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Display current social links if they exist */}
          {userSettings?.socialLinks && Object.values(userSettings.socialLinks).some(link => link) && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Current Links:</Label>
              <div className="grid grid-cols-1 gap-2">
                {userSettings.socialLinks.twitter && (
                  <div className="flex items-center text-sm">
                    <Twitter className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Twitter:</span>
                    <span className="ml-2 font-mono text-xs bg-muted px-2 py-1 rounded">
                      @{userSettings.socialLinks.twitter}
                    </span>
                  </div>
                )}
                {userSettings.socialLinks.github && (
                  <div className="flex items-center text-sm">
                    <Github className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">GitHub:</span>
                    <span className="ml-2 font-mono text-xs bg-muted px-2 py-1 rounded">
                      {userSettings.socialLinks.github}
                    </span>
                  </div>
                )}
                {userSettings.socialLinks.linkedin && (
                  <div className="flex items-center text-sm">
                    <Linkedin className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">LinkedIn:</span>
                    <span className="ml-2 font-mono text-xs bg-muted px-2 py-1 rounded">
                      {userSettings.socialLinks.linkedin}
                    </span>
                  </div>
                )}
                {userSettings.socialLinks.email && (
                  <div className="flex items-center text-sm">
                    <Globe className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Email:</span>
                    <span className="ml-2 font-mono text-xs bg-muted px-2 py-1 rounded">
                      {userSettings.socialLinks.email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
