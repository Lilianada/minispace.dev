'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter, Github, Linkedin, Instagram, Globe, Mail, Heart } from 'lucide-react';

interface FooterProps {
  text: string;
  showSocials?: boolean;
  showPoweredBy?: boolean;
  socials?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
    email?: string;
  };
}

export default function Footer({ 
  text, 
  showSocials = true, 
  showPoweredBy = true,
  socials = {} 
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-card border-t border-border py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-secondary mb-4">{text || 'A personal blog built with Minispace.'}</p>
            
            {showSocials && (
              <div className="flex space-x-4 mt-6">
                {socials.twitter && (
                  <a 
                    href={`https://twitter.com/${socials.twitter}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-primary transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter size={20} />
                  </a>
                )}
                
                {socials.github && (
                  <a 
                    href={`https://github.com/${socials.github}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-primary transition-colors"
                    aria-label="GitHub"
                  >
                    <Github size={20} />
                  </a>
                )}
                
                {socials.linkedin && (
                  <a 
                    href={`https://linkedin.com/in/${socials.linkedin}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                )}
                
                {socials.instagram && (
                  <a 
                    href={`https://instagram.com/${socials.instagram}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-primary transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                )}
                
                {socials.website && (
                  <a 
                    href={socials.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-primary transition-colors"
                    aria-label="Website"
                  >
                    <Globe size={20} />
                  </a>
                )}
                
                {socials.email && (
                  <a 
                    href={`mailto:${socials.email}`} 
                    className="text-secondary hover:text-primary transition-colors"
                    aria-label="Email"
                  >
                    <Mail size={20} />
                  </a>
                )}
              </div>
            )}
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-secondary hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-secondary hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-secondary hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-secondary hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-secondary hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-secondary">
            © {currentYear} All rights reserved.
          </p>
          
          {showPoweredBy && (
            <div className="mt-4 md:mt-0 flex items-center text-sm text-secondary">
              <span className="flex items-center">
                Made with <Heart size={14} className="mx-1 text-red-500" /> using 
                <Link href="https://minispace.dev" className="ml-1 text-primary hover:underline">
                  Minispace
                </Link>
              </span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
