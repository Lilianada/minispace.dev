import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteCustomizationClient from './page.client';

export const metadata: Metadata = {
  title: 'Site Customization | Minispace',
  description: 'Customize your personal site on Minispace',
};

interface SiteCustomizationPageProps {
  params: {
    username: string;
  };
}

export default async function SiteCustomizationPage({ params }: SiteCustomizationPageProps) {
  const { username } = params;
  
  if (!username) {
    return notFound();
  }
  
  return <SiteCustomizationClient username={username} />;
}
