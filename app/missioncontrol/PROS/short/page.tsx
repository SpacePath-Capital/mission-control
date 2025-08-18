'use client';

import TradeBlotter from '../../../components/TradeBlotter';
import ProsNav from '../../../components/ProsNav';
import { useEffect } from 'react';

const BASE_PUB_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWqC6_q0vrGbsrJq130ZraEgUhZM-z7KGe3tmFYg0pkffkKqL8cx706eYFQwfAWtnZZVNL5J-O9QIe/pubhtml';
const SHORT_GID = 408869694;

export default function ShortPage() {
  useEffect(() => {
    const t = setInterval(() => {
      const el = document.getElementById('short-iframe') as HTMLIFrameElement | null;
      if (el && el.src) el.src = el.src;
    }, 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-screen" style={{ margin: 0, padding: 0, backgroundColor: 'black' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '40px', backgroundColor: 'black', zIndex: 10 }}></div>
      <div style={{ position: 'absolute', left: 0, top: '0px', width: '5px', height: '100%', backgroundColor: 'black', zIndex: 10 }}></div>
      <div style={{ position: 'absolute', bottom: 0, left: '0px', width: '100%', height: '5px', backgroundColor: 'black', zIndex: 10 }}></div>
      <TradeBlotter />
      <ProsNav />
      <iframe
        id="short-iframe"
        src={`${BASE_PUB_URL}?gid=${SHORT_GID}&single=true&widget=false&headers=false&rm=embedded&output=embed`}
        style={{ width: 'calc(100vw + 20px)', height: 'calc(100vh + 50px)', border: '3px solid black', overflow: 'hidden', margin: '0px', padding: 0, position: 'absolute', top: '0px', left: 0, marginTop: '0', zIndex: 1, backgroundColor: 'black' }}
        scrolling="no"
      ></iframe>
    </div>
  );
}
