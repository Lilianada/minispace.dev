import React from "react";
import Layout from "../components/Layout";
import TitleBlock from "../blocks/TitleBlock";
import { ThemeConfig } from "../theme.config";

interface AboutPageProps {
  config: ThemeConfig;
}

export default function AboutPage({ config }: AboutPageProps) {
  const blocks = config.pages.about.blocks.sort((a, b) => a.order - b.order);
  return (
    <Layout config={config}>
      {blocks.map((block) => {
        switch (block.type) {
          case "title":
            return <TitleBlock key={block.id} content={block.content} />;
          case "text":
            return (
              <section key={block.id} className="py-4 text-lg text-gray-300 max-w-xl mx-auto">
                {block.content.text}
              </section>
            );
          default:
            return null;
        }
      })}
    </Layout>
  );
}