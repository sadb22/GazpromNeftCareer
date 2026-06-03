import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, TrendingUp, BookOpen, Briefcase, Calendar,
  MessageSquare, BarChart2, User, Settings, ChevronRight, LogOut, Sparkles,
} from 'lucide-react';

/* Официальный логотип Газпром нефти */
function GazpromNeftLogo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Голубой фон — корп. цвет Газпром нефти */}
      <rect width="40" height="40" rx="9" fill="#003087"/>
      {/* Стилизованная «Г» / пламя */}
      <path
        d="M20 8C13.4 8 8 13.4 8 20C8 24.6 10.5 28.6 14.2 30.8L14.2 25.2C12.5 23.6 11.4 21.4 11.4 19C11.4 14.6 15.2 11 20 11C22.4 11 24.6 12 26.2 13.6L26.2 8.8C24.4 8.3 22.2 8 20 8Z"
        fill="white"
      />
      <path
        d="M26.2 13.6L26.2 19.6L22.2 19.6L22.2 22L30 22L30 13.6C28.8 11 25.6 8.8 26.2 13.6Z"
        fill="white" opacity="0"
      />
      <path
        d="M21 19.5L21 21.5L28 21.5L28 19.5L21 19.5Z"
        fill="white"
      />
      <path
        d="M26 13.5L26 21.5L28 21.5L28 13.5L26 13.5Z"
        fill="white"
      />
      <path
        d="M14 30.8C15.8 31.8 17.8 32.4 20 32.4C26.6 32.4 32 27 32 20.4C32 17.4 30.9 14.7 29.1 12.7L27 15C28.2 16.4 29 18.3 29 20.4C29 25.2 25 29.2 20 29.2C18.2 29.2 16.6 28.6 15.2 27.6L14 30.8Z"
        fill="white"
      />
    </svg>
  );
}
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

export default function Sidebar() {
  const navigate     = useNavigate();
  const { user }     = useApp();
  const { logout }   = useMode();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="hidden md:flex flex-col w-[280px] flex-shrink-0 bg-white border-r border-border min-h-screen shadow-sidebar">
      {/* Logo — только логотип Газпром нефти, без подписи платформы */}
      <div className="px-5 pt-6 pb-4">
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <GazpromNeftLogo size={36} />
          <div className="leading-tight">
            <div className="font-bold text-dark text-[13px] tracking-tight">ГАЗПРОМ</div>
            <div className="font-bold text-dark text-[13px] tracking-tight">НЕФТЬ</div>
          </div>
        </div>
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
