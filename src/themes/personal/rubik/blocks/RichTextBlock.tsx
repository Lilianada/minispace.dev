'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface RichTextBlockProps {
  content: {
    text: string;
  };
}

export default function RichTextBlock({ content }: RichTextBlockProps) {
  const { text } = content;
  
  return (
    <section className="py-6">
      <div className="prose prose-gray max-w-none">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={nord}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            a: ({ node, ...props }) => (
              <a 
                {...props} 
                className="text-primary hover:underline"
                target={props.href?.startsWith('http') ? '_blank' : undefined}
                rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              />
            ),
            h1: ({ node, ...props }) => <h1 {...props} className="text-3xl font-bold mt-8 mb-4" />,
            h2: ({ node, ...props }) => <h2 {...props} className="text-2xl font-bold mt-8 mb-3" />,
            h3: ({ node, ...props }) => <h3 {...props} className="text-xl font-bold mt-6 mb-3" />,
            p: ({ node, ...props }) => <p {...props} className="my-4 leading-relaxed" />,
            ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-6 my-4" />,
            ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-6 my-4" />,
            li: ({ node, ...props }) => <li {...props} className="mb-1" />,
            blockquote: ({ node, ...props }) => (
              <blockquote
                {...props}
                className="border-l-4 border-gray-200 pl-4 italic my-6 text-gray-700"
              />
            ),
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </section>
  );
}
