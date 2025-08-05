import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; // Import Realtime Database

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate required config
if (!firebaseConfig.apiKey) {
  throw new Error('Missing NEXT_PUBLIC_FIREBASE_API_KEY in environment variables');
}
if (!firebaseConfig.authDomain) {
  throw new Error('Missing NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN in environment variables');
}
if (!firebaseConfig.projectId) {
  throw new Error('Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID in environment variables');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Realtime Database
const database = getDatabase(app); // Initialize and export Realtime Database

export { app, auth, database }; // Export database along with app and auth