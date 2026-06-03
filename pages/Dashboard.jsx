import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit3, Mail, MapPin, Calendar, Clock, ChevronRight,
  BookOpen, Target, Brain, Sparkles, CheckCircle,
  AlertTriangle, RefreshCw, ArrowRight, TrendingUp,
  X, ChevronDown, Users, Star, MoreHorizontal,
  CheckSquare, Circle, Briefcase, Zap,
} from 'lucide-react';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { courses } from '../data/courses';
import { upcomingReviews, calendarEvents } from '../data/calendarEvents';
import { tasks, statusConfig } from '../data/tasks';

const TARGET_ROLES = [
  'Senior AI Engineer', 'Data Scientist Lead', 'ML Engineer',
  'Tech Lead Backend', 'Product Manager', 'Solution Architect', 'Business Analyst',
];
const TRACKS = ['Инженерный', 'Аналитический', 'Управленческий', 'Продуктовый'];
const GRADES = ['Middle', 'Senior', 'Lead', 'Principal'];

/* ── Employee Card (left sticky panel) ──────────────────── */
function EmployeeCard({ user, onEdit }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-5">
      {/* Avatar + name */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-sm"
            style={{ backgroundColor: user.avatarColor }}
          >
            {user.initials}
          </div>
          <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-success border-2 border-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-dark leading-tight">{user.name}</h2>
          <p className="text-sm text-secondary mt-0.5">{user.role}</p>
          <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#EBF2FB', color: '#005DB9' }}>
            {user.level}
          </span>
        </div>
      </div>

      {/* Readiness progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-secondary">Готовность к переходу</span>
          <span className="text-sm font-bold text-accent">{user.readiness}%</span>
        </div>
        <ProgressBar value={user.readiness} color="accent" height={6} />
        <p className="text-[10px] text-muted">до роли {user.targetRole}</p>
      </div>

      {/* Contact info */}
      <div className="space-y-2 pt-1 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-secondary">
          <Mail size={13} className="text-muted flex-shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-secondary">
          <MapPin size={13} className="text-muted flex-shrink-0" />
          <span>{user.location}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-secondary">
          <Briefcase size={13} className="text-muted flex-shrink-0" />
          <span>{user.yearsAtCompany} лет в компании</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-secondary">
          <Users size={13} className="text-muted flex-shrink-0" />
          <span>{user.department}</span>
        </div>
      </div>

      {/* Edit button */}
      <button
        onClick={onEdit}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-semibold text-secondary hover:border-accent/40 hover:text-accent hover:bg-accent-light/30 transition-all"
      >
        <Edit3 size={14} />
        Редактировать профиль
      </button>
    </div>
  );
}

/* ── Task Card ───────────────────────────────────────────── */
function TaskCard({ task }) {
  const st = statusConfig[task.status];
  const priorityBorder = task.priority === 'high' ? '#EF4444' : task.priority === 'medium' ? '#F59E0B' : '#DDE1E9';
  return (
    <div className="bg-white rounded-xl border border-border shadow-sm hover:shadow-card hover:border-accent/20 transition-all p-4 flex flex-col gap-3"
      style={{ borderLeftColor: priorityBorder, borderLeftWidth: '3px' }}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: task.categoryBg, color: task.categoryColor }}>
          {task.category}
        </span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: st.bg, color: st.color }}>
          {st.label}
        </span>
      </div>
      <p className="text-sm font-semibold text-dark leading-snug">{task.title}</p>
      <div className="flex items-center gap-1 text-xs text-muted mt-auto">
        <Clock size={11} />
        <span>Дедлайн: {task.deadline}</span>
      </div>
    </div>
  );
}

/* ── Meeting Item ────────────────────────────────────────── */
const evtTypeMap = {
  meeting: { color: '#059669', label: 'Встреча' },
  learning: { color: '#7C3AED', label: 'Обучение' },
  review: { color: '#0284C7', label: 'Ревью' },
  interview: { color: '#EA580C', label: 'Интервью' },
  deadline: { color: '#D97706', label: 'Дедлайн' },
  hr: { color: '#BE185D', label: 'HR' },
  event: { color: '#005DB9', label: 'Событие' },
};

function MeetingItem({ event }) {
  const [, mm, dd] = event.date.split('-');
  const cfg = evtTypeMap[event.type] || evtTypeMap.meeting;
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-background transition-colors group cursor-pointer">
      <div className="w-1 h-full min-h-[40px] rounded-full flex-shrink-0"
        style={{ backgroundColor: cfg.color }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-dark leading-snug truncate">{event.title}</p>
        <p className="text-xs text-secondary mt-0.5">
          {event.with && <span>{event.with} · </span>}
          {dd}.{mm}
          {event.time && ` · ${event.time}`}
        </p>
      </div>
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5"
        style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}>
        {cfg.label}
      </span>
    </div>
  );
}

/* ── Main Info Tab ───────────────────────────────────────── */
function MainInfoTab({ navigate }) {
  const TODAY = '2026-06-03';
  const upcoming = calendarEvents
    .filter(e => e.date >= TODAY)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
    .slice(0, 8);

  return (
    <div className="flex gap-5 items-start">
      {/* Tasks */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-dark">Текущие задачи</h2>
          <span className="text-xs text-secondary">{tasks.filter(t => t.status !== 'completed').length} активных</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tasks.map(task => <TaskCard key={task.id} task={task} />)}
        </div>
      </div>

      {/* Meetings sidebar */}
      <div className="w-72 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-accent" />
              <p className="text-sm font-bold text-dark">Ближайшие встречи</p>
            </div>
            <button
              onClick={() => navigate('/calendar')}
              className="text-xs text-accent font-semibold hover:underline"
            >
              Все
            </button>
          </div>
          <div className="p-2 space-y-0.5 max-h-[520px] overflow-y-auto">
            {upcoming.length === 0 ? (
              <p className="text-xs text-muted text-center py-6">Нет событий</p>
            ) : (
              upcoming.map(e => <MeetingItem key={e.id} event={e} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Career Tab ──────────────────────────────────────────── */
function CareerTab({ user, targetRole, courses, navigate, onChangeGoal }) {
  const activeCourses = courses.filter(c => c.status === 'in_progress');

  const kpis = [
    { label: 'Пройдено курсов',  value: '7',    delta: '+2 в квартале', color: '#1A7A4A', bg: '#D6EFE1' },
    { label: 'Часов обучения',   value: '124',  delta: '+18 ч за месяц', color: '#6D4FA0', bg: '#EDE9F6' },
    { label: 'Вовлечённость',    value: '84%',  delta: 'Высокая',        color: '#B45309', bg: '#FEF3C7' },
  ];

  return (
    <div className="space-y-5">
      {/* Role header card */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-5">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="min-w-0">
              <p className="text-xs text-secondary mb-1 font-medium">Текущая роль</p>
              <p className="text-base font-bold text-dark truncate">{user.role}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#EBF2FB', color: '#005DB9' }}>
                {user.level}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 px-2">
              <div className="flex items-center gap-1">
                <div className="h-px w-8 bg-border" />
                <ArrowRight size={14} className="text-accent flex-shrink-0" />
                <div className="h-px w-8 bg-border" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-secondary mb-1 font-medium">Целевая роль</p>
              <p className="text-base font-bold text-accent truncate">{targetRole}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#EBF2FB', color: '#005DB9' }}>
                Senior
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5 flex-shrink-0">
            <div className="text-center">
              <p className="text-4xl font-bold text-dark leading-none">{user.readiness}%</p>
              <p className="text-xs text-secondary mt-1">Готовность</p>
              <p className="text-xs font-semibold text-success mt-0.5">+4% за месяц</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <button
              onClick={onChangeGoal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-secondary hover:border-accent/40 hover:text-accent hover:bg-accent-light/20 transition-all"
            >
              <RefreshCw size={14} />
              Сменить трек
            </button>
          </div>
        </div>

        <div className="mt-4">
          <ProgressBar value={user.readiness} color="accent" height={8} />
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border shadow-card p-4">
            <p className="text-xs text-secondary mb-2">{k.label}</p>
            <p className="text-2xl font-bold text-dark">{k.value}</p>
            <p className="text-xs font-semibold mt-1" style={{ color: k.color }}>{k.delta}</p>
          </div>
        ))}
      </div>

      {/* Two-column content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Active Learning */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#D6EFE1', color: '#1A7A4A' }}>
                <BookOpen size={17} />
              </div>
              <div>
                <h3 className="font-bold text-dark text-sm leading-tight">Активное обучение</h3>
                <p className="text-xs text-secondary">{activeCourses.length} курса в процессе</p>
              </div>
            </div>
            <button onClick={() => navigate('/learning')}
              className="text-xs text-accent font-semibold flex items-center gap-1 hover:underline">
              Все курсы <ChevronRight size={13} />
            </button>
          </div>
          <div className="space-y-3">
            {activeCourses.map(c => (
              <div key={c.id} onClick={() => navigate('/learning')}
                className="p-3.5 rounded-xl border border-border hover:border-accent/30 hover:bg-background/50 transition-all cursor-pointer">
                <div className="flex items-start gap-2 mb-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: c.categoryBg, color: c.categoryColor }}>
                    {c.category}
                  </span>
                </div>
                <p className="text-sm font-semibold text-dark leading-snug mb-1">{c.title}</p>
                <p className="text-xs text-secondary mb-2.5">{c.provider}</p>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-secondary">Прогресс</span>
                  <span className="font-bold text-dark">{c.progress}%</span>
                </div>
                <ProgressBar value={c.progress} color={c.categoryColor} height={5} />
                <p className="text-[10px] text-muted mt-1.5 flex items-center gap-1">
                  <Clock size={10} /> {c.duration} · до {c.deadline}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Career Progress + AI */}
        <div className="flex flex-col gap-4">
          {/* Career Progress */}
          <div className="bg-white rounded-2xl border border-border shadow-card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#EBF2FB', color: '#005DB9' }}>
                <Target size={17} />
              </div>
              <div>
                <h3 className="font-bold text-dark text-sm leading-tight">Карьерный прогресс</h3>
                <p className="text-xs text-secondary">Прогноз: Q1 2027</p>
              </div>
            </div>
            <div className="flex justify-between items-end mb-3">
              <p className="text-3xl font-bold text-dark">{user.careerProgress}%</p>
              <p className="text-xs text-accent font-semibold">Завершено шагов</p>
            </div>
            <ProgressBar value={user.careerProgress} color="accent" height={8} />
            <div className="space-y-2 mt-4">
              {user.learningPath.slice(0, 3).map((step, i) => (
                <div key={i} className="flex items-center gap-2.5 py-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold
                    ${step.status === 'completed' ? 'bg-success text-white'
                      : step.status === 'in_progress' ? 'bg-accent text-white'
                      : 'bg-background border border-border text-muted'}`}>
                    {step.status === 'completed' ? <CheckCircle size={12} /> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-dark truncate">{step.title}</p>
                    <p className="text-[10px] text-muted">{step.quarter}</p>
                  </div>
                  {step.status === 'in_progress' && (
                    <span className="text-[10px] font-semibold text-accent">{step.progress}%</span>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/career')}
              className="w-full mt-3 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:border-accent/40 hover:text-accent transition-all flex items-center justify-center gap-1">
              Полный маршрут <ChevronRight size={12} />
            </button>
          </div>

          {/* AI Recommendation */}
          <div className="bg-white rounded-2xl border border-border shadow-card p-5"
            style={{ borderColor: '#E0EAFB', background: 'linear-gradient(145deg, #FFFFFF 0%, #F5F9FF 100%)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#005DB9' }}>
                <Brain size={17} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-dark text-sm leading-tight">AI-рекомендация</h3>
                <p className="text-xs text-secondary">Персонализировано</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-white">Новое</span>
            </div>
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-white border border-border/60">
                <p className="text-xs text-secondary mb-1">Приоритет #1</p>
                <p className="text-sm font-semibold text-dark">Завершить Python ML курс — критично для перехода</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {user.skillGaps.slice(0, 3).map(g => (
                  <span key={g} className="text-xs px-2 py-1 rounded-lg font-medium flex items-center gap-1"
                    style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
                    <AlertTriangle size={10} /> {g}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={() => navigate('/career')}
              className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#005DB9' }}>
              Карьерный путь <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Goal Modal ──────────────────────────────────────────── */
function GoalModal({ user, onClose, onSave }) {
  const [draftRole, setDraftRole] = useState(user.targetRole);
  const [draftTrack, setDraftTrack] = useState('Инженерный');
  const [draftGrade, setDraftGrade] = useState('Senior');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(26,37,51,0.45)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-card-hover w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-dark">Изменить карьерную цель</h2>
            <p className="text-xs text-secondary mt-0.5">Выберите роль, трек и грейд</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:bg-background hover:text-dark transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-secondary mb-2 block uppercase tracking-wide">Целевая роль</label>
            <div className="grid gap-1.5 max-h-52 overflow-y-auto pr-1">
              {TARGET_ROLES.map(role => (
                <button key={role} onClick={() => setDraftRole(role)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all border
                    ${draftRole === role ? 'bg-accent text-white border-accent' : 'border-border text-dark hover:border-accent/40 hover:bg-background'}`}>
                  {role}
                  {draftRole === role && <CheckCircle size={14} className="inline ml-2 opacity-80" />}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[{ label: 'Трек', val: draftTrack, set: setDraftTrack, opts: TRACKS },
              { label: 'Грейд', val: draftGrade, set: setDraftGrade, opts: GRADES }].map(({ label, val, set, opts }) => (
              <div key={label}>
                <label className="text-xs font-semibold text-secondary mb-2 block uppercase tracking-wide">{label}</label>
                <div className="relative">
                  <select value={val} onChange={e => set(e.target.value)}
                    className="w-full appearance-none px-3 py-2.5 pr-8 text-sm bg-background border border-border rounded-xl text-dark focus:border-accent/50 transition-all">
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-border text-secondary hover:bg-background transition-colors">
            Отмена
          </button>
          <button onClick={() => onSave(draftRole)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#005DB9' }}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Dashboard ──────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState(0);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [targetRole, setTargetRole] = useState(user.targetRole);
  const activeCourses = courses.filter(c => c.status === 'in_progress');

  return (
    <>
      <div className="max-w-[1140px] mx-auto">
        <div className="flex gap-6 items-start">
          {/* Left: Employee Card */}
          <div className="w-72 flex-shrink-0 sticky top-6">
            <EmployeeCard user={user} onEdit={() => navigate('/settings')} />
          </div>

          {/* Right: Content */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Tab switcher */}
            <div className="flex gap-1.5 bg-white border border-border rounded-2xl p-1.5 shadow-card">
              {['Основная информация', 'Карьера'].map((tab, i) => (
                <button key={i} onClick={() => setActiveTab(i)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === i
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-secondary hover:text-dark hover:bg-background'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 0 && <MainInfoTab navigate={navigate} />}

            {activeTab === 1 && (
              <CareerTab
                user={user}
                targetRole={targetRole}
                courses={courses}
                navigate={navigate}
                onChangeGoal={() => setShowGoalModal(true)}
              />
            )}
          </div>
        </div>
      </div>

      {showGoalModal && (
        <GoalModal
          user={user}
          onClose={() => setShowGoalModal(false)}
          onSave={role => { setTargetRole(role); setShowGoalModal(false); }}
        />
      )}
    </>
  );
}
