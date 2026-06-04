import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import ManagerSidebar from '../../components/manager/ManagerSidebar';
import { useMode } from '../../context/ModeContext';

const FULL_WIDTH = ['/manager/messages'];

export default function ManagerShell() {
  const { mode }     = useMode();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (mode !== 'manager') return <Navigate to="/" replace />;

  const isFullWidth = FULL_WIDTH.some(r => pathname.startsWith(r));

  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Mobile sidebar drawer ────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full z-50 md:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ManagerSidebar mobile />
      </div>

      {/* ── Desktop sidebar ──────────────────────── */}
      <ManagerSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="md:hidden h-14 bg-white border-b border-border flex items-center px-4 gap-3 flex-shrink-0 sticky top-0 z-20">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-1 rounded-xl text-secondary hover:bg-background transition-colors"
            aria-label="Открыть меню"
          >
            <Menu size={20} />
          </button>
          <span className="font-bold text-dark text-sm">Газпром нефть</span>
        </header>

        <main className={`flex-1 overflow-y-auto ${isFullWidth ? 'p-0' : 'p-3 sm:p-6'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
