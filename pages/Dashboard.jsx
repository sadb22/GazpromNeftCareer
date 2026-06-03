import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit3, Mail, MapPin, Briefcase, Calendar, Clock,
  ChevronRight, BookOpen, Target, Brain, Sparkles,
  AlertTriangle, RefreshCw, ArrowRight, TrendingUp,
  X, ChevronDown, Users, CheckCircle, Activity, Timer,
  BarChart2, Zap, ExternalLink,
} from 'lucide-react';
import ProgressBar from '../components/ui/ProgressBar';
import { useApp } from '../context/AppContext';
import { courses } from '../data/courses';
import { calendarEvents } from '../data/calendarEvents';
import { tasks, statusConfig } from '../data/tasks';

const TARGET_ROLES = ['Senior AI Engineer','Data Scientist Lead','ML Engineer','Tech Lead Backend','Product Manager','Solution Architect','Business Analyst'];
const TRACKS = ['Инженерный','Аналитический','Управленческий','Продуктовый'];
const GRADES = ['Middle','Senior','Lead','Principal'];
const TODAY_STR = '2026-06-04';
const TODAY_TASK = '4 июня';

const MONTH_ABBR = {
  'января':'ЯНВ','февраля':'ФЕВ','марта':'МАР','апреля':'АПР',
  'мая':'МАЙ','июня':'ИЮН','июля':'ИЮЛ','августа':'АВГ',
  'сентября':'СЕН','октября':'ОКТ','ноября':'НОЯ','декабря':'ДЕК',
};

const EVT_CFG = {
  meeting:   { color:'#10B981', label:'Встреча'  },
  learning:  { color:'#8B5CF6', label:'Обучение' },
  review:    { color:'#3B6FE8', label:'Ревью'    },
  interview: { color:'#F97316', label:'Интервью' },
  deadline:  { color:'#EF4444', label:'Дедлайн'  },
  hr:        { color:'#EC4899', label:'HR'       },
  event:     { color:'#005DB9', label:'Событие'  },
};

const CORP_NEWS = [
  { id:1, type:'new',       label:'НОВОЕ',  labelBg:'#EBF2FB', labelColor:'#005DB9', date:'03.06.2026', title:'Запущена обновлённая система оценки компетенций' },
  { id:2, type:'important', label:'ВАЖНО',  labelBg:'#FDECEA', labelColor:'#C0392B', date:'02.06.2026', title:'Изменения в политике гибридного формата работы' },
  { id:3, type:'new',       label:'НОВОЕ',  labelBg:'#D6EFE1', labelColor:'#1A7A4A', date:'01.06.2026', title:'Открыты новые программы профессионального развития' },
];

function sortTasks(t) {
  const mn = {'января':1,'февраля':2,'марта':3,'апреля':4,'мая':5,'июня':6,'июля':7,'августа':8,'сентября':9,'октября':10,'ноября':11,'декабря':12};
  return [...t].sort((a,b) => {
    const [da,ma] = a.deadline.split(' '); const [db,mb] = b.deadline.split(' ');
    return ((mn[ma]||0)*100+parseInt(da)) - ((mn[mb]||0)*100+parseInt(db));
  });
}

function calcEndTime(time, duration) {
  if (!time || !duration) return '';
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + (duration||0);
  return `${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}`;
}

/* ── 1. Employee compact card ────────────────────────────── */
function EmployeeTopCard({ user }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-card p-5 flex flex-col items-center justify-center gap-3 text-center h-full">
      <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-sm flex-shrink-0"
        style={{ backgroundColor: user.avatarColor }}>
        {user.initials}
      </div>
      <div>
        <p className="text-sm font-bold text-dark leading-tight">{user.name}</p>
        <p className="text-xs text-secondary mt-1">{user.role}</p>
        <p className="text-[11px] text-muted mt-0.5">{user.department}</p>
      </div>
      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor:'#EBF2FB', color:'#005DB9' }}>
        {user.level}
      </span>
    </div>
  );
}

/* ── 2. KPI top card ─────────────────────────────────────── */
function KpiTopCard({ label, value, subtitle, delta, deltaColor, progress, icon, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-card p-5 flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-secondary leading-snug max-w-[100px]">{label}</p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor:iconBg, color:iconColor }}>{icon}</div>
      </div>
      <p className="text-3xl font-bold text-dark leading-none mb-1">{value}</p>
      <p className="text-xs text-muted mb-2">{subtitle}</p>
      {progress !== undefined && <ProgressBar value={progress} color="accent" height={4} className="mb-2" />}
      {delta && <p className="text-xs font-semibold mt-auto" style={{ color: deltaColor }}>{delta}</p>}
    </div>
  );
}

/* ── 3. News top card ────────────────────────────────────── */
function NewsTopCard({ news, navigate }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-card p-4 flex flex-col h-full">
      <p className="text-xs font-bold text-dark mb-2.5">Последние новости</p>
      <div className="space-y-2.5 flex-1">
        {news.slice(0, 2).map(n => (
          <div key={n.id} className="group cursor-pointer">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: n.labelBg, color: n.labelColor }}>
                {n.label}
              </span>
              <span className="text-[10px] text-muted">{n.date}</span>
            </div>
            <p className="text-xs font-semibold text-dark leading-snug group-hover:text-accent transition-colors line-clamp-2">{n.title}</p>
            <p className="text-[10px] text-accent mt-0.5 font-medium">Подробнее →</p>
          </div>
        ))}
      </div>
      <button className="text-[11px] text-accent font-semibold hover:underline mt-2.5 text-left">
        Все новости
      </button>
    </div>
  );
}

/* ── Task Timeline (roadmap style) ──────────────────────── */
function TaskTimelineSection({ taskList }) {
  const [filter, setFilter] = useState('all');
  const sorted = sortTasks(taskList);
  const shown = filter === 'active' ? sorted.filter(t => ['in_progress','pending'].includes(t.status)) : sorted;

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="font-bold text-dark text-sm">Шкала временных задач</h3>
          <p className="text-xs text-secondary mt-0.5">Задачи и дедлайны</p>
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

      {/* Timeline */}
      <div className="flex-1 px-5 py-3 overflow-y-auto" style={{ maxHeight: '520px' }}>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[28px] top-5 bottom-2 w-px bg-border" />

          <div className="space-y-1.5">
            {shown.map(task => {
              const isToday = task.deadline === TODAY_TASK;
              const isDone = task.status === 'completed';
              const st = statusConfig[task.status];
              const [day, month] = task.deadline.split(' ');
              const monthAbbr = MONTH_ABBR[month] || month.slice(0,3).toUpperCase();

              return (
                <div key={task.id} className="flex items-center gap-0 py-1.5">
                  {/* Circle marker */}
                  <div className="w-14 flex-shrink-0 flex flex-col items-center gap-1 relative z-10">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                      isDone ? 'bg-success border-success' :
                      isToday ? 'bg-accent border-accent' :
                      task.status === 'in_progress' ? 'bg-accent/20 border-accent' :
                      'bg-white border-border'
                    }`}>
                      {isDone && <CheckCircle size={14} className="text-white" />}
                      {isToday && !isDone && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  {/* Date block */}
                  <div className="w-10 flex-shrink-0 text-center mr-3">
                    <p className="text-sm font-bold text-dark leading-none">{day}</p>
                    <p className="text-[10px] text-muted font-semibold uppercase tracking-wide mt-0.5">{monthAbbr}</p>
                  </div>

                  {/* Task info — horizontal card */}
                  <div className="flex-1 flex items-center gap-3 bg-background rounded-xl border border-border px-3.5 py-2.5 hover:border-accent/25 hover:bg-white transition-all">
                    <p className="text-sm font-semibold text-dark flex-1 leading-snug">{task.title}</p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: task.categoryBg, color: task.categoryColor }}>
                      {task.category}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: st.bg, color: st.color }}>
                      {st.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="px-5 py-3 border-t border-border flex-shrink-0">
        <button className="text-sm text-accent font-semibold hover:underline">Все задачи</button>
      </div>
    </div>
  );
}

/* ── Meetings Today ─────────────────────────────────────── */
function MeetingsTodaySection({ events, navigate }) {
  const today = events.filter(e => e.date === TODAY_STR && e.time)
    .sort((a,b) => (a.time||'').localeCompare(b.time||''));
  const upcoming = events.filter(e => e.date > TODAY_STR && e.time)
    .sort((a,b) => a.date.localeCompare(b.date)||(a.time||'').localeCompare(b.time||''));
  const list = [...today, ...upcoming].slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex-shrink-0">
        <h3 className="font-bold text-dark text-sm">Ближайшие встречи на сегодня</h3>
        <p className="text-xs text-secondary mt-0.5">{today.length} встреч сегодня</p>
      </div>
      <div className="flex-1 divide-y divide-border overflow-y-auto" style={{ maxHeight: '520px' }}>
        {list.map(ev => {
          const cfg = EVT_CFG[ev.type] || EVT_CFG.meeting;
          const endTime = calcEndTime(ev.time, ev.duration);
          const [,mm,dd] = ev.date.split('-');
          const isToday = ev.date === TODAY_STR;
          return (
            <div key={ev.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-background/50 transition-colors">
              {/* Time column */}
              <div className="w-14 flex-shrink-0 text-center">
                <p className="text-sm font-bold text-dark leading-none">{ev.time}</p>
                <p className="text-[10px] text-muted mt-0.5">—</p>
                <p className="text-xs text-muted">{endTime}</p>
              </div>
              {/* Color bar */}
              <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <p className="text-sm font-semibold text-dark leading-snug flex-1 truncate">{ev.title}</p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor:`${cfg.color}18`, color:cfg.color }}>
                    {cfg.label}
                  </span>
                </div>
                {ev.with && <p className="text-xs text-secondary mt-0.5">{ev.with}</p>}
                {!isToday && <p className="text-[10px] text-muted mt-0.5">{dd}.{mm}.2026</p>}
                {/* Simple participant avatars */}
                {ev.with && (
                  <div className="flex items-center gap-1 mt-1.5">
                    {ev.with.split(/[\s,]+/).filter(Boolean).slice(0,3).map((word,i) => (
                      <div key={i} className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ backgroundColor: ['#005DB9','#8B5CF6','#10B981','#F97316'][i%4] }}>
                        {word[0]}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <div className="text-center py-8 text-sm text-muted">Нет встреч на сегодня</div>
        )}
      </div>
      <div className="px-5 py-3 border-t border-border flex-shrink-0">
        <button onClick={() => navigate('/calendar')} className="text-sm text-accent font-semibold hover:underline">
          Все встречи на сегодня
        </button>
      </div>
    </div>
  );
}

/* ── Career Tab Content ──────────────────────────────────── */
function CareerTabContent({ user, targetRole, courses: allCourses, navigate, onChangeGoal }) {
  const active = allCourses.filter(c => c.status === 'in_progress');
  return (
    <div className="space-y-4">
      {/* Active Courses */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor:'#D6EFE1', color:'#1A7A4A' }}>
              <BookOpen size={16} />
            </div>
            <div>
              <h3 className="font-bold text-dark text-sm">Текущие курсы</h3>
              <p className="text-xs text-secondary">{active.length} курса в процессе</p>
            </div>
          </div>
          <button onClick={() => navigate('/learning')} className="text-xs text-accent font-semibold flex items-center gap-1 hover:underline">
            Все курсы <ChevronRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {active.map(c => (
            <div key={c.id} className="p-3.5 rounded-xl bg-background border border-border hover:border-accent/20 hover:bg-white transition-all cursor-pointer" onClick={() => navigate('/learning')}>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block mb-1.5"
                style={{ backgroundColor:c.categoryBg, color:c.categoryColor }}>{c.category}</span>
              <p className="text-xs font-semibold text-dark leading-snug mb-2">{c.title}</p>
              <div className="flex justify-between text-[10px] mb-1.5">
                <span className="text-secondary">Прогресс</span>
                <span className="font-bold text-dark">{c.progress}%</span>
              </div>
              <ProgressBar value={c.progress} color={c.categoryColor} height={4} />
              <p className="text-[10px] text-muted mt-1.5 flex items-center gap-1">
                <Clock size={9} /> до {c.deadline}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Role header */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-5">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="min-w-0">
              <p className="text-[10px] text-secondary mb-1 font-semibold uppercase tracking-wide">Текущая роль</p>
              <p className="text-sm font-bold text-dark">{user.role}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor:'#EBF2FB',color:'#005DB9' }}>{user.level}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 px-2">
              <div className="h-px w-8 bg-border"/><ArrowRight size={13} className="text-accent"/><div className="h-px w-8 bg-border"/>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-secondary mb-1 font-semibold uppercase tracking-wide">Целевая роль</p>
              <p className="text-sm font-bold text-accent">{targetRole}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor:'#EBF2FB',color:'#005DB9' }}>Senior</span>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-center">
              <p className="text-3xl font-bold text-dark">{user.readiness}%</p>
              <p className="text-[11px] text-secondary mt-1">Готовность</p>
              <p className="text-[11px] font-semibold text-success">+4% за месяц</p>
            </div>
            <div className="w-px h-10 bg-border"/>
            <button onClick={onChangeGoal} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:border-accent/40 hover:text-accent transition-all">
              <RefreshCw size={12}/> Сменить трек
            </button>
          </div>
        </div>
        <ProgressBar value={user.readiness} color="accent" height={6} className="mt-4" />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {label:'Прогресс карьеры',value:`${user.careerProgress}%`,sub:'Завершено шагов',color:'#1A2533'},
          {label:'Прогноз перехода',value:'Q1 2027',sub:'При текущем темпе',color:'#005DB9'},
          {label:'Пробелов в навыках',value:user.skillGaps.length,sub:'требуют внимания',color:'#B45309'},
        ].map((m,i) => (
          <div key={i} className="bg-white rounded-2xl border border-border shadow-card p-4">
            <p className="text-[11px] text-secondary mb-2">{m.label}</p>
            <p className="text-2xl font-bold" style={{ color:m.color }}>{m.value}</p>
            <p className="text-[11px] text-muted mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* AI */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-5" style={{ borderColor:'#E0EAFB',background:'linear-gradient(145deg,#fff 0%,#F5F9FF 100%)' }}>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center flex-shrink-0"><Brain size={16} className="text-white"/></div>
          <div><h3 className="font-bold text-dark text-sm">AI-рекомендации</h3><p className="text-xs text-secondary">Персонализировано</p></div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-white ml-auto">Live</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { title:'Приоритет #1', text:'Завершить Python ML — критично для перехода к Senior AI Engineer' },
            { title:'Рекомендация', text:'Backend Tech Lead — 91% совпадение уже сейчас, доступен' },
          ].map((item,i) => (
            <div key={i} className="p-3 rounded-xl bg-white border border-border/60">
              <p className="text-[10px] text-secondary font-semibold mb-1">{item.title}</p>
              <p className="text-xs font-semibold text-dark">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {user.skillGaps.slice(0,3).map(g => (
            <span key={g} className="text-[10px] px-2 py-0.5 rounded-lg font-medium flex items-center gap-1"
              style={{ backgroundColor:'#FEF3C7',color:'#B45309' }}>
              <AlertTriangle size={9}/> {g}
            </span>
          ))}
        </div>
        <button onClick={() => navigate('/career')} className="w-full mt-3 py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity" style={{ backgroundColor:'#005DB9' }}>
          Карьерный путь <ArrowRight size={12}/>
        </button>
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
          <div><h2 className="text-base font-bold text-dark">Изменить карьерную цель</h2><p className="text-xs text-secondary mt-0.5">Выберите роль, трек и грейд</p></div>
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
            {[{label:'Трек',val:draftTrack,set:setDraftTrack,opts:TRACKS},{label:'Грейд',val:draftGrade,set:setDraftGrade,opts:GRADES}].map(({label,val,set,opts}) => (
              <div key={label}>
                <label className="text-xs font-semibold text-secondary mb-2 block uppercase tracking-wide">{label}</label>
                <div className="relative">
                  <select value={val} onChange={e=>set(e.target.value)} className="w-full appearance-none px-3 py-2.5 pr-8 text-sm bg-background border border-border rounded-xl text-dark">
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

  const notStartedCount = tasks.filter(t => t.status === 'not_started').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const totalThisWeek = tasks.length;

  return (
    <>
      <div className="max-w-[1280px] mx-auto space-y-5">

        {/* ── TOP ROW: 5 equal cards ── */}
        <div className="grid grid-cols-5 gap-4 items-stretch">
          <EmployeeTopCard user={user} />
          <KpiTopCard
            label="KPI сотрудника"
            value={`${user.engagement}%`}
            subtitle="Выполнение плана"
            progress={user.engagement}
            delta={`↑ +6% по сравнению с прошлым месяцем`}
            deltaColor="#1A7A4A"
            icon={<BarChart2 size={16}/>} iconBg="#EBF2FB" iconColor="#005DB9"
          />
          <KpiTopCard
            label="Предстоящие задачи"
            value={totalThisWeek}
            subtitle="на этой неделе"
            delta={`Ближайшая: сегодня`}
            deltaColor="#B45309"
            icon={<Calendar size={16}/>} iconBg="#FEF3C7" iconColor="#B45309"
          />
          <KpiTopCard
            label="Активные задачи"
            value={inProgressCount}
            subtitle="в работе"
            delta="Обновлено 10 мин назад"
            deltaColor="#5B6B7D"
            icon={<Activity size={16}/>} iconBg="#D6EFE1" iconColor="#1A7A4A"
          />
          <NewsTopCard news={CORP_NEWS} navigate={navigate} />
        </div>

        {/* ── TAB SWITCHER ── */}
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

        {/* ── ОСНОВНАЯ ИНФОРМАЦИЯ ── */}
        {activeTab === 0 && (
          <div className="grid grid-cols-[1.3fr_1fr] gap-5 items-start">
            <TaskTimelineSection taskList={tasks} />
            <MeetingsTodaySection events={calendarEvents} navigate={navigate} />
          </div>
        )}

        {/* ── КАРЬЕРА ── */}
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

      {showGoalModal && (
        <GoalModal user={user} onClose={() => setShowGoalModal(false)} onSave={role => { setTargetRole(role); setShowGoalModal(false); }} />
      )}
    </>
  );
}
