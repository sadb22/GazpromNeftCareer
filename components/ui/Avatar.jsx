import React from 'react';

const sizes = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
};

export default function Avatar({ initials, color = '#005DB9', textColor, size = 'md', online, className = '' }) {
  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold select-none`}
        style={{ backgroundColor: color, color: textColor || '#ffffff' }}
      >
        {initials}
      </div>
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${online ? 'bg-success' : 'bg-muted'}`}
        />
      )}
    </div>
  );
}
