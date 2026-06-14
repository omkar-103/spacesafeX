import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';

// ============================================================
// App Layout — wraps all pages within the (app) route group
// Provides the top navigation bar, content area, and footer.
// The (app) folder is a route group — it does NOT affect URLs.
// ============================================================

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed top navigation */}
      <Navbar />

      {/* Main content — pt-16 offsets the fixed 4rem navbar height */}
      <main className="flex-1 pt-16">
        <div className="bg-grid min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>

      {/* Minimal footer */}
      <Footer />
    </div>
  );
}
