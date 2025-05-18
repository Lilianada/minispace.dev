'use client';

import React from 'react';

export default function IntroSection() {
  return (
    <section id="introduction" className="mb-12">
      <h1 className="text-3xl font-bold mb-4">Minispace Documentation</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Everything you need to know about building and hosting your Minispace site
      </p>
      
      <div className="prose max-w-none">
        <p>
          Minispace is a no-code publishing tool for developers and creatives who want the performance 
          of static sites without the setup complexity of Hugo or Jekyll.
        </p>
      </div>
    </section>
  );
}
