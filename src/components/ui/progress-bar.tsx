'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function ProgressBar() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Reset progress and start animation when route changes
    setProgress(0);
    setIsAnimating(true);
    
    // Simulate progress
    const timer1 = setTimeout(() => setProgress(30), 100);
    const timer2 = setTimeout(() => setProgress(60), 300);
    const timer3 = setTimeout(() => setProgress(80), 600);
    
    // Complete progress after a delay
    const timer4 = setTimeout(() => {
      setProgress(100);
      // Hide the progress bar after completion
      const timer5 = setTimeout(() => setIsAnimating(false), 200);
      return () => clearTimeout(timer5);
    }, 1000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [pathname, searchParams]);

  return (
    <div 
      className={`fixed top-0 left-0 right-0 h-1 z-50 transition-opacity duration-200 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className="h-full bg-primary transition-all ease-out duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
