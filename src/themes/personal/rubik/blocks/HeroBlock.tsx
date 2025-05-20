'use client';

import React from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowRight } from 'lucide-react';

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
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          {showAvatar && (
            <div className="mb-8 relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full blur-md opacity-30 scale-110"></div>
              <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-white shadow-xl relative">
                <AvatarImage src={avatarUrl || '/placeholder-avatar.png'} alt={heading} />
                <AvatarFallback className="bg-gradient-to-br from-sky-500 to-indigo-600 text-white text-3xl font-bold">
                  {heading.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6 leading-tight tracking-tight animate-fade-in-up">
            {heading}
          </h1>
          
          {subheading && (
            <p className="text-xl md:text-2xl text-secondary max-w-2xl text-center leading-relaxed animate-fade-in-up animation-delay-200">
              {subheading}
            </p>
          )}
          
          <div className="mt-10 flex flex-wrap gap-4 justify-center animate-fade-in-up animation-delay-300">
            <Link 
              href="/about" 
              className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 shadow-sm hover:shadow transition-all duration-200 flex items-center"
            >
              About Me
              <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link 
              href="/posts" 
              className="px-6 py-3 bg-white text-text border border-border font-medium rounded-md hover:bg-muted shadow-sm hover:shadow transition-all duration-200"
            >
              Read My Blog
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative dots pattern */}
      <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-10">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-dots-pattern"></div>
        <div className="absolute inset-y-0 left-0 w-1/3 bg-dots-pattern"></div>
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
        
        .bg-dots-pattern {
          background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
          background-size: 16px 16px;
        }
      `}</style>
    </section>
  );
}
