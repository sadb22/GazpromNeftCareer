import React from 'react';

const presets = {
  accent: { bg: '#E8F0FA', color: '#005DB9' },   // Gazprom blue
  success: { bg: '#D6EFE1', color: '#1A7A4A' },
  warning: { bg: '#FEF3C7', color: '#B45309' },
  danger:  { bg: '#FDECEA', color: '#C0392B' },
  purple:  { bg: '#EDE9F6', color: '#6D4FA0' },
  orange:  { bg: '#FDEEDE', color: '#C05621' },
  teal:    { bg: '#CCEDE9', color: '#0D7A6E' },
  pink:    { bg: '#F9E5EF', color: '#A83265' },
  muted:   { bg: '#ECEEF2', color: '#5B6B7D' },
  silver:  { bg: '#ECEEF2', color: '#8A919E' },
};

export default function Badge({ children, variant = 'muted', color, bg, dot, className = '' }) {
  const style = presets[variant] || presets.muted;
  const bgColor = bg || style.bg;
  const textColor = color || style.color;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: textColor }} />
      )}
      {children}
    </span>
  );
}
