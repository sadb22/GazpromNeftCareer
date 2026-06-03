import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit3, Mail, MapPin, Briefcase, Calendar, Clock,
  ChevronRight, BookOpen, Target, Brain, Sparkles,
  AlertTriangle, RefreshCw, ArrowRight, TrendingUp,
  X, ChevronDown, Users, CheckCircle, Activity, Timer,
  Lock,
} from 'lucide-react';
import ProgressBar from '../components/ui/ProgressBar';
import { useApp } from '../context/AppContext';
import { courses } from '../data/courses';
import { calendarEvents } from '../data/calendarEvents';
import { tasks, statusConfig } from '../data/tasks';

const TARGET_ROLES = ['Senior AI Engineer','Data Scientist Lead','ML Engineer','Tech Lead Backend','Product Manager','Solution Architect','Business Analyst'];
const TRACKS = ['Инженерный','Аналитический','Управленческий','Продуктовый'];
const GRADES = ['Middle','Senior','Lead','Principal'];

const EVT_CFG = {
  meeting:   { color: '#10B981', label: 'Встреча'  },
  learning:  { color: '#8B5CF6', label: 'Обучение' },
  review:    { color: '#3B6FE8', label: 'Ревью'    },
  interview: { color: '#F97316', label: 'Интервью' },
  deadline:  { color: '#EF4444', label: 'Дедлайн'  },
  hr:        { color: '#EC4899', label: 'HR'       },
  event:     { color: '#005DB9', label: 'Событие'  },
};

const CIRCLE_COLOR = {
  in_progress: '#005DB9',
  pending:     '#B45309',
  not_started: '#C5CDD9',
  completed:   '#1A7A4A',
};

function sortTasks(t) {
  const mn = { 'января':1,'февраля':2,'марта':3,'апреля':4,'мая':5,'июня':6,'июля':7,'августа':8,'сентября':9,'октября':10,'ноября':11,'декабря':12 };
  return [...t].sort((a, b) => {
    const [da, ma] = a.deadline.split(' '); const [db, mb] = b.deadline.split(' ');
    return ((mn[ma]||0)*100 + parseInt(da)) - ((mn[mb]||0)*100 + parseInt(db));
  });
}

/* ── Employee Card ───────────────────────────────────────── */
function EmployeeCard({ user, onEdit }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-card p-5 space-y-4">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="relative">
          <div className="w-18 h-18 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-sm"
            style={{ backgroundColor: user.avatarColor, width: 72, height: 72 }}>
            {user.initials}
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-success border-2 border-white" />
        </div>
        <div>
          <h2 className="text-base font-bold text-dark leading-tight">{user.name}</h2>
          <p className="text-xs text-secondary mt-0.5">{user.role}</p>
          <span className="inline-flex items-center mt-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#EBF2FB', color: '#005DB9' }}>
            {user.level}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-semibold text-secondary">Готовность к переходу</span>
          <span className="text-sm font-bold text-accent">{user.readiness}%</span>
        </div>
        <ProgressBar value={user.readiness} color="accent" height={5} />
        <p className="text-[10px] text-muted">до роли {user.targetRole}</p>
      </div>

      <div className="space-y-2 pt-1 border-t border-border">
        {[
          { icon: <Mail size={12} />, text: user.email },
          { icon: <MapPin size={12} />, text: user.location },
          { icon: <Briefcase size={12} />, text: `${user.yearsAtCompany} лет в компании` },
          { icon: <Users size={12} />, text: user.department },
        ].map((row, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-secondary">
            <span className="text-muted flex-shrink-0">{row.icon}</span>
            <span className="truncate">{row.text}</span>
          </div>
        ))}
      </div>

      <button onClick={onEdit}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:border-accent/40 hover:text-accent hover:bg-accent-light/20 transition-all">
        <Edit3 size={12} /> Редактировать профиль
      </button>
    </div>
  );
}

/* ── KPI Block ───────────────────────────────────────────── */
function KpiBlock({ label, value, delta, deltaColor, icon, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-card p-5">
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-semibold text-secondary leading-snug max-w-[110px]">{label}</p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconBg, color: iconColor }}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-dark leading-none mb-2">{value}</p>
      <p className="text-xs font-semibold" style={{ color: deltaColor }}>{delta}</p>
    </div>
  );
}

/* ── Task Timeline ───────────────────────────────────────── */
function TaskTimeline({ taskList }) {
  const [filter, setFilter] = useState('all');
  const base = sortTasks(taskList);
  const shown = filter === 'active' ? base.filter(t => ['in_progress','pending'].includes(t.status)) : base;

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-bold text-dark text-sm">Временная шкала задач</h3>
          <p className="text-xs text-secondary mt-0.5">Задачи и дедлайны на ближайший период</p>
        </div>
        <div className="flex gap-0.5 bg-background border border-border rounded-xl p-1">
          {[{k:'all',l:'Все'},{k:'active',l:'Активные'}].map(({k,l}) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${filter===k ? 'bg-white text-dark shadow-sm border border-border' : 'text-secondary hover:text-dark'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-[9px] top-4 bottom-4 w-px bg-border" />

          <div className="space-y-3">
            {shown.map(task => {
              const st = statusConfig[task.status];
              return (
                <div key={task.id} className="relative flex items-start gap-4">
                  {/* circle */}
                  <div className="w-[19px] h-[19px] rounded-full border-2 border-white flex-shrink-0 relative z-10 mt-3"
                    style={{ backgroundColor: CIRCLE_COLOR[task.status] }} />

                  {/* card */}
                  <div className="flex-1 bg-background rounded-xl border border-border p-3.5 hover:border-accent/20 hover:bg-white transition-all">
                    <div className="flex items-start gap-4">
                      {/* deadline */}
                      <div className="w-[72px] flex-shrink-0">
                        <p className="text-[10px] text-muted font-medium">дедлайн</p>
                        <p className="text-sm font-bold text-dark leading-tight mt-0.5">{task.deadline}</p>
                      </div>
                      {/* info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark leading-snug">{task.title}</p>
                        <span className="inline-block mt-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: task.categoryBg, color: task.categoryColor }}>
                          {task.category}
                        </span>
                      </div>
                      {/* status */}
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Career Tab Content ──────────────────────────────────── */
function CareerTabContent({ user, targetRole, courses: allCourses, navigate, onChangeGoal }) {
  const active = allCourses.filter(c => c.status === 'in_progress');
  return (
    <div className="space-y-4">
      {/* Role header */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-5">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="min-w-0">
              <p className="text-[10px] text-secondary mb-1 font-semibold uppercase tracking-wide">Текущая роль</p>
              <p className="text-sm font-bold text-dark truncate">{user.role}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor:'#EBF2FB',color:'#005DB9' }}>{user.level}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 px-2">
              <div className="h-px w-6 bg-border" />
              <ArrowRight size={13} className="text-accent" />
              <div className="h-px w-6 bg-border" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-secondary mb-1 font-semibold uppercase tracking-wide">Целевая роль</p>
              <p className="text-sm font-bold text-accent truncate">{targetRole}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor:'#EBF2FB',color:'#005DB9' }}>Senior</span>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-center">
              <p className="text-3xl font-bold text-dark leading-none">{user.readiness}%</p>
              <p className="text-[11px] text-secondary mt-1">Готовность</p>
              <p className="text-[11px] font-semibold text-success mt-0.5">+4% за месяц</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <button onClick={onChangeGoal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:border-accent/40 hover:text-accent transition-all">
              <RefreshCw size={12} /> Сменить трек
            </button>
          </div>
        </div>
        <ProgressBar value={user.readiness} color="accent" height={6} className="mt-4" />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:'Прогресс', value:`${user.careerProgress}%`, sub:'Завершено шагов', color:'#1A2533' },
          { label:'Прогноз перехода', value:'Q1 2027', sub:'При текущем темпе', color:'#005DB9' },
          { label:'Пробелов в навыках', value:user.skillGaps.length, sub:`${user.skillGaps.length-1} обязательных`, color:'#B45309' },
        ].map((m,i) => (
          <div key={i} className="bg-white rounded-2xl border border-border shadow-card p-4">
            <p className="text-[11px] text-secondary mb-2">{m.label}</p>
            <p className="text-2xl font-bold" style={{ color: m.color }}>{m.value}</p>
            <p className="text-[11px] text-muted mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Active learning + AI */}
      <div className="grid grid-cols-2 gap-4">
        {/* Active courses */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor:'#D6EFE1',color:'#1A7A4A' }}>
                <BookOpen size={14} />
              </div>
              <p className="text-sm font-bold text-dark">Активные курсы</p>
            </div>
            <button onClick={() => navigate('/learning')} className="text-[11px] text-accent font-semibold flex items-center gap-0.5 hover:underline">
              Все <ChevronRight size={11} />
            </button>
          </div>
          <div className="space-y-3">
            {active.map(c => (
              <div key={c.id} className="p-3 rounded-xl bg-background border border-border hover:border-accent/20 transition-all cursor-pointer" onClick={() => navigate('/learning')}>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block mb-1.5"
                  style={{ backgroundColor:c.categoryBg, color:c.categoryColor }}>{c.category}</span>
                <p className="text-xs font-semibold text-dark leading-snug mb-2">{c.title}</p>
                <div className="flex justify-between text-[10px] mb-1.5">
                  <span className="text-secondary">Прогресс</span>
                  <span className="font-bold text-dark">{c.progress}%</span>
                </div>
                <ProgressBar value={c.progress} color={c.categoryColor} height={4} />
              </div>
            ))}
          </div>
        </div>

        {/* AI recommendation */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-4"
          style={{ background:'linear-gradient(145deg,#fff 0%,#F5F9FF 100%)', borderColor:'#E0EAFB' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor:'#005DB9' }}>
              <Brain size={14} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-dark">AI-рекомендации</p>
              <p className="text-[10px] text-secondary">Персонализировано</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-white">Live</span>
          </div>
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-white border border-border/60">
              <p className="text-[10px] text-secondary mb-1 font-semibold">Приоритет #1</p>
              <p className="text-xs font-semibold text-dark">Завершить Python ML — критично для перехода</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {user.skillGaps.slice(0,3).map(g => (
                <span key={g} className="text-[10px] px-1.5 py-0.5 rounded-lg font-medium flex items-center gap-1"
                  style={{ backgroundColor:'#FEF3C7', color:'#B45309' }}>
                  <AlertTriangle size={9} /> {g}
                </span>
              ))}
            </div>
          </div>
          <button onClick={() => navigate('/career')}
            className="w-full mt-3 py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
            style={{ backgroundColor:'#005DB9' }}>
            Карьерный путь <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Meetings Widget (right panel) ───────────────────────── */
function MeetingsWidget({ events, today, navigate }) {
  const upcoming = [...events]
    .filter(e => e.date >= today)
    .sort((a,b) => a.date.localeCompare(b.date)||(a.time||'').localeCompare(b.time||''))
    .slice(0,7);
  return (
    <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-accent" />
          <p className="text-sm font-bold text-dark">Ближайшие встречи</p>
        </div>
        <button onClick={() => navigate('/calendar')} className="text-[11px] text-accent font-semibold hover:underline">Все</button>
      </div>
      <div className="divide-y divide-border">
        {upcoming.map(ev => {
          const cfg = EVT_CFG[ev.type] || EVT_CFG.meeting;
          const [,mm,dd] = ev.date.split('-');
          return (
            <div key={ev.id} className="flex items-start gap-3 px-3 py-2.5 hover:bg-background transition-colors">
              <div className="w-1 min-h-[34px] rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: cfg.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-dark leading-snug truncate">{ev.title}</p>
                <p className="text-[10px] text-muted mt-0.5">
                  {ev.with && <span>{ev.with} · </span>}{dd}.{mm}{ev.time && ` · ${ev.time}`}
                </p>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                style={{ backgroundColor:`${cfg.color}15`, color:cfg.color }}>
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Courses Widget (right panel) ────────────────────────── */
function CoursesWidget({ courses: allCourses, navigate }) {
  const active = allCourses.filter(c => c.status === 'in_progress');
  return (
    <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-success" />
          <p className="text-sm font-bold text-dark">Текущие курсы</p>
        </div>
        <button onClick={() => navigate('/learning')} className="text-[11px] text-accent font-semibold hover:underline">Все</button>
      </div>
      <div className="p-3 space-y-2.5">
        {active.map(c => (
          <div key={c.id} className="p-2.5 rounded-xl bg-background border border-border hover:bg-white transition-all cursor-pointer" onClick={() => navigate('/learning')}>
            <p className="text-xs font-semibold text-dark truncate mb-1.5">{c.title}</p>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor:c.categoryBg, color:c.categoryColor }}>{c.category}</span>
              <span className="text-xs font-bold text-dark">{c.progress}%</span>
            </div>
            <ProgressBar value={c.progress} color={c.categoryColor} height={4} />
            <p className="text-[10px] text-muted mt-1.5 flex items-center gap-1">
              <Clock size={9} /> до {c.deadline}
            </p>
          </div>
        ))}
        {allCourses.filter(c=>c.status==='not_started'&&c.recommended).slice(0,1).map(c => (
          <div key={c.id} className="p-2.5 rounded-xl border border-dashed border-accent/30 bg-accent-light/10 cursor-pointer" onClick={() => navigate('/learning')}>
            <div className="flex items-center gap-1 mb-1">
              <Sparkles size={11} className="text-accent" />
              <span className="text-[10px] font-semibold text-accent">Рекомендовано AI</span>
            </div>
            <p className="text-xs font-semibold text-dark truncate">{c.title}</p>
            <p className="text-[10px] text-secondary mt-0.5">{c.provider}</p>
          </div>
        ))}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor:'rgba(26,37,51,0.45)' }}
      onClick={e => e.target===e.currentTarget&&onClose()}>
      <div className="bg-white rounded-2xl shadow-card-hover w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-dark">Изменить карьерную цель</h2>
            <p className="text-xs text-secondary mt-0.5">Выберите роль, трек и грейд</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-xl flex items-center justify-center text-muted hover:bg-background"><X size={15}/></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-secondary mb-2 block uppercase tracking-wide">Целевая роль</label>
            <div className="grid gap-1.5 max-h-48 overflow-y-auto pr-1">
              {TARGET_ROLES.map(role => (
                <button key={role} onClick={()=>setDraftRole(role)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${draftRole===role?'bg-accent text-white border-accent':'border-border text-dark hover:border-accent/40 hover:bg-background'}`}>
                  {role}{draftRole===role&&<CheckCircle size={13} className="inline ml-2 opacity-80"/>}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[{label:'Трек',val:draftTrack,set:setDraftTrack,opts:TRACKS},{label:'Грейд',val:draftGrade,set:setDraftGrade,opts:GRADES}].map(({label,val,set,opts})=>(
              <div key={label}>
                <label className="text-xs font-semibold text-secondary mb-2 block uppercase tracking-wide">{label}</label>
                <div className="relative">
                  <select value={val} onChange={e=>set(e.target.value)} className="w-full appearance-none px-3 py-2.5 pr-8 text-sm bg-background border border-border rounded-xl text-dark focus:border-accent/50 transition-all">
                    {opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"/>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-border text-secondary hover:bg-background transition-colors">Отмена</button>
          <button onClick={()=>onSave(draftRole)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor:'#005DB9' }}>Сохранить</button>
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
  const TODAY = '2026-06-04';

  const notStartedCount = tasks.filter(t => t.status === 'not_started').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;

  return (
    <>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex gap-5 items-start">

          {/* LEFT: Employee Card */}
          <div className="w-60 flex-shrink-0 sticky top-6">
            <EmployeeCard user={user} onEdit={() => navigate('/settings')} />
          </div>

          {/* CENTER: KPI + Tabs + Content */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* KPI cards — 3 equal */}
            <div className="grid grid-cols-3 gap-4">
              <KpiBlock
                label="KPI сотрудника"
                value={`${user.engagement}%`}
                delta="Высокий уровень"
                deltaColor="#1A7A4A"
                icon={<TrendingUp size={17}/>}
                iconBg="#D6EFE1" iconColor="#1A7A4A"
              />
              <KpiBlock
                label="Предстоящие задачи"
                value={notStartedCount}
                delta="Не начаты"
                deltaColor="#B45309"
                icon={<Timer size={17}/>}
                iconBg="#FEF3C7" iconColor="#B45309"
              />
              <KpiBlock
                label="Активные задачи"
                value={inProgressCount}
                delta="В работе сейчас"
                deltaColor="#005DB9"
                icon={<Activity size={17}/>}
                iconBg="#EBF2FB" iconColor="#005DB9"
              />
            </div>

            {/* Tab switcher */}
            <div className="bg-white rounded-2xl border border-border shadow-card p-1.5">
              <div className="flex gap-1">
                {['Основная информация','Карьера'].map((tab,i) => (
                  <button key={i} onClick={() => setActiveTab(i)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab===i ? 'bg-accent text-white shadow-sm' : 'text-secondary hover:text-dark hover:bg-background'}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            {activeTab === 0 && <TaskTimeline taskList={tasks} />}
            {activeTab === 1 && (
              <CareerTabContent
                user={user}
                targetRole={targetRole}
                courses={courses}
                navigate={navigate}
                onChangeGoal={() => setShowGoalModal(true)}
              />
            )}
          </div>

          {/* RIGHT: Meetings + Courses */}
          <div className="w-64 flex-shrink-0 sticky top-6 space-y-4">
            <MeetingsWidget events={calendarEvents} today={TODAY} navigate={navigate} />
            <CoursesWidget courses={courses} navigate={navigate} />
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
