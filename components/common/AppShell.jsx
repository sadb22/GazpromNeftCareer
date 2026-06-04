import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Topbar from '../topbar/Topbar';
import { useMode } from '../../context/ModeContext';

const FULL_WIDTH_ROUTES = ['/messenger', '/calendar', '/ai-assistant'];

export default function AppShell() {
  const { mode }        = useMode();
  const { pathname }    = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (mode !== 'employee') return <Navigate to="/" replace />;

  const isFullWidth = FULL_WIDTH_ROUTES.some(r => pathname.startsWith(r));

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
        <Sidebar mobile />
      </div>

      {/* ── Desktop sidebar ──────────────────────── */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className={`flex-1 overflow-y-auto ${isFullWidth ? 'p-0' : 'p-3 sm:p-6'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
