'use client';
import Navbar from '@/components/landing/navbar';
import HeroSection from '@/components/landing/hero';

export default function Home() {
  
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <HeroSection />
    </main>
  );
}
