import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis,
  Radar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import {
  TrendingUp, Award, BookOpen, Target, Zap,
  ChevronUp, ChevronDown, Minus,
} from 'lucide-react';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import { useApp } from '../context/AppContext';

/* ── Personal data ─────────────────────────────────────── */

const readinessTrend = [
  { month: 'Янв', score: 48 },
  { month: 'Фев', score: 51 },
  { month: 'Мар', score: 55 },
  { month: 'Апр', score: 58 },
  { month: 'Май', score: 63 },
  { month: 'Июн', score: 68 },
];

const feedback360 = [
  { subject: 'Технические навыки', self: 72, peers: 68, manager: 74 },
  { subject: 'Коммуникация',       self: 80, peers: 78, manager: 75 },
  { subject: 'Инициативность',     self: 75, peers: 80, manager: 82 },
  { subject: 'Результативность',   self: 70, peers: 72, manager: 70 },
  { subject: 'Обучаемость',        self: 90, peers: 88, manager: 92 },
  { subject: 'Командная работа',   self: 82, peers: 85, manager: 80 },
];

const radarData = [
  { subject: 'Python',          current: 85, target: 95 },
  { subject: 'ML/AI',           current: 32, target: 85 },
  { subject: 'MLOps',           current: 15, target: 75 },
  { subject: 'Cloud',           current: 28, target: 70 },
  { subject: 'Architecture',    current: 55, target: 80 },
  { subject: 'Leadership',      current: 48, target: 65 },
];

const kpiHistory = [
  { quarter: 'Q3 25', kpi: 82 },
  { quarter: 'Q4 25', kpi: 85 },
  { quarter: 'Q1 26', kpi: 79 },
  { quarter: 'Q2 26', kpi: 88 },
];

const gapClosure = [
  { name: 'Machine Learning', closed: 38, total: 100 },
  { name: 'MLOps',            closed: 8,  total: 100 },
  { name: 'Cloud AI',         closed: 22, total: 100 },
  { name: 'LLM Engineering',  closed: 5,  total: 100 },
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
  { label: 'Технические навыки', score: 71, delta: +3,  prev: 68 },
  { label: 'Инициативность',     score: 79, delta: +7,  prev: 72 },
  { label: 'Обучаемость',        score: 90, delta: +2,  prev: 88 },
  { label: 'Коммуникация',       score: 78, delta: -1,  prev: 79 },
  { label: 'Результативность',   score: 71, delta: 0,   prev: 71 },
];

const tooltip = {
  contentStyle: { borderRadius: 12, border: '1px solid #DDE1E9', fontSize: 11, color: '#1A2533' },
};

/* ── Component ─────────────────────────────────────────── */

export default function Analytics() {
  const { user } = useApp();
  const [period, setPeriod] = useState('6m');

  const readinessNow  = readinessTrend[readinessTrend.length - 1].score;
  const readinessPrev = readinessTrend[readinessTrend.length - 2].score;
  const readinessDiff = readinessNow - readinessPrev;

  return (
    <div className="max-w-[860px] mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-dark">Личная аналитика</h1>
          <p className="text-sm text-secondary mt-0.5">{user.name} · {user.role}</p>
        </div>
        <div className="flex gap-1.5">
          {['3m', '6m', '1y'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
                ${period === p ? 'bg-accent text-white' : 'bg-white border border-border text-secondary hover:border-accent/40'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Top KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Готовность к переходу', value: `${readinessNow}%`,
            delta: `+${readinessDiff}% за месяц`, color: '#005DB9', bg: '#E8F0FA' },
          { label: 'Завершено курсов', value: '7',
            delta: '+2 в этом квартале', color: '#1A7A4A', bg: '#D6EFE1' },
          { label: 'Часов обучения', value: '124',
            delta: '+29 ч в июне', color: '#6D4FA0', bg: '#EDE9F6' },
          { label: 'KPI последний квартал', value: '88%',
            delta: '+9% vs Q1', color: '#B45309', bg: '#FEF3C7' },
        ].map((k, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-4 shadow-card">
            <p className="text-xs text-secondary leading-snug mb-2">{k.label}</p>
            <p className="text-2xl font-bold text-dark">{k.value}</p>
            <p className="text-xs font-semibold mt-1" style={{ color: k.color }}>{k.delta}</p>
          </div>
        ))}
      </div>

      {/* Transition Readiness Signal */}
      <div className="rounded-2xl p-4 border border-accent/30 bg-accent-light/40 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center flex-shrink-0">
          <Zap size={22} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold text-dark text-sm">Сигнал готовности к переходу</p>
            <Badge variant="accent">AI оценка</Badge>
          </div>
          <p className="text-sm text-secondary">
            Готовность достигла <strong className="text-dark">68%</strong> — динамика положительная.
            При текущем темпе обучения переход в <strong className="text-dark">{user.targetRole}</strong> реален к <strong className="text-dark">Q1 2027</strong>.
            Критический блок: закрыть MLOps и Cloud AI.
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-3xl font-bold text-accent">68%</p>
          <p className="text-xs text-secondary">из 100</p>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Career Readiness Trend */}
        <Card>
          <CardHeader title="Динамика готовности" subtitle="Персональный балл по месяцам"
            icon={<TrendingUp size={18} />} iconBg="#E8F0FA" iconColor="#005DB9" />
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={readinessTrend}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8A919E' }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 80]} tick={{ fontSize: 11, fill: '#8A919E' }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltip} formatter={v => [`${v}%`, 'Готовность']} />
              <defs>
                <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#005DB9" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#005DB9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="score" stroke="#005DB9" strokeWidth={2.5}
                fill="url(#rGrad)" dot={{ r: 3, fill: '#005DB9' }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Personal KPI */}
        <Card>
          <CardHeader title="KPI по кварталам" subtitle="Личная результативность"
            icon={<Target size={18} />} iconBg="#FEF3C7" iconColor="#B45309" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={kpiHistory} barCategoryGap="35%">
              <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#8A919E' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#8A919E' }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltip} formatter={v => [`${v}%`, 'KPI']} />
              <Bar dataKey="kpi" fill="#005DB9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Competency Radar — current vs target */}
        <Card>
          <CardHeader title="Компетенции: текущие vs цель" subtitle={`Целевая роль: ${user.targetRole}`}
            icon={<Award size={18} />} iconBg="#EDE9F6" iconColor="#6D4FA0" />
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={80}>
              <PolarGrid stroke="#DDE1E9" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#8A919E' }} />
              <Radar name="Текущий" dataKey="current" stroke="#005DB9" fill="#005DB9" fillOpacity={0.12} strokeWidth={2} />
              <Radar name="Цель" dataKey="target" stroke="#B8BDC5" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
              <Tooltip {...tooltip} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-1 justify-center">
            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <span className="w-4 h-0.5 bg-accent inline-block" /> Текущий уровень
            </div>
            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <span className="w-4 h-0.5 bg-silver inline-block border-dashed" /> Целевой уровень
            </div>
          </div>
        </Card>

        {/* Learning Hours */}
        <Card>
          <CardHeader title="Часы обучения" subtitle="Ежемесячно"
            icon={<BookOpen size={18} />} iconBg="#D6EFE1" iconColor="#1A7A4A" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={learningMonths} barCategoryGap="35%">
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8A919E' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8A919E' }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltip} formatter={v => [`${v} ч`, 'Часов']} />
              <Bar dataKey="hours" fill="#1A7A4A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex items-center gap-2 text-xs text-secondary px-1">
            <span className="font-bold text-dark">124 ч</span> всего · июнь — рекорд месяца
          </div>
        </Card>
      </div>

      {/* Gap Closure Progress */}
      <Card>
        <CardHeader title="Прогресс закрытия пробелов" subtitle="Динамика по ключевым компетенциям"
          icon={<TrendingUp size={18} />} iconBg="#E8F0FA" iconColor="#005DB9" />
        <div className="space-y-4">
          {gapClosure.map((g, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-semibold text-dark">{g.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-secondary">{g.closed}% закрыто</span>
                  <Badge variant={g.closed >= 30 ? 'accent' : g.closed >= 15 ? 'warning' : 'muted'}
                    className="text-[10px]">
                    {g.closed >= 30 ? 'В процессе' : g.closed >= 15 ? 'Начато' : 'Не начато'}
                  </Badge>
                </div>
              </div>
              <ProgressBar value={g.closed} color={g.closed >= 30 ? 'accent' : g.closed >= 15 ? 'warning' : 'silver'} height={8} />
            </div>
          ))}
        </div>
      </Card>

      {/* 360 Feedback Summary */}
      <Card>
        <CardHeader title="360° Обратная связь" subtitle="Последний цикл оценки — Q2 2026"
          icon={<Award size={18} />} iconBg="#D6EFE1" iconColor="#1A7A4A" />
        <div className="space-y-3">
          {feedbackSummary.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-dark">{f.label}</p>
                <ProgressBar value={f.score} color={f.score >= 80 ? 'success' : 'accent'} height={5} className="mt-1.5" />
              </div>
              <div className="text-right flex-shrink-0 w-16">
                <p className="text-base font-bold text-dark">{f.score}%</p>
                <p className={`text-xs font-semibold flex items-center justify-end gap-0.5
                  ${f.delta > 0 ? 'text-success' : f.delta < 0 ? 'text-danger' : 'text-muted'}`}>
                  {f.delta > 0 ? <ChevronUp size={11} /> : f.delta < 0 ? <ChevronDown size={11} /> : <Minus size={11} />}
                  {f.delta > 0 ? `+${f.delta}%` : f.delta < 0 ? `${f.delta}%` : 'без изм.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}
