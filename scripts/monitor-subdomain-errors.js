/**
 * Script to regularly check the access logs for subdomain issues
 * This will help identify patterns in 404 errors for subdomain routing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const LOG_FILE = path.join(process.cwd(), 'logs', 'subdomain-access.log');
const CHECK_INTERVAL_MS = 60 * 1000; // 1 minute
const MAX_LOGS_TO_KEEP = 10000;
const ALERT_THRESHOLD = 5; // Alert if more than 5 errors in a minute

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Initialize log file if it doesn't exist
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, 'timestamp,method,url,status,referer,userAgent,isSubdomain,username\n');
}

/**
 * Extract 404 errors from logs
 */
function checkFor404Errors() {
  try {
    // Read the log file
    const logContent = fs.readFileSync(LOG_FILE, 'utf8');
    const lines = logContent.trim().split('\n');
    
    // Skip header
    if (lines.length <= 1) {
      return;
    }
    
    // Get lines from the last minute
    const oneMinuteAgo = Date.now() - (60 * 1000);
    const recentLines = lines
      .slice(1) // Skip header
      .filter(line => {
        const timestamp = line.split(',')[0];
        return new Date(timestamp).getTime() > oneMinuteAgo;
      });
    
    // Count 404 errors
    const errors404 = recentLines.filter(line => line.split(',')[3] === '404');
    
    if (errors404.length > ALERT_THRESHOLD) {
      console.log('\n⚠️  SUBDOMAIN ROUTING ALERT ⚠️');
      console.log(`${errors404.length} 404 errors detected in the last minute!`);
      
      // Analyze patterns
      const urlPatterns = {};
      const subdomainErrors = [];
      const pathBasedErrors = [];
      
      errors404.forEach(line => {
        const [timestamp, method, url, status, referer, userAgent, isSubdomain, username] = line.split(',');
        
        // Extract URL pattern (first segment after domain)
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split('/').filter(Boolean);
        const pattern = pathSegments.length > 0 ? pathSegments[0] : '/';
        
        // Count pattern occurrences
        urlPatterns[pattern] = (urlPatterns[pattern] || 0) + 1;
        
        // Group by routing type
        if (isSubdomain === 'true') {
          subdomainErrors.push(url);
        } else {
          pathBasedErrors.push(url);
        }
      });
      
      // Report findings
      console.log('\nURL patterns in 404 errors:');
      Object.entries(urlPatterns)
        .sort((a, b) => b[1] - a[1])
        .forEach(([pattern, count]) => {
          console.log(`  - ${pattern}: ${count} occurrences`);
        });
      
      console.log(`\nSubdomain errors: ${subdomainErrors.length}`);
      console.log(`Path-based errors: ${pathBasedErrors.length}`);
      
      if (subdomainErrors.length > 0) {
        console.log('\nSample subdomain 404 errors:');
        subdomainErrors.slice(0, 3).forEach(url => console.log(`  - ${url}`));
      }
      
      if (pathBasedErrors.length > 0) {
        console.log('\nSample path-based 404 errors:');
        pathBasedErrors.slice(0, 3).forEach(url => console.log(`  - ${url}`));
      }
      
      console.log('\nRecommendation: Check subdomain routing configuration and middleware rewrites');
      console.log('----------------------------------------------------------------');
    }
    
    // Trim the log file if it's getting too large
    if (lines.length > MAX_LOGS_TO_KEEP) {
      const newContent = [
        lines[0], // Keep header
        ...lines.slice(-MAX_LOGS_TO_KEEP + 1) // Keep last N entries
      ].join('\n');
      fs.writeFileSync(LOG_FILE, newContent);
    }
  } catch (error) {
    console.error('Error checking 404 logs:', error);
  }
}

// Set up the check interval
console.log(`Starting subdomain access monitoring (checking every ${CHECK_INTERVAL_MS / 1000}s)...`);
setInterval(checkFor404Errors, CHECK_INTERVAL_MS);

// Make the logger available for import
module.exports = {
  logRequest: (req, res) => {
    try {
      const url = req.url;
      const urlObj = new URL(url);
      const host = req.headers.host || '';
      const method = req.method;
      
      // Check if this is a subdomain request
      const isProd = process.env.NODE_ENV === 'production';
      const domain = isProd ? 'minispace.dev' : 'localhost';
      
      // Simplified subdomain detection
      const isSubdomain = host !== domain && 
                        host !== `www.${domain}` &&
                        !host.includes('vercel.app');
      
      // Extract username
      let username = '';
      if (isSubdomain) {
        if (isProd) {
          username = host.replace(`.${domain}`, '');
        } else {
          const hostWithoutPort = host.split(':')[0];
          username = hostWithoutPort.replace(`.${domain}`, '');
        }
      } else {
        // Try to extract from path
        const pathSegments = urlObj.pathname.split('/').filter(Boolean);
        if (pathSegments.length > 0) {
          username = pathSegments[0];
        }
      }
      
      // Build log entry
      const timestamp = new Date().toISOString();
      const status = res.statusCode;
      const referer = req.headers.referer || '';
      const userAgent = req.headers['user-agent'] || '';
      
      const logEntry = `${timestamp},${method},${url},${status},${referer},${userAgent},${isSubdomain},${username}\n`;
      
      // Append to log file
      fs.appendFileSync(LOG_FILE, logEntry);
    } catch (error) {
      console.error('Error logging request:', error);
    }
  }
};

// Run an initial check
checkFor404Errors();
