'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  title: string;
  menu: {
    label: string;
    path: string;
  }[];
  sticky?: boolean;
}

export default function Header({ title, menu, sticky = true }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`bg-card border-b border-border ${sticky ? 'sticky top-0 z-50' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex-shrink-0">
          <Link href="/" className="text-xl font-semibold text-text hover:text-primary transition-colors">
            {title}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="px-4 py-2 rounded-md text-secondary hover:text-primary hover:bg-muted font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-4 pl-4 border-l border-border">
            <Link 
              href="/signin" 
              className="px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-secondary hover:text-primary hover:bg-muted focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-2">
              {menu.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="px-4 py-3 rounded-md text-secondary hover:text-primary hover:bg-muted font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-border">
                <Link 
                  href="/signin" 
                  className="block px-4 py-3 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
