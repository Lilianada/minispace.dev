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
    <header className={`bg-white border-b border-gray-100 ${sticky ? 'sticky top-0 z-10' : ''}`}>
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex-shrink-0">
          <Link href="/" className="text-xl font-medium text-gray-900 hover:text-primary">
            {title}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="text-gray-600 hover:text-primary font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-600 hover:text-primary focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-4 py-4">
              {menu.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="text-gray-600 hover:text-primary font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
