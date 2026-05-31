import React from 'react';

export default function ChartCard({ title, children }) {
  return (
    <div className="bg-card rounded-2xl shadow-lg p-6 border border-background/60 flex flex-col min-w-[320px]">
      <div className="font-heading font-bold text-accent text-lg mb-2">{title}</div>
      <div className="flex-1 min-h-[180px]">{children}</div>
    </div>
  );
}
