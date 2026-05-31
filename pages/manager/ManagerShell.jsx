import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import ManagerSidebar from '../../components/manager/ManagerSidebar';
import { useMode } from '../../context/ModeContext';

const FULL_WIDTH = ['/manager/messages'];

export default function ManagerShell() {
  const { mode }     = useMode();
  const { pathname } = useLocation();

  if (mode !== 'manager') return <Navigate to="/" replace />;

  const isFullWidth = FULL_WIDTH.some(r => pathname.startsWith(r));

  return (
    <div className="min-h-screen flex bg-background">
      <ManagerSidebar />
      <main className={`flex-1 overflow-y-auto ${isFullWidth ? 'p-0' : 'p-6'}`}>
        <Outlet />
      </main>
    </div>
  );
}
