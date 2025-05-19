import React from "react";
import Layout from "../components/Layout";
import TitleBlock from "../blocks/TitleBlock";
import ProjectGridBlock from "../blocks/ProjectGridBlock";
import { ThemeConfig } from "../theme.config";

interface ProjectsPageProps {
  config: ThemeConfig;
  projects: any[];
}

export default function ProjectsPage({ config, projects }: ProjectsPageProps) {
  const blocks = config.pages.projects.blocks.sort((a, b) => a.order - b.order);
  return (
    <Layout config={config}>
      {blocks.map((block) => {
        switch (block.type) {
          case "title":
            return <TitleBlock key={block.id} content={block.content} />;
          case "project-grid":
            return (
              <ProjectGridBlock
                key={block.id}
                content={block.content}
                projects={projects}
              />
            );
          default:
            return null;
        }
      })}
    </Layout>
  );
}