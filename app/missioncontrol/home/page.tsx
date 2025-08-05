'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth } from 'lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function MissionControlHome() {
  const [hydrated, setHydrated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);

    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
        if (cookies.authToken) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/missioncontrol');
        }
      } else {
        setIsAuthenticated(false);
        router.push('/missioncontrol');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isAuthenticated === null) {
    return null; // Prevent rendering until auth check completes
  }

  if (!isAuthenticated) {
    return null; // Redirect is handled in useEffect
  }

  return (
    <div className="relative w-full h-screen bg-black text-white font-[var(--font-orbitron)] overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover -z-10 opacity-100"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/space.mp4?v=7" type="video/mp4" />
      </video>

      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-20 flex items-start justify-between px-4 py-4 pointer-events-none">
        <h1
          style={{ color: 'white', fontFamily: 'var(--font-orbitron)' }}
          className="text-xs font-normal pointer-events-auto whitespace-nowrap"
        >
          SpacePath Capital
        </h1>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <button
          onClick={() => router.push('/missioncontrol/PROS/snapshot')} 
          className="flex flex-col items-center gap-2"
        >
          <Image src="/mars.gif" alt="Mars Icon" width={100} height={100} unoptimized />
          <p className="text-xl font-bold mt-2">PROS</p>
        </button>
      </div>

      {/* Footer */}
      {hydrated && (
        <div
          style={{
            position: 'fixed',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
            pointerEvents: 'none',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <p
            style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.6)',
              whiteSpace: 'nowrap',
              pointerEvents: 'auto',
              fontFamily: 'var(--font-orbitron)',
            }}
          >
            © 2025 SpacePath Capital. All systems secured and monitored.
          </p>
        </div>
      )}
    </div>
  );
}