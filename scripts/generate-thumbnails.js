#!/usr/bin/env node
/**
 * Theme Thumbnail Generator
 * 
 * This script captures screenshots of theme thumbnails using Puppeteer
 * Run with: npm run generate:thumbnails
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { execSync } = require('child_process');

// Ensure puppeteer is installed
try {
  require.resolve('puppeteer');
} catch (e) {
  console.log('Puppeteer is required but not installed. Installing now...');
  execSync('npm install --save-dev puppeteer', { stdio: 'inherit' });
  console.log('Puppeteer installed successfully.');
}

async function generateThumbnails() {
  console.log('Starting thumbnail generation...');

  // Find all theme folders from both locations
  const publicThemesPath = path.join(process.cwd(), 'public', 'themes');
  const rootThemesPath = path.join(process.cwd(), 'themes');
  
  // Get themes from public/themes directory
  let themeFolders = [];
  if (fs.existsSync(publicThemesPath)) {
    themeFolders = fs.readdirSync(publicThemesPath)
      .filter(folder => {
        const folderPath = path.join(publicThemesPath, folder);
        return fs.statSync(folderPath).isDirectory();
      })
      .map(folder => ({ name: folder, path: path.join(publicThemesPath, folder) }));
  }
  
  // Get themes from root themes directory
  if (fs.existsSync(rootThemesPath)) {
    const rootThemes = fs.readdirSync(rootThemesPath)
      .filter(folder => {
        const folderPath = path.join(rootThemesPath, folder);
        return fs.statSync(folderPath).isDirectory();
      })
      .map(folder => ({ name: folder, path: path.join(rootThemesPath, folder) }));
    
    themeFolders = [...themeFolders, ...rootThemes];
  }

  console.log(`Found ${themeFolders.length} themes`);

  // Launch browser
  const browser = await puppeteer.launch({
    headless: 'new', // Use new headless mode
  });
  
  // Process each theme
  for (const theme of themeFolders) {
    try {
      console.log(`Generating thumbnail for ${theme.name}...`);
      
      const thumbnailPath = path.join(theme.path, 'assets', 'thumbnail.png');
      
      // Ensure assets directory exists
      const assetsDir = path.join(theme.path, 'assets');
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }
      
      // Check if there's a thumbnail-generator.html file
      const htmlPath = path.join(theme.path, 'assets', 'thumbnail-generator.html');
      
      if (fs.existsSync(htmlPath)) {
        // Use the generator HTML if it exists
        const htmlUrl = `file://${htmlPath}`;
        
        // Open page
        const page = await browser.newPage();
        await page.setViewport({ width: 600, height: 400, deviceScaleFactor: 2 }); // Higher resolution
        await page.goto(htmlUrl, { waitUntil: 'networkidle0' });
        
        // Allow time for any animations or fonts to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Take screenshot
        await page.screenshot({
          path: thumbnailPath,
          type: 'png',
          fullPage: false
        });
      } else {
        // Otherwise generate a simple preview based on the theme's CSS
        const page = await browser.newPage();
        await page.setViewport({ width: 600, height: 400, deviceScaleFactor: 2 });
        
        // Create a simple HTML preview page
        const cssPath = path.join(theme.path, 'theme.css');
        let css = '';
        
        if (fs.existsSync(cssPath)) {
          css = fs.readFileSync(cssPath, 'utf-8');
        }
        
        // Generate a simple HTML preview
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${theme.name} Theme Preview</title>
            <style>${css}</style>
        </head>
        <body>
            <div style="padding: 20px;">
                <h1>${theme.name} Theme</h1>
                <p>A simple preview of the ${theme.name} theme styling.</p>
                <div style="margin-top: 20px;">
                    <div style="margin-bottom: 10px;">Sample Post</div>
                    <div style="margin-bottom: 5px;">Another Sample Post</div>
                </div>
            </div>
        </body>
        </html>
        `;
        
        await page.setContent(html, { waitUntil: 'networkidle0' });
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Take screenshot
      await page.screenshot({
        path: thumbnailPath,
        type: 'png',
        quality: 100,
        fullPage: false
      });
      
      console.log(`✓ Created thumbnail for ${theme.name} at ${thumbnailPath}`);
      await page.close();
    } catch (error) {
      console.error(`✗ Error generating thumbnail for ${theme.name}:`, error);
    }
  }
  
  await browser.close();
  console.log('Thumbnail generation complete!');
}

generateThumbnails().catch(error => {
  console.error('Failed to generate thumbnails:', error);
  process.exit(1);
});
