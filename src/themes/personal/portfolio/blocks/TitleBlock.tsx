import React from "react";

interface TitleBlockProps {
  content: {
    text: string;
    alignment?: "left" | "center" | "right";
    size?: "small" | "medium" | "large";
  };
}

export default function TitleBlock({ content }: TitleBlockProps) {
  const { text, alignment = "left", size = "large" } = content;
  const alignClass =
    alignment === "center"
      ? "text-center"
      : alignment === "right"
      ? "text-right"
      : "text-left";
  const sizeClass =
    size === "small"
      ? "text-xl"
      : size === "medium"
      ? "text-2xl"
      : "text-3xl";
  return (
    <section className={`py-6 ${alignClass}`}>
      <h1 className={`${sizeClass} font-extrabold text-white`}>{text}</h1>
    </section>
  );
}