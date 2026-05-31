import React from 'react';

export default function Card({ children, className = '', onClick, hover = false, padding = 'p-6' }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-border shadow-card
        ${hover ? 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : ''}
        ${padding}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, icon, iconBg, iconColor }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: iconBg || '#E8F0FA', color: iconColor || '#005DB9' }}
          >
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-dark text-base leading-tight">{title}</h3>
          {subtitle && <p className="text-xs text-secondary mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
