'use client';

import React from 'react';
import Link from 'next/link';
import '../global.css';

export default function Header() {
  return (
    <div className="test-environment">
      {/* Header */}
      <header className="site-header">
        <div className="container">
          <div className="flex items-center">
            <div className="logo mr-auto md:mr-0 md:w-1/4">
              <Link href="/test">
                <span className="text-xl font-medium">minispace</span>
              </Link>
            </div>
            <nav className="hidden md:flex justify-center w-2/4">
              <Link href="/test" className="nav-link mx-4">Home</Link>
              <Link href="/test/about" className="nav-link mx-4">About</Link>
              <Link href="/test/discover" className="nav-link mx-4">Discover</Link>
              <Link href="/docs" className="nav-link mx-4">Docs</Link>
            </nav>
            <div className="hidden md:flex justify-end items-center w-1/4">
              <Link href="/signin" className="nav-link mr-4">Sign In</Link>
              <Link href="/signup" className="button">Get Started</Link>
            </div>
            {/* Mobile menu button */}
            <button className="md:hidden ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>
    </div>
  )}