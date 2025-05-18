# Firestore Indexes for Minispace

This document explains how to deploy the Firestore indexes required for the application to function properly.

## Required Indexes

The application requires several composite indexes for the `posts` collection to support filtering and sorting operations. These indexes are defined in the `firestore.indexes.json` file.

## Deploying Indexes

### Option 1: Using Firebase CLI (Recommended)

1. Make sure you have the Firebase CLI installed:
   ```
   npm install -g firebase-tools
   ```

2. Login to your Firebase account:
   ```
   firebase login
   ```

3. Deploy the indexes:
   ```
   firebase deploy --only firestore:indexes
   ```

### Option 2: Creating Indexes Manually

If you encounter a missing index error in the console, you'll see a link that looks like:
```
https://console.firebase.google.com/project/[YOUR-PROJECT-ID]/database/firestore/indexes?create_composite=...
```

Click on this link to automatically create the required index in the Firebase Console.

### Option 3: Creating Indexes in Firebase Console

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database > Indexes
4. Click "Add Index"
5. For each index in the `firestore.indexes.json` file:
   - Set Collection ID to "posts"
   - Add the fields with their respective order (Ascending/Descending)
   - Set Query scope to "Collection"
   - Click "Create"

## Important Notes

- Index creation can take several minutes to complete
- The application will show an error message with instructions if it encounters a missing index
- All required indexes are listed in the `firestore.indexes.json` file
