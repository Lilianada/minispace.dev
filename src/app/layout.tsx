import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProgressBar } from "@/components/ui/progress-bar";
import Providers from "@/components/common/Providers";
// Import debug overlay component
import { RoutingDebugOverlay } from "@/components/debug/RoutingDebugOverlay";

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
        <ProgressBar />
        <Providers>
          <TooltipProvider>
            {children}
            <Analytics />
            <Toaster />
            <RoutingDebugOverlay />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
