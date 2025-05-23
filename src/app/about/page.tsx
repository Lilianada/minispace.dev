"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Footer from "../../components/landing/footer";
import Header from "../../components/landing/navbar";
import { Card, CardTitle } from "@/components/ui/card";
import { CheckIcon, X } from "lucide-react";
import Image from "next/image";
import LoadingScreen from "@/components/LoadingScreen";

const AboutPage = () => {
  const loveToHost = [
    "Blogs & personal sites",
    "Digital gardens & zettelkastens",
    "Portfolios websites",
    "Hobby pages & fan sites",
    "Cliques, collectives, school projects",
    "Design resources & graphics pages",
  ];
  const dontHost = [
    "E-commerce or dropshipping stores",
    "Affiliate/SEO-farmed content",
    "Gambling, adult content, crypto trading",
    "Political or religious propaganda",
    "Anything AI-generated without human editing",
    "Spam, Illegal, Harmful, or Harmful Content",
  ];
  return (
    <Suspense fallback={<LoadingScreen />}>
      <div className="test-environment">
        {/* Header */}
        <Header />

        <main className="max-w-3xl mx-auto px-4 py-16 text-zinc-800 space-y-16">
          {/* What is Minispace */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Minispace</h2>
            <div className="prose prose-zinc mb-2">
              <p>
                Minispace is a lightweight, minimal, personal site builder made
                for anyone who wants to carve out a little space online. Whether
                you’re journaling your thoughts, building a digital garden,
                archiving your school projects, or starting a tiny fan site —
                you can do it here, simply and beautifully.
              </p>
            </div>
            <div className="bg-primary/5 rounded p-3 mb-2 text-zinc-700 font-mono text-sm">
              <span className="font-semibold">username.minispace.dev</span>
            </div>
            <p className="text-zinc-500 text-sm">
              …with full control over your design, layout, and content.
            </p>
          </section>

          {/* Founder's Note */}
          <section className="">
            <Card className="p-4 bg-primary/5 border-primary/30 noise">
              <CardTitle className="text-xl font-semibold mb-4 text-primary">
                Founder's Note
              </CardTitle>
              <div className="prose prose-zinc mb-4">
                <p>
                  The internet gave us an opportunity to find people who live
                  hundreds and thousands of miles away just by clicking a few
                  buttons. Everyone has the chance to create a presence, a
                  space, an identity — to design and refine it, make it their
                  own, give it personality, and add bits to it.
                </p>
                <p>
                  Finding these spaces, exploring them, breaking them down,
                  reading what the writer has to say, gives me my fair share of
                  daily dopamine.
                </p>
                <p className="mt-2">
                  Why should everyone have one?
                  <br />
                  The real question is, <strong>why not?</strong>
                </p>
                <p className="mt-2">
                  You can do whatever you want with it, add whatever you want —
                  without constraints or restrictions. Build something you might
                  never have in real life, or just create something good enough
                  to share the tiny bits that make you <em>you</em>. Tell
                  stories, share tales, express your thoughts.
                </p>
                <p>
                  If you want to do that and don’t know where to start... I’m
                  building <strong>Minispace</strong>.
                </p>
                <p>
                  With Minispace, you can get your own mini corner of the web.
                </p>
              </div>
              <div className="">
                <Image
                  src="/signature.png"
                  alt="Signature"
                  width={200}
                  height={100}
                />
              </div>
            </Card>
          </section>

          <section className="bg-white/70 dark:bg-zinc-900/70 rounded-xl shadow-sm p-6  mx-auto mb-6 border border-primar dark:border-zinc-800">
            <div className="flex flex-col gap-6">
              {/* Section Title */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1 text-zinc-900 dark:text-zinc-100">
                  Minispace: For Creators, Tinkerers &amp; the Web’s Joyful Few
                </h2>
                <p className="text-zinc-500 text-sm mb-2">
                  If you miss the creativity of the early internet, you’re going
                  to feel right at home.
                </p>
              </div>
              
              {/* How does it work */}
              <div>
                <h3 className="text-lg font-semibold mb-1 text-zinc-800 dark:text-zinc-200">
                  How does it work?
                </h3>
                <p className="text-zinc-600 mb-2">
                  Sign up, choose a theme, customize your space, and write.
                  That’s it.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-700 dark:text-zinc-300 text-base mb-2">
                  <li>Add pages like Home, About, and Posts</li>
                  <li>Customize layout and theme</li>
                  <li>Publish blog posts</li>
                  <li>Preview posts before publishing</li>
                  <li>Export your data</li>
                  <li>Host at your own subdomain</li>
                  <li>Even migrate from other platforms</li>
                </ul>
                <p className="text-zinc-600 mt-1">
                  <strong>Your space is yours.</strong> We just give you the
                  tools to build it.
                </p>
              </div>

              {/* Philosophy */}
              <div>
                <h3 className="text-lg font-semibold mb-1 text-zinc-800 dark:text-zinc-200">
                  Our Philosophy
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-zinc-700 dark:text-zinc-300 text-base mb-2">
                  <li>Small sites over massive platforms</li>
                  <li>Personal expression over performance metrics</li>
                  <li>Writing for joy, not algorithms</li>
                  <li>Minimalism, simplicity, and creative freedom</li>
                  <li>Giving people ownership of their own space on the web</li>
                </ul>
                <p className="text-zinc-600 mb-1">
                  We don’t track, we don’t sell your data, and we won’t clutter
                  your dashboard with stuff you didn’t ask for. Minispace is not
                  about numbers — it’s about expression.
                </p>
              </div>
            </div>
          </section>

          {/* What We Host */}
          <section>
            <h2 className="text-xl font-semibold mb-2">What We Host</h2>
            <div className="flex flex-col md:flex-row gap-4">
              {/* We Love to Host */}
              <div className="border border-primary p-4 flex-1 rounded-lg bg-white/90">
                <h3 className="text-base font-bold mb-3 text-primary">
                  We Love to Host
                </h3>
                <ul className="space-y-3">
                  {loveToHost.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-zinc-700 text-sm"
                    >
                      <span className="inline-flex items-center justify-center rounded-full bg-primary w-5 h-5">
                        <CheckIcon className="w-3 h-3 text-white" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* We Don't Host */}
              <div className="border border-red-500 p-4 flex-1 rounded-lg bg-white/90">
                <h3 className="text-base font-bold mb-3 text-red-500">
                  We Don’t Host
                </h3>
                <ul className="space-y-3">
                  {dontHost.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-zinc-700 text-sm"
                    >
                      <span className="inline-flex items-center justify-center rounded-full bg-red-500 w-5 h-5">
                        <X className="w-3 h-3 text-white" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* What's Next */}
          <section>
            <h2 className="text-xl font-semibold mb-2">What’s Next?</h2>
            <div className="prose prose-zinc">
              <p>
                We’re building slowly and thoughtfully. Expect more layouts,
                themes, and customization features soon — always with
                performance and simplicity in mind.
              </p>
              <p>You can follow the project and contribute ideas too.</p>
            </div>
          </section>

          {/* Inspired By */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Inspired By</h2>
            <ul className="list-disc pl-5 space-y-1 text-zinc-700">
              <li>
                <Link
                  href="https://bearblog.dev"
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  bearblog.dev
                </Link>
              </li>
              <li>
                <Link
                  href="https://indieweb.org"
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  indieweb.org
                </Link>
              </li>
              <li>
                <Link
                  href="https://micro.blog"
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  micro.blog
                </Link>
              </li>
              <li>
                <Link
                  href="https://hugo.io"
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  hugo.io
                </Link>
              </li>
              <li>
                <Link
                  href="https://jekyllrb.com"
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  jekyllrb.com
                </Link>
              </li>
              <li>
                <Link
                  href="https://neocities.org"
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  neocities.org
                </Link>
              </li>
              <li>
                <Link
                  href="https://leprd.space/"
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  leprd.space
                </Link>
              </li>
              <li>The early blogosphere and zine culture.</li>
              <li>Digital gardens and hypertext creativity.</li>
              <li>The idea that everyone deserves a tiny home on the web.</li>
            </ul>
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Suspense>
  );
};

export default AboutPage;
