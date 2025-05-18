'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter, Github, Linkedin, Instagram, Globe } from 'lucide-react';

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
  };
}

export default function Footer({ 
  text, 
  showSocials = true, 
  showPoweredBy = true,
  socials = {} 
}: FooterProps) {
  return (
    <footer className="bg-white border-t border-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">{text}</p>
          </div>
          
          {showSocials && (
            <div className="flex space-x-4">
              {socials.twitter && (
                <a 
                  href={`https://twitter.com/${socials.twitter}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary"
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
                  className="text-gray-500 hover:text-primary"
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
                  className="text-gray-500 hover:text-primary"
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
                  className="text-gray-500 hover:text-primary"
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
                  className="text-gray-500 hover:text-primary"
                  aria-label="Website"
                >
                  <Globe size={20} />
                </a>
              )}
            </div>
          )}
        </div>
        
        {showPoweredBy && (
          <div className="mt-4 text-center text-sm text-gray-500">
            <Link href="https://minispace.dev" className="hover:text-primary">
              Powered by Minispace
            </Link>
          </div>
        )}
      </div>
    </footer>
  );
}
