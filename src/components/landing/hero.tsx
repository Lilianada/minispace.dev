/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 pt-20 pb-16 sm:pt-24 sm:pb-20 text-center min-h-[calc(100vh-80px)] flex flex-col justify-center items-center">
      <div className="inline-flex items-center justify-center rounded-full border border-accent/30 bg-accent/10 py-1 px-3 text-xs font-medium text-accent mb-6 w-fit">
        <span>Limited Access</span>
        <span className="mx-1">•</span>
        <span>Join Our Beta Community Today</span>
      </div>
      
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground max-w-3xl mx-auto">
        Your Own Mini Space on the Internet in Minutes
      </h1>
      
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
        Create a stunning, lightning-fast blog without the complexity. Express yourself, share your ideas, and build your audience with Minispace's intuitive platform.
      </p>
      
      <div className="mt-10">
        <Link 
          href="/signup" 
          className="btn btn-primary px-6 py-3 text-base"
        >
          Claim Your Space
        </Link>
      </div>
    </section>
  );
}