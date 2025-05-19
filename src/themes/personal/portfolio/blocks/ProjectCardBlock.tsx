import React from "react";

interface ProjectCardBlockProps {
  project: {
    title: string;
    description: string;
    image?: string;
    link?: string;
    tags?: string[];
  };
}

export default function ProjectCardBlock({ project }: ProjectCardBlockProps) {
  const { title, description, image, link, tags } = project;
  return (
    <div className="bg-[#222431] rounded-xl shadow p-5 flex flex-col hover:-translate-y-2 hover:shadow-xl transition">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
      )}
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-300 mb-3">{description}</p>
      {tags && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start mt-auto text-primary hover:underline font-semibold"
        >
          View Project →
        </a>
      )}
    </div>
  );
}