# Firebase Setup Guide

This guide explains how to set up and configure Firebase for the Minispace project.

## Prerequisites

- Node.js 18+ and npm
- Firebase account

## Firebase Project Setup

1. **Create a Firebase project**
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Google Analytics if desired

## Project Configuration

There are two parts to Firebase configuration:
1. Client-side Firebase SDK (for browser)
2. Firebase Admin SDK (for server-side rendering)

For the admin SDK setup, see [Firebase Admin Setup Guide](firebase-admin-setup.md)

2. **Set up Firebase Authentication**
   - In your Firebase project, go to "Authentication"
   - Enable the sign-in methods you want to use (Email/Password, Google, etc.)

3. **Create a Firestore database**
   - Go to "Firestore Database"
   - Click "Create database"
   - Choose "Start in production mode"
   - Select a location for your database

4. **Set up security rules**
   - In Firestore, go to the "Rules" tab
   - Configure appropriate security rules for your application
   - Example basic rules:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /posts/{postId} {
         allow read;
         allow write: if request.auth != null;
       }
       match /users/{userId} {
         allow read;
         allow write: if request.auth != null && request.auth.uid == userId;
       }
       match /tags/{tagId} {
         allow read;
         allow write: if request.auth != null;
       }
     }
   }
   ```

5. **Set up Firebase Storage** (if needed)
   - Go to "Storage"
   - Click "Get started" and follow the setup wizard
   - Configure appropriate security rules

## Project Configuration

1. **Install Firebase SDK**

```bash
npm install firebase
```

2. **Configure environment variables**

Copy the `.env.example` file to `.env.local` and update the Firebase configuration:

```bash
cp .env.example .env.local
```

Edit the `.env.local` file and update all the Firebase-related variables with the values from your Firebase project settings.

3. **Initialize Firebase in your app**

The Firebase configuration is already set up in `src/lib/firebase/config.ts`.

## Seeding the Database

To populate your Firestore database with initial data:

```bash
npm run seed:firestore
```

## Firebase Emulator (Optional)

For local development, you can use the Firebase Emulator Suite:

1. **Install Firebase CLI**

```bash
npm install -g firebase-tools
```

2. **Login to Firebase**

```bash
firebase login
```

3. **Initialize Firebase in your project**

```bash
firebase init
```

Select Firestore, Authentication, and any other services you need.

4. **Start the emulator**

```bash
firebase emulators:start
```

Update your Firebase configuration to use the emulators in development:

```typescript
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
  // Connect other emulators as needed
}
```

## Structure of Data

### Collections

- **posts**: Blog posts with details
- **users**: User information 
- **tags**: Tags for categorizing posts

### Document Structure

#### Post Document

```
{
  title: string,
  slug: string,
  content: string,
  excerpt: string,
  status: 'published' | 'draft',
  publishedAt: timestamp (optional),
  createdAt: timestamp,
  updatedAt: timestamp,
  views: number,
  authorId: string (reference to a user),
  tags: array of strings
}
```

#### User Document

```
{
  name: string,
  email: string,
  image: string (optional),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Tag Document

```
{
  name: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```