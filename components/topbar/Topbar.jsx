import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, ChevronDown, X, Check } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { useApp } from '../../context/AppContext';

const notifIcons = { opportunity: '💼', learning: '📚', message: '💬', review: '📋' };

export default function Topbar() {
  const navigate = useNavigate();
  const { user, notifications, unreadCount, markNotificationRead, markAllRead } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowNotifs(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-14 bg-white border-b border-border flex items-center px-6 gap-4 flex-shrink-0 z-20 sticky top-0">
      <span className="hidden lg:block text-sm font-semibold text-secondary whitespace-nowrap">Платформа развития</span>
      <div className="hidden lg:block w-px h-5 bg-border" />
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Поиск сотрудников, курсов, материалов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm bg-background border border-border rounded-xl text-dark placeholder-muted focus:border-accent/60 focus:bg-white transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Badge variant="accent" className="hidden sm:flex text-xs">Сотрудник</Badge>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-secondary hover:bg-background hover:text-dark transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-white" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-card-hover border border-border z-50 animate-fade-in overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="font-semibold text-dark text-sm">Уведомления</span>
                <button onClick={markAllRead} className="text-xs text-accent hover:text-accent-dark font-medium flex items-center gap-1">
                  <Check size={11} /> Прочитать все
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-border/50">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-background transition-colors text-left ${!n.read ? 'bg-accent-light/20' : ''}`}
                  >
                    <span className="text-base flex-shrink-0 mt-0.5">{notifIcons[n.type] || '🔔'}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!n.read ? 'font-semibold text-dark' : 'text-secondary'}`}>{n.text}</p>
                      <p className="text-xs text-muted mt-0.5">{n.time}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 hover:bg-background rounded-xl px-2 py-1.5 transition-colors group"
        >
          <Avatar initials={user.initials} color={user.avatarColor} size="sm" />
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-dark leading-none">{user.name.split(' ')[0]}</div>
            <div className="text-[10px] text-secondary leading-none mt-0.5">{user.level}</div>
          </div>
          <ChevronDown size={13} className="text-muted hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
