'use client';

// ============================================================
// SpaceSafe X — Premium Mission Control Navbar
// ============================================================
// Always fixed/sticky. Never disappears. Smooth backdrop blur.
// Judge Mode button accessible from every page.
// Active page indicator with animated underline.
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Satellite, LayoutDashboard, Globe2, Atom, Bot,
  ShieldAlert, Menu, X, Radio, Play, Zap,
} from 'lucide-react';

// ============================================================
// Navigation Links
// ============================================================

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navLinks: NavLink[] = [
  { href: '/dashboard',         label: 'Dashboard',   icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
  { href: '/earth-view',        label: 'Earth View',  icon: <Globe2 className="w-3.5 h-3.5" /> },
  { href: '/kessler-simulator', label: 'Simulator',   icon: <Atom className="w-3.5 h-3.5" /> },
  { href: '/ai-agents',         label: 'AI Agents',   icon: <Bot className="w-3.5 h-3.5" /> },
  { href: '/collision-engine',  label: 'Collision',   icon: <ShieldAlert className="w-3.5 h-3.5" /> },
];

// ============================================================
// Judge Mode Trigger Hook
// ============================================================
// Dispatches a custom event that page.tsx listens to.
// This allows the navbar to trigger judge mode from any page.

function triggerJudgeMode() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('spacesafe:judge-mode'));
  }
}

// ============================================================
// Navbar Component
// ============================================================

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const handleJudgeMode = useCallback(() => {
    setIsMobileMenuOpen(false);
    if (pathname !== '/') {
      router.push('/');
      // Give the page time to load before triggering
      setTimeout(() => triggerJudgeMode(), 600);
    } else {
      triggerJudgeMode();
    }
  }, [pathname, router]);

  return (
    <>
      {/* ======================================== */}
      {/* Fixed Top Navbar — Always Visible        */}
      {/* ======================================== */}
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`
          fixed top-0 left-0 right-0 z-50 h-14
          transition-all duration-300
          ${isScrolled
            ? 'bg-[#050816]/98 border-b border-[#172554] shadow-[0_4px_32px_rgba(0,0,0,0.5)] backdrop-blur-md'
            : 'bg-[#050816]/80 border-b border-[#172554]/60 backdrop-blur-sm'
          }
        `}
        style={{ willChange: 'transform' }}
      >
        <div className="max-w-[1600px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">

          {/* ---- Logo ---- */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-sm border border-[#00D4FF]/40"
                style={{ background: 'rgba(0,212,255,0.08)' }}
              >
                <Satellite className="w-4 h-4 text-[#00D4FF]" />
              </div>
              <div
                className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#10B981]"
                style={{ boxShadow: '0 0 6px rgba(16,185,129,0.8)', animation: 'pulse-glow-green 2s infinite' }}
              />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="text-[13px] font-bold tracking-[0.08em] text-[#F8FAFC] uppercase"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                SpaceSafe<span className="text-[#00D4FF]">X</span>
              </span>
              <span
                className="text-[8px] tracking-[0.2em] text-[#475569] uppercase hidden sm:block"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                SPACE TRAFFIC MGT
              </span>
            </div>
          </Link>

          {/* ---- Desktop Nav Links ---- */}
          <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative flex items-center gap-1.5 px-3 py-2
                    text-xs font-medium transition-all duration-150
                    ${ active
                      ? 'text-[#00D4FF]'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.03]'
                    }
                  `}
                  style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.03em' }}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute bottom-0 left-2 right-2 h-[1.5px] bg-[#00D4FF]"
                      style={{ boxShadow: '0 0 8px rgba(0,212,255,0.6)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ---- Right Actions ---- */}
          <div className="flex items-center gap-2 shrink-0">

            {/* System Status (desktop only) */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-[#172554]">
              <div
                className="w-1.5 h-1.5 rounded-full bg-[#10B981]"
                style={{ boxShadow: '0 0 5px rgba(16,185,129,0.7)', animation: 'pulse-glow-green 2s infinite' }}
              />
              <span
                className="text-[9px] text-[#94A3B8] tracking-[0.12em] uppercase"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                SYS NOMINAL
              </span>
            </div>

            {/* ▶ JUDGE MODE — Premium CTA */}
            <button
              onClick={handleJudgeMode}
              className={`
                hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-sm
                text-[10px] font-bold tracking-[0.08em] uppercase
                transition-all duration-200 cursor-pointer
                border border-[#7C3AED]/50 bg-[rgba(124,58,237,0.12)]
                text-[#7C3AED] hover:bg-[rgba(124,58,237,0.22)]
                hover:border-[#7C3AED]/80
                hover:shadow-[0_0_16px_rgba(124,58,237,0.3)]
                active:scale-[0.97]
              `}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              aria-label="Launch Judge Mode demo"
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              JUDGE MODE
            </button>

            {/* Launch Platform */}
            <Link href="/dashboard">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold transition-all duration-150 bg-[#00D4FF] text-[#050816] hover:bg-[#00c4ef] hover:shadow-[0_0_16px_rgba(0,212,255,0.35)] active:scale-[0.97]"
                style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em' }}
              >
                <Zap className="w-3 h-3" />
                Launch
              </button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-sm border border-[#172554] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#1e3a5f] transition-colors"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ======================================== */}
      {/* Mobile Menu Overlay                      */}
      {/* ======================================== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="fixed top-14 right-0 bottom-0 z-40 w-64 border-l border-[#172554] bg-[#050816] md:hidden overflow-y-auto"
            >
              <div className="p-3 space-y-0.5">
                {navLinks.map((link, index) => {
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ x: 16, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-sm
                          text-xs font-medium transition-all duration-150
                          ${ active
                            ? 'text-[#00D4FF] bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.15)]'
                            : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.03] border border-transparent'
                          }
                        `}
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                        {active && <div className="ml-auto w-1 h-1 rounded-full bg-[#00D4FF]" style={{ boxShadow: '0 0 5px rgba(0,212,255,0.8)' }} />}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Judge Mode in mobile menu */}
                <motion.div
                  initial={{ x: 16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navLinks.length * 0.04 }}
                  className="pt-2"
                >
                  <button
                    onClick={handleJudgeMode}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-bold transition-all duration-150 border border-[#7C3AED]/40 bg-[rgba(124,58,237,0.08)] text-[#7C3AED] hover:bg-[rgba(124,58,237,0.15)] cursor-pointer"
                    style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em' }}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    JUDGE MODE
                  </button>
                </motion.div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#172554]">
                <p
                  className="text-[9px] text-[#475569] text-center tracking-[0.15em] uppercase"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  SPACESAFE X v1.0.0
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
