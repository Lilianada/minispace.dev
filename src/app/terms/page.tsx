import LoadingScreen from "@/components/LoadingScreen";
import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Terms of Service | Minispace",
  description:
    "Read our Terms of Service for Minispace: your creative webroom.",
};

export default function TermsPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <div>
        {/* Header */}
        <Header />
        <main className="prose prose-zinc mx-auto max-w-3xl py-10 px-4">
          <h1>Terms of Service</h1>
          <p className="text-zinc-500 text-sm mb-8">
            Last updated: May 22, 2025
          </p>
          <p>
            Welcome to <strong>Minispace</strong> — a cozy, creative space for
            self-expression.
          </p>
          <p>
            By using Minispace, you agree to these simple, human-friendly terms.
            If you have questions,{" "}
            <a href="mailto:hello@minispace.xyz">reach out</a>.
          </p>

          <h2>Your Minispace is yours</h2>
          <ul>
            <li>
              You own your content. You can edit, export, or delete it at any
              time.
            </li>
            <li>You decide what to share publicly and what to keep private.</li>
          </ul>

          <h2>Account basics</h2>
          <ul>
            <li>You need an email address to sign up.</li>
            <li>Please use your own info, and keep your login safe.</li>
            <li>Don’t impersonate others or use Minispace for deception.</li>
          </ul>

          <h2>Content guidelines</h2>
          <ul>
            <li>
              Minispace is a home for{" "}
              <strong>personal, creative expression</strong>.
            </li>
            <li>
              Please don’t post content that is illegal, abusive, hateful, or
              violates the rights of others.
            </li>
            <li>
              We may remove content or suspend accounts that break these rules —
              but we aim for a light touch and fair warning.
            </li>
          </ul>

          <h2>Your responsibilities</h2>
          <ul>
            <li>Don’t try to break, hack, or misuse the service.</li>
            <li>Respect the privacy and rights of other users.</li>
            <li>Don’t use Minispace for spam, bots, or commercial scraping.</li>
          </ul>

          <h2>Uptime &amp; changes</h2>
          <ul>
            <li>
              We do our best to keep Minispace fast and reliable, but uptime
              isn’t guaranteed.
            </li>
            <li>
              Features may change as we improve Minispace, but you’ll always
              have ways to export your data.
            </li>
          </ul>

          <h2>Account deletion &amp; data</h2>
          <ul>
            <li>
              Delete your account at any time — your data will be wiped from our
              servers.
            </li>
            <li>We’ll never lock you in or hold your data hostage.</li>
          </ul>

          <h2>Liability</h2>
          <ul>
            <li>
              Minispace is provided “as is.” We aren’t responsible for losses or
              damages from use (or lack of use) of the service.
            </li>
            <li>
              You use Minispace at your own risk, but we promise to treat your
              presence here with care.
            </li>
          </ul>

          <h2>Updates</h2>
          <ul>
            <li>
              We’ll post updates to these terms here. If changes are
              significant, we’ll try to let you know directly.
            </li>
            <li>
              Continued use of Minispace means you accept the most recent terms.
            </li>
          </ul>

          <blockquote>
            <strong>Minispace: A home, not a feed.</strong>
            <br />
            You bring the story, we bring the space.
          </blockquote>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Suspense>
  );
}
