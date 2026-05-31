import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileSidebar from './MobileSidebar';

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar className="hidden md:block" />
      <MobileSidebar className="md:hidden" />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
