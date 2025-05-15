'use client';
import Navbar from '@/components/landing-page/navbar';
import HeroSection from '@/components/landing-page/hero';

export default function Home() {
  
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <HeroSection />
    </main>
  );
}
