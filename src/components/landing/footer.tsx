import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="mb-4 md:mb-0">
            <p>© 2025 Minispace</p>
          </div>
          <div className="flex space-x-6">
            <Link href="/terms" className="hover:text-accent">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-accent">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-accent">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}