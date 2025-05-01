'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UsernameList from '@/app/components/UsernameList';

export default function MissionControlHome() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black text-white font-[var(--font-orbitron)] overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover -z-10"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/space.mp4" type="video/mp4" />
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

      {/* ISS Icon */}
      <div className="absolute top-1/2 right-0 z-20 pointer-events-auto" style={{ transform: 'translate(-10px, -50%)' }}>
        <Image
          src="/iss.gif"
          alt="ISS Icon"
          width={40}
          height={40}
          unoptimized
          className="transition-transform"
          style={{ transform: 'scale(4)' }} // Double the login ISS size (scale(2) → scale(4))
        />
      </div>

      {/* Main Content */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h2 className="text-4xl font-bold">Mission Control</h2>
        <p className="mt-4 text-lg">Welcome to SpacePath Capital Mission Control</p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/missioncontrol/liverisk" className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-200">
            <Image src="/mars.png" alt="Mars" width={20} height={20} unoptimized />
            Live Risk
          </Link>
          {/* Add other internal applications here */}
        </div>
        <div className="mt-8">
          <UsernameList />
        </div>
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
            © {new Date().getFullYear()} SpacePath Capital. All systems secured and monitored.
          </p>
        </div>
      )}
    </div>
  );
}