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

  // Find all theme folders
  const themesPath = path.join(process.cwd(), 'public', 'themes');
  const themeFolders = fs.readdirSync(themesPath).filter(folder => {
    const folderPath = path.join(themesPath, folder);
    return fs.statSync(folderPath).isDirectory() && 
           fs.existsSync(path.join(folderPath, 'thumbnail-generator.html'));
  });

  console.log(`Found ${themeFolders.length} themes with thumbnail-generator.html`);

  // Launch browser
  const browser = await puppeteer.launch({
    headless: 'new', // Use new headless mode
  });
  
  // Process each theme
  for (const theme of themeFolders) {
    try {
      console.log(`Generating thumbnail for ${theme}...`);
      
      const thumbnailPath = path.join(themesPath, theme, 'thumbnail.png');
      const htmlPath = path.join(themesPath, theme, 'thumbnail-generator.html');
      const htmlUrl = `file://${htmlPath}`;
      
      // Open page
      const page = await browser.newPage();
      await page.setViewport({ width: 600, height: 400, deviceScaleFactor: 2 }); // Higher resolution
      await page.goto(htmlUrl, { waitUntil: 'networkidle0' });
      
      // Allow time for any animations or fonts to load
      await page.waitForTimeout(1000);
      
      // Take screenshot
      await page.screenshot({
        path: thumbnailPath,
        type: 'png',
        quality: 100,
        fullPage: false
      });
      
      console.log(`✓ Created thumbnail for ${theme} at ${thumbnailPath}`);
      await page.close();
    } catch (error) {
      console.error(`✗ Error generating thumbnail for ${theme}:`, error);
    }
  }
  
  await browser.close();
  console.log('Thumbnail generation complete!');
}

generateThumbnails().catch(error => {
  console.error('Failed to generate thumbnails:', error);
  process.exit(1);
});
