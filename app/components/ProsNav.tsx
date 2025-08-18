'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/missioncontrol/PROS/pros', label: 'PROS' },
  { href: '/missioncontrol/PROS/snapshot', label: 'Snapshot' },
  { href: '/missioncontrol/PROS/long', label: 'Long' },     // NEW
  { href: '/missioncontrol/PROS/short', label: 'Short' },   // NEW
  { href: '/missioncontrol/PROS/watchlist', label: 'Watchlist' },
  { href: '/missioncontrol/PROS/beta', label: 'Beta' },
  { href: '/missioncontrol/PROS/tradehistory', label: 'Trade History' },
];

export default function ProsNav() {
  const pathname = usePathname();
  return (
    <nav className="absolute right-0 top-0 p-2 bg-black text-white flex gap-4" style={{ border: 'none', zIndex: 20 }}>
      {links.map(l => (
        <Link
          key={l.href}
          href={l.href}
          className={`${pathname === l.href ? 'font-bold' : ''} hover:font-bold`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
