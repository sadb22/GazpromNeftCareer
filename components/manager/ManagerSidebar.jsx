import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Users, MessageSquare, Calendar, BarChart2, Mail,
  LogOut, Zap, ChevronRight,
} from 'lucide-react';
import { useMode } from '../../context/ModeContext';
import { managerUser } from '../../data/managerData';

const NAV = [
  { to: '/manager/team',      icon: <Users size={18} />,        label: 'Команда' },
  { to: '/manager/chat',      icon: <MessageSquare size={18} />, label: 'AI-чат' },
  { to: '/manager/calendar',  icon: <Calendar size={18} />,     label: 'Календарь' },
  { to: '/manager/analytics', icon: <BarChart2 size={18} />,    label: 'Аналитика' },
  { to: '/manager/messages',  icon: <Mail size={18} />,         label: 'Сообщения' },
];

const PRIMARY = '#003366';
const PRIMARY_LIGHT = '#EEF2F8';

export default function ManagerSidebar() {
  const navigate     = useNavigate();
  const { logout }   = useMode();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      className="hidden md:flex flex-col w-[240px] flex-shrink-0 min-h-screen bg-white border-r border-border"
      style={{ boxShadow: '2px 0 12px rgba(0,51,102,0.06)' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-border">
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate('/manager/team')}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: PRIMARY }}
          >
            <Zap size={15} className="text-white" />
          </div>
          <div className="leading-none">
            <div className="font-bold text-dark text-[13px] tracking-tight">ГАЗПРОМНЕФТЬ</div>
            <div className="font-semibold text-[10px] tracking-wider mt-0.5" style={{ color: PRIMARY }}>
              РУКОВОДИТЕЛЬ
            </div>
          </div>
        </div>
      </div>

      {/* Manager profile block */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ backgroundColor: PRIMARY }}
          >
            {managerUser.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-dark truncate">{managerUser.name}</p>
            <p className="text-xs text-secondary truncate">Team Lead</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
              ${isActive
                ? 'text-white font-semibold'
                : 'text-secondary hover:text-dark hover:bg-background'}`
            }
            style={({ isActive }) => isActive ? { backgroundColor: PRIMARY } : {}}
          >
            {({ isActive }) => (
              <>
                <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-muted group-hover:text-dark'}`}>
                  {item.icon}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 pt-2 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-secondary hover:bg-danger-light hover:text-danger transition-all"
        >
          <LogOut size={16} className="flex-shrink-0" />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  );
}
