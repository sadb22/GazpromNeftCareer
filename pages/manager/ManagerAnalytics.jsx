import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, CartesianGrid, AreaChart, Area,
} from 'recharts';
import {
  TrendingUp, Users, Target, Award,
  ArrowUpRight, ArrowDownRight, ChevronRight,
} from 'lucide-react';
import { teamMembers, idpStatusConfig } from '../../data/managerData';
import ProgressBar from '../../components/ui/ProgressBar';

/* ── Derived data ──────────────────────────────────────────── */
const withIdp    = teamMembers.filter(m => m.idpStatus !== 'no_idp');
const avgIdp     = Math.round(withIdp.reduce((s, m) => s + m.idpProgress, 0) / withIdp.length);
const avg360     = Math.round(teamMembers.reduce((s, m) => s + m.score360,       0) / teamMembers.length);
const avgKpi     = Math.round(teamMembers.reduce((s, m) => s + m.kpiScore,       0) / teamMembers.length);
const avgEngag   = Math.round(teamMembers.reduce((s, m) => s + m.engagementScore, 0) / teamMembers.length);

const allSkills  = {};
teamMembers.forEach(m =>
  m.gaps.forEach(g => {
    if (!allSkills[g.skill]) allSkills[g.skill] = { total: 0, count: 0, required: g.required };
    allSkills[g.skill].total  += g.current;
    allSkills[g.skill].count  += 1;
  })
);
const teamGaps = Object.entries(allSkills)
  .map(([skill, d]) => ({
    skill,
    avg:      Math.round(d.total / d.count),
    required: d.required,
    pct:      Math.round((d.total / d.count / d.required) * 100),
  }))
  .sort((a, b) => a.pct - b.pct)
  .slice(0, 6);

const idpChartData = withIdp.map(m => ({
  name:     m.name.split(' ')[0],
  progress: m.idpProgress,
  kpi:      m.kpiScore,
  color:    m.avatarColor,
}));

const statusDist = Object.entries(idpStatusConfig).map(([key, cfg]) => ({
  label: cfg.label, count: teamMembers.filter(m => m.idpStatus === key).length,
  color: cfg.color, bg: cfg.bg,
})).filter(s => s.count > 0);

/* ── Tooltip style ─────────────────────────────────────────── */
const TT = {
  contentStyle: {
    borderRadius: 10, border: '1px solid #DDE1E9',
    fontSize: 11, boxShadow: '0 4px 12px rgba(26,37,51,0.08)',
  },
};

/* ── Stat card ─────────────────────────────────────────────── */
function StatCard({ label, value, delta, deltaLabel, icon, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-card">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-secondary leading-snug">{label}</p>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconBg, color: iconColor }}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-dark leading-none mb-2">{value}</p>
      {delta !== undefined && (
        <div className="flex items-center gap-1.5 text-xs">
          {delta > 0
            ? <span className="flex items-center gap-0.5 font-semibold text-emerald-600"><ArrowUpRight size={13} />+{delta}%</span>
            : <span className="flex items-center gap-0.5 font-semibold text-danger"><ArrowDownRight size={13} />{delta}%</span>}
          {deltaLabel && <span className="text-muted">{deltaLabel}</span>}
        </div>
      )}
    </div>
  );
}

/* ── Section header ─────────────────────────────────────────── */
function SH({ title, sub }) {
  return (
    <div className="mb-5">
      <h3 className="font-bold text-dark text-base">{title}</h3>
      {sub && <p className="text-xs text-secondary mt-0.5">{sub}</p>}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export default function ManagerAnalytics() {
  return (
    <div className="max-w-[920px] mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-dark">Аналитика команды</h1>
        <p className="text-sm text-secondary mt-0.5">
          Обзор развития · {teamMembers.length} сотрудников
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Ср. прогресс ИПР" value={`${avgIdp}%`} delta={8}  deltaLabel="vs Q1"
          icon={<TrendingUp size={19}/>} iconBg="#EEF3FF" iconColor="#3B6FE8" />
        <StatCard label="Средний 360°"      value={`${avg360}%`} delta={3}  deltaLabel="за квартал"
          icon={<Award size={19}/>}      iconBg="#E0F9F4" iconColor="#0D9488" />
        <StatCard label="Средний KPI"       value={`${avgKpi}%`} delta={5}  deltaLabel="vs Q1"
          icon={<Target size={19}/>}     iconBg="#FFF7E6" iconColor="#F59E0B" />
        <StatCard label="Вовлечённость"     value={`${avgEngag}%`} delta={2} deltaLabel="за месяц"
          icon={<Users size={19}/>}      iconBg="#F3EEFF" iconColor="#8B5CF6" />
      </div>

      {/* ── Main charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* IDP progress per person (horizontal bars) */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-5">
          <SH title="Прогресс ИПР по сотрудникам" sub="% выполнения плана развития" />
          <div className="space-y-4">
            {idpChartData.map((m, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                      style={{ backgroundColor: m.color }}>
                      {m.name[0]}
                    </div>
                    <span className="text-sm font-semibold text-dark">{m.name}</span>
                  </div>
                  <span className="text-sm font-bold text-dark">{m.progress}%</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${m.progress}%`,
                      backgroundColor: m.progress >= 80 ? '#3B6FE8' : m.progress >= 50 ? '#60A5FA' : '#93C5FD',
                    }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KPI by person (bar chart) */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-5">
          <SH title="KPI по сотрудникам" sub="Балл за последний квартал" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={idpChartData} barCategoryGap="35%"
              margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F4" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8A919E' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#8A919E' }} axisLine={false} tickLine={false} />
              <Tooltip {...TT} formatter={v => [`${v}%`, 'KPI']} />
              <Bar dataKey="kpi" radius={[6, 6, 0, 0]}>
                {idpChartData.map((entry, i) => (
                  <Cell key={i}
                    fill={entry.kpi >= 88 ? '#2563EB' : entry.kpi >= 80 ? '#3B6FE8' : '#60A5FA'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Top skill gaps */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-5">
          <SH title="Топ пробелов команды" sub="Средний дефицит по навыку" />
          <div className="space-y-4">
            {teamGaps.map((g, i) => {
              const color = g.pct >= 80 ? '#3B6FE8' : g.pct >= 55 ? '#60A5FA' : '#F59E0B';
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-dark">{g.skill}</span>
                    <span className="text-xs text-secondary">
                      {g.avg} / {g.required}
                      <span className="ml-2 font-bold" style={{ color }}>{g.pct}%</span>
                    </span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(g.pct, 100)}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status distribution */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-5">
          <SH title="Статусы ИПР в команде" sub={`${teamMembers.length} сотрудников`} />
          <div className="space-y-4">
            {statusDist.map((s, i) => {
              const pct = Math.round((s.count / teamMembers.length) * 100);
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-32 flex-shrink-0">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                  </div>
                  <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: s.color }} />
                  </div>
                  <span className="text-sm font-bold text-dark w-6 text-right">{s.count}</span>
                </div>
              );
            })}
          </div>

          {/* Quick summary */}
          <div className="mt-5 pt-4 border-t border-border grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-background border border-border text-center">
              <p className="text-xl font-bold" style={{ color: '#3B6FE8' }}>{avgKpi}%</p>
              <p className="text-xs text-secondary mt-0.5">Ср. KPI</p>
            </div>
            <div className="p-3 rounded-xl bg-background border border-border text-center">
              <p className="text-xl font-bold" style={{ color: '#0D9488' }}>{avg360}%</p>
              <p className="text-xs text-secondary mt-0.5">Ср. 360°</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
