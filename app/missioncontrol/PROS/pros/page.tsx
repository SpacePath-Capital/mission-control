'use client';

import TradeBlotter from '../../../components/TradeBlotter';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ProsPage() {
  const pathname = usePathname();

  useEffect(() => {
    const interval = setInterval(() => {
      const iframe = document.querySelector('iframe');
      // if (iframe) iframe.contentWindow?.location.reload(); // Commented out due to cross-origin issue
    }, 60000); // Reload every 60 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="relative h-screen" style={{ margin: 0, padding: 0, backgroundColor: 'black' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '40px', backgroundColor: 'black', zIndex: 10 }}></div>
      <div style={{ position: 'absolute', left: 0, top: '0px', width: '5px', height: '100%', backgroundColor: 'black', zIndex: 10 }}></div> {/* Left overlay, 5px wide */}
      <div style={{ position: 'absolute', bottom: 0, left: '0px', width: '100%', height: '5px', backgroundColor: 'black', zIndex: 10 }}></div> {/* Bottom overlay, 5px high */}
      <TradeBlotter />
      <nav className="absolute right-0 top-0 p-2 bg-black text-white flex gap-4" style={{ border: 'none', zIndex: 20 }}>
        <Link href="/missioncontrol/PROS/pros" className={`${pathname === '/missioncontrol/PROS/pros' ? 'font-bold' : ''} hover:font-bold`}>PROS</Link>
        <Link href="/missioncontrol/PROS/snapshot" className={`${pathname === '/missioncontrol/PROS/snapshot' ? 'font-bold' : ''} hover:font-bold`}>Snapshot</Link>
        <Link href="/missioncontrol/PROS/portfolio" className={`${pathname === '/missioncontrol/PROS/portfolio' ? 'font-bold' : ''} hover:font-bold`}>Portfolio</Link>
        <Link href="/missioncontrol/PROS/watchlist" className={`${pathname === '/missioncontrol/PROS/watchlist' ? 'font-bold' : ''} hover:font-bold`}>Watchlist</Link>
        <Link href="/missioncontrol/PROS/beta" className={`${pathname === '/missioncontrol/PROS/beta' ? 'font-bold' : ''} hover:font-bold`}>Beta</Link>
        <Link href="/missioncontrol/PROS/tradehistory" className={`${pathname === '/missioncontrol/PROS/tradehistory' ? 'font-bold' : ''} hover:font-bold`}>Trade History</Link>
      </nav>
      <iframe
        src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQWqC6_q0vrGbsrJq130ZraEgUhZM-z7KGe3tmFYg0pkffkKqL8cx706eYFQwfAWtnZZVNL5J-O9QIe/pubhtml?gid=1117029356&single=true&widget=false&headers=false&rm=embedded&output=embed"
        style={{ width: 'calc(100vw + 20px)', height: 'calc(100vh + 50px)', border: '3px solid black', overflow: 'hidden', margin: '0px', padding: 0, position: 'absolute', top: '0px', left: 0, marginTop: '0', zIndex: 1, backgroundColor: 'black' }}
        scrolling="no"
      ></iframe>
    </div>
  );
}