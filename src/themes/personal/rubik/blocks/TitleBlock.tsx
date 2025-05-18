'use client';

import React from 'react';

interface TitleBlockProps {
  content: {
    text: string;
    alignment?: 'left' | 'center' | 'right';
    size?: 'small' | 'medium' | 'large';
  };
}

export default function TitleBlock({ content }: TitleBlockProps) {
  const { text, alignment = 'left', size = 'large' } = content;
  
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
  };
  
  return (
    <section className={`py-6 ${alignmentClasses[alignment]}`}>
      <h1 className={`${sizeClasses[size]} font-bold text-gray-900`}>{text}</h1>
    </section>
  );
}
