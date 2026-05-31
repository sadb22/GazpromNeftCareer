import React from 'react';

export default function StatBadge({ value, label, color = 'accent' }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full font-bold text-sm bg-${color} text-background mr-2`}>{value} <span className="font-normal">{label}</span></span>
  );
}
