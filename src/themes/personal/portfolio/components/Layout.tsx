import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ThemeConfig } from "../theme.config";

interface LayoutProps {
  children: React.ReactNode;
  config: ThemeConfig;
  
}

export default function Layout({ children, config }: LayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: config.defaultStyles.colors.background,
        color: config.defaultStyles.colors.text,
        fontFamily: config.defaultStyles.fonts.body
      }}
    >
      <Header
        title={config.layout.header.title}
        menu={config.layout.header.menu}
        sticky={config.layout.header.sticky}
      />
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-10">{children}</main>
      <Footer
        text={config.layout.footer.text}
        showSocials={config.layout.footer.showSocials}
        showPoweredBy={config.layout.footer.showPoweredBy}
      />
    </div>
  );
}