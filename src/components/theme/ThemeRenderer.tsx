'use client';

import { useEffect, useState, useRef } from 'react';

interface ThemeRendererProps {
  themeId: string;
  pageName: string;
  html: string;
  css: string;
  userCustomCSS?: string;
  viewportSize?: 'desktop' | 'tablet' | 'mobile';
}

/**
 * ThemeRenderer component
 * 
 * Renders a theme preview inside an iframe for proper isolation
 */
export default function ThemeRenderer({
  themeId,
  pageName,
  html,
  css,
  userCustomCSS = '',
  viewportSize = 'desktop'
}: ThemeRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState('100vh');
  
  // Viewport size classes
  const viewportSizes = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]'
  };
  
  // When HTML or CSS changes, update the iframe content
  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument;
      
      if (doc) {
        // Write the HTML content
        doc.open();
        doc.write(html);
        doc.close();
        
        // Inject the theme CSS
        const styleElement = doc.createElement('style');
        styleElement.textContent = css;
        doc.head.appendChild(styleElement);
        
        // Add user custom CSS if provided
        if (userCustomCSS) {
          const userStyleElement = doc.createElement('style');
          userStyleElement.textContent = userCustomCSS;
          doc.head.appendChild(userStyleElement);
        }
        
        // Add script to resize iframe based on content height
        const resizeScript = doc.createElement('script');
        resizeScript.textContent = `
          function updateHeight() {
            const height = document.documentElement.scrollHeight;
            window.parent.postMessage({ type: 'resize', height }, '*');
          }
          window.addEventListener('load', updateHeight);
          window.addEventListener('resize', updateHeight);
          // Initial call
          updateHeight();
        `;
        doc.body.appendChild(resizeScript);
      }
    }
    
    // Listen for resize messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'resize') {
        setIframeHeight(`${event.data.height}px`);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [html, css, userCustomCSS]);
  
  return (
    <div className="theme-renderer-container flex justify-center">
      <iframe
        ref={iframeRef}
        title={`${themeId} - ${pageName} preview`}
        className={`${viewportSizes[viewportSize]} h-full border-0 transition-width duration-300`}
        style={{ height: iframeHeight }}
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
}
