import { Satellite } from 'lucide-react';

// ============================================================
// Footer — Engineering-style telemetry footer
// ============================================================

export default function Footer() {
  return (
    <footer className="relative mt-auto">
      <div className="h-px bg-[#172554]" />
      <div className="bg-[#050816]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">

            {/* Left — Branding */}
            <div className="flex items-center gap-2 text-[#475569]">
              <Satellite className="w-3 h-3" />
              <span
                className="text-[9px] tracking-[0.15em] uppercase"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                SpaceSafe X &copy; 2026 — AI Space Traffic Management
              </span>
            </div>

            {/* Center — System info */}
            <div
              className="hidden md:flex items-center gap-4 text-[9px] tracking-[0.12em] uppercase text-[#2d4a6e]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              <span>UPTIME: 99.97%</span>
              <span className="w-px h-3 bg-[#172554]" />
              <span>TRACKING: 34K+ OBJECTS</span>
              <span className="w-px h-3 bg-[#172554]" />
              <span>LATENCY: &lt;50ms</span>
            </div>

            {/* Right — Status */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" style={{ boxShadow: '0 0 5px rgba(16,185,129,0.7)' }} />
              <span
                className="text-[9px] tracking-[0.12em] uppercase text-[#94A3B8]"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                Systems Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
