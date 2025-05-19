import React from "react";

interface SidebarProps {
  title?: string;
  content?: any;
}

export default function Sidebar({ title, content }: SidebarProps) {
  if (!content && !title) return null;
  return (
    <aside className="hidden lg:block w-64 p-6 bg-[#222431] rounded-xl shadow-lg mr-8">
      {title && <h2 className="text-primary font-bold text-lg mb-3">{title}</h2>}
      {content}
    </aside>
  );
}