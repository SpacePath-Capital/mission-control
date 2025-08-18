'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth } from 'lib/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

export default function MissionControlLogin() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [earthAnimation, setEarthAnimation] = useState(false);
  const [postLoginAnimation, setPostLoginAnimation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);

    const videoElement = document.querySelector('video');
    if (videoElement) {
      console.log('Video element found:', videoElement);
      console.log('Video source:', videoElement.src);
      console.log('Video attributes:', {
        autoPlay: videoElement.autoplay,
        loop: videoElement.loop,
        muted: videoElement.muted,
        playsInline: videoElement.playsInline,
        readyState: videoElement.readyState,
        networkState: videoElement.networkState,
        error: videoElement.error ? videoElement.error.message : 'No error',
      });
      if (videoElement.paused) {
        console.log('Video is paused, attempting to play...');
        videoElement.play().catch(err => console.error('Play failed:', err));
      }
    } else {
      console.error('Video element not found in the DOM');
    }
  }, []);

  const handleEarthClick = () => {
    setEarthAnimation(true);
    setTimeout(() => {
      setShowLogin(true);
      setEarthAnimation(false);
    }, 500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', { username, password });
    setError(null);
    try {
      const credential = await signInWithEmailAndPassword(auth, username, password);
      const token = await credential.user.getIdToken();
      console.log('Login successful, token:', token);
      const isProd = process.env.NODE_ENV === 'production';
      document.cookie = `authToken=${token}; path=/; ${isProd ? 'Secure;' : ''} SameSite=Strict`;
      setShowLogin(false);
      setPostLoginAnimation(true);
      setCountdown(3);
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        setError(`Login failed: ${error.message}`);
      } else {
        setError('Login failed: An unknown error occurred');
      }
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt('Please enter your email to reset your password:');
    if (!email) {
      alert('Email is required to reset password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent! Please check your inbox.');
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error sending password reset email: ${error.message}`);
      } else {
        alert('Error sending password reset email: An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => (prev !== null ? prev - 1 : null));
      }, 500);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      const timer = setTimeout(() => {
        console.log('Countdown finished, setting isLoggedIn to true and redirecting...');
        setIsLoggedIn(true);
        router.push('/missioncontrol/home');
        console.log('Redirect executed');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, router]);

  return (
    <div className="relative w-full h-screen bg-black text-white font-[var(--font-orbitron)] overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover -z-10 opacity-100"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        preload="auto"
      >
        <source src="/space.mp4?v=6" type="video/mp4" />
        Your browser does not support the video tag, or the video file could not be loaded.
      </video>

      {/* Header */}
      <div
        className={`absolute top-0 left-0 w-full z-20 flex items-start justify-between px-4 py-4 pointer-events-none ${postLoginAnimation ? 'fade-out' : ''}`}
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
              alt="Show login form"
              width={40}
              height={40}
              unoptimized
              className="cursor-pointer hover:scale-110 transition-transform"
              onClick={handleEarthClick}
              role="button"
              aria-label="Show login form"
            />
          </div>
        )}
      </div>

      {/* Earth: Click to login */}
      {!showLogin && !isLoggedIn && countdown === null && (
        <div
          className={`absolute top-1/2 left-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2 ${earthAnimation ? 'earth-fade-out' : postLoginAnimation ? 'earth-fade-away' : ''}`}
        >
          <Image
            src="/earth.gif"
            alt="Click to access login form"
            width={300}
            height={300}
            unoptimized
            className="cursor-pointer transition-opacity duration-500 hover:scale-105 drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            onClick={handleEarthClick}
            role="button"
            aria-label="Click to access login form"
          />
        </div>
      )}

      {/* Login Form */}
      {showLogin && !isLoggedIn && countdown === null && (
        <div className="login-container" data-debug="login-container">
          <div
            className={`flex flex-col items-start gap-6 ${postLoginAnimation ? 'fade-out' : ''}`}
            style={{ alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: '50px' }}
            data-debug="inner-flex"
          >
            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-6 font-[var(--font-orbitron)]"
              style={{ alignItems: 'flex-start' }}
              role="form"
              aria-label="Login form"
            >
              <div className="flex items-center gap-4">
                <label className="text-white text-sm w-20" htmlFor="email-input">
                  Email:
                </label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="Enter your email"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-[300px] text-right bg-transparent text-white placeholder-right placeholder-white text-xs border border-gray-400 rounded px-2 py-1 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-[var(--font-orbitron)]"
                  aria-required="true"
                  aria-describedby={error ? 'login-error' : undefined}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="text-white text-sm w-20" htmlFor="password-input">
                  Password:
                </label>
                <input
                  id="password-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-[300px] text-right bg-transparent text-white placeholder-right placeholder-white text-xs border border-gray-400 rounded px-2 py-1 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-[var(--font-orbitron)]"
                  aria-required="true"
                  aria-describedby={error ? 'login-error' : undefined}
                />
              </div>
              {error && (
                <p
                  id="login-error"
                  className="text-red-500 text-xs mt-2 text-left"
                  role="alert"
                >
                  {error}
                </p>
              )}
              <div className="flex justify-between items-center w-full mt-2">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-blue-500 text-xs font-normal"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.fontWeight = 'bold'}
                  onMouseLeave={(e) => e.currentTarget.style.fontWeight = 'normal'}
                >
                  Forgot My Password?
                </button>
                <button
                  type="submit"
                  className="text-[#8B4000] font-normal px-4 py-2 rounded hover:text-white"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.fontWeight = 'bold'}
                  onMouseLeave={(e) => e.currentTarget.style.fontWeight = 'normal'}
                  aria-label="Submit login"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Countdown */}
      {countdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <span className="text-6xl font-[var(--font-orbitron)] text-white tracking-widest">
            {countdown}
          </span>
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