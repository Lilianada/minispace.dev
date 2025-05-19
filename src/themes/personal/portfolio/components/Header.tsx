import React, { useState } from "react";
import Link from "next/link";

interface HeaderProps {
  title: string;
  menu: { label: string; path: string }[];
  sticky?: boolean;
}

export default function Header({ title, menu, sticky = true }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className={`bg-[#181924] ${sticky ? "sticky top-0 z-20" : ""} shadow`}>
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white tracking-wide">
          {title}
        </Link>
        <nav className="hidden md:flex space-x-8">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="text-gray-300 hover:text-primary font-medium transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          className="md:hidden text-gray-300"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="text-2xl">{open ? "✕" : "☰"}</span>
        </button>
      </div>
      {open && (
        <nav className="md:hidden bg-[#181924] px-4 pb-3">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="block py-2 text-gray-300 hover:text-primary font-medium transition"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}