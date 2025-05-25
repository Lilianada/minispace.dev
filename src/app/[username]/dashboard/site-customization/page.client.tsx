'use client';

import { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { isAuthContextUserData } from '@/lib/type-adapters';
import SiteCustomizationTabs from '@/components/site-customization/SiteCustomizationTabs';
import SiteCustomizationHeader, { SiteCustomizationActions } from '@/components/site-customization/SiteCustomizationHeader';
import SiteCustomizationSkeleton from '@/components/site-customization/SiteCustomizationSkeleton';
import SiteCustomizationError from '@/components/site-customization/SiteCustomizationError';
import { useSiteCustomization } from '@/components/site-customization/useSiteCustomization';

export default function SiteCustomizationClient({ params }: { params: { username: string } }) {
  const [activeSection, setActiveSection] = useState('themes');
  const { user, loading: authLoading } = useAuth();
  
  // Ensure userData is of the correct type
  const validUserData = isAuthContextUserData(user) ? user : null;

  const {
    loading,
    saving,
    error,
    successMessage,
    userId,
    userSettings,
    siteCustomization,
    updateSettings,
    saveSettings
  } = useSiteCustomization(params.username);

  if (authLoading || loading) {
    return <SiteCustomizationSkeleton />;
  }

  if (error) {
    return <SiteCustomizationError error={error} />;
  }

  if (!userSettings || !siteCustomization || !userId) {
    return <SiteCustomizationError error="Failed to load user settings" />;
  }

  return (
    <div className="container mx-auto py-6">
      <SiteCustomizationHeader
        successMessage={successMessage}
        params={params}
        saving={saving}
        onSave={saveSettings}
      />

      <SiteCustomizationTabs
        userSettings={userSettings}
        updateSettings={updateSettings}
        params={params}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <SiteCustomizationActions
        params={params}
        saving={saving}
        onSave={saveSettings}
      />
    </div>
  );
}
