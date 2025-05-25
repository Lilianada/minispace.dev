'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemesSection from './ThemesSection';

// Test each component individually
export default function SiteCustomizationTabsTest({ 
  userSettings, 
  updateSettings, 
  params, 
  activeSection, 
  onSectionChange 
}: any) {
  return (
    <Tabs value={activeSection} onValueChange={onSectionChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="themes">Themes</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="layout">Layout</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="themes" className="space-y-6">
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">Themes Section</h3>
          <p>Theme: {userSettings?.theme || 'default'}</p>
        </div>
      </TabsContent>

      <TabsContent value="content" className="space-y-6">
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">Content Section</h3>
          <p>Site Title: {userSettings?.siteTitle || 'No title set'}</p>
        </div>
      </TabsContent>

      <TabsContent value="layout" className="space-y-6">
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">Layout Section</h3>
          <p>Header Style: {userSettings?.layout?.headerStyle || 'default'}</p>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-6">
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">Advanced Section</h3>
          <p>Custom Domain: {userSettings?.domain?.customDomain || 'None'}</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
