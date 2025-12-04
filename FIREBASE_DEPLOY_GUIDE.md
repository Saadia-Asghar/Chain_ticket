# Deploying Next.js to Firebase Hosting

This guide will help you deploy your Next.js application to Firebase Hosting using the Firebase CLI's web frameworks support.

## Prerequisites

Ensure you have the Firebase CLI installed. If not, run:

```bash
npm install -g firebase-tools
```

## Step 1: Login to Firebase

Open your terminal in the project root (`d:\test\chainticket-plus`) and run:

```bash
firebase login
```

Follow the browser prompts to authenticate with the Google account associated with your Firebase project (`chainticket-5ef44`).

## Step 2: Initialize Firebase

Run the initialization command:

```bash
firebase init hosting
```

**Follow these interactive prompts:**

1.  **Are you ready to proceed?** -> `Yes`
2.  **Please select an option:** -> `Use an existing project`
3.  **Select a default Firebase project for this directory:** -> Select `chainticket-5ef44 (ChainTicket)`
4.  **Detected an existing Next.js codebase in the current directory, should we use this?** -> `Yes`
5.  **In which region would you like to host server-side content, if applicable?** -> Select a region close to your users (e.g., `us-central1`).
6.  **Set up automatic builds and deploys with GitHub?** -> `No` (You can set this up later if you want CI/CD).

Firebase will automatically detect your Next.js setup and configure the necessary build settings.

## Step 3: Deploy

Once initialization is complete, deploy your application:

```bash
firebase deploy
```

This command will:
1.  Build your Next.js application.
2.  Upload the static assets and server functions to Firebase.
3.  Provide you with a hosting URL (e.g., `https://chainticket-5ef44.web.app`).

## Troubleshooting

-   **Permissions:** If you get permission errors, ensure you are logged in with the correct account (`firebase login:list` to check).
-   **Build Failures:** If the build fails, try running `npm run build` locally to see if there are any code errors before deploying.
