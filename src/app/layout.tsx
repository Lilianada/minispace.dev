import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import { Analytics } from "@vercel/analytics/react";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Minispace - Minimalist Blogging",
  description: "A minimalist blogging platform",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Minispace - Minimalist Blogging",
    description: "A minimalist blogging platform",
    url: "https://minispace.dev",
    siteName: "Minispace",
    images: [
      {
        url: "https://minispace.dev/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Minispace - Minimalist Blogging",
    description: "A minimalist blogging platform",
    images: ["https://minispace.dev/og-image.png"],
    creator: "@minispace",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>
          <Providers>
            <TooltipProvider>
              {children}
              <Analytics />
              <Toaster />
            </TooltipProvider>
          </Providers>
        </ToastProvider>
      </body>
    </html>
  );
}
