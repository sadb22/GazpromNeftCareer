import React, { createContext, useContext, useState, useEffect } from 'react';

const ModeContext = createContext(null);
const STORAGE_KEY = 'gnk_mode';

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || null; }
    catch { return null; }
  });

  const loginAs = (selectedMode) => {
    setMode(selectedMode);
    try { localStorage.setItem(STORAGE_KEY, selectedMode); } catch {}
  };

  const logout = () => {
    setMode(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return (
    <ModeContext.Provider value={{ mode, loginAs, logout }}>
      {children}
    </ModeContext.Provider>
  );
}

export const useMode = () => {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
};
