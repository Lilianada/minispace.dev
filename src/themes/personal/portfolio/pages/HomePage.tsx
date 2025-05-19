import React from "react";
import Layout from "../components/Layout";
import HeroBlock from "../blocks/HeroBlock";
import SkillsBlock from "../blocks/SkillsBlock";
import ProjectGridBlock from "../blocks/ProjectGridBlock";
import { ThemeConfig } from "../theme.config";

interface HomePageProps {
  config: ThemeConfig;
  featuredProjects: any[];
}

export default function HomePage({ config, featuredProjects }: HomePageProps) {
  const blocks = config.pages.home.blocks.sort((a, b) => a.order - b.order);
  return (
    <Layout config={config}>
      {blocks.map((block) => {
        switch (block.type) {
          case "hero":
            return <HeroBlock key={block.id} content={block.content} />;
          case "skills":
            return <SkillsBlock key={block.id} content={block.content} />;
          case "project-grid":
            return (
              <ProjectGridBlock
                key={block.id}
                content={block.content}
                projects={featuredProjects}
              />
            );
          default:
            return null;
        }
      })}
    </Layout>
  );
}