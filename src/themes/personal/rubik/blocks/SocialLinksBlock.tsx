'use client';

import React from 'react';
import { Twitter, Github, Linkedin, Instagram, Globe, Mail } from 'lucide-react';

interface SocialLinksBlockProps {
  content: {
    showEmail?: boolean;
    showSocial?: boolean;
    email?: string;
    socials?: {
      twitter?: string;
      github?: string;
      linkedin?: string;
      instagram?: string;
      website?: string;
    };
  };
}

export default function SocialLinksBlock({ content }: SocialLinksBlockProps) {
  const { showEmail = true, showSocial = true, email, socials = {} } = content;
  
  // Default values for preview
  const defaultEmail = 'hello@example.com';
  const defaultSocials = {
    twitter: 'username',
    github: 'username',
    linkedin: 'username',
    instagram: 'username',
    website: 'https://example.com',
  };
  
  const displayEmail = email || defaultEmail;
  const displaySocials = {
    twitter: socials.twitter || defaultSocials.twitter,
    github: socials.github || defaultSocials.github,
    linkedin: socials.linkedin || defaultSocials.linkedin,
    instagram: socials.instagram || defaultSocials.instagram,
    website: socials.website || defaultSocials.website,
  };
  
  return (
    <section className="py-6">
      <h2 className="text-xl font-medium text-gray-900 mb-4">Connect With Me</h2>
      
      <div className="flex flex-wrap gap-4">
        {showEmail && (
          <a 
            href={`mailto:${displayEmail}`}
            className="flex items-center gap-2 text-gray-700 hover:text-primary"
          >
            <Mail size={18} />
            <span>{displayEmail}</span>
          </a>
        )}
        
        {showSocial && (
          <>
            {displaySocials.twitter && (
              <a 
                href={`https://twitter.com/${displaySocials.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-primary"
              >
                <Twitter size={18} />
                <span>Twitter</span>
              </a>
            )}
            
            {displaySocials.github && (
              <a 
                href={`https://github.com/${displaySocials.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-primary"
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>
            )}
            
            {displaySocials.linkedin && (
              <a 
                href={`https://linkedin.com/in/${displaySocials.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-primary"
              >
                <Linkedin size={18} />
                <span>LinkedIn</span>
              </a>
            )}
            
            {displaySocials.instagram && (
              <a 
                href={`https://instagram.com/${displaySocials.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-primary"
              >
                <Instagram size={18} />
                <span>Instagram</span>
              </a>
            )}
            
            {displaySocials.website && (
              <a 
                href={displaySocials.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-primary"
              >
                <Globe size={18} />
                <span>Website</span>
              </a>
            )}
          </>
        )}
      </div>
    </section>
  );
}
