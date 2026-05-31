import React from 'react';

const colorMap = {
  accent:  '#005DB9',   // Gazprom Pantone 300 CV
  success: '#1A7A4A',
  warning: '#B45309',
  danger:  '#C0392B',
  purple:  '#6D4FA0',
  orange:  '#C05621',
  silver:  '#B8BDC5',
};

export default function ProgressBar({ value = 0, max = 100, color = 'accent', height = 8, showLabel = false, className = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const barColor = colorMap[color] || color;

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-secondary">Прогресс</span>
          <span className="text-xs font-semibold text-dark">{Math.round(pct)}%</span>
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height, backgroundColor: '#E8EBF2' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
