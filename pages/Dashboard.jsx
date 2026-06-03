import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Edit3, BookOpen, Briefcase, Sparkles,
  Calendar, Clock, ChevronRight, Brain, Target,
  CheckCircle, AlertTriangle, RefreshCw, X, ChevronDown,
} from 'lucide-react';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import ProgressBar from '../components/ui/ProgressBar';
import DonutChart from '../components/ui/DonutChart';
import { useApp } from '../context/AppContext';
import { courses } from '../data/courses';
import { opportunities } from '../data/opportunities';
import { upcomingReviews } from '../data/calendarEvents';

// KPIs — readiness card handled separately (donut)
const kpis = [
  { label: 'Пройдено курсов',  value: '7',   delta: '+2 в квартале', color: '#10B981' },
  { label: 'Часов обучения',   value: '124', delta: '+18 ч',          color: '#8B5CF6' },
  { label: 'Вовлечённость',    value: '84%', delta: 'Высокая',        color: '#F59E0B' },
];

const reviewTypeLabel = { review: 'Ревью', hr: 'HR', interview: 'Интервью' };
const reviewTypeColor = { review: 'accent', hr: 'pink', interview: 'orange' };

const TARGET_ROLES = [
  'Senior AI Engineer', 'Data Scientist Lead', 'ML Engineer',
  'Tech Lead Backend', 'Product Manager', 'Solution Architect', 'Business Analyst',
];
const TRACKS = ['Инженерный', 'Аналитический', 'Управленческий', 'Продуктовый'];
const GRADES = ['Middle', 'Senior', 'Lead', 'Principal'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useApp();
  const activeCourses   = courses.filter(c => c.status === 'in_progress');
  const topOpportunities = opportunities.slice(0, 2);

  // Module counts for DonutChart
  const totalCompletedModules = courses.reduce((acc, c) => acc + c.completedModules, 0);
  const inProgressModules     = courses
    .filter(c => c.status === 'in_progress')
    .reduce((acc, c) => acc + (c.modules - c.completedModules), 0);
  const plannedModules        = courses
    .filter(c => c.status === 'not_started')
    .reduce((acc, c) => acc + c.modules, 0);

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [targetRole,    setTargetRole]    = useState(user.targetRole);
  const [selectedTrack, setSelectedTrack] = useState('Инженерный');
  const [selectedGrade, setSelectedGrade] = useState('Senior');
  const [draftRole,     setDraftRole]     = useState(user.targetRole);
  const [draftTrack,    setDraftTrack]    = useState('Инженерный');
  const [draftGrade,    setDraftGrade]    = useState('Senior');

  const openModal = () => {
    setDraftRole(targetRole); setDraftTrack(selectedTrack); setDraftGrade(selectedGrade);
    setShowGoalModal(true);
  };
  const saveGoal = () => {
    setTargetRole(draftRole); setSelectedTrack(draftTrack); setSelectedGrade(draftGrade);
    setShowGoalModal(false);
  };

  return (
    <>
    <div className="max-w-[900px] mx-auto space-y-5">

      {/* ── 1. Profile / Welcome Card ── */}
      <div
        className="rounded-2xl p-6 flex items-center justify-between gap-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #005DB9 0%, #004A94 100%)' }}
      >
        <div className="relative z-10">
          <p className="text-blue-100 text-sm font-medium mb-1">Добрый день 👋</p>
          <h1 className="text-white text-2xl font-bold mb-1">{user.name}</h1>
          <p className="text-blue-100 text-sm mb-4">{user.role} · {user.department}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="secondary" size="sm" onClick={() => navigate('/settings')}
              icon={<Edit3 size={13} />} className="bg-white/20 text-white hover:bg-white/30 border-0">
              Редактировать
            </Button>
            <Button variant="secondary" size="sm" onClick={openModal}
              icon={<RefreshCw size={13} />} className="bg-white/20 text-white hover:bg-white/30 border-0">
              Поменять цель
            </Button>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end gap-2 relative z-10">
          <div className="text-right">
            <p className="text-blue-100 text-xs mb-1">Целевая роль</p>
            <p className="text-white font-bold text-sm">{targetRole}</p>
            <p className="text-blue-200 text-[10px] mt-0.5">{selectedTrack} · {selectedGrade}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-xs mb-1">Готовность</p>
            <p className="text-white font-bold text-2xl">{user.readiness}%</p>
          </div>
        </div>
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 right-16 w-20 h-20 rounded-full bg-white/10" />
      </div>

      {/* ── 2. Upcoming Events ── */}
      <Card>
        <CardHeader
          title="Ближайшие события"
          icon={<Calendar size={18} />}
          iconBg="#FFEDD5"
          iconColor="#F97316"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/calendar')}
              iconRight={<ChevronRight size={14} />}>
              Календарь
            </Button>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {upcomingReviews.map(r => (
            <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border">
              <div className="w-8 h-8 rounded-xl bg-orange-light flex items-center justify-center flex-shrink-0">
                <Calendar size={14} className="text-orange" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-dark truncate">{r.title}</p>
                <p className="text-xs text-secondary">{r.date} · {r.time}</p>
              </div>
              <Badge variant={reviewTypeColor[r.type] || 'muted'} className="text-[10px] flex-shrink-0">
                {reviewTypeLabel[r.type]}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* ── 3. KPI Strip + Readiness Donut ── */}
      <div className="space-y-3">
        {/* Readiness card — full width */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-card">
          <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-4">
            Готовность к переходу
          </p>
          <div className="flex items-center gap-8 flex-wrap">
            <DonutChart
              percentage={user.readiness}
              completed={totalCompletedModules}
              inProgress={inProgressModules}
              planned={plannedModules}
              size={130}
            />
            <div>
              <p className="text-4xl font-bold text-dark">{user.readiness}%</p>
              <p className="text-sm font-semibold text-accent mt-1">+4% за месяц</p>
              <p className="text-xs text-secondary mt-0.5">до роли {targetRole}</p>
            </div>
          </div>
        </div>

        {/* 3 KPI cards — single row */}
        <div className="grid grid-cols-3 gap-3">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-4 shadow-card">
              <p className="text-xs text-secondary leading-tight mb-2">{kpi.label}</p>
              <p className="text-2xl font-bold text-dark">{kpi.value}</p>
              <p className="text-xs mt-0.5 font-medium" style={{ color: kpi.color }}>{kpi.delta}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Career Progress (left) + AI Recommendation (right) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Career Progress */}
        <Card>
          <CardHeader
            title="Прогресс карьерного пути"
            subtitle={`${user.role} → ${user.targetRole}`}
            icon={<Target size={18} />}
            iconBg="#E8F0FA"
            iconColor="#005DB9"
          />
          <div className="mb-5">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-3xl font-bold text-dark">{user.careerProgress}%</p>
                <p className="text-xs text-secondary">Завершено шагов</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-secondary">Прогноз</p>
                <p className="text-sm font-semibold text-accent">Q1 2027</p>
              </div>
            </div>
            <ProgressBar value={user.careerProgress} color="accent" height={10} />
          </div>
          <div className="space-y-2">
            {user.learningPath.slice(0, 3).map((step, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-background transition-colors">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
                  ${step.status === 'completed' ? 'bg-success-light text-success'
                    : step.status === 'in_progress' ? 'bg-accent-light text-accent'
                    : 'bg-background text-muted border border-border'}`}>
                  {step.status === 'completed' ? <CheckCircle size={14} /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-dark truncate">{step.title}</p>
                  <p className="text-[10px] text-secondary">{step.quarter}</p>
                </div>
                {step.status === 'in_progress' && (
                  <div className="w-16">
                    <ProgressBar value={step.progress} color="accent" height={4} />
                    <p className="text-[10px] text-accent text-right mt-0.5">{step.progress}%</p>
                  </div>
                )}
                {step.status === 'not_started' && (
                  <Badge variant="muted" className="text-[10px]">Далее</Badge>
                )}
              </div>
            ))}
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/career')}
            className="w-full justify-center mt-4" iconRight={<ChevronRight size={14} />}>
            Полный маршрут
          </Button>
        </Card>

        {/* AI Recommendation */}
        <Card className="relative overflow-hidden">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0">
              <Brain size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-dark text-base">AI-рекомендация</h3>
              <p className="text-xs text-secondary">Персонализировано для вас</p>
            </div>
            <Badge variant="accent" className="ml-auto text-xs">Новое</Badge>
          </div>
          <div className="space-y-3 mb-4">
            <div className="p-3 rounded-xl bg-background border border-border">
              <p className="text-xs text-secondary font-medium mb-1">Цель</p>
              <p className="text-sm font-semibold text-dark">{targetRole}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-secondary mb-2">Пробелы в навыках</p>
              <div className="flex flex-wrap gap-1.5">
                {user.skillGaps.map(g => (
                  <span key={g} className="text-xs px-2 py-1 rounded-lg bg-warning-light text-warning font-medium flex items-center gap-1">
                    <AlertTriangle size={10} /> {g}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-3 rounded-xl border border-accent/20 bg-accent-light/50">
              <p className="text-xs text-secondary mb-1">Следующий шаг</p>
              <p className="text-sm font-medium text-dark">
                Завершите <strong>Python ML курс</strong> — самый высокий приоритет для перехода.
              </p>
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/career')}
            className="w-full justify-center" iconRight={<ArrowRight size={14} />}>
            Открыть карьерный путь
          </Button>
        </Card>
      </div>

      {/* ── 5. Active Courses ── */}
      <Card>
        <CardHeader
          title="Активное обучение"
          subtitle={`${activeCourses.length} курса в процессе`}
          icon={<BookOpen size={18} />}
          iconBg="#D1FAE5"
          iconColor="#10B981"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/learning')}
              iconRight={<ChevronRight size={14} />}>
              Все курсы
            </Button>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeCourses.map(course => (
            <div
              key={course.id}
              className="p-4 rounded-xl border border-border hover:border-accent/30 hover:bg-background/50 transition-all cursor-pointer group"
              onClick={() => navigate('/learning')}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <Badge style={{ backgroundColor: course.categoryBg, color: course.categoryColor }} className="text-[10px] mb-1.5">
                    {course.category}
                  </Badge>
                  <h4 className="text-sm font-semibold text-dark leading-snug">{course.title}</h4>
                  <p className="text-xs text-secondary mt-0.5">{course.provider}</p>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-secondary">Прогресс</span>
                  <span className="font-bold text-dark">{course.progress}%</span>
                </div>
                <ProgressBar value={course.progress} color={course.categoryColor} height={6} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondary flex items-center gap-1">
                  <Clock size={10} /> {course.duration}
                </span>
                <span className="text-xs text-muted">до {course.deadline}</span>
              </div>
            </div>
          ))}
          {courses.filter(c => c.status === 'not_started' && c.recommended).slice(0, 1).map(course => (
            <div
              key={course.id}
              className="p-4 rounded-xl border border-dashed border-border hover:border-accent/40 transition-all cursor-pointer"
              onClick={() => navigate('/learning')}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-accent" />
                <span className="text-xs font-semibold text-accent">Рекомендовано AI</span>
              </div>
              <h4 className="text-sm font-semibold text-dark mb-1">{course.title}</h4>
              <p className="text-xs text-secondary mb-3">{course.provider} · {course.duration}</p>
              <Button variant="secondary" size="sm" className="w-full justify-center">Начать курс</Button>
            </div>
          ))}
        </div>
      </Card>

      {/* ── 6. Opportunities ── */}
      <Card>
        <CardHeader
          title="Внутренние возможности"
          subtitle="AI подобрал для вас"
          icon={<Briefcase size={18} />}
          iconBg="#EDE9FE"
          iconColor="#8B5CF6"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/opportunities')}
              iconRight={<ChevronRight size={14} />}>
              Все позиции
            </Button>
          }
        />
        <div className="space-y-3">
          {topOpportunities.map(opp => (
            <div
              key={opp.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent/30 hover:bg-background/50 transition-all cursor-pointer group"
              onClick={() => navigate('/opportunities')}
            >
              <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0">
                <Briefcase size={16} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="text-sm font-semibold text-dark">{opp.title}</h4>
                  <Badge style={{ backgroundColor: opp.badgeBg, color: opp.badgeColor }} className="text-[10px]">
                    {opp.badge}
                  </Badge>
                </div>
                <p className="text-xs text-secondary">{opp.department} · {opp.location}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold" style={{ color: opp.compatibility >= 80 ? '#10B981' : '#F59E0B' }}>
                  {opp.compatibility}%
                </div>
                <div className="text-[10px] text-secondary">совпадение</div>
              </div>
              <ChevronRight size={16} className="text-muted group-hover:text-accent transition-colors" />
            </div>
          ))}
        </div>
      </Card>

    </div>

    {/* ── Goal modal ── */}
    {showGoalModal && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(26,37,51,0.45)' }}
        onClick={e => e.target === e.currentTarget && setShowGoalModal(false)}
      >
        <div className="bg-white rounded-3xl shadow-card-hover w-full max-w-md animate-fade-in">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
            <div>
              <h2 className="text-base font-bold text-dark">Изменить карьерную цель</h2>
              <p className="text-xs text-secondary mt-0.5">Выберите роль, трек и грейд</p>
            </div>
            <button onClick={() => setShowGoalModal(false)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:bg-background hover:text-dark transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-secondary mb-2 block uppercase tracking-wide">
                Целевая роль
              </label>
              <div className="grid grid-cols-1 gap-1.5 max-h-52 overflow-y-auto pr-1">
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
              <div>
                <label className="text-xs font-semibold text-secondary mb-2 block uppercase tracking-wide">Трек</label>
                <div className="relative">
                  <select value={draftTrack} onChange={e => setDraftTrack(e.target.value)}
                    className="w-full appearance-none px-3 py-2.5 pr-8 text-sm bg-background border border-border rounded-xl text-dark focus:border-accent/50 transition-all">
                    {TRACKS.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-secondary mb-2 block uppercase tracking-wide">Грейд</label>
                <div className="relative">
                  <select value={draftGrade} onChange={e => setDraftGrade(e.target.value)}
                    className="w-full appearance-none px-3 py-2.5 pr-8 text-sm bg-background border border-border rounded-xl text-dark focus:border-accent/50 transition-all">
                    {GRADES.map(g => <option key={g}>{g}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-accent-light/40 border border-accent/20 flex items-center gap-3">
              <Target size={16} className="text-accent flex-shrink-0" />
              <div>
                <p className="text-xs text-secondary">Новая цель</p>
                <p className="text-sm font-semibold text-dark">{draftRole}</p>
                <p className="text-xs text-muted">{draftTrack} · {draftGrade}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 px-6 pb-6">
            <Button variant="outline" size="md" className="flex-1 justify-center" onClick={() => setShowGoalModal(false)}>
              Отмена
            </Button>
            <Button variant="primary" size="md" className="flex-1 justify-center" onClick={saveGoal}>
              Сохранить цель
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
