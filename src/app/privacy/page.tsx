import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import LoadingScreen from "@/components/LoadingScreen";

export const metadata: Metadata = {
  title: "Privacy Policy | Minispace",
  description: "Read our privacy policy for Minispace: your digital home, not a feed.",
};

export default function PrivacyPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
          <div>
            {/* Header */}
            <Header />
    <main className="prose prose-zinc mx-auto max-w-3xl py-10 px-4">
      <h1>Privacy Policy</h1>
      <p className="text-zinc-500 text-sm mb-8">Last updated: May 22, 2025</p>
      <p>
        Welcome to <strong>Minispace</strong> — your little corner of the web.
      </p>
      <p>
        We believe your online home should feel safe, private, and truly yours. This page explains how we handle your data, your privacy, and our philosophy on user rights.
      </p>

      <h2>No surveillance, no selling</h2>
      <p>
        Minispace exists so you can express yourself freely and comfortably. We do <strong>not</strong>:
      </p>
      <ul>
        <li>Sell your data to advertisers or brokers</li>
        <li>Track you across the web</li>
        <li>Embed third-party analytics that profile you</li>
      </ul>
      <p>Your data lives here, not everywhere.</p>

      <h2>What we collect — and why</h2>
      <ul>
        <li>
          <strong>Account information:</strong> If you sign up, we store your email (for login/reset) and your chosen display name.
        </li>
        <li>
          <strong>Your content:</strong> Everything you write, upload, or customize — pages, notes, images, themes — is stored so it appears on your Minispace.
        </li>
        <li>
          <strong>Basic logs:</strong> We keep simple logs for security (e.g. failed login attempts), not for profiling.
        </li>
      </ul>
      <p>
        We do not keep unnecessary logs, and we never read your Minispace content for advertising or profiling.
      </p>

      <h2>How your data is used</h2>
      <ul>
        <li>To show your site to visitors (your public posts)</li>
        <li>To let you log in and customize your space</li>
        <li>To back up your site (so you don’t lose your work)</li>
        <li>To provide basic stats (optional, opt-in only)</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We use only essential cookies — for example, to keep you logged in. No tracking cookies, ever.
      </p>

      <h2>Your choices &amp; rights</h2>
      <ul>
        <li>
          <strong>You control your data</strong> — edit, export, or delete your Minispace at any time, no questions asked.
        </li>
        <li>
          <strong>Opt out of stats</strong> — if offered, analytics are always optional and anonymous.
        </li>
        <li>
          <strong>No dark patterns</strong> — no “gotchas,” no hidden settings.
        </li>
      </ul>

      <h2>Third-party services</h2>
      <p>
        If we ever use a third-party service (like image hosting or email), we’ll say so clearly, and only choose privacy-respecting providers.
      </p>

      <h2>Children’s privacy</h2>
      <p>
        Minispace is not intended for children under 13. We do not knowingly collect personal information from children.
      </p>

      <h2>Contact</h2>
      <p>
        Have privacy questions or want your data deleted? Email us at{" "}
        <a href="mailto:hello@minispace.xyz">hello@minispace.xyz</a>.
      </p>

      <blockquote>
        <strong>Minispace is your home, not a feed.</strong>
        <br />
        We believe in digital permanence, creative freedom, and never monetizing your identity.
      </blockquote>
    </main>
            {/* Footer */}
            <Footer />
          </div>
        </Suspense>
  );
}