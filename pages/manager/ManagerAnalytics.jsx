import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { teamMembers, idpStatusConfig } from '../../data/managerData';
import ProgressBar from '../../components/ui/ProgressBar';

const PRIMARY = '#003366';
const SUCCESS = '#1D9E75';

/* ── Derived analytics data ─────────────────────────────── */

// Top team gaps (average deficit across team)
const allSkills = {};
teamMembers.forEach(m => {
  m.gaps.forEach(g => {
    if (!allSkills[g.skill]) allSkills[g.skill] = { total: 0, count: 0, required: g.required };
    allSkills[g.skill].total   += g.current;
    allSkills[g.skill].count   += 1;
  });
});
const teamGaps = Object.entries(allSkills)
  .map(([skill, d]) => ({
    skill,
    avg: Math.round(d.total / d.count),
    required: d.required,
    deficit: Math.round(d.required - d.total / d.count),
  }))
  .sort((a, b) => b.deficit - a.deficit)
  .slice(0, 6);

// IDP progress per employee
const idpProgress = teamMembers
  .filter(m => m.idpStatus !== 'no_idp')
  .map(m => ({ name: m.name.split(' ')[0], progress: m.idpProgress, color: m.avatarColor }));

// Status distribution
const statusDist = Object.entries(idpStatusConfig).map(([key, cfg]) => ({
  label: cfg.label,
  count: teamMembers.filter(m => m.idpStatus === key).length,
  color: cfg.color,
  bg: cfg.bg,
}));

// Learning workload (hours per week estimate)
const learningLoad = teamMembers.map(m => ({
  name: m.name.split(' ')[0],
  hours: m.courses.filter(c => c.status === 'in_progress').length * 2.5 + m.courses.filter(c => c.status === 'not_started').length * 1,
  color: m.avatarColor,
}));

const tooltip = {
  contentStyle: { borderRadius: 12, border: '1px solid #DDE1E9', fontSize: 11 },
};

export default function ManagerAnalytics() {
  return (
    <div className="max-w-[860px] mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-dark">Аналитика команды</h1>
        <p className="text-sm text-secondary mt-0.5">Обзор развития · {teamMembers.length} сотрудников</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Ср. прогресс ИПР', value: `${Math.round(teamMembers.filter(m => m.idpStatus !== 'no_idp').reduce((a, m) => a + m.idpProgress, 0) / teamMembers.filter(m => m.idpStatus !== 'no_idp').length)}%`, color: PRIMARY },
          { label: 'Ср. 360°',         value: `${Math.round(teamMembers.reduce((a, m) => a + m.score360, 0) / teamMembers.length)}%`, color: SUCCESS },
          { label: 'Ср. KPI',          value: `${Math.round(teamMembers.reduce((a, m) => a + m.kpiScore, 0) / teamMembers.length)}%`, color: '#6D4FA0' },
          { label: 'Ср. вовлечённость', value: `${Math.round(teamMembers.reduce((a, m) => a + m.engagementScore, 0) / teamMembers.length)}%`, color: '#B45309' },
        ].map((k, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-4 shadow-card text-center">
            <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
            <p className="text-xs text-secondary mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Top gaps */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-5">
          <h3 className="font-semibold text-dark text-sm mb-1">Топ пробелов команды</h3>
          <p className="text-xs text-secondary mb-4">Средний дефицит по навыку</p>
          <div className="space-y-3">
            {teamGaps.map((g, i) => {
              const pct = Math.round((g.avg / g.required) * 100);
              const c   = pct >= 80 ? SUCCESS : pct >= 50 ? '#B45309' : '#C0392B';
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-dark">{g.skill}</span>
                    <span className="text-xs text-secondary">{g.avg} / {g.required}</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: c }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* IDP progress by person */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-5">
          <h3 className="font-semibold text-dark text-sm mb-1">Прогресс ИПР</h3>
          <p className="text-xs text-secondary mb-4">По сотрудникам</p>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={idpProgress} layout="vertical" barCategoryGap="25%">
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#8A919E' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={55} tick={{ fontSize: 11, fill: '#1A2533' }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltip} formatter={v => [`${v}%`, 'ИПР']} />
              <Bar dataKey="progress" radius={[0, 4, 4, 0]}>
                {idpProgress.map((entry, i) => (
                  <Cell key={i} fill={entry.progress >= 80 ? SUCCESS : PRIMARY} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Status distribution */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-5">
          <h3 className="font-semibold text-dark text-sm mb-1">Распределение статусов</h3>
          <p className="text-xs text-secondary mb-4">Команда по состоянию ИПР</p>
          <div className="space-y-3">
            {statusDist.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full w-32 text-center flex-shrink-0"
                  style={{ backgroundColor: s.bg, color: s.color }}
                >
                  {s.label}
                </span>
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(s.count / teamMembers.length) * 100}%`, backgroundColor: s.color }}
                  />
                </div>
                <span className="text-sm font-bold text-dark w-6 text-right flex-shrink-0">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Learning workload */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-5">
          <h3 className="font-semibold text-dark text-sm mb-1">Учебная нагрузка</h3>
          <p className="text-xs text-secondary mb-4">Оценка часов в неделю</p>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={learningLoad} barCategoryGap="30%">
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8A919E' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#8A919E' }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltip} formatter={v => [`${v} ч/нед`, 'Нагрузка']} />
              <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                {learningLoad.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
