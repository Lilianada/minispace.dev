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
    <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-400 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-400 blur-3xl"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col items-center">
          {showAvatar && (
            <div className="mb-8 relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-md opacity-50 scale-110"></div>
              <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-white shadow-xl relative">
                <AvatarImage src={avatarUrl || '/placeholder-avatar.png'} alt={heading} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
                  {heading.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 text-center leading-tight tracking-tight animate-fade-in-up">
            {heading}
          </h1>
          
          {subheading && (
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl text-center leading-relaxed animate-fade-in-up animation-delay-200">
              {subheading}
            </p>
          )}
          
          <div className="mt-8 flex flex-wrap gap-4 justify-center animate-fade-in-up animation-delay-300">
            <a href="#about" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
              About Me
            </a>
            <a href="#posts" className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
              Read My Blog
            </a>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </section>
  );
}
