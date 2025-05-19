'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './global.css';
import './browser-tabs.css';
import Footer from './components/Footer';

const TestPage = () => {
  return (
    <div className="test-environment">
      {/* Header */}
      <header className="site-header">
        <div className="container">
          <div className="flex items-center">
            <div className="logo mr-auto md:mr-0 md:w-1/4">
              <Link href="/test">
                <span className="text-xl font-medium">minispace</span>
              </Link>
            </div>
            <nav className="hidden md:flex justify-center w-2/4">
              <Link href="/test" className="nav-link mx-4">Home</Link>
              <Link href="/test/about" className="nav-link mx-4">About</Link>
              <Link href="/test/discover" className="nav-link mx-4">Discover</Link>
              <Link href="/docs" className="nav-link mx-4">Docs</Link>
            </nav>
            <div className="hidden md:flex justify-end w-1/4">
              <Link href="/signin" className="nav-link mr-4">Sign In</Link>
              <Link href="/signup" className="button">Get Started</Link>
            </div>
            {/* Mobile menu button */}
            <button className="md:hidden ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Capari Inspired */}
      <section className="hero-section cloud-bg">
        {/* Cloud decorations */}
        <div className="flex justify-center w-full">
       <Image src="/cloud.png" alt="Cloud" width={300} height={300} />

        </div>
        
        <div className="container">
          <div className="text-center hero-content mb-xl">
            <h2 className="text-center text-sm uppercase tracking-wider mb-lg" style={{ color: '#5c5742' }}>minispace</h2>
            <h1 className="capari-heading text-4xl md:text-5xl lg:text-6xl mb-lg mx-auto" style={{ maxWidth: '800px' }}>
             Design your own little corner of the internet
            </h1>
            <p className="capari-subheading text-lg md:text-xl mx-auto mb-xl" style={{ maxWidth: '650px' }}>
            Minispace is your mini corner of the web — a place where you collect, create, express, and share the fragments that make you <i>you</i>. It is personal, quiet, human, and free.
            </p>
          </div>
          
          {/* Browser Windows Collection */}
          <div className="browser-collection mb-xl">
            {/* Main browser window */}
            <div className="browser-window main floating">
              <div className="browser-tabs">
                <div className="browser-tab active"></div>
                <div className="browser-tab"></div>
                <div className="browser-tab"></div>
              </div>
              <div className="browser-controls">
                <div className="browser-address-bar"></div>
              </div>
              <div className="browser-content">
                {/* Empty content */}
              </div>
            </div>
            
            {/* Floating browser windows */}
            <div className="browser-window float-1 floating">
              <div className="browser-tabs">
                <div className="browser-tab"></div>
              </div>
              <div className="browser-content">
                {/* Empty content */}
              </div>
            </div>
            
            <div className="browser-window float-2 floating">
              <div className="browser-tabs">
                <div className="browser-tab"></div>
              </div>
              <div className="browser-content">
                {/* Empty content */}
              </div>
            </div>
            
            <div className="browser-window float-3 floating">
              <div className="browser-tabs">
                <div className="browser-tab"></div>
              </div>
              <div className="browser-content">
                {/* Empty content */}
              </div>
            </div>
            
            <div className="browser-window float-4 floating">
              <div className="browser-tabs">
                <div className="browser-tab"></div>
              </div>
              <div className="browser-content">
                {/* Empty content */}
              </div>
            </div>
            
            <div className="browser-window float-5 floating">
              <div className="browser-tabs">
                <div className="browser-tab"></div>
              </div>
              <div className="browser-content">
                {/* Empty content */}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/signup" className="button">Create Your Space</Link>
            <Link href="/test/about" className="button button-outline ml-4">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Featured Spaces */}
      <section className="section bg-paper">
        <div className="container">
          <h2 className="text-center mb-xl">Spaces to explore</h2>
          <p className="text-center text-muted content-container mb-xl">
            Discover personal spaces created by people from around the world. Each one unique, each one a reflection of its creator.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-xl">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <div className="aspect-video bg-highlight mb-md rounded">
                  {/* Placeholder for site preview */}
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <span className="text-mono">Site preview {i}</span>
                  </div>
                </div>
                <h3 className="text-lg mb-sm">username.minispace.dev</h3>
                <p className="text-muted mb-md">A personal journal about travel, photography, and life's little moments.</p>
                <Link href="#" className="text-sm">Visit this space →</Link>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/discover" className="button button-outline">Discover More Spaces</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-paper">
        <div className="container">
          <div className="text-center mb-xl">
            <h2 className="capari-heading text-3xl md:text-4xl mb-md">Simple enough to start, deep enough to grow</h2>
            <p className="capari-subheading text-lg mx-auto" style={{ maxWidth: '650px' }}>
              Minispace gives structure to self-expression without diluting its freedom.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-xl">
            <div className="card border border-accent-muted hover:border-accent transition-colors">
              <div className="text-accent mb-md" style={{ fontSize: '2rem' }}>01</div>
              <h3 className="text-lg mb-sm font-medium">A home, not a feed</h3>
              <p className="text-muted">Your own subdomain that feels grounded and permanent, never transient or scroll-optimized.</p>
            </div>
            
            <div className="card border border-accent-muted hover:border-accent transition-colors">
              <div className="text-accent mb-md" style={{ fontSize: '2rem' }}>02</div>
              <h3 className="text-lg mb-sm font-medium">Fully yours</h3>
              <p className="text-muted">Visual customizations + markdown = an expression engine that adapts to your style.</p>
            </div>
            
            <div className="card border border-accent-muted hover:border-accent transition-colors">
              <div className="text-accent mb-md" style={{ fontSize: '2rem' }}>03</div>
              <h3 className="text-lg mb-sm font-medium">No design skills needed</h3>
              <p className="text-muted">Pre-built themes feel designed even when empty. Defaults look good, every layout feels intentional.</p>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/discover" className="button button-outline">Explore Features</Link>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="section cloud-bg" style={{ backgroundColor: 'var(--color-highlight)' }}>
        {/* Cloud decorations */}
        <div className="cloud cloud-1" style={{ opacity: '0.1' }}></div>
        
        <div className="container">
          <div className="content-container">
            <blockquote className="text-serif text-xl md:text-2xl mb-md text-center" style={{ fontWeight: 300, lineHeight: 1.6, color: '#5c5742' }}>
              "Because expression matters. Because some things deserve to live outside social feeds. Because tiny spaces tell big stories."
            </blockquote>
            <p className="text-center text-muted">— From the Minispace manifesto</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section bg-paper">
        <div className="container">
          <div className="text-center mb-xl">
            <h2 className="capari-heading text-3xl md:text-4xl mb-md">Simple, transparent pricing</h2>
            <p className="capari-subheading text-lg mx-auto" style={{ maxWidth: '650px' }}>
              Start for free and upgrade when you need more. No hidden fees, no surprises.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-xl">
            {/* Free Plan */}
            <div className="card border border-accent-muted hover:border-accent transition-colors">
              <div className="mb-md">
                <h3 className="text-lg font-medium mb-sm">Free</h3>
                <p className="text-3xl font-medium mb-sm">$0<span className="text-sm text-muted-foreground">/month</span></p>
                <p className="text-muted">Perfect for personal projects and experiments.</p>
              </div>
              <ul className="space-y-2 mb-lg">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Free subdomain (yourname.minispace.dev)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>5 pages</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>100MB storage</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Basic themes</span>
                </li>
              </ul>
              <Link href="/signup" className="button w-full">Get Started</Link>
            </div>
            
            {/* Pro Plan */}
            <div className="card border border-accent relative">
              <div className="absolute top-0 right-0 bg-accent text-white text-xs px-3 py-1 transform translate-y-0 translate-x-0">
                Popular
              </div>
              <div className="mb-md">
                <h3 className="text-lg font-medium mb-sm">Pro</h3>
                <p className="text-3xl font-medium mb-sm">$3<span className="text-sm text-muted-foreground">/month</span></p>
                <p className="text-muted">For creators who want more flexibility and features.</p>
              </div>
              <ul className="space-y-2 mb-lg">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Custom domain support</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Unlimited pages</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>1GB storage</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>All themes</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Custom CSS</span>
                </li>
              </ul>
              <Link href="/signup?plan=pro" className="button w-full">Upgrade to Pro</Link>
            </div>
            
            {/* Team Plan */}
            <div className="card border border-accent-muted hover:border-accent transition-colors">
              <div className="mb-md">
                <h3 className="text-lg font-medium mb-sm">Family</h3>
                <p className="text-3xl font-medium mb-sm">$14<span className="text-sm text-muted-foreground">/month</span></p>
                <p className="text-muted">For families and friends with multiple sites.</p>
              </div>
              <ul className="space-y-2 mb-lg">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>5 team members</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>10GB storage</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Team collaboration tools</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              <Link href="/signup?plan=team" className="button w-full">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="card text-center content-container mx-auto border border-accent-muted">
            <h2 className="capari-heading text-2xl md:text-3xl mb-md">Ready to carve out your corner?</h2>
            <p className="capari-subheading mb-lg">Get started in seconds. No credit card required.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup" className="button">Create Your Minispace</Link>
              <Link href="/discover" className="button button-outline">Explore Existing Spaces</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default TestPage;
