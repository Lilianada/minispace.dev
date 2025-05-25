'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemesSection from './ThemesSection';
import ContentSection from './ContentSection';
import LayoutSection from './LayoutSection';
import AdvancedSection from './AdvancedSection';
import { SiteCustomizationProps } from './types';

interface SiteCustomizationTabsProps extends SiteCustomizationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function SiteCustomizationTabs({ 
  userSettings, 
  updateSettings, 
  params, 
  activeSection, 
  onSectionChange 
}: SiteCustomizationTabsProps) {
  return (
    <Tabs value={activeSection} onValueChange={onSectionChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="themes">Themes</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="layout">Layout</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="themes" className="space-y-6">
        <ThemesSection 
          userSettings={userSettings} 
          updateSettings={updateSettings} 
          params={params} 
        />
      </TabsContent>

      <TabsContent value="content" className="space-y-6">
        <ContentSection 
          userSettings={userSettings} 
          updateSettings={updateSettings} 
          params={params}
        />
      </TabsContent>

      <TabsContent value="layout" className="space-y-6">
        <LayoutSection 
          userSettings={userSettings} 
          updateSettings={updateSettings} 
        />
      </TabsContent>

      <TabsContent value="advanced" className="space-y-6">
        <AdvancedSection 
          userSettings={userSettings} 
          updateSettings={updateSettings} 
          params={params} 
        />
      </TabsContent>
    </Tabs>
  );
}
