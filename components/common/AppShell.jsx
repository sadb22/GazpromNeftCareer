import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Topbar from '../topbar/Topbar';
import { useMode } from '../../context/ModeContext';

const FULL_WIDTH_ROUTES = ['/messenger', '/calendar'];

export default function AppShell() {
  const { mode }     = useMode();
  const { pathname } = useLocation();

  if (mode !== 'employee') return <Navigate to="/" replace />;

  const isFullWidth = FULL_WIDTH_ROUTES.some(r => pathname.startsWith(r));

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className={`flex-1 overflow-y-auto ${isFullWidth ? 'p-0' : 'p-6'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
