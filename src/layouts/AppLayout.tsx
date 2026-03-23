import { Link, Outlet } from "react-router";
import HeaderMe from "@/components/HeaderMe";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-5 text-sm font-medium">
            <Link to="/" className="transition-colors hover:text-blue-600">
              Home
            </Link>
            <Link to="/about" className="transition-colors hover:text-blue-600">
              About
            </Link>
          </div>

          <HeaderMe />
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-slate-500 sm:px-6">
          © 2026 My App
        </div>
      </footer>
    </div>
  );
}
