'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BackLinkBlockProps {
  content: {
    text: string;
    link: string;
  };
}

export default function BackLinkBlock({ content }: BackLinkBlockProps) {
  const { text, link } = content;
  
  return (
    <section className="py-8">
      <Link 
        href={link} 
        className="inline-flex items-center gap-2 text-gray-700 hover:text-primary font-medium"
      >
        <ArrowLeft size={16} />
        <span>{text}</span>
      </Link>
    </section>
  );
}
