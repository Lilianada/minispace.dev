'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-medium">Minispace</span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="block md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="h-6 w-6"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>

        {/* Desktop navigation */}
        <div className="hidden space-x-6 md:flex items-center">
          <Link href="/discover" className="text-sm font-medium transition-colors hover:text-accent">
            Discover
          </Link>
          <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-accent">
            Pricing
          </Link>
          <Link href="/signin" className="text-sm font-medium transition-colors hover:text-accent">
            Login
          </Link>
          <Link href="/signup" className="border border-input rounded-md px-3 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
            Sign up
          </Link>
        </div>

        {/* Mobile navigation */}
        {isOpen && (
          <div className="absolute top-14 left-0 right-0 bg-background border-b border-border z-50 md:hidden">
            <div className="flex flex-col space-y-4 p-4">
              <Link 
                href="/discover" 
                className="text-sm font-medium transition-colors hover:text-accent"
                onClick={() => setIsOpen(false)}
              >
                Discover
              </Link>
              <Link 
                href="/pricing" 
                className="text-sm font-medium transition-colors hover:text-accent"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="/signin" 
                className="text-sm font-medium transition-colors hover:text-accent"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="border border-input rounded-md px-3 py-1 text-sm font-medium text-center transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}