'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CTABlockProps {
  content: {
    text: string;
    link: string;
    buttonStyle?: 'primary' | 'secondary' | 'outline';
  };
}

export default function CTABlock({ content }: CTABlockProps) {
  const { text, link, buttonStyle = 'primary' } = content;
  
  const buttonVariant = {
    primary: 'default',
    secondary: 'secondary',
    outline: 'outline'
  }[buttonStyle];
  
  return (
    <section className="py-8 text-center">
      <Link href={link}>
        <Button variant={buttonVariant as any} size="lg">
          {text}
        </Button>
      </Link>
    </section>
  );
}
