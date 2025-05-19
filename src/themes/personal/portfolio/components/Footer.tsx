import React from "react";

interface FooterProps {
  text: string;
  showSocials?: boolean;
  showPoweredBy?: boolean;
  socials?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export default function Footer({ text, showSocials, showPoweredBy, socials }: FooterProps) {
  return (
    <footer className="bg-[#181924] text-gray-400 py-8 mt-8">
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-4">
        <div className="text-sm">{text}</div>
        {showSocials && socials && (
          <div className="flex gap-4 text-lg">
            {socials.github && (
              <a
                href={`https://github.com/${socials.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                GitHub
              </a>
            )}
            {socials.twitter && (
              <a
                href={`https://twitter.com/${socials.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Twitter
              </a>
            )}
            {socials.linkedin && (
              <a
                href={`https://linkedin.com/in/${socials.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                LinkedIn
              </a>
            )}
          </div>
        )}
        {showPoweredBy && (
          <div className="text-xs mt-1">
            Powered by <a href="https://minispace.dev" className="hover:text-primary">Minispace</a>
          </div>
        )}
      </div>
    </footer>
  );
}