import React from "react";

interface ContactBlockProps {
  content: {
    email?: string;
    socials?: {
      github?: string;
      twitter?: string;
      linkedin?: string;
    };
  };
}

export default function ContactBlock({ content }: ContactBlockProps) {
  const { email, socials = {} } = content;
  return (
    <section className="text-center py-10">
      <h2 className="text-2xl font-bold mb-2">Let’s build something amazing!</h2>
      {email && (
        <a
          className="text-lg text-primary font-semibold block mb-6"
          href={`mailto:${email}`}
        >
          {email}
        </a>
      )}
      <div className="flex justify-center gap-5">
        {socials.github && (
          <a
            href={`https://github.com/${socials.github}`}
            className="text-gray-200 hover:text-primary text-xl"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        )}
        {socials.twitter && (
          <a
            href={`https://twitter.com/${socials.twitter}`}
            className="text-gray-200 hover:text-primary text-xl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
        )}
        {socials.linkedin && (
          <a
            href={`https://linkedin.com/in/${socials.linkedin}`}
            className="text-gray-200 hover:text-primary text-xl"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        )}
      </div>
    </section>
  );
}