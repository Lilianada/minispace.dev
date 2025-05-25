export interface UserSettings {
  theme: string;
  mode: 'light' | 'dark' | 'auto';
  customCSS?: string;
  siteTitle?: string;
  siteDescription?: string;
  siteTagline?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    email?: string;
  };
  navigation?: {
    showHome?: boolean;
    showAbout?: boolean;
    showPosts?: boolean;
    customPages?: string[];
  };
  layout?: {
    headerStyle?: 'minimal' | 'centered' | 'sidebar';
    footerStyle?: 'minimal' | 'full';
    showSidebar?: boolean;
    sidebarPosition?: 'left' | 'right';
  };
  analytics?: {
    googleAnalyticsId?: string;
    enableTracking?: boolean;
  };
  domain?: {
    customDomain?: string;
    subdomain?: string;
  };
}

export interface Page {
  slug: string;
  title: string;
  blocks: any[];
}

export interface SiteCustomization {
  pages: Record<string, Page>;
  siteInitialized: boolean;
}

export interface SiteCustomizationProps {
  userSettings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  params: { username: string };
}
