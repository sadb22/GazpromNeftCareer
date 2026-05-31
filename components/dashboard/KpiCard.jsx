import React from 'react';

export default function KpiCard({ title, value, trend, icon, secondary }) {
  return (
    <div className="bg-card rounded-2xl shadow-lg p-6 flex flex-col gap-2 border border-background/60 min-w-[200px]">
      <div className="flex items-center gap-2 text-accent font-heading font-bold text-lg">
        {icon}
        <span>{title}</span>
      </div>
      <div className="font-heading text-4xl font-extrabold text-white tracking-tight">{value}</div>
      <div className="flex items-center gap-2 text-green-400 font-bold text-base">
        {trend}
      </div>
      <div className="text-muted text-sm font-body mt-2">{secondary}</div>
    </div>
  );
}
