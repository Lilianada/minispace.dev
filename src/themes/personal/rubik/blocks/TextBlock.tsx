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
    <section className={`py-8 ${alignmentClasses[alignment]}`}>
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed">{text}</p>
      </div>
    </section>
  );
}
