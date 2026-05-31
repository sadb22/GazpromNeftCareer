import React from 'react';
import { NavLink } from 'react-router-dom';

export default function SidebarItem({ to, icon, label, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
        ${isActive
          ? 'bg-accent-light text-accent font-semibold'
          : 'text-secondary hover:bg-background hover:text-dark'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-accent' : 'text-muted group-hover:text-dark'}`}>
            {icon}
          </span>
          <span className="flex-1 truncate">{label}</span>
          {badge ? (
            <span className={`min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs font-bold px-1.5
              ${isActive ? 'bg-accent text-white' : 'bg-danger text-white'}`}>
              {badge}
            </span>
          ) : null}
        </>
      )}
    </NavLink>
  );
}
