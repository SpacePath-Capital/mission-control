import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'SpacePath Mission Control',
  description: 'Secure command interface',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{ fontFamily: 'Orbitron, sans-serif' }}
        className="relative antialiased text-white"
      >
        <Script id="cleanup-body-attributes" strategy="beforeInteractive">
          {`
            // Remove unwanted attributes added by browser extensions
            const body = document.querySelector('body');
            if (body) {
              body.removeAttribute('data-new-gr-c-s-check-loaded');
              body.removeAttribute('data-gr-ext-installed');
            }
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}