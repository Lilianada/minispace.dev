'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import DOMPurify from 'isomorphic-dompurify';

interface EnhancedMarkdownRendererProps {
  content: string;
  className?: string;
  allowHtml?: boolean;
}

export function EnhancedMarkdownRenderer({ 
  content, 
  className = '',
  allowHtml = false
}: EnhancedMarkdownRendererProps) {
  // Process custom markdown extensions for text colors
  const processColorSyntax = (markdown: string): string => {
    // Process color syntax: {color:red}text{/color}
    return markdown.replace(
      /\{color:([\w-]+)\}(.*?)\{\/color\}/gs,
      '<span style="color:$1">$2</span>'
    );
  };

  // Process custom markdown extensions for text alignment
  const processAlignmentSyntax = (markdown: string): string => {
    // Process alignment syntax: {align:center}text{/align}
    return markdown
      .replace(
        /\{align:center\}(.*?)\{\/align\}/gs,
        '<div style="text-align:center">$1</div>'
      )
      .replace(
        /\{align:right\}(.*?)\{\/align\}/gs,
        '<div style="text-align:right">$1</div>'
      )
      .replace(
        /\{align:left\}(.*?)\{\/align\}/gs,
        '<div style="text-align:left">$1</div>'
      );
  };

  // Process custom markdown extensions for text size
  const processSizeSyntax = (markdown: string): string => {
    // Process size syntax: {size:large}text{/size}
    return markdown
      .replace(
        /\{size:small\}(.*?)\{\/size\}/gs,
        '<span style="font-size:0.875em">$1</span>'
      )
      .replace(
        /\{size:large\}(.*?)\{\/size\}/gs,
        '<span style="font-size:1.25em">$1</span>'
      )
      .replace(
        /\{size:larger\}(.*?)\{\/size\}/gs,
        '<span style="font-size:1.5em">$1</span>'
      );
  };

  // Ensure dividers are properly formatted
  const processDividers = (markdown: string): string => {
    // Replace --- with proper horizontal rule
    return markdown.replace(/\n\s*---\s*\n/g, '\n\n<hr class="my-8 border-t border-gray-300 dark:border-gray-700" />\n\n');
  };

  // Process all custom syntax
  const processedContent = React.useMemo(() => {
    let processed = content;
    processed = processColorSyntax(processed);
    processed = processAlignmentSyntax(processed);
    processed = processSizeSyntax(processed);
    processed = processDividers(processed);
    
    // Sanitize if HTML is not allowed
    if (!allowHtml) {
      processed = DOMPurify.sanitize(processed);
    }
    
    return processed;
  }, [content, allowHtml]);

  return (
    <div className={`prose prose-sm sm:prose max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={atomDark}
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
          // Custom rendering for blockquotes
          blockquote({node, children, ...props}) {
            return (
              <blockquote 
                className="border-l-4 border-primary pl-4 italic text-gray-700 dark:text-gray-300"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          // Custom rendering for tables
          table({node, children, ...props}) {
            return (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          // Custom rendering for images
          img({node, ...props}) {
            return (
              <img 
                className="rounded-md shadow-md max-w-full h-auto" 
                loading="lazy"
                {...props} 
              />
            );
          },
          // Custom rendering for links
          a({node, children, ...props}) {
            return (
              <a 
                className="text-primary hover:text-primary/80 underline" 
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
          // Custom rendering for horizontal rules
          hr({node, ...props}) {
            return (
              <hr 
                className="my-8 border-t border-gray-300 dark:border-gray-700" 
                {...props} 
              />
            );
          }
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
