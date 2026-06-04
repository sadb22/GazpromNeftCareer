import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, TrendingUp, BookOpen, Briefcase, Calendar,
  MessageSquare, BarChart2, User, Settings, ChevronRight, LogOut, Sparkles,
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import Avatar from '../ui/Avatar';
import { useApp } from '../../context/AppContext';
import { useMode } from '../../context/ModeContext';

const nav = [
  { to: '/dashboard',     icon: <Home size={18} />,           label: 'Главная' },
  { to: '/messenger',     icon: <MessageSquare size={18} />,  label: 'Сообщения' },
  { to: '/calendar',      icon: <Calendar size={18} />,       label: 'Календарь' },
  { to: '/learning',      icon: <BookOpen size={18} />,       label: 'Обучение' },
  { to: '/analytics',     icon: <BarChart2 size={18} />,      label: 'Аналитика' },
  { to: '/career',        icon: <TrendingUp size={18} />,     label: 'Карьерный путь' },
  { to: '/ai-assistant',  icon: <Sparkles size={18} />,       label: 'AI-ассистент' },
  { to: '/opportunities', icon: <Briefcase size={18} />,      label: 'Возможности' },
];

const bottomNav = [
  { to: '/profile', icon: <User size={18} />, label: 'Профиль' },
  { to: '/settings', icon: <Settings size={18} />, label: 'Настройки' },
];

export default function Sidebar({ mobile = false }) {
  const navigate     = useNavigate();
  const { user }     = useApp();
  const { logout }   = useMode();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className={`${mobile ? 'flex' : 'hidden md:flex'} flex-col w-[280px] flex-shrink-0 bg-white border-r border-border min-h-screen shadow-sidebar`}>
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <img
          src="/logo.png"
          alt="Газпром нефть"
          height={40}
          style={{ height: 40, width: 'auto', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        />
      </div>

      {/* Profile Block */}
      <div
        className="mx-4 mb-4 p-3 rounded-xl bg-background border border-border cursor-pointer hover:border-accent/30 transition-all group"
        onClick={() => navigate('/profile')}
      >
        <div className="flex items-center gap-3">
          <Avatar initials={user.initials} color={user.avatarColor} size="md" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-dark text-sm truncate">{user.name}</div>
            <div className="text-xs text-secondary truncate">{user.role}</div>
          </div>
          <ChevronRight size={14} className="text-muted group-hover:text-accent transition-colors flex-shrink-0" />
        </div>
        <div className="mt-2.5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-secondary">Готовность к переходу</span>
            <span className="text-xs font-bold text-accent">{user.readiness}%</span>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${user.readiness}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {nav.map((item) => (
          <SidebarItem key={item.to} {...item} />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 pb-4 pt-2 border-t border-border space-y-0.5">
        {bottomNav.map((item) => (
          <SidebarItem key={item.to} {...item} />
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-secondary hover:bg-danger-light hover:text-danger transition-all"
        >
          <LogOut size={16} className="flex-shrink-0 text-muted" />
          <span>Сменить роль</span>
        </button>
      </div>
    </aside>
  );
}
