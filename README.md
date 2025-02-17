# DevFeed

DevFeed is a modern, React-based TypeScript blog platform where developers share knowledge. It leverages React Native Web for cross‑platform components and integrates with Firebase for authentication, Firestore data storage, and (optionally) file storage.

## Features

- **Responsive Design:** Uses React Native Web components for a consistent experience across devices.
- **Theme Toggle:** Switch between light and dark modes with persisted preferences.
- **Article Feed:** Browse a list of articles with likes, comments, and share options.
- **Comments & Replies:** Engage in discussions with nested comments.
- **Firebase Integration:** Securely manage authentication and data with Firebase.

## Directory Structure

```
project-root/
├── src/
│   ├── components/
│   │   ├── ThemeProvider.tsx
│   │   ├── PostCard.tsx
│   │   ├── CommentSection.tsx
│   │   ├── UserProfile.tsx
│   │   ├── Analytics.tsx
│   │   └── Moderation.tsx
│   ├── context/
│   │   ├── ThemeContext.tsx
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── useAuth.ts
│   │   └── useAnalytics.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── firebase.ts
│   │   └── helpers.ts
│   └── App.tsx
├── .env
├── package.json
└── tsconfig.json
```

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (or yarn)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/raselshikdar/devfeed.git
   cd devfeed
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Environment Variables:**

   Create a `.env` file in the project root with your Firebase configuration. Use the updated environment variable names:

   ```env
   REACT_FIRE_API_KEY=your_api_key
   REACT_FIRE_AUTH_DOMAIN=your_auth_domain
   REACT_FIRE_PROJECT_ID=your_project_id
   REACT_FIRE_STORAGE_BUCKET=your_storage_bucket
   REACT_FIRE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_FIRE_APP_ID=your_app_id
   ```

   **Important:** Do not commit the `.env` file. For CI/CD (e.g., on GitHub or Vercel), set these values as secret environment variables.

### Firebase Setup

1. **Create a Firebase Project:**  
   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

2. **Enable Authentication:**  
   In the Firebase Console, enable your desired authentication methods (e.g., Email/Password, Google, etc.).

3. **Firestore Database:**  
   - Create a Cloud Firestore database in either test mode (for development) or production mode.
   - In your Firestore database, create the following collections as needed:
     - `articles` – to store blog posts.
     - `comments` – to store comments (this can be a subcollection under articles or a standalone collection).

   **Firestore Indexes:**  
   To support the queries used in DevFeed (such as filtering articles by tags or sorting by timestamp), add composite indexes. For example, create an `indexes.json` file with:

   ```json
   {
     "indexes": [
       {
         "collectionGroup": "articles",
         "queryScope": "COLLECTION",
         "fields": [
           { "fieldPath": "timestamp", "order": "DESCENDING" },
           { "fieldPath": "tags", "arrayConfig": "CONTAINS" }
         ]
       },
       {
         "collectionGroup": "comments",
         "queryScope": "COLLECTION",
         "fields": [
           { "fieldPath": "timestamp", "order": "DESCENDING" }
         ]
       }
     ],
     "fieldOverrides": []
   }
   ```

   You can then deploy these indexes using the Firebase CLI:

   ```bash
   firebase deploy --only firestore:indexes
   ```

4. **Firebase Storage (Optional):**  
   If your app requires file uploads (e.g., user avatars, article images), enable Firebase Storage and configure appropriate security rules.

### Running the App Locally

Start the development server:

```bash
npm start
```
or
```bash
yarn start
```

### Deployment

1. **Push to GitHub:**  
   Ensure your repository is up-to-date on GitHub.

2. **Connect to Vercel:**  
   Link your GitHub repository to Vercel. Vercel will automatically detect your TypeScript React app.

3. **Set Environment Variables on Vercel:**  
   In your Vercel project settings, add the following environment variables:
   - `REACT_FIRE_API_KEY`
   - `REACT_FIRE_AUTH_DOMAIN`
   - `REACT_FIRE_PROJECT_ID`
   - `REACT_FIRE_STORAGE_BUCKET`
   - `REACT_FIRE_MESSAGING_SENDER_ID`
   - `REACT_FIRE_APP_ID`

4. **Deploy:**  
   Once configured, trigger a deployment from Vercel.

## Firebase Utility (`src/utils/firebase.ts`)

Your Firebase integration uses the modular Firebase SDK (v9+) for improved performance. An example configuration:

```typescript
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_FIRE_API_KEY,
  authDomain: process.env.REACT_FIRE_AUTH_DOMAIN,
  projectId: process.env.REACT_FIRE_PROJECT_ID,
  storageBucket: process.env.REACT_FIRE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_FIRE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_FIRE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
```

This file reads credentials from environment variables and exports configured Firebase services for use in your app.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.
