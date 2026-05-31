import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

export default function MobileSidebar({ className = '' }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className={`absolute top-4 left-4 z-30 md:hidden text-accent ${className}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Открыть меню"
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>
      {open && (
        <div className="fixed inset-0 bg-background/80 z-20" onClick={() => setOpen(false)} />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-60 bg-card z-30 transform ${open ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 md:hidden ${className}`}
      >
        <Sidebar />
      </div>
    </>
  );
}
