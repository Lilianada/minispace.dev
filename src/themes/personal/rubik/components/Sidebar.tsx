'use client';

import React from 'react';
import Link from 'next/link';

interface SidebarProps {
  title: string;
  content: {
    showCategories?: boolean;
    showTags?: boolean;
    categories?: { name: string; slug: string; count: number }[];
    tags?: { name: string; slug: string; count: number }[];
  };
}

export default function Sidebar({ title, content }: SidebarProps) {
  const { showCategories = true, showTags = true, categories = [], tags = [] } = content;
  
  // Default categories and tags for preview
  const defaultCategories = [
    { name: 'Technology', slug: 'technology', count: 5 },
    { name: 'Life', slug: 'life', count: 3 },
    { name: 'Ideas', slug: 'ideas', count: 2 },
  ];
  
  const defaultTags = [
    { name: 'JavaScript', slug: 'javascript', count: 4 },
    { name: 'React', slug: 'react', count: 3 },
    { name: 'CSS', slug: 'css', count: 2 },
    { name: 'Productivity', slug: 'productivity', count: 2 },
    { name: 'Books', slug: 'books', count: 1 },
  ];
  
  const displayCategories = categories.length > 0 ? categories : defaultCategories;
  const displayTags = tags.length > 0 ? tags : defaultTags;

  return (
    <aside className="w-64 px-4 py-8 border-r border-gray-100 hidden lg:block">
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        
        {showCategories && displayCategories.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
            <ul className="space-y-2">
              {displayCategories.map((category) => (
                <li key={category.slug}>
                  <Link 
                    href={`/category/${category.slug}`}
                    className="text-gray-600 hover:text-primary flex justify-between items-center"
                  >
                    <span>{category.name}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {showTags && displayTags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {displayTags.map((tag) => (
                <Link 
                  key={tag.slug}
                  href={`/tag/${tag.slug}`}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
