import type { Metadata } from "next";
import { Mail, MessageCircle, Heart, Github } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | Minispace",
  description: "Get in touch with the Minispace team. We'd love to hear from you!",
};

export default function ContactPage() {
  return (
    <main className="h-screen w-full bg-primary/20 flex items-center justify-center px-4">
      <div className="relative w-full max-w-lg mx-auto rounded-3xl bg-white/95 dark:bg-zinc-950/95 shadow-2xl p-6 md:p-10 border border-zinc-100 dark:border-zinc-800 flex flex-col gap-6 justify-center overflow-hidden"
        style={{ maxHeight: "90vh" }}>
        {/* Floating Decorative Heart */}
        <Heart className="absolute left-6 top-4 text-pink-200 dark:text-pink-400 opacity-70 animate-pulse" size={30} />
        <Heart className="absolute right-8 top-0 text-primary opacity-10" size={64} />
        {/* Heading Area */}
        <div className="flex flex-col items-center gap-2 mb-2">
         
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight text-center">
            Contact Minispace
          </h1>
          <p className="text-zinc-500 dark:text-zinc-300 text-center text-base max-w-md mt-1">
            We love hearing from fellow creators and tinkerers.<br />
            Whether feedback, a question, or just a hello — drop us a note!
          </p>
        </div>
        {/* Contact Form */}
        <form
          className="flex flex-col gap-3"
          action="mailto:hello@minispace.xyz"
          method="POST"
          encType="text/plain"
        >
          <label className="flex flex-col gap-1">
            <span className="font-medium text-zinc-700 dark:text-zinc-200">Name</span>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Ada Lovelace"
              className="rounded-lg px-4 py-2 border border-primary/20 bg-white dark:bg-zinc-900/80 focus:border-primary focus:ring-primary/30 transition-all"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-zinc-700 dark:text-zinc-200">Email</span>
            <input
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className="rounded-lg px-4 py-2 border border-primary/20 bg-white dark:bg-zinc-900/80 focus:border-primary focus:ring-primary/30 transition-all"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-zinc-700 dark:text-zinc-200">Message</span>
            <textarea
              name="message"
              required
              rows={3}
              maxLength={400}
              placeholder="What's on your mind?"
              className="rounded-lg px-4 py-2 border border-primary/20 bg-white dark:bg-zinc-900/80 focus:border-primary focus:ring-primary/30 transition-all resize-none"
            />
          </label>
          <button
            type="submit"
            className="mt-2 bg-primary text-white font-bold py-2.5 rounded-xl shadow-lg hover:bg-primary/90 transition-all active:scale-95"
          >
            Send Message 💌
          </button>
        </form>
        {/* Cute Footer */}
        <div className="mt-3 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Minispace is your cozy webroom.<br />
          We reply to most messages within 48 hours!
        </div>
      </div>
    </main>
  );
}