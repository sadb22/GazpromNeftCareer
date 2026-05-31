import React from 'react';

export default function Topbar() {
  return (
    <header className="h-16 bg-card flex items-center px-6 border-b border-background/40">
      <div className="font-heading font-bold text-lg text-accent">Газпромнефть Карьера</div>
      <div className="flex-1" />
      <div className="text-muted">Панель управления</div>
    </header>
  );
}
