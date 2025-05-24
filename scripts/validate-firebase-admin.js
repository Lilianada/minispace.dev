#!/usr/bin/env node
/**
 * Firebase Admin SDK Validation Script
 * 
 * This script validates your Firebase Admin SDK credentials and helps
 * identify and fix common configuration issues.
 * 
 * Usage:
 *   node scripts/validate-firebase-admin.js
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

// Helper function to log status updates
function log(message, type = 'info') {
  const icons = {
    info: '🔷',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };
  console.log(`${icons[type] || '•'} ${message}`);
}

// Helper function to truncate long strings
function truncate(str, length = 50) {
  if (!str) return '';
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

// Validate Firebase Admin configuration
async function validateFirebaseAdmin() {
  log('Starting Firebase Admin SDK validation...', 'info');
  
  // 1. Check for required environment variables
  log('\nChecking environment variables:', 'info');
  
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (projectId) {
    log(`Project ID: ${projectId}`, 'success');
  } else {
    log('NEXT_PUBLIC_FIREBASE_PROJECT_ID not found', 'error');
  }
  
  const adminCreds = process.env.FIREBASE_ADMIN_CREDENTIALS;
  if (adminCreds) {
    log('FIREBASE_ADMIN_CREDENTIALS found', 'success');
  } else {
    log('FIREBASE_ADMIN_CREDENTIALS not found', 'error');
    log('Add this variable to your .env.local file', 'info');
    return;
  }
  
  // 2. Decode and analyze the admin credentials
  log('\nAnalyzing admin credentials:', 'info');
  try {
    const decoded = Buffer.from(adminCreds, 'base64').toString('utf-8');
    log(`Decoded length: ${decoded.length} characters`, 'info');
    
    if (decoded.trim().startsWith('{')) {
      log('Format: JSON object (preferred)', 'success');
      try {
        const credentials = JSON.parse(decoded);
        log('JSON parsing: Successful', 'success');
        
        // Check for required fields
        const requiredFields = ['project_id', 'private_key', 'client_email'];
        const missingFields = requiredFields.filter(field => !credentials[field]);
        
        if (missingFields.length === 0) {
          log('Required fields: All present', 'success');
          log(`project_id: ${credentials.project_id}`, 'success');
          log(`client_email: ${credentials.client_email}`, 'success');
          log(`private_key: ${truncate(credentials.private_key, 30)}`, 'success');
        } else {
          log(`Missing fields: ${missingFields.join(', ')}`, 'error');
        }
      } catch (e) {
        log(`JSON parsing failed: ${e.message}`, 'error');
      }
    } else if (decoded.includes('BEGIN PRIVATE KEY')) {
      log('Format: Private key only (workable)', 'warning');
      log('Client email will be auto-generated using the pattern:', 'info');
      log(`firebase-adminsdk@${projectId}.iam.gserviceaccount.com`, 'info');
      log('\nRecommendation:', 'info');
      log('Use the create-service-account.js script to generate a full service account', 'info');
    } else {
      log('Unknown credential format', 'error');
      log('Sample of content:', 'info');
      log(truncate(decoded, 100), 'info');
    }
  } catch (error) {
    log(`Failed to decode credentials: ${error.message}`, 'error');
    return;
  }
  
  // 3. Test Firebase Admin initialization
  log('\nTesting Firebase Admin initialization:', 'info');
  try {
    const admin = require('firebase-admin');
    
    // Skip if already initialized
    if (admin.apps.length > 0) {
      log('Firebase Admin is already initialized', 'warning');
      admin.apps.forEach((app, i) => {
        log(`App ${i + 1}: ${app.name}`, 'info');
      });
    } else {
      log('Attempting to initialize Firebase Admin...', 'info');
      
      // Decode credentials
      const decoded = Buffer.from(adminCreds, 'base64').toString('utf-8');
      
      let credential;
      if (decoded.trim().startsWith('{')) {
        // Parse full JSON
        const serviceAccount = JSON.parse(decoded);
        credential = admin.credential.cert(serviceAccount);
      } else if (decoded.includes('BEGIN PRIVATE KEY')) {
        // Create minimal credential
        credential = admin.credential.cert({
          projectId: projectId,
          clientEmail: `firebase-adminsdk@${projectId}.iam.gserviceaccount.com`,
          privateKey: decoded,
        });
      } else {
        throw new Error('Invalid credential format');
      }
      
      // Initialize
      admin.initializeApp({
        credential: credential,
        projectId: projectId,
      });
      
      log('Initialization successful!', 'success');
      
      // Test Firestore
      log('\nTesting Firestore access:', 'info');
      const db = admin.firestore();
      
      try {
        const testDoc = await db.collection('__test__').doc('validation').get();
        log('Firestore access successful', 'success');
      } catch (error) {
        log(`Firestore access error: ${error.message}`, 'error');
        log('This may be due to insufficient permissions', 'info');
        log('Check your Firebase console IAM settings', 'info');
      }
    }
  } catch (error) {
    log(`Firebase Admin initialization failed: ${error.message}`, 'error');
    log('See detailed error above for troubleshooting', 'info');
  }
  
  log('\nValidation complete', 'info');
}

// Run validation
validateFirebaseAdmin().catch(error => {
  log(`Validation script error: ${error.message}`, 'error');
  process.exit(1);
});
