import React from "react";

interface HeroBlockProps {
  content: {
    heading: string;
    subheading?: string;
    showAvatar?: boolean;
    avatarUrl?: string;
    cta?: { text: string; link: string };
  };
}

export default function HeroBlock({ content }: HeroBlockProps) {
  const { heading, subheading, showAvatar, avatarUrl, cta } = content;
  return (
    <section className="text-center py-12">
      {showAvatar && (
        <div className="flex justify-center mb-6">
          <img
            src={avatarUrl || "/avatar.png"}
            alt={heading}
            className="w-28 h-28 rounded-full border-4 border-primary shadow-lg"
          />
        </div>
      )}
      <h1 className="text-4xl font-extrabold mb-2">{heading}</h1>
      {subheading && (
        <p className="text-xl text-gray-400 mb-4">{subheading}</p>
      )}
      {cta && (
        <a
          href={cta.link}
          className="inline-block mt-4 px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-accent transition"
        >
          {cta.text}
        </a>
      )}
    </section>
  );
}