# Firebase Admin SDK Setup Guide

This guide explains how to set up the Firebase Admin SDK for Minispace development.

## Prerequisites

1. A Firebase project with Firestore enabled
2. Access to the Firebase console as an owner or service account manager

## Setup Instructions

### 1. Generate a Service Account

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Project Settings (gear icon) > Service Accounts
4. Select "Firebase Admin SDK" 
5. Click "Generate new private key"
6. Save the JSON file securely (do not commit to git)

### 2. Configure your Environment

Add the following to your `.env.local` file:

```
# Firebase Admin SDK
FIREBASE_ADMIN_CREDENTIALS=<base64-encoded-service-account-json>
```

To encode your service account JSON:

```bash
# macOS/Linux
cat path/to/serviceAccountKey.json | base64

# Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Content -Raw path/to/serviceAccountKey.json)))
```

### 3. Validate your Configuration

Run the validation script:

```bash
node scripts/validate-firebase-admin.js
```

This script will:
- Verify that your credentials are properly encoded
- Test Firebase Admin initialization
- Confirm Firestore access permissions

### Alternative Setup: Private Key Only

If you only have a private key (not a full service account JSON), you can:

1. Add your private key to `.env.local` as `FIREBASE_ADMIN_CREDENTIALS`
2. Run `node scripts/create-service-account.js` to generate a complete service account JSON

## Troubleshooting

### Initialization Failed

If the validation script shows "Firebase Admin initialization failed":

1. Ensure your service account JSON is properly encoded
2. Check that your project ID matches in both the service account and environment variables
3. Verify that your service account has the necessary permissions

### Firestore Access Error

If the validation shows "Firestore access error":

1. Check that your service account has the "Firebase Admin" role
2. Verify your Firestore security rules allow access to collections used by the app

## Additional Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Service Account Management](https://firebase.google.com/docs/projects/iam/service-accounts)
