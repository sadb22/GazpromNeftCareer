import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Shared
import Login from '../pages/Login';

// Employee mode
import AppShell      from '../components/common/AppShell';
import Dashboard     from '../pages/Dashboard';
import Profile       from '../pages/Profile';
import Career        from '../pages/Career';
import Learning      from '../pages/Learning';
import Opportunities from '../pages/Opportunities';
import MessengerPage from '../pages/MessengerPage';
import AIAssistant   from '../pages/Messenger';
import Calendar      from '../pages/Calendar';
import Analytics     from '../pages/Analytics';
import Settings      from '../pages/Settings';

// Manager mode
import ManagerShell      from '../pages/manager/ManagerShell';
import Team              from '../pages/manager/Team';
import ManagerChat       from '../pages/manager/ManagerChat';
import ManagerCalendar   from '../pages/manager/ManagerCalendar';
import ManagerAnalytics  from '../pages/manager/ManagerAnalytics';
import ManagerMessages   from '../pages/manager/ManagerMessages';

export default function App() {
  return (
    <Routes>
      {/* Login / role selection */}
      <Route path="/" element={<Login />} />

      {/* ── Employee mode ── */}
      <Route element={<AppShell />}>
        <Route path="dashboard"    element={<Dashboard />} />
        <Route path="profile"      element={<Profile />} />
        <Route path="career"       element={<Career />} />
        <Route path="learning"     element={<Learning />} />
        <Route path="opportunities" element={<Opportunities />} />
        <Route path="messenger"      element={<MessengerPage />} />
        <Route path="ai-assistant"   element={<AIAssistant />} />
        <Route path="calendar"     element={<Calendar />} />
        <Route path="analytics"    element={<Analytics />} />
        <Route path="settings"     element={<Settings />} />
      </Route>

      {/* ── Manager mode ── */}
      <Route path="/manager" element={<ManagerShell />}>
        <Route index element={<Navigate to="team" replace />} />
        <Route path="team"      element={<Team />} />
        <Route path="chat"      element={<ManagerChat />} />
        <Route path="calendar"  element={<ManagerCalendar />} />
        <Route path="analytics" element={<ManagerAnalytics />} />
        <Route path="messages"  element={<ManagerMessages />} />
      </Route>
    </Routes>
  );
}
