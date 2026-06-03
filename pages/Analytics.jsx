import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis,
  Radar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp, Award, BookOpen, Target, Zap,
  ArrowUpRight, ArrowDownRight, Minus, ChevronRight,
} from 'lucide-react';
import ProgressBar from '../components/ui/ProgressBar';
import { useApp } from '../context/AppContext';

/* ── Data ─────────────────────────────────────────────────── */
const readinessTrend = [
  { month: 'Янв', score: 48 },
  { month: 'Фев', score: 51 },
  { month: 'Мар', score: 55 },
  { month: 'Апр', score: 58 },
  { month: 'Май', score: 63 },
  { month: 'Июн', score: 68 },
];

const radarData = [
  { subject: 'Python',       current: 85, target: 95 },
  { subject: 'ML/AI',        current: 32, target: 85 },
  { subject: 'MLOps',        current: 15, target: 75 },
  { subject: 'Cloud',        current: 28, target: 70 },
  { subject: 'Architecture', current: 55, target: 80 },
  { subject: 'Leadership',   current: 48, target: 65 },
];

const kpiHistory = [
  { quarter: 'Q3 25', kpi: 82 },
  { quarter: 'Q4 25', kpi: 85 },
  { quarter: 'Q1 26', kpi: 79 },
  { quarter: 'Q2 26', kpi: 88 },
];

const gapClosure = [
  { name: 'Machine Learning', closed: 38, total: 85 },
  { name: 'MLOps',            closed: 8,  total: 75 },
  { name: 'Cloud AI',         closed: 22, total: 70 },
  { name: 'LLM Engineering',  closed: 5,  total: 65 },
];

const learningMonths = [
  { month: 'Янв', hours: 12 },
  { month: 'Фев', hours: 18 },
  { month: 'Мар', hours: 22 },
  { month: 'Апр', hours: 15 },
  { month: 'Май', hours: 28 },
  { month: 'Июн', hours: 29 },
];

const feedbackSummary = [
  { label: 'Технические навыки', score: 71, delta: +3  },
  { label: 'Инициативность',     score: 79, delta: +7  },
  { label: 'Обучаемость',        score: 90, delta: +2  },
  { label: 'Коммуникация',       score: 78, delta: -1  },
  { label: 'Результативность',   score: 71, delta:  0  },
];

/* ── Shared tooltip style ─────────────────────────────────── */
const TOOLTIP = {
  contentStyle: {
    borderRadius: 10,
    border: '1px solid #DDE1E9',
    fontSize: 11,
    color: '#1A2533',
    boxShadow: '0 4px 12px rgba(26,37,51,0.08)',
  },
};

/* ── Trend icon ───────────────────────────────────────────── */
function TrendBadge({ delta, suffix = '%' }) {
  if (delta > 0) return (
    <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
      <ArrowUpRight size={13} /> +{delta}{suffix}
    </span>
  );
  if (delta < 0) return (
    <span className="flex items-center gap-0.5 text-xs font-semibold text-danger">
      <ArrowDownRight size={13} /> {delta}{suffix}
    </span>
  );
  return <span className="text-xs font-semibold text-muted flex items-center gap-0.5"><Minus size={11} /> —</span>;
}

/* ── Stat Card ────────────────────────────────────────────── */
function StatCard({ label, value, delta, deltaLabel, icon, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-card">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-secondary leading-snug max-w-[120px]">{label}</p>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconBg, color: iconColor }}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-dark leading-none mb-2">{value}</p>
      <div className="flex items-center gap-1.5">
        <TrendBadge delta={delta} />
        {deltaLabel && <span className="text-xs text-muted">{deltaLabel}</span>}
      </div>
    </div>
  );
}

/* ── Section header ───────────────────────────────────────── */
function SectionHead({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h3 className="font-bold text-dark text-base">{title}</h3>
        {subtitle && <p className="text-xs text-secondary mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ── PeriodToggle ─────────────────────────────────────────── */
function PeriodToggle({ options, value, onChange }) {
  return (
    <div className="flex gap-0.5 bg-background border border-border rounded-xl p-0.5">
      {options.map(o => (
        <button key={o.key} onClick={() => onChange(o.key)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
            ${value === o.key ? 'bg-white text-dark shadow-sm border border-border' : 'text-secondary hover:text-dark'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────── */
export default function Analytics() {
  const { user }    = useApp();
  const [period,    setPeriod]    = useState('6m');
  const [kpiPeriod, setKpiPeriod] = useState('all');

  const readinessNow  = readinessTrend.at(-1).score;
  const readinessPrev = readinessTrend.at(-2).score;

  return (
    <div className="max-w-[920px] mx-auto space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-dark">Личная аналитика</h1>
          <p className="text-sm text-secondary mt-0.5">{user.name} · {user.role}</p>
        </div>
        <PeriodToggle
          options={[{key:'3m',label:'3 мес'},{key:'6m',label:'6 мес'},{key:'1y',label:'Год'}]}
          value={period}
          onChange={setPeriod}
        />
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Готовность к переходу"
          value={`${readinessNow}%`}
          delta={readinessNow - readinessPrev}
          deltaLabel="за месяц"
          icon={<TrendingUp size={19} />}
          iconBg="#EEF3FF" iconColor="#3B6FE8"
        />
        <StatCard
          label="Завершено курсов"
          value="7"
          delta={2}
          deltaLabel="в этом квартале"
          icon={<BookOpen size={19} />}
          iconBg="#E0F9F4" iconColor="#0D9488"
        />
        <StatCard
          label="Часов обучения"
          value="124"
          delta={29}
          deltaLabel="ч в июне"
          icon={<Award size={19} />}
          iconBg="#F3EEFF" iconColor="#8B5CF6"
        />
        <StatCard
          label="KPI последний квартал"
          value="88%"
          delta={9}
          deltaLabel="vs Q1 2026"
          icon={<Target size={19} />}
          iconBg="#FFF7E6" iconColor="#F59E0B"
        />
      </div>

      {/* ── AI signal banner ── */}
      <div className="bg-white rounded-2xl border border-accent/20 p-5 flex items-center gap-5"
        style={{ background: 'linear-gradient(135deg, #EEF3FF 0%, #F0F7FF 100%)' }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#3B6FE8' }}>
          <Zap size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-dark text-sm mb-0.5 flex items-center gap-2">
            Сигнал готовности к переходу
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-white">AI</span>
          </p>
          <p className="text-sm text-secondary leading-relaxed">
            Готовность <strong className="text-dark">68%</strong> — динамика положительная.
            При текущем темпе переход в <strong className="text-dark">{user.targetRole}</strong> реален к <strong className="text-dark">Q1 2027</strong>.
            Критический блок: закрыть <strong className="text-dark">MLOps</strong> и <strong className="text-dark">Cloud AI</strong>.
          </p>
        </div>
        <div className="flex-shrink-0 text-right pl-2">
          <p className="text-3xl font-bold" style={{ color: '#3B6FE8' }}>68%</p>
          <p className="text-xs text-secondary">из 100</p>
        </div>
      </div>

      {/* ── Main chart row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Career readiness trend – full-width hero chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border shadow-card p-5">
          <SectionHead
            title="Динамика готовности к переходу"
            subtitle="Персональный балл по месяцам"
            action={
              <PeriodToggle
                options={[{key:'3m',label:'3 мес'},{key:'6m',label:'6 мес'}]}
                value={period}
                onChange={setPeriod}
              />
            }
          />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={readinessTrend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#3B6FE8" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#3B6FE8" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F4" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8A919E' }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 75]} tick={{ fontSize: 11, fill: '#8A919E' }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP} formatter={v => [`${v}%`, 'Готовность']} />
              <ReferenceLine y={80} stroke="#DDE1E9" strokeDasharray="4 3" label={{ value: 'Цель', fill: '#B8BDC5', fontSize: 10 }} />
              <Area type="monotone" dataKey="score" stroke="#3B6FE8" strokeWidth={2.5}
                fill="url(#rGrad)" dot={{ r: 4, fill: '#fff', stroke: '#3B6FE8', strokeWidth: 2 }}
                activeDot={{ r: 5, fill: '#3B6FE8' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* KPI bar */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-5">
          <SectionHead title="KPI по кварталам" subtitle="Личная результативность" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={kpiHistory} barCategoryGap="40%" margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F4" vertical={false} />
              <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: '#8A919E' }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 95]} tick={{ fontSize: 10, fill: '#8A919E' }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP} formatter={v => [`${v}%`, 'KPI']} />
              <Bar dataKey="kpi" fill="#3B6FE8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
            <span className="text-secondary">Последний квартал</span>
            <span className="font-bold text-dark">88% <span className="text-emerald-600 font-semibold">↑ +9%</span></span>
          </div>
        </div>
      </div>

      {/* ── Competency row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Radar */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-5">
          <SectionHead
            title="Компетенции: текущие vs цель"
            subtitle={`Целевая роль: ${user.targetRole}`}
          />
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={82}>
              <PolarGrid stroke="#EEF0F4" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#8A919E' }} />
              <Radar name="Текущий" dataKey="current" stroke="#3B6FE8" fill="#3B6FE8" fillOpacity={0.12} strokeWidth={2} />
              <Radar name="Цель" dataKey="target" stroke="#DDE1E9" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
              <Tooltip {...TOOLTIP} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 justify-center mt-1">
            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <span className="w-5 h-0.5 rounded inline-block" style={{ backgroundColor: '#3B6FE8' }} />
              Текущий
            </div>
            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <span className="w-5 h-0.5 rounded inline-block" style={{ backgroundColor: '#DDE1E9', borderTop: '1px dashed' }} />
              Целевой
            </div>
          </div>
        </div>

        {/* Gap closure */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-5">
          <SectionHead title="Закрытие пробелов" subtitle="Текущий уровень / требуемый" />
          <div className="space-y-4">
            {gapClosure.map((g, i) => {
              const pct = Math.round((g.closed / g.total) * 100);
              const color = pct >= 50 ? '#3B6FE8' : pct >= 25 ? '#8B5CF6' : '#F59E0B';
              const statusLabel = pct >= 50 ? 'В процессе' : pct >= 20 ? 'Начато' : 'Не начато';
              const statusBg    = pct >= 50 ? '#EEF3FF' : pct >= 20 ? '#F3EEFF' : '#FFF7E6';
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-dark">{g.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-secondary">{g.closed} / {g.total}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: statusBg, color }}>
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                  <div className="relative h-2 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                  <p className="text-[10px] text-muted mt-1">{pct}% от необходимого уровня</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Learning hours */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-5">
          <SectionHead title="Часы обучения" subtitle="Активность по месяцам" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={learningMonths} barCategoryGap="35%" margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F4" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8A919E' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8A919E' }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP} formatter={v => [`${v} ч`, 'Обучение']} />
              <Bar dataKey="hours" fill="#3B6FE8" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
            <span className="text-secondary">Всего за период</span>
            <span className="font-bold text-dark">124 ч · <span className="text-emerald-600">июнь — рекорд</span></span>
          </div>
        </div>

        {/* 360 Feedback */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-5">
          <SectionHead title="360° Обратная связь" subtitle="Q2 2026 · последний цикл" />
          <div className="space-y-3">
            {feedbackSummary.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-dark">{f.label}</span>
                    <span className="text-sm font-bold text-dark">{f.score}%</span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${f.score}%`,
                        backgroundColor: f.score >= 85 ? '#3B6FE8' : f.score >= 75 ? '#60A5FA' : '#93C5FD',
                      }} />
                  </div>
                </div>
                <div className="w-14 text-right flex-shrink-0">
                  <TrendBadge delta={f.delta} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
