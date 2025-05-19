import React from "react";

interface SkillsBlockProps {
  content: {
    skills: string[];
  };
}

export default function SkillsBlock({ content }: SkillsBlockProps) {
  return (
    <section className="py-6 text-center">
      <h2 className="text-2xl font-bold mb-2 text-primary">Skills</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {content.skills.map((skill) => (
          <span
            key={skill}
            className="bg-[#232533] text-primary px-4 py-2 rounded-full font-medium text-sm shadow"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}