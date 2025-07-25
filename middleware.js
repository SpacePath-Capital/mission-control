import { NextResponse } from 'next/server';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
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

  // Exclude /missioncontrol from protection
  if (request.nextUrl.pathname === '/missioncontrol') {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/missioncontrol', request.url));
  }

  // Simplified token validation (placeholder)
  // For production, use Firebase Admin SDK to verify token server-side
  return NextResponse.next();
}

export const config = {
  matcher: ['/missioncontrol/home', '/missioncontrol/pros/:path*'],
};