import React from "react";
import Layout from "../components/Layout";
import TitleBlock from "../blocks/TitleBlock";
import ProjectCardBlock from "../blocks/ProjectCardBlock";
import { ThemeConfig } from "../theme.config";

interface ProjectPageProps {
  config: ThemeConfig;
  project: any;
}

export default function ProjectPage({ config, project }: ProjectPageProps) {
  const blocks = config.pages.project.blocks.sort((a, b) => a.order - b.order);
  return (
    <Layout config={config}>
      {blocks.map((block) => {
        switch (block.type) {
          case "title":
            return (
              <TitleBlock
                key={block.id}
                content={{ ...block.content, text: project.title }}
              />
            );
          case "project-card":
            return <ProjectCardBlock key={block.id} project={project} />;
          default:
            return null;
        }
      })}
    </Layout>
  );
}