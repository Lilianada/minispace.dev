'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="py-12 border-t border-accent-muted antialiased relative">
      <div className="container relative ">
        <div className="flex flex-col items-center text-center">
          <Link href="/test" className="inline-block mb-6">
            <span className="text-2xl font-medium">minispace</span>
          </Link>
          
          <div className="flex space-x-8 mb-8">
            <Link href="/test/about" className="text-muted hover:text-accent transition-colors">About</Link>
            <Link href="/test/discover" className="text-muted hover:text-accent transition-colors">Discover</Link>
            <Link href="/docs" className="text-muted hover:text-accent transition-colors">Documentation</Link>
            <Link href="/terms" className="text-muted hover:text-accent transition-colors">Terms</Link>
            <Link href="/privacy" className="text-muted hover:text-accent transition-colors">Privacy</Link>
          </div>
          
          <div className="flex justify-center space-x-6 mb-8">
            <a href="https://twitter.com" aria-label="Twitter" className="text-muted hover:text-accent transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="https://github.com" aria-label="GitHub" className="text-muted hover:text-accent transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
          </div>
          
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Minispace. Made with ♥ by a team of one.
          </p>
        </div>
      </div>
       {/* Soft vignette bottom fade (like in screenshot) */}
       <div className="pointer-events-none absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#edeadf] to-transparent" />
    </footer>
  );
};

export default Footer;
