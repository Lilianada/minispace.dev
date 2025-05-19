import React from "react";
import Layout from "../components/Layout";
import TitleBlock from "../blocks/TitleBlock";
import ContactBlock from "../blocks/ContactBlock";
import { ThemeConfig } from "../theme.config";

interface ContactPageProps {
  config: ThemeConfig;
}

export default function ContactPage({ config }: ContactPageProps) {
  const blocks = config.pages.contact.blocks.sort((a, b) => a.order - b.order);
  return (
    <Layout config={config}>
      {blocks.map((block) => {
        switch (block.type) {
          case "title":
            return <TitleBlock key={block.id} content={block.content} />;
          case "contact":
            return <ContactBlock key={block.id} content={block.content} />;
          default:
            return null;
        }
      })}
    </Layout>
  );
}