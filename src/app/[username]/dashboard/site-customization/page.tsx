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
  
  console.log(`Rendering site customization page for user: ${username}`);
  
  // Special handling for demouser - makes debugging easier
  if (username === 'demouser') {
    console.log('Demo user detected in site customization page');
  }
  
  return <SiteCustomizationClient username={username} />;
}
