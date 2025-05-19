'use client';

import React from 'react';

interface TextBlockProps {
  content: {
    text: string;
    alignment?: 'left' | 'center' | 'right';
  };
}

export default function TextBlock({ content }: TextBlockProps) {
  const { text, alignment = 'left' } = content;
  
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  return (
    <section className={`py-12 md:py-16 px-4 ${alignmentClasses[alignment]}`}>
      <div className="max-w-4xl mx-auto fade-in-scroll">
        <div className="relative">
          <div className="absolute -top-10 -left-10 text-8xl font-serif text-blue-100 dark:text-gray-800 opacity-50 select-none">"</div>
          
          <div className="prose prose-lg md:prose-xl max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-800 dark:hover:prose-a:text-blue-300">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg md:text-xl relative z-10">{text}</p>
          </div>
          
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mt-6 mx-auto md:mx-0 md:ml-0"></div>
        </div>
      </div>
      
      <style jsx>{`
        .fade-in-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        @media (prefers-reduced-motion: no-preference) {
          .fade-in-scroll.visible {
            opacity: 1;
            transform: translateY(0);
          }
          
          /* Simple intersection observer polyfill using CSS */
          @supports (animation-timeline: scroll()) {
            .fade-in-scroll {
              animation: fadeInScroll 1s ease-out forwards;
              animation-timeline: scroll();
              animation-range: entry 10% cover 30%;
            }
            
            @keyframes fadeInScroll {
              from { 
                opacity: 0;
                transform: translateY(20px);
              }
              to { 
                opacity: 1;
                transform: translateY(0);
              }
            }
          }
        }
      `}</style>
      
      <script dangerouslySetInnerHTML={{ __html: `
        // Simple intersection observer for browsers that don't support CSS scroll timeline
        document.addEventListener('DOMContentLoaded', function() {
          if (!('animationTimeline' in document.body.style)) {
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('visible');
                  observer.unobserve(entry.target);
                }
              });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.fade-in-scroll').forEach(el => {
              observer.observe(el);
            });
          }
        });
      `}} />
    </section>
  );
}
