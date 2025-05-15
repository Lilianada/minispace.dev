'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg';
  color?: string;
}

export function Loader({ className, size = 'default', color = 'currentColor', ...props }: LoaderProps) {
  // Define sizes based on the size prop
  const dotSize = size === 'sm' ? '6px' : size === 'lg' ? '12px' : '8px';
  const dotMargin = size === 'sm' ? '2px' : size === 'lg' ? '6px' : '4px';
  // const bounceHeight = size === 'sm' ? '4px' : size === 'lg' ? '10px' : '8px';
  
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
      <div className="flex justify-center">
        <div 
          className="animate-bounce-delay-0"
          style={{
            width: dotSize,
            height: dotSize,
            margin: dotMargin,
            borderRadius: '50%',
            backgroundColor: color,
            opacity: 0.6,
            animation: 'bounce 0.6s infinite alternate',
          }}
        />
        <div 
          className="animate-bounce-delay-200"
          style={{
            width: dotSize,
            height: dotSize,
            margin: dotMargin,
            borderRadius: '50%',
            backgroundColor: color,
            opacity: 0.6,
            animation: 'bounce 0.6s infinite alternate',
            animationDelay: '0.2s',
          }}
        />
        <div 
          className="animate-bounce-delay-400"
          style={{
            width: dotSize,
            height: dotSize,
            margin: dotMargin,
            borderRadius: '50%',
            backgroundColor: color,
            opacity: 0.6,
            animation: 'bounce 0.6s infinite alternate',
            animationDelay: '0.4s',
          }}
        />
        <div 
          className="animate-bounce-delay-600"
          style={{
            width: dotSize,
            height: dotSize,
            margin: dotMargin,
            borderRadius: '50%',
            backgroundColor: color,
            opacity: 0.6,
            animation: 'bounce 0.6s infinite alternate',
            animationDelay: '0.6s',
          }}
        />
      </div>
    </div>
  );
}