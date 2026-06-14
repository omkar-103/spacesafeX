import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Orbitron, Space_Grotesk } from 'next/font/google';
import './globals.css';

// ============================================================
// Font Configuration — Self-hosted via next/font
// Orbitron: aerospace display headings
// Space Grotesk: precision subheadings
// Inter: readable body text
// JetBrains Mono: data/numeric displays
// ============================================================

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-subhead',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

// ============================================================
// SEO Metadata
// ============================================================

export const metadata: Metadata = {
  title: 'SpaceSafe X | Autonomous Space Traffic Management',
  description:
    'Mission-control-grade AI platform for real-time orbital collision prediction, Kessler syndrome simulation, debris tracking, and autonomous avoidance maneuvers. Protecting the space environment with multi-agent AI.',
  keywords: [
    'space traffic management',
    'collision avoidance',
    'orbital debris',
    'Kessler syndrome',
    'satellite tracking',
    'AI agents',
    'space situational awareness',
    'mission control',
    'autonomous space operations',
  ],
  authors: [{ name: 'SpaceSafe X' }],
  openGraph: {
    title: 'SpaceSafe X | Autonomous Space Traffic Management',
    description:
      'Real-time collision prediction and autonomous avoidance maneuvers powered by multi-agent AI.',
    type: 'website',
  },
};

// ============================================================
// Root Layout — wraps the entire application
// ============================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable} ${spaceGrotesk.variable}`}
    >
      <body
        className="min-h-screen antialiased"
        style={{ backgroundColor: '#050816', color: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}
      >
        {/* Starfield background — purely decorative */}
        <div className="starfield" aria-hidden="true" />

        {/* Application content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
