import Footer from '@/components/layout/footer';

// ============================================================
// App Layout — wraps all pages within the (app) route group
// Navbar is now rendered globally in root layout.tsx
// This layout only adds the footer and content offset.
// ============================================================

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content — pt-14 offsets the fixed navbar height */}
      <main className="flex-1 pt-14">
        <div className="bg-grid min-h-[calc(100vh-3.5rem)]">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
