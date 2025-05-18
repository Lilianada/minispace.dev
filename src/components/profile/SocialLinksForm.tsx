'use client';

import { useState } from 'react';
import { User } from 'firebase/auth';
import { UserData } from '@/lib/auth-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Twitter, Github, Linkedin, Instagram } from 'lucide-react';

interface SocialLinks {
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
}

interface SocialLinksFormProps {
  user: User | null;
  userData: UserData | null;
  onSubmit: (links: SocialLinks) => Promise<void>;
  isLoading: boolean;
}

export function SocialLinksForm({ user, userData, onSubmit, isLoading }: SocialLinksFormProps) {
  const [links, setLinks] = useState<SocialLinks>({
    website: userData?.socialLinks?.website || '',
    twitter: userData?.socialLinks?.twitter || '',
    github: userData?.socialLinks?.github || '',
    linkedin: userData?.socialLinks?.linkedin || '',
    instagram: userData?.socialLinks?.instagram || '',
  });
  
  const handleChange = (platform: keyof SocialLinks, value: string) => {
    setLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(links);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
        <CardDescription>
          Add your social media profiles to connect with your audience.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> Website
            </Label>
            <Input
              id="website"
              placeholder="https://yourwebsite.com"
              value={links.website}
              onChange={(e) => handleChange('website', e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="twitter" className="flex items-center gap-2">
              <Twitter className="h-4 w-4" /> Twitter
            </Label>
            <Input
              id="twitter"
              placeholder="https://twitter.com/yourusername"
              value={links.twitter}
              onChange={(e) => handleChange('twitter', e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="github" className="flex items-center gap-2">
              <Github className="h-4 w-4" /> GitHub
            </Label>
            <Input
              id="github"
              placeholder="https://github.com/yourusername"
              value={links.github}
              onChange={(e) => handleChange('github', e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="linkedin" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </Label>
            <Input
              id="linkedin"
              placeholder="https://linkedin.com/in/yourusername"
              value={links.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" /> Instagram
            </Label>
            <Input
              id="instagram"
              placeholder="https://instagram.com/yourusername"
              value={links.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Social Links'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
