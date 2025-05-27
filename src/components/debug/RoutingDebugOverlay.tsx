/**
 * Routing Debug Helper
 * 
 * This module provides a client-side debugging component that displays routing information.
 * It can be conditionally included in the layout to help diagnose routing issues in production.
 */

'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface RoutingDebugInfo {
  pathname: string;
  hostname: string;
  isSubdomain: boolean;
  detectedUsername: string;
  originalPathname?: string;
  rewrittenPathname?: string;
  customHeaders: Record<string, string>;
}

export function RoutingDebugOverlay() {
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState<RoutingDebugInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only run this in production when explicitly enabled via query param or localStorage
    const shouldShow = 
      typeof window !== 'undefined' && (
        window.location.search.includes('debug_routing=true') || 
        localStorage.getItem('minispace_debug_routing') === 'true'
      );

    if (shouldShow) {
      // First show basic client-side information
      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      const isProd = !hostname.includes('localhost');
      
      // Detect if this is a subdomain request
      const isSubdomain = 
        parts.length > (isProd ? 2 : 1) && 
        parts[parts.length - (isProd ? 2 : 1)] === (isProd ? 'minispace' : 'localhost');
      
      // Extract username from either subdomain or path
      let detectedUsername = 'unknown';
      
      if (isSubdomain) {
        detectedUsername = parts[0];
      } else {
        // Try to extract from path (/username/...)
        const pathParts = pathname.split('/').filter(Boolean);
        if (pathParts.length > 0) {
          detectedUsername = pathParts[0];
        }
      }
      
      // Basic initial information
      setInfo({
        pathname,
        hostname,
        isSubdomain,
        detectedUsername,
        customHeaders: {}
      });
      
      setVisible(true);
      
      // Then fetch more detailed information from the API
      fetch('/api/debug')
        .then(response => response.json())
        .then(data => {
          // Update with server-side information
          setInfo({
            pathname: data.pathname,
            hostname: data.hostname,
            isSubdomain: data.isSubdomain,
            detectedUsername: data.extractedUsername || detectedUsername,
            originalPathname: data.originalUrl ? new URL(data.originalUrl).pathname : undefined,
            rewrittenPathname: data.isSubdomain ? data.pathname : undefined,
            customHeaders: {
              'X-Minispace-Rewritten-From-Subdomain': data.headers['x-minispace-rewritten-from-subdomain'] || 'not set',
              'X-Minispace-Original-Host': data.headers['x-minispace-original-host'] || 'not set',
              'X-Minispace-Username': data.headers['x-minispace-username'] || 'not set',
            }
          });
        })
        .catch(error => {
          console.error('Failed to fetch debug info:', error);
        });
    }
  }, [pathname]);

  if (!visible || !info) {
    return null;
  }

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const copyDebugInfo = () => {
    navigator.clipboard.writeText(JSON.stringify(info, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const enablePermanentDebug = () => {
    localStorage.setItem('minispace_debug_routing', 'true');
    alert('Routing debug is now permanently enabled. Clear localStorage to disable.');
  };

  const disableDebug = () => {
    localStorage.removeItem('minispace_debug_routing');
    setVisible(false);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 9999,
      maxWidth: '400px',
      maxHeight: '80vh',
      overflowY: 'auto',
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <strong>🧭 ROUTING DEBUG</strong>
        <button 
          onClick={toggleVisibility} 
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          {visible ? '❌' : '👁️'}
        </button>
      </div>

      <div>
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#aaa' }}>Hostname:</span> {info.hostname}
        </div>
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#aaa' }}>Pathname:</span> {info.pathname}
        </div>
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#aaa' }}>Is Subdomain:</span>{' '}
          <span style={{ 
            color: info.isSubdomain ? '#4caf50' : '#ff9800', 
            fontWeight: 'bold' 
          }}>
            {info.isSubdomain ? 'YES' : 'NO'}
          </span>
        </div>
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#aaa' }}>Username:</span> {info.detectedUsername}
        </div>
        
        {info.originalPathname && (
          <div style={{ marginBottom: '5px' }}>
            <span style={{ color: '#aaa' }}>Original Path:</span> {info.originalPathname}
          </div>
        )}
        
        {info.rewrittenPathname && (
          <div style={{ marginBottom: '5px' }}>
            <span style={{ color: '#aaa' }}>Rewritten Path:</span> {info.rewrittenPathname}
          </div>
        )}
        
        <hr style={{ border: '1px solid #333', margin: '10px 0' }} />
        
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#aaa', fontWeight: 'bold' }}>Debug Headers:</span>
          {Object.entries(info.customHeaders).map(([key, value]) => (
            <div key={key} style={{ marginLeft: '10px', fontSize: '11px' }}>
              <span style={{ color: '#ff9800' }}>{key}:</span> {value}
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={copyDebugInfo}
            style={{
              background: '#2196f3',
              border: 'none',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
              marginRight: '5px'
            }}
          >
            {copied ? '✅ Copied!' : '📋 Copy Info'}
          </button>
          
          <button 
            onClick={enablePermanentDebug}
            style={{
              background: '#ff9800',
              border: 'none',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
              marginRight: '5px'
            }}
          >
            🔧 Always Show
          </button>
          
          <button 
            onClick={disableDebug}
            style={{
              background: '#f44336',
              border: 'none',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            🚫 Disable
          </button>
          
          {/* Quick access testing links */}
          <div style={{ marginTop: '15px', borderTop: '1px solid #333', paddingTop: '10px' }}>
            <strong style={{ display: 'block', marginBottom: '5px' }}>Quick Test Links:</strong>
            
            {info.detectedUsername && (
              <>
                <div style={{ marginTop: '5px', fontSize: '11px' }}>
                  <strong>Path-based:</strong>
                  <a 
                    href={`/${info.detectedUsername}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#4caf50', marginLeft: '5px', textDecoration: 'underline' }}
                  >
                    Home
                  </a>
                  <a 
                    href={`/${info.detectedUsername}/posts`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#4caf50', marginLeft: '5px', textDecoration: 'underline' }}
                  >
                    Posts
                  </a>
                  <a 
                    href={`/${info.detectedUsername}/about`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#4caf50', marginLeft: '5px', textDecoration: 'underline' }}
                  >
                    About
                  </a>
                </div>
                
                {/* Only show subdomain links in production */}
                {info.hostname.includes('minispace.dev') && (
                  <div style={{ marginTop: '5px', fontSize: '11px' }}>
                    <strong>Subdomain:</strong>
                    <a 
                      href={`https://${info.detectedUsername}.minispace.dev`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#2196f3', marginLeft: '5px', textDecoration: 'underline' }}
                    >
                      Home
                    </a>
                    <a 
                      href={`https://${info.detectedUsername}.minispace.dev/posts`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#2196f3', marginLeft: '5px', textDecoration: 'underline' }}
                    >
                      Posts
                    </a>
                    <a 
                      href={`https://${info.detectedUsername}.minispace.dev/about`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#2196f3', marginLeft: '5px', textDecoration: 'underline' }}
                    >
                      About
                    </a>
                  </div>
                )}
                
                {info.hostname.includes('localhost') && (
                  <div style={{ marginTop: '5px', fontSize: '11px' }}>
                    <strong>Dev Subdomain:</strong>
                    <a 
                      href={`http://${info.detectedUsername}.localhost:3000`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#2196f3', marginLeft: '5px', textDecoration: 'underline' }}
                    >
                      Home
                    </a>
                    <a 
                      href={`http://${info.detectedUsername}.localhost:3000/posts`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#2196f3', marginLeft: '5px', textDecoration: 'underline' }}
                    >
                      Posts
                    </a>
                    <a 
                      href={`http://${info.detectedUsername}.localhost:3000/about`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#2196f3', marginLeft: '5px', textDecoration: 'underline' }}
                    >
                      About
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
