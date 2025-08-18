'use client';

import { useEffect } from 'react';
import TradeBlotter from '../../../components/TradeBlotter';
import ProsNav from '../../../components/ProsNav';

export default function BetaPage() {
  useEffect(() => {
    const interval = setInterval(() => {
      const iframe = document.getElementById('beta-iframe') as HTMLIFrameElement | null;
      if (iframe && iframe.src) {
        iframe.src = iframe.src; // Reload by resetting src to itself
      }
    }, 60000); // Reload every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen" style={{ margin: 0, padding: 0, backgroundColor: 'black' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '40px', backgroundColor: 'black', zIndex: 10 }} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: '5px', height: '100%', backgroundColor: 'black', zIndex: 10 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '5px', backgroundColor: 'black', zIndex: 10 }} />
      <TradeBlotter />
      <ProsNav />
      <iframe
        id="beta-iframe"
        src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQWqC6_q0vrGbsrJq130ZraEgUhZM-z7KGe3tmFYg0pkffkKqL8cx706eYFQwfAWtnZZVNL5J-O9QIe/pubhtml?gid=614407323&single=true&widget=false&headers=false&rm=embedded&output=embed"
        style={{ width: 'calc(100vw + 20px)', height: 'calc(100vh + 50px)', border: '3px solid black', overflow: 'hidden', margin: 0, padding: 0, position: 'absolute', top: 0, left: 0, zIndex: 1, backgroundColor: 'black' }}
        scrolling="no"
      />
    </div>
  );
}
