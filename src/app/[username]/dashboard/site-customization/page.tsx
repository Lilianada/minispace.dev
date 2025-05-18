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
  // Await the params object before destructuring
  const resolvedParams = await Promise.resolve(params);
  const { username } = resolvedParams;
  
  if (!username) {
    return notFound();
  }
  
  return <SiteCustomizationClient username={username} />;
}
