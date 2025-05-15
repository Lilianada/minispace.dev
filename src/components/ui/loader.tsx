'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg';
}

export function Loader({ className, size = 'default', ...props }: LoaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        {
          'h-6': size === 'sm',
          'h-8': size === 'default',
          'h-12': size === 'lg',
        },
        className
      )}
      {...props}
    >
      <style jsx>{`
        .bouncing-loader {
          display: flex;
          justify-content: center;
        }
        
        .bouncing-loader > div {
          width: ${size === 'sm' ? '6px' : size === 'lg' ? '12px' : '8px'};
          height: ${size === 'sm' ? '6px' : size === 'lg' ? '12px' : '8px'};
          margin: ${size === 'sm' ? '2px' : size === 'lg' ? '6px' : '4px'};
          border-radius: 50%;
          background-color: currentColor;
          opacity: 0.6;
          animation: bouncing-loader 0.6s infinite alternate;
        }
        
        .bouncing-loader > div:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .bouncing-loader > div:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        .bouncing-loader > div:nth-child(4) {
          animation-delay: 0.6s;
        }
        
        @keyframes bouncing-loader {
          to {
            opacity: 1;
            transform: translateY(-${size === 'sm' ? '4px' : size === 'lg' ? '10px' : '8px'});
          }
        }
      `}</style>
      <div className="bouncing-loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}