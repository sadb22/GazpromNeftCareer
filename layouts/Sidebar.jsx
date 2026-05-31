import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2 } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: <Home size={20} />, label: 'Дашборд' },
];

export default function Sidebar({ className = '' }) {
  return (
    <aside className={`w-60 bg-card text-muted flex flex-col p-4 ${className}`}>
      <div className="font-heading font-bold text-xl text-accent mb-8">ГАЗПРОМНЕФТЬ КАРЬЕРА</div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg font-body text-base hover:bg-background/60 transition ${isActive ? 'bg-background/80 text-accent' : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
