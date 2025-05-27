#!/bin/bash

# Script to set up local subdomain testing using /etc/hosts file
# This script will add entries for common test usernames to use with subdomain routing in development

# Default usernames to set up
USERNAMES=("demouser" "test" "admin" "dev")
CUSTOM_USERNAME=$1

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
  echo "This script needs to be run as root to modify /etc/hosts"
  echo "Please run with: sudo $0"
  exit 1
fi

# Backup hosts file
echo "📝 Creating backup of your /etc/hosts file to /etc/hosts.minispace.bak"
cp /etc/hosts /etc/hosts.minispace.bak

# Check if specific username was provided
if [ ! -z "$CUSTOM_USERNAME" ]; then
  USERNAMES+=("$CUSTOM_USERNAME")
  echo "👤 Adding custom username: $CUSTOM_USERNAME"
fi

# Add header comment
echo "# ----------------------------------------------------" >> /etc/hosts
echo "# Minispace local subdomain testing - Added $(date)" >> /etc/hosts
echo "# ----------------------------------------------------" >> /etc/hosts

# Add entries for each username
for username in "${USERNAMES[@]}"; do
  echo "👉 Setting up subdomain for: $username.localhost"
  
  # Check if entry already exists
  if grep -q "$username.localhost" /etc/hosts; then
    echo "   ✓ Entry for $username.localhost already exists"
  else
    echo "127.0.0.1 $username.localhost" >> /etc/hosts
    echo "   + Added entry for $username.localhost"
  fi
done

echo ""
echo "✅ Local subdomain setup complete!"
echo "You can now access:"
for username in "${USERNAMES[@]}"; do
  echo "   🌐 http://$username.localhost:3000"
done

echo ""
echo "To add more usernames later, run:"
echo "   sudo $0 username"
echo ""
