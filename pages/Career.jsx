import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, CheckCircle, Clock, Lock, ArrowRight,
  Target, TrendingUp, BookOpen, Award, Zap, AlertTriangle,
  ChevronRight, Info,
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip,
} from 'recharts';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { useApp } from '../context/AppContext';
import { courses } from '../data/courses';

/* ── Static data ───────────────────────────────────────── */

const roadmap = [
  {
    quarter: 'Q3 2026', label: 'Сейчас', status: 'current',
    steps: [
      { title: 'Python ML Foundations', type: 'course', progress: 65, status: 'in_progress', icon: '📚', skillGap: 'Machine Learning' },
      { title: 'Cloud AI на базе AWS',  type: 'course', progress: 20, status: 'in_progress', icon: '☁️', skillGap: 'Cloud AI' },
    ],
  },
  {
    quarter: 'Q4 2026', label: '6 месяцев', status: 'upcoming',
    steps: [
      { title: 'MLOps: Деплой и мониторинг', type: 'course',   progress: 0, status: 'not_started', icon: '⚙️', skillGap: 'MLOps' },
      { title: 'Shadow Project в AI Team',  type: 'project', progress: 0, status: 'not_started', icon: '👥', skillGap: null },
    ],
  },
  {
    quarter: 'Q1 2027', label: '9 месяцев', status: 'upcoming',
    steps: [
      { title: 'LLM Engineering Certification', type: 'cert',      progress: 0, status: 'not_started', icon: '🏆', skillGap: 'LLM Engineering' },
      { title: 'Финальное интервью: AI Engineer', type: 'interview', progress: 0, status: 'not_started', icon: '🎯', skillGap: null },
    ],
  },
];

const typeColors = {
  course:    { label: 'Курс',        variant: 'accent' },
  project:   { label: 'Проект',      variant: 'teal' },
  cert:      { label: 'Сертификат',  variant: 'warning' },
  interview: { label: 'Интервью',    variant: 'orange' },
};

const gapAnalysis = [
  {
    skill: 'Machine Learning',
    category: 'must',
    progress: 38,
    course: 'Python ML Foundations',
    courseId: 1,
    reason: 'Базовый навык для роли AI Engineer — без него невозможно пройти технический скрининг.',
    hours: 32,
    months: '3–4 мес. при 2 ч/нед.',
    depends: ['Python'],
    status: 'in_progress',
  },
  {
    skill: 'MLOps',
    category: 'must',
    progress: 8,
    course: 'MLOps: Деплой и мониторинг моделей',
    courseId: 2,
    reason: 'Рекомендован, так как готовность по Kubernetes ниже целевого порога (15 из 75).',
    hours: 40,
    months: '4–5 мес. при 2 ч/нед.',
    depends: ['Python', 'Machine Learning'],
    status: 'not_started',
  },
  {
    skill: 'Cloud AI',
    category: 'must',
    progress: 22,
    course: 'Cloud AI на базе AWS',
    courseId: 3,
    reason: 'Команда AI & Data использует AWS SageMaker — навык требуется для работы с production ML.',
    hours: 36,
    months: '4–5 мес. при 2 ч/нед.',
    depends: ['Machine Learning'],
    status: 'in_progress',
  },
  {
    skill: 'LLM Engineering',
    category: 'nice',
    progress: 5,
    course: 'LLM Engineering',
    courseId: 5,
    reason: 'Желательный навык — усилит профиль при конкуренции за Senior-роль.',
    hours: 60,
    months: '6–8 мес. при 2 ч/нед.',
    depends: ['Machine Learning', 'MLOps'],
    status: 'not_started',
  },
];

const radarData = [
  { subject: 'Python',       current: 85, target: 95 },
  { subject: 'ML/AI',        current: 32, target: 85 },
  { subject: 'MLOps',        current: 15, target: 75 },
  { subject: 'Cloud',        current: 28, target: 70 },
  { subject: 'Architecture', current: 55, target: 80 },
  { subject: 'Leadership',   current: 48, target: 65 },
];

const aiInsights = [
  { icon: '🚀', text: 'При текущем темпе (+5 ч/нед) переход возможен к Q1 2027. Ускорить: добавить +2 ч/нед на MLOps.' },
  { icon: '⚡', text: 'Завершение Python ML курса ускорит готовность на 18% — приоритет №1.' },
  { icon: '🎯', text: 'Гэп закрыт на 82% по Machine Learning. Осталось 2 модуля до завершения.' },
  { icon: '💼', text: 'Backend Tech Lead: 91% совпадение уже сейчас — доступен до завершения ML-трека.' },
];

const aiSteps = ['Анализ текущих навыков...', 'Определение пробелов...', 'Поиск оптимального пути...', 'Формирование рекомендаций...'];

const tooltip = { contentStyle: { borderRadius: 12, border: '1px solid #DDE1E9', fontSize: 11 } };

/* ── Component ─────────────────────────────────────────── */

export default function Career() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [aiLoading, setAiLoading]     = useState(false);
  const [aiGenerated, setAiGenerated] = useState(true);
  const [aiStep, setAiStep]           = useState(0);
  const [expandedGap, setExpandedGap] = useState(null);

  const mustHave  = gapAnalysis.filter(g => g.category === 'must');
  const niceHave  = gapAnalysis.filter(g => g.category === 'nice');

  const handleGenerate = () => {
    setAiLoading(true);
    setAiGenerated(false);
    setAiStep(0);
    const iv = setInterval(() => {
      setAiStep(s => {
        if (s >= 3) { clearInterval(iv); setAiLoading(false); setAiGenerated(true); return s; }
        return s + 1;
      });
    }, 550);
  };

  return (
    <div className="max-w-[1100px] mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-dark">Карьерный путь</h1>
          <p className="text-sm text-secondary mt-0.5">
            {user.role} → <span className="font-semibold text-accent">{user.targetRole}</span>
          </p>
        </div>
        <Button variant="primary" size="md" icon={<Sparkles size={15} />}
          onClick={handleGenerate} loading={aiLoading}>
          {aiGenerated ? 'Обновить AI-маршрут' : 'Сформировать путь'}
        </Button>
      </div>

      {/* AI Loading */}
      {aiLoading && (
        <Card className="border-accent/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-accent-light flex items-center justify-center">
              <Sparkles size={16} className="text-accent animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-dark">AI анализирует ваш профиль</p>
              <p className="text-xs text-secondary">Подождите несколько секунд</p>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            {aiSteps.map((txt, i) => (
              <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${i <= aiStep ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]
                  ${i < aiStep ? 'bg-success text-white' : i === aiStep ? 'bg-accent text-white' : 'bg-border text-muted'}`}>
                  {i < aiStep ? <CheckCircle size={11} /> : i + 1}
                </div>
                <span className="text-sm text-dark">{txt}</span>
              </div>
            ))}
          </div>
          <ProgressBar value={(aiStep + 1) * 25} color="accent" height={6} />
        </Card>
      )}

      {aiGenerated && !aiLoading && (
        <>
          {/* Stats strip — full width */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-border p-5 shadow-card">
              <p className="text-xs text-secondary mb-2">Прогресс</p>
              <p className="text-3xl font-bold text-dark">{user.careerProgress}%</p>
              <ProgressBar value={user.careerProgress} color="accent" height={5} className="mt-3" />
            </div>
            <div className="bg-white rounded-2xl border border-border p-5 shadow-card">
              <p className="text-xs text-secondary mb-2">Прогноз перехода</p>
              <p className="text-3xl font-bold text-accent">Q1 2027</p>
              <p className="text-xs text-secondary mt-2">При текущем темпе обучения</p>
            </div>
            <div className="bg-white rounded-2xl border border-border p-5 shadow-card">
              <p className="text-xs text-secondary mb-2">Пробелов в навыках</p>
              <p className="text-3xl font-bold text-warning">{user.skillGaps.length}</p>
              <p className="text-xs text-secondary mt-2">{mustHave.length} обязательных</p>
            </div>
          </div>

          {/* ── TWO-COLUMN LAYOUT ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

            {/* ── LEFT: Roadmap (primary) ── */}
            <Card>
              <CardHeader title="Дорожная карта" subtitle="Персонализирован AI · Обновлено сегодня"
                icon={<Target size={18} />} iconBg="#E8F0FA" iconColor="#005DB9" />
              <div className="space-y-6">
                {roadmap.map((phase, pi) => (
                  <div key={pi}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5
                        ${phase.status === 'current' ? 'bg-accent text-white' : 'bg-background border border-border text-secondary'}`}>
                        <Clock size={11} /> {phase.quarter}
                        {phase.status === 'current' && <span className="opacity-80 text-[10px]">· {phase.label}</span>}
                      </span>
                      {phase.status !== 'current' && <span className="text-xs text-muted">~{phase.label}</span>}
                    </div>
                    <div className="ml-4 pl-4 border-l-2 border-border space-y-2">
                      {phase.steps.map((step, si) => {
                        const badge = typeColors[step.type];
                        return (
                          <div key={si} className="relative bg-background rounded-xl border border-border p-4 hover:border-accent/30 hover:bg-white transition-all">
                            <div className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white"
                              style={{ backgroundColor: step.status === 'in_progress' ? '#005DB9' : step.status === 'completed' ? '#1A7A4A' : '#DDE1E9' }} />
                            <div className="flex items-start gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <h4 className="text-sm font-semibold text-dark">{step.title}</h4>
                                  <Badge variant={badge.variant} className="text-[10px]">{badge.label}</Badge>
                                  {step.skillGap && <Badge variant="warning" className="text-[10px]">{step.skillGap}</Badge>}
                                </div>
                                {step.status === 'in_progress' && (
                                  <div className="mt-2">
                                    <ProgressBar value={step.progress} color="accent" height={5} />
                                    <p className="text-xs text-accent font-semibold mt-1">{step.progress}% выполнено</p>
                                  </div>
                                )}
                                {step.status === 'not_started' && (
                                  <p className="text-xs text-muted flex items-center gap-1 mt-1">
                                    <Lock size={10} /> Ожидает предыдущих шагов
                                  </p>
                                )}
                              </div>
                              {step.status === 'in_progress' && (
                                <Button variant="secondary" size="sm" onClick={() => navigate('/learning')}>
                                  Продолжить
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* ── RIGHT: Radar + AI Insights + Gap Analysis ── */}
            <div className="space-y-5">

              {/* Competency Radar */}
              <Card>
                <CardHeader title="Компетенции" subtitle={`Текущие vs цель: ${user.targetRole}`}
                  icon={<Award size={18} />} iconBg="#EDE9F6" iconColor="#6D4FA0" />
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={75}>
                    <PolarGrid stroke="#DDE1E9" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#8A919E' }} />
                    <Radar name="Текущий" dataKey="current" stroke="#005DB9" fill="#005DB9" fillOpacity={0.13} strokeWidth={2} />
                    <Radar name="Цель"    dataKey="target"  stroke="#B8BDC5" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
                    <Tooltip {...tooltip} />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-5 justify-center mt-1">
                  <div className="flex items-center gap-1.5 text-xs text-secondary">
                    <span className="w-4 h-0.5 bg-accent inline-block rounded" /> Текущий
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-secondary">
                    <span className="w-4 border-t border-dashed border-silver inline-block" /> Цель
                  </div>
                </div>
              </Card>

              {/* AI Insights */}
              <Card className="border-accent/20" style={{ background: 'linear-gradient(145deg, #FFFFFF 0%, #F5F9FF 100%)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <Sparkles size={15} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-dark text-sm">AI-инсайты</h3>
                    <p className="text-xs text-secondary">По вашему треку</p>
                  </div>
                  <Badge variant="accent" className="text-[10px]">Live</Badge>
                </div>
                <div className="space-y-2">
                  {aiInsights.map((ins, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-border">
                      <span className="text-sm flex-shrink-0">{ins.icon}</span>
                      <p className="text-xs text-secondary leading-relaxed">{ins.text}</p>
                    </div>
                  ))}
                </div>
              </Card>

            </div>
          </div>

          {/* ── Gap Analysis — FULL WIDTH ── */}
          <Card>
            <CardHeader title="Анализ пробелов" subtitle="Сравнение навыков: текущая роль → целевая"
              icon={<AlertTriangle size={18} />} iconBg="#FEF3C7" iconColor="#B45309" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-3">
                  Обязательные <span className="text-danger">({mustHave.length})</span>
                </p>
                <div className="space-y-2">
                  {mustHave.map((gap, i) => (
                    <GapCard key={i} gap={gap} expanded={expandedGap === gap.skill}
                      onToggle={() => setExpandedGap(expandedGap === gap.skill ? null : gap.skill)}
                      onLearn={() => navigate('/learning')} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-3">
                  Желательные <span className="text-muted">({niceHave.length})</span>
                </p>
                <div className="space-y-2">
                  {niceHave.map((gap, i) => (
                    <GapCard key={i} gap={gap} expanded={expandedGap === gap.skill}
                      onToggle={() => setExpandedGap(expandedGap === gap.skill ? null : gap.skill)}
                      onLearn={() => navigate('/learning')} />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

/* ── Gap Card sub-component ────────────────────────────── */

function GapCard({ gap, expanded, onToggle, onLearn }) {
  const isMust = gap.category === 'must';
  return (
    <div className={`rounded-xl border transition-all ${expanded ? 'border-accent/40 bg-white shadow-card' : 'border-border bg-background hover:border-accent/30'}`}>
      {/* Header row */}
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-3 text-left">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isMust ? 'bg-danger-light' : 'bg-silver-light'}`}>
          <AlertTriangle size={13} className={isMust ? 'text-danger' : 'text-muted'} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-dark">{gap.skill}</span>
            <Badge variant={isMust ? 'danger' : 'muted'} className="text-[10px]">
              {isMust ? 'Обязательный' : 'Желательный'}
            </Badge>
            {gap.status === 'in_progress' && <Badge variant="accent" className="text-[10px]">В процессе</Badge>}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <ProgressBar value={gap.progress} color={gap.progress >= 30 ? 'accent' : 'warning'} height={4} className="flex-1 max-w-[120px]" />
            <span className="text-xs text-secondary">{gap.progress}%</span>
          </div>
        </div>
        <ChevronRight size={14} className={`text-muted transition-transform flex-shrink-0 ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-border/60 pt-3 space-y-3 animate-fade-in">
          {/* Why */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-accent-light/30 border border-accent/20">
            <Info size={13} className="text-accent flex-shrink-0 mt-0.5" />
            <p className="text-xs text-secondary leading-relaxed">{gap.reason}</p>
          </div>

          {/* Recommended course */}
          <div>
            <p className="text-xs font-semibold text-secondary mb-1.5">Рекомендованный курс</p>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border">
              <BookOpen size={14} className="text-accent flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-dark truncate">{gap.course}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-secondary">
                  <span className="flex items-center gap-1"><Clock size={10} /> {gap.hours} ч</span>
                  <span>{gap.months}</span>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={onLearn}>Начать</Button>
            </div>
          </div>

          {/* Dependency chain */}
          {gap.depends.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-secondary mb-1.5">Порядок освоения</p>
              <div className="flex items-center gap-2 flex-wrap">
                {gap.depends.map((d, i) => (
                  <React.Fragment key={d}>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-success-light text-success font-semibold flex items-center gap-1">
                      <CheckCircle size={10} /> {d}
                    </span>
                    <ChevronRight size={12} className="text-muted" />
                  </React.Fragment>
                ))}
                <span className="text-xs px-2.5 py-1 rounded-lg bg-accent-light text-accent font-semibold">{gap.skill}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
