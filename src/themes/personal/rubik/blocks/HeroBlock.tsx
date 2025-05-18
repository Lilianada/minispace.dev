'use client';

import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface HeroBlockProps {
  content: {
    heading: string;
    subheading?: string;
    showAvatar?: boolean;
    avatarUrl?: string;
  };
}

export default function HeroBlock({ content }: HeroBlockProps) {
  const { heading, subheading, showAvatar = true, avatarUrl } = content;
  
  return (
    <section className="py-12 text-center">
      {showAvatar && (
        <div className="mb-6 flex justify-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl || '/placeholder-avatar.png'} alt={heading} />
            <AvatarFallback>{heading.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      )}
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{heading}</h1>
      
      {subheading && (
        <p className="text-xl text-gray-600">{subheading}</p>
      )}
    </section>
  );
}
