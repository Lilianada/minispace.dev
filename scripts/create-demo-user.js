/**
 * Script to create a demo user in Firebase
 * Run with: node scripts/create-demo-user.js
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Try to find the service account file
let serviceAccountPath;
const possiblePaths = [
  './serviceAccountKey.json',
  './firebase-service-account.json',
  './firebase-admin-key.json',
  '../serviceAccountKey.json',
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
];

for (const p of possiblePaths) {
  if (p && fs.existsSync(p)) {
    serviceAccountPath = p;
    break;
  }
}

if (!serviceAccountPath) {
  console.error('Service account file not found. Please provide the path:');
  console.error('GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json node scripts/create-demo-user.js');
  process.exit(1);
}

// Initialize Firebase Admin
try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

const db = admin.firestore();

// Create demo user data
const demoUser = {
  username: 'demouser',
  displayName: 'Demo User',
  email: 'demo@minispace.dev',
  photoURL: 'https://firebasestorage.googleapis.com/v0/b/mini-app-00.appspot.com/o/avatars%2Fdemo-avatar.png?alt=media',
  bio: 'This is a demo account to showcase the features of Minispace.',
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};

// Check if demo user already exists
async function createDemoUser() {
  try {
    // Check if user exists
    const usersRef = db.collection('Users');
    const querySnapshot = await usersRef.where('username', '==', 'demouser').get();
    
    if (!querySnapshot.empty) {
      console.log('Demo user already exists!');
      querySnapshot.forEach(doc => {
        console.log('User ID:', doc.id);
        console.log('User data:', doc.data());
      });
      return;
    }
    
    // Create the user
    const newUserRef = await usersRef.add(demoUser);
    console.log('Demo user created with ID:', newUserRef.id);
    
    // Create theme settings for the user
    await db.collection('Users').doc(newUserRef.id).collection('userSettings').doc('theme').set({
      themeId: 'personal/rubik',
      themeName: 'Rubik',
      themeCategory: 'personal',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('Demo user theme settings created');
    
    // Create some demo posts
    const postsRef = db.collection('Posts');
    
    await postsRef.add({
      title: 'Welcome to Minispace',
      slug: 'welcome-to-minispace',
      content: '# Welcome to Minispace\n\nThis is a demo post to showcase the features of Minispace. Minispace is a platform for creating your own personal space on the web.\n\n## Features\n\n- Custom domains\n- Beautiful themes\n- Markdown support\n- And much more!',
      excerpt: 'Get started with your own personal space on the web.',
      authorId: newUserRef.id,
      authorUsername: 'demouser',
      status: 'published',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      publishedAt: admin.firestore.FieldValue.serverTimestamp(),
      tags: ['welcome', 'minispace'],
    });
    
    await postsRef.add({
      title: 'Getting Started with Markdown',
      slug: 'getting-started-with-markdown',
      content: '# Getting Started with Markdown\n\nMarkdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents.\n\n## Basic Syntax\n\n### Headers\n\n```\n# H1\n## H2\n### H3\n```\n\n### Emphasis\n\n```\n*italic*\n**bold**\n```\n\n### Lists\n\n```\n- Item 1\n- Item 2\n  - Subitem\n```\n\n### Links\n\n```\n[Link text](https://example.com)\n```',
      excerpt: 'Learn the basics of Markdown to format your posts.',
      authorId: newUserRef.id,
      authorUsername: 'demouser',
      status: 'published',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      publishedAt: admin.firestore.FieldValue.serverTimestamp(),
      tags: ['markdown', 'tutorial'],
    });
    
    console.log('Demo posts created');
    console.log('Demo user setup complete!');
    
  } catch (error) {
    console.error('Error creating demo user:', error);
  } finally {
    process.exit(0);
  }
}

createDemoUser();
