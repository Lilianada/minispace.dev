import React from "react";
import ProjectCardBlock from "./ProjectCardBlock";

interface ProjectGridBlockProps {
  content: {
    count?: number;
    projects?: any[];
  };
  projects?: any[]; // fallback or pass as prop
}

export default function ProjectGridBlock({
  content,
  projects: propProjects,
}: ProjectGridBlockProps) {
  const projects = content.projects || propProjects || [];
  const count = content.count || projects.length;
  return (
    <section className="py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.slice(0, count).map((project, i) => (
          <ProjectCardBlock key={project.id || i} project={project} />
        ))}
      </div>
    </section>
  );
}