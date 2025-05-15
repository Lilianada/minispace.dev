import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground max-w-md mx-auto mb-4">
          Ready to Create Something Amazing?
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Get started in less than 2 minutes. No credit card required.
        </p>
        <div>
          <Link 
            href="/signup" 
            className="btn btn-primary px-6 py-3 text-base"
          >
            Launch Your Minispace
          </Link>
        </div>
      </div>
    </section>
  );
}