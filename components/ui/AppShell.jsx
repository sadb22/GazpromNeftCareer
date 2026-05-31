import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Topbar from '../topbar/Topbar';
import Dashboard from '../../pages/Dashboard';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-background grid grid-cols-[280px_1fr] grid-rows-[64px_1fr]">
      <Sidebar />
      <Topbar className="col-start-2 row-start-1" />
      <main className="col-start-2 row-start-2 p-8 overflow-y-auto">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          {/* Other routes here */}
        </Routes>
      </main>
    </div>
  );
}
