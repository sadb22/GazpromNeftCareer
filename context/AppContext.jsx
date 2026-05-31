import React, { createContext, useContext, useState } from 'react';
import { currentUser } from '../data/employees';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user] = useState(currentUser);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Новая позиция Backend Tech Lead — совпадение 91%', type: 'opportunity', time: '2 мин назад', read: false },
    { id: 2, text: 'Курс Python ML: вы прошли 65%', type: 'learning', time: '1 час назад', read: false },
    { id: 3, text: 'Сергей Громов написал вам', type: 'message', time: '2 часа назад', read: true },
    { id: 4, text: 'Квартальное ревью — 5 июня в 15:00', type: 'review', time: '1 день назад', read: true },
  ]);
  const [aiRoadmapGenerated, setAiRoadmapGenerated] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      user,
      notifications,
      unreadCount,
      markNotificationRead,
      markAllRead,
      aiRoadmapGenerated,
      setAiRoadmapGenerated,
      aiLoading,
      setAiLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
