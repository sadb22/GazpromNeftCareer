import React from 'react';

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-dark shadow-sm',
  secondary: 'bg-accent-light text-accent hover:bg-accent/20',
  outline: 'bg-white border border-border text-dark hover:bg-background',
  ghost: 'bg-transparent text-secondary hover:bg-background',
  danger: 'bg-danger-light text-danger hover:bg-danger hover:text-white',
  success: 'bg-success-light text-success hover:bg-success hover:text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-2.5 text-sm rounded-2xl gap-2',
  xl: 'px-8 py-3 text-base rounded-2xl gap-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  disabled,
  loading,
  onClick,
  className = '',
  type = 'button',
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center font-semibold transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  );
}
