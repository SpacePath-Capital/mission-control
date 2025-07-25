import { NextResponse } from 'next/server';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  // Your Firebase config from env (e.g., process.env.FIREBASE_API_KEY, etc.)
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function middleware(request) {
  const token = request.cookies.get('authToken'); // Assume you set a cookie on login

  if (!token) {
    return NextResponse.redirect(new URL('/missioncontrol', request.url));
  }

  // Verify token (simplified; use Firebase Admin SDK for server-side verification if needed)
  return NextResponse.next();
}

export const config = {
  matcher: ['/missioncontrol/home', '/missioncontrol/pros', '/missioncontrol/(.*)'],
};