import React from "react";
import PortfolioTheme from "../index";

const sampleProjects = [
  {
    id: "1",
    title: "Personal Portfolio",
    description: "A sleek portfolio site built with React and TypeScript.",
    image: "/preview/project1.png",
    link: "https://yourportfolio.com",
    tags: ["React", "TypeScript", "Portfolio"]
  },
  {
    id: "2",
    title: "Blog Platform",
    description: "A fast, minimal blog with MDX and custom themes.",
    image: "/preview/project2.png",
    link: "https://yourblog.com",
    tags: ["MDX", "Blog", "Next.js"]
  },
  {
    id: "3",
    title: "Design System",
    description: "Reusable UI components for modern web apps.",
    image: "/preview/project3.png",
    link: "https://designsystem.com",
    tags: ["UI", "Design", "Storybook"]
  }
];

export default function ThemePreview() {
  const { config, components } = PortfolioTheme;
  const { HomePage } = components;
  return (
    <div className="bg-[#181924] min-h-screen text-white">
      <HomePage config={config} featuredProjects={sampleProjects} />
    </div>
  );
}