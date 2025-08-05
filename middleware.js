import { NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('Firebase Config in Middleware:', firebaseConfig);

if (!firebaseConfig.apiKey) {
  throw new Error('Missing NEXT_PUBLIC_FIREBASE_API_KEY in .env.local');
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function middleware(request) {
  const token = request.cookies.get('authToken'); // Get token set by login

  // Exclude /missioncontrol from protection
  if (request.nextUrl.pathname === '/missioncontrol') {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/missioncontrol', request.url));
  }

  // Placeholder token validation (for production, use Firebase Admin SDK)
  // This is a basic check; enhance with proper JWT validation
  return NextResponse.next();
}

export const config = {
  matcher: ['/missioncontrol/home', '/missioncontrol/pros/:path*'],
};