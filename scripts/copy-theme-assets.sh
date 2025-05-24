#!/bin/bash

# Script to copy theme assets to public directory during build process
# Usage: npm run copy:theme-assets

set -e # Exit on error

# Colors for pretty output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🎨 Copying theme assets to public directory..."

# Create themes directory if it doesn't exist
mkdir -p public/themes

# Base CSS
echo -e "${YELLOW}➤ Copying base theme CSS...${NC}"
mkdir -p public/themes/base
cp -v src/themes/base/theme.css public/themes/base/theme.css 2>/dev/null || true

# Get all theme folders (except base) from src/themes
theme_folders=$(find src/themes -type d -depth 1 | grep -v "base" 2>/dev/null || true)

# Copy each theme's assets from src/themes
for theme_path in $theme_folders; do
  theme=$(basename "$theme_path")
  echo -e "${YELLOW}➤ Processing ${GREEN}$theme${YELLOW} theme from src/themes...${NC}"
  
  # Create directory
  mkdir -p "public/themes/$theme"
  
  # Copy CSS
  if [ -f "src/themes/$theme/theme.css" ]; then
    cp -v "src/themes/$theme/theme.css" "public/themes/$theme/"
  else
    echo -e "${RED}  ✗ No theme.css found for $theme${NC}"
  fi
  
  # Copy all HTML templates for reference
  for template_file in $(find "src/themes/$theme" -name "*.html"); do
    template_basename=$(basename "$template_file")
    cp -v "$template_file" "public/themes/$theme/"
    echo "  ✓ Copied $template_basename"
  done
  
  # Generate thumbnail-generator.html if it doesn't exist in public
  if [ ! -f "public/themes/$theme/thumbnail-generator.html" ] && [ -f "src/themes/$theme/thumbnail-generator.html" ]; then
    cp -v "src/themes/$theme/thumbnail-generator.html" "public/themes/$theme/"
  fi
  
  # Check for thumbnail
  if [ -f "public/themes/$theme/thumbnail.png" ]; then
    echo -e "${GREEN}  ✓ Thumbnail exists${NC}"
  else
    echo -e "${YELLOW}  ⚠ No thumbnail.png found. Run npm run generate:thumbnails to create it.${NC}"
  fi
done

# Now check for themes in the root themes directory
root_theme_folders=$(find themes -type d -depth 1 2>/dev/null || true)

# Copy each theme's assets from root themes folder
for theme_path in $root_theme_folders; do
  theme=$(basename "$theme_path")
  echo -e "${YELLOW}➤ Processing ${GREEN}$theme${YELLOW} theme from root themes directory...${NC}"
  
  # Create directory
  mkdir -p "public/themes/$theme"
  
  # Copy CSS
  if [ -f "themes/$theme/theme.css" ]; then
    cp -v "themes/$theme/theme.css" "public/themes/$theme/"
  else
    echo -e "${RED}  ✗ No theme.css found for $theme${NC}"
  fi
  
  # Copy all HTML templates for reference
  for template_file in $(find "themes/$theme" -name "*.html"); do
    template_basename=$(basename "$template_file")
    cp -v "$template_file" "public/themes/$theme/"
    echo "  ✓ Copied $template_basename"
  done
  
  # Copy assets folder if it exists
  if [ -d "themes/$theme/assets" ]; then
    mkdir -p "public/themes/$theme/assets"
    cp -rv "themes/$theme/assets/"* "public/themes/$theme/assets/" 2>/dev/null || true
    echo -e "${GREEN}  ✓ Copied assets directory${NC}"
  fi
done

echo -e "${GREEN}✅ Theme assets copied successfully!${NC}"
echo "You can now run 'npm run generate:thumbnails' to create thumbnails for themes"
