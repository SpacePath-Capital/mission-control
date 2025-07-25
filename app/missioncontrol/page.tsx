'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function MissionControlLogin() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [earthAnimation, setEarthAnimation] = useState(false);
  const [issAnimation, setIssAnimation] = useState(false);
  const [postLoginAnimation, setPostLoginAnimation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleEarthClick = () => {
    setEarthAnimation(true);
    setIssAnimation(true);
    setTimeout(() => {
      setShowLogin(true);
      setEarthAnimation(false);
    }, 1000); // Match animation duration
  };

  const handleLogin = async () => {
    try {
      const credential = await signInWithEmailAndPassword(auth, username, password);
      const token = await credential.user.getIdToken(); // Get auth token
      document.cookie = \`authToken=\${token}; path=/;`; // Set cookie for middleware
      setShowLogin(false);
      setLoading(true);
      setPostLoginAnimation(true);
      setTimeout(() => {
        setLoading(false);
        setCountdown(5); // Start countdown
      }, 2000); // Match post-login animation duration
    } catch (error) {
      if (error instanceof Error) {
        alert(\`Login failed: \${error.message}\`);
      } else {
        alert('Login failed: An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setIsLoggedIn(true);
      router.push('/missioncontrol/home');
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, router]);

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
      <div
        className= \`absolute top-0 left-0 w-full z-20 flex items-start justify-between px-4 py-4 pointer-events-none \${
          postLoginAnimation ? 'fade-out' : ''
        }\`
      >
        <h1
          style={{ color: 'white', fontFamily: 'var(--font-orbitron)' }}
          className="text-xs font-normal pointer-events-auto whitespace-nowrap"
        >
          SpacePath Capital
        </h1>
        {!showLogin && (
          <div className="pointer-events-auto">
            <Image
              src="/iss.gif"
              alt="ISS Icon"
              width={40}
              height={40}
              unoptimized
              className= \`cursor-pointer hover:scale-110 transition-transform \${
                issAnimation ? 'iss-fly-in' : ''
              }\`
              onClick={handleEarthClick}
              style={{ position: issAnimation ? 'fixed' : 'relative' }}
              data-debug="header-iss"
            />
          </div>
        )}
      </div>

      {/* Earth: Click to login */}
      {!showLogin && !isLoggedIn && (
        <div
          className= \`absolute top-1/2 left-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2 \${
            earthAnimation ? 'earth-fade-out' : postLoginAnimation ? 'earth-fade-away' : ''
          }\`
        >
          <Image
            src="/earth.gif"
            alt="Earth"
            width={300}
            height={300}
            unoptimized
            className="cursor-pointer transition-opacity duration-500 hover:scale-105 drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            onClick={handleEarthClick}
          />
        </div>
      )}

      {/* Login Form and ISS */}
      {showLogin && !isLoggedIn && !loading && (
        <div className="login-container" data-debug="login-container">
          <div
            className= \`flex items-center gap-20 \$ {postLoginAnimation ? 'fade-out' : ''}\`
            data-debug="inner-flex"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="flex flex-col items-center gap-8 font-[var(--font-orbitron)]"
              data-debug="login-form"
            >
              <input
                type="text"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-[200px] text-center bg-transparent text-white placeholder-white text-xs border-none outline-none focus:outline-none focus:ring-0 font-[var(--font-orbitron)] input-text-white"
                style={{ fontFamily: 'var(--font-orbitron)', color: 'white !important', WebkitTextFillColor: 'white !important' }}
                data-debug="username-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-[200px] text-center bg-transparent text-white placeholder-white text-xs border-none outline-none focus:outline-none focus:ring-0 font-[var(--font-orbitron)] input-text-white"
                style={{ fontFamily: 'var(--font-orbitron)', color: 'white !important', WebkitTextFillColor: 'white !important' }}
                data-debug="password-input"
              />
            </form>
            <Image
              src="/iss.gif"
              alt="ISS Icon"
              width={40}
              height={40}
              unoptimized
              className= \`cursor-pointer hover:scale-110 transition-transform \$ {
                issAnimation && !postLoginAnimation ? 'iss-fly-in' : postLoginAnimation ? 'iss-fly-out' : ''
              }\`
              onClick={handleLogin}
              data-debug="login-iss"
            />
          </div>
          <Script id="force-center" strategy="afterInteractive">
            {`
              const container = document.querySelector('[data-debug="login-container"]');
              if (container) {
                container.style.position = 'fixed';
                container.style.top = '50%';
                container.style.left = '50%';
                container.style.transform = 'translate(-50%, -50%)';
                container.style.display = 'flex';
                container.style.justifyContent = 'center';
                container.style.alignItems = 'center';
                container.style.width = '100vw';
                container.style.minHeight = '100vh';
                container.style.margin = '0';
                container.style.padding = '0';
                container.style.zIndex = '20';
              }
            `}
          </Script>
        </div>
      )}

      {/* Countdown */}
      {countdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center z-30 fade-to-black">
          <span className="text-6xl font-[var(--font-orbitron)] text-white tracking-widest">
            {countdown > 0 ? countdown : 'Lift Off!'}
          </span>
        </div>
      )}

      {/* Loading State */}
      {loading && !countdown && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-30">
          <Image
            src="/iss.gif"
            alt="ISS"
            width={200}
            height={200}
            unoptimized
            className="iss-loading"
          />
          <span className="tracking-widest text-2xl">Loading...</span>
        </div>
      )}

      {/* Footer (disclaimer) */}
      {hydrated && !postLoginAnimation && (
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