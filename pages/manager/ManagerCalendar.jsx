import React, { useState, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, X, Clock, Users,
  Calendar, UserPlus, Check, LayoutGrid,
} from 'lucide-react';
import { managerEvents } from '../../data/managerData';
import { teamMembers } from '../../data/managerData';

/* ── Constants ───────────────────────────────────────────── */
const DAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS_RU  = ['Январь','Февраль','Март','Апрель','Май','Июнь',
                    'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const MONTHS_GEN = ['января','февраля','марта','апреля','мая','июня',
                    'июля','августа','сентября','октября','ноября','декабря'];

const PX_PER_HOUR = 66;
const START_HOUR  = 8;
const END_HOUR    = 19;
const HOURS       = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

// Event type → colour config
const TYPE_CFG = {
  one_on_one: { bg: '#EEF3FF', border: '#3B6FE8', text: '#2952C8', label: '1:1'         },
  review:     { bg: '#F3EEFF', border: '#8B5CF6', text: '#7C3AED', label: 'Ревью'       },
  idp:        { bg: '#FFF7E6', border: '#F59E0B', text: '#B45309', label: 'ИПР'         },
  deadline:   { bg: '#FFF0F0', border: '#F87171', text: '#C0392B', label: 'Дедлайн'     },
  interview:  { bg: '#ECFDF5', border: '#34D399', text: '#059669', label: 'Интервью'    },
  team:       { bg: '#E0F9F4', border: '#14B8A6', text: '#0D9488', label: 'Команда'     },
  meeting:    { bg: '#EEF3FF', border: '#3B6FE8', text: '#2952C8', label: 'Встреча'     },
};

/* ── Date helpers ────────────────────────────────────────── */
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function fmtDate(d)    { return d.toISOString().split('T')[0]; }
function fmtDay(d)     { return d.getDate(); }
function fmtWeekday(d) { return DAYS_SHORT[d.getDay() === 0 ? 6 : d.getDay() - 1]; }

function parseMinutes(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

/* ── Week View ───────────────────────────────────────────── */
function WeekView({ weekStart, events, onEventClick, today }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex-1 bg-white rounded-2xl border border-border shadow-card overflow-hidden flex flex-col">
      {/* Day headers */}
      <div className="flex border-b border-border bg-background/40 flex-shrink-0">
        <div className="w-14 flex-shrink-0 relative">
          <span className="absolute right-2 bottom-0 translate-y-[50%] text-[10px] text-muted font-medium leading-none">
            {START_HOUR}:00
          </span>
        </div>
        {days.map((day, i) => {
          const isToday = fmtDate(day) === today;
          return (
            <div key={i} className="flex-1 text-center py-3 border-l border-border first:border-l-0">
              <p className="text-[11px] font-semibold text-muted uppercase tracking-wide">
                {fmtWeekday(day)}
              </p>
              <div
                className={`mx-auto mt-1 w-8 h-8 rounded-full flex items-center justify-center
                  text-sm font-bold transition-colors
                  ${isToday ? 'text-white' : 'text-dark'}`}
                style={isToday ? { backgroundColor: '#003087' } : {}}
              >
                {fmtDay(day)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid (scrollable) */}
      <div className="overflow-y-auto flex-1" style={{ maxHeight: '560px' }}>
        <div className="flex">
          {/* Time labels */}
          <div className="w-14 flex-shrink-0">
            {HOURS.map((h, idx) => (
              <div key={h} className="relative" style={{ height: PX_PER_HOUR }}>
                {idx > 0 && (
                  <span className="absolute right-2 top-0 -translate-y-1/2 text-[10px] text-muted font-medium leading-none">
                    {h}:00
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day, di) => {
            const dateStr  = fmtDate(day);
            const dayEvts  = events.filter(e => e.date === dateStr);
            const isToday  = dateStr === today;

            return (
              <div
                key={di}
                className={`flex-1 border-l border-border relative
                  ${isToday ? 'bg-blue-50/30' : ''}`}
              >
                {/* Hour grid lines */}
                {HOURS.map((h, idx) => (
                  <div key={h}
                    className={idx > 0 ? 'border-t border-border/60' : ''}
                    style={{ height: PX_PER_HOUR }} />
                ))}

                {/* All-day events (no time) */}
                {dayEvts.filter(e => !e.time).map(ev => {
                  const cfg = TYPE_CFG[ev.type] || TYPE_CFG.meeting;
                  return (
                    <div
                      key={ev.id}
                      onClick={() => onEventClick(ev)}
                      className="absolute left-1 right-1 top-1 z-10 cursor-pointer rounded-md px-1.5 py-0.5
                                 text-[10px] font-bold truncate hover:opacity-90 transition-opacity"
                      style={{ borderLeft: `3px solid ${cfg.border}`, backgroundColor: cfg.bg, color: cfg.text }}
                    >
                      {ev.title}
                    </div>
                  );
                })}

                {/* Timed events */}
                {dayEvts.filter(e => e.time).map(ev => {
                  const cfg       = TYPE_CFG[ev.type] || TYPE_CFG.meeting;
                  const startMin  = parseMinutes(ev.time);
                  const durMin    = ev.duration || 60;
                  const topPx     = ((startMin - START_HOUR * 60) / 60) * PX_PER_HOUR;
                  const heightPx  = Math.max((durMin / 60) * PX_PER_HOUR - 3, 24);

                  return (
                    <div
                      key={ev.id}
                      onClick={() => onEventClick(ev)}
                      className="absolute left-1 right-1 z-10 cursor-pointer rounded-lg px-2 py-1
                                 hover:brightness-95 transition-all overflow-hidden"
                      style={{
                        top: `${topPx}px`,
                        height: `${heightPx}px`,
                        backgroundColor: cfg.bg,
                        borderLeft: `3px solid ${cfg.border}`,
                      }}
                    >
                      <p className="text-[9px] font-semibold leading-none" style={{ color: cfg.border }}>
                        {ev.time}
                      </p>
                      <p className="text-[11px] font-bold leading-snug mt-0.5 truncate" style={{ color: cfg.text }}>
                        {ev.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Month View ──────────────────────────────────────────── */
function MonthView({ year, month, events, onEventClick, today }) {
  const daysInMonth   = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return events.filter(e => e.date === dateStr);
  };

  return (
    <div className="flex-1 bg-white rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="grid grid-cols-7 border-b border-border bg-background/40">
        {DAYS_SHORT.map(d => (
          <div key={d} className="py-2.5 text-center text-[11px] font-semibold text-muted uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`e-${i}`} className="h-28 border-b border-r border-border bg-background/20" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const dateStr  = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const dayEvts  = getEventsForDay(day);
          const isToday  = dateStr === today;
          const isWeekend = (firstDayIndex + day - 1) % 7 >= 5;
          return (
            <div key={day}
              className={`h-28 border-b border-r border-border p-1.5 transition-colors
                ${(firstDayIndex + day - 1) % 7 === 6 ? 'border-r-0' : ''}
                ${isWeekend ? 'bg-background/30' : 'hover:bg-background/50'}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1
                  ${isToday ? 'text-white' : isWeekend ? 'text-muted' : 'text-dark'}`}
                style={isToday ? { backgroundColor: '#003087' } : {}}
              >
                {day}
              </div>
              <div className="space-y-0.5 overflow-hidden">
                {dayEvts.slice(0, 3).map(ev => {
                  const cfg = TYPE_CFG[ev.type] || TYPE_CFG.meeting;
                  return (
                    <div
                      key={ev.id}
                      onClick={() => onEventClick(ev)}
                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md truncate cursor-pointer hover:opacity-90"
                      style={{ backgroundColor: cfg.bg, color: cfg.text, borderLeft: `2px solid ${cfg.border}` }}
                    >
                      {ev.time && `${ev.time} `}{ev.title}
                    </div>
                  );
                })}
                {dayEvts.length > 3 && (
                  <div className="text-[9px] text-muted px-1 font-medium">+{dayEvts.length - 3} ещё</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Upcoming Panel ──────────────────────────────────────── */
function UpcomingPanel({ events, today, onEventClick }) {
  const upcoming = [...events]
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
    .slice(0, 8);

  return (
    <div className="w-60 flex-shrink-0 bg-white rounded-2xl border border-border shadow-card flex flex-col overflow-hidden">
      <div className="px-4 py-3.5 border-b border-border">
        <p className="text-xs font-bold text-dark uppercase tracking-wide">Ближайшие события</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {upcoming.length === 0 && (
          <p className="text-xs text-muted text-center py-6">Нет событий</p>
        )}
        {upcoming.map(ev => {
          const cfg  = TYPE_CFG[ev.type] || TYPE_CFG.meeting;
          const [, mm, dd] = ev.date.split('-');
          return (
            <div
              key={ev.id}
              onClick={() => onEventClick(ev)}
              className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-background transition-colors cursor-pointer group"
            >
              <div className="w-1 h-full min-h-[32px] rounded-full flex-shrink-0 mt-0.5"
                style={{ backgroundColor: cfg.border }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-dark leading-snug truncate">{ev.title}</p>
                <p className="text-[10px] text-muted mt-0.5">
                  {dd}.{mm} {ev.time && `· ${ev.time}`}
                </p>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                style={{ backgroundColor: cfg.bg, color: cfg.text }}>
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Event Popup ─────────────────────────────────────────── */
function EventPopup({ event, onClose }) {
  const cfg = TYPE_CFG[event.type] || TYPE_CFG.meeting;
  const [, mm, dd] = event.date.split('-');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/30"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-card-hover border border-border p-5 w-80 animate-fade-in">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.border }} />
            <h4 className="font-bold text-dark text-sm leading-snug">{event.title}</h4>
          </div>
          <button onClick={onClose}
            className="w-6 h-6 rounded-lg hover:bg-background flex items-center justify-center text-muted flex-shrink-0">
            <X size={13} />
          </button>
        </div>
        <div className="space-y-2 text-xs text-secondary">
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-muted flex-shrink-0" />
            <span>{dd}.{mm}.2026{event.time ? ` · ${event.time}` : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: cfg.bg, color: cfg.text }}>
              {cfg.label}
            </span>
          </div>
          {event.person && (
            <div className="flex items-center gap-2">
              <Users size={12} className="text-muted flex-shrink-0" />
              <span className="font-medium text-dark">{event.person}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── New Meeting Modal ───────────────────────────────────── */
function NewMeetingModal({ onClose, onAdd }) {
  const [title,       setTitle]       = useState('');
  const [date,        setDate]        = useState('');
  const [timeStart,   setTimeStart]   = useState('10:00');
  const [timeEnd,     setTimeEnd]     = useState('11:00');
  const [teamSel,     setTeamSel]     = useState([]);
  const [extInput,    setExtInput]    = useState('');
  const [extList,     setExtList]     = useState([]);

  const toggleTeam = id =>
    setTeamSel(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const addExternal = () => {
    const v = extInput.trim();
    if (v && !extList.includes(v)) setExtList(prev => [...prev, v]);
    setExtInput('');
  };

  const handleCreate = () => {
    if (!title.trim() || !date) return;
    const [h] = timeStart.split(':').map(Number);
    const durMin = (() => {
      const [sh, sm] = timeStart.split(':').map(Number);
      const [eh, em] = timeEnd.split(':').map(Number);
      return Math.max((eh * 60 + em) - (sh * 60 + sm), 30);
    })();
    const participants = [
      ...teamMembers.filter(m => teamSel.includes(m.id)).map(m => m.name),
      ...extList,
    ].join(', ');
    onAdd({
      id: Date.now(), date, title: title.trim(),
      type: 'meeting', time: timeStart, duration: durMin,
      person: participants || null, color: '#3B6FE8',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/40"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-card-hover border border-border w-full max-w-md animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#EEF3FF' }}>
              <Calendar size={16} style={{ color: '#3B6FE8' }} />
            </div>
            <h3 className="font-bold text-dark">Запланировать встречу</h3>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-background flex items-center justify-center text-muted">
            <X size={14} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Theme */}
          <div>
            <label className="text-xs font-semibold text-secondary mb-1.5 block uppercase tracking-wide">
              Тема встречи
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Укажите тему встречи..."
              className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-xl
                         focus:border-accent/50 focus:outline-none transition-all"
            />
          </div>

          {/* Date + Time */}
          <div>
            <label className="text-xs font-semibold text-secondary mb-1.5 block uppercase tracking-wide">
              Дата и время
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="col-span-3 sm:col-span-1 px-3 py-2.5 text-sm bg-background border border-border
                           rounded-xl focus:border-accent/50 focus:outline-none transition-all" />
              <input type="time" value={timeStart} onChange={e => setTimeStart(e.target.value)}
                className="px-3 py-2.5 text-sm bg-background border border-border rounded-xl
                           focus:border-accent/50 focus:outline-none transition-all" />
              <input type="time" value={timeEnd} onChange={e => setTimeEnd(e.target.value)}
                className="px-3 py-2.5 text-sm bg-background border border-border rounded-xl
                           focus:border-accent/50 focus:outline-none transition-all" />
            </div>
            <p className="text-[10px] text-muted mt-1">Дата · Начало · Конец</p>
          </div>

          {/* Team members */}
          <div>
            <label className="text-xs font-semibold text-secondary mb-2 block uppercase tracking-wide flex items-center gap-1.5">
              <Users size={12} /> Участники из команды
            </label>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {teamMembers.map(m => (
                <button
                  key={m.id}
                  onClick={() => toggleTeam(m.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left
                    transition-all border text-sm
                    ${teamSel.includes(m.id)
                      ? 'border-accent/40 bg-accent-light/50'
                      : 'border-border hover:border-accent/20 hover:bg-background'}`}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center
                                  text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: m.avatarColor }}>
                    {m.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark text-xs truncate">{m.name}</p>
                    <p className="text-[10px] text-secondary truncate">{m.role}</p>
                  </div>
                  {teamSel.includes(m.id) && (
                    <Check size={14} className="text-accent flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* External participants */}
          <div>
            <label className="text-xs font-semibold text-secondary mb-1.5 block uppercase tracking-wide flex items-center gap-1.5">
              <UserPlus size={12} /> Внешние участники
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={extInput}
                onChange={e => setExtInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addExternal()}
                placeholder="Имя или email..."
                className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-xl
                           focus:border-accent/50 focus:outline-none transition-all"
              />
              <button
                onClick={addExternal}
                disabled={!extInput.trim()}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-white transition-colors
                           disabled:opacity-40"
                style={{ backgroundColor: '#003087' }}
              >
                <Plus size={14} />
              </button>
            </div>
            {extList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {extList.map((person, i) => (
                  <span key={i}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-background
                               border border-border text-xs font-medium text-dark">
                    {person}
                    <button onClick={() => setExtList(p => p.filter((_, j) => j !== i))}
                      className="text-muted hover:text-danger transition-colors ml-0.5">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-border">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-border
                       text-secondary hover:bg-background transition-colors">
            Отмена
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim() || !date}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors
                       disabled:opacity-40"
            style={{ backgroundColor: '#003087' }}
          >
            Создать встречу
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function ManagerCalendar() {
  const TODAY = '2026-06-03';

  const [events,       setEvents]       = useState(managerEvents);
  const [viewMode,     setViewMode]     = useState('week');
  const [weekStart,    setWeekStart]    = useState(() => getMonday(new Date(TODAY)));
  const [year,         setYear]         = useState(2026);
  const [month,        setMonth]        = useState(5);
  const [showModal,    setShowModal]    = useState(false);
  const [popupEvent,   setPopupEvent]   = useState(null);

  /* Navigation */
  const goPrev = () => {
    if (viewMode === 'week') {
      setWeekStart(d => addDays(d, -7));
    } else {
      if (month === 0) { setMonth(11); setYear(y => y - 1); }
      else setMonth(m => m - 1);
    }
  };
  const goNext = () => {
    if (viewMode === 'week') {
      setWeekStart(d => addDays(d, 7));
    } else {
      if (month === 11) { setMonth(0); setYear(y => y + 1); }
      else setMonth(m => m + 1);
    }
  };
  const goToday = () => {
    setWeekStart(getMonday(new Date(TODAY)));
    setMonth(5); setYear(2026);
  };

  /* Header label */
  const headerLabel = viewMode === 'week'
    ? (() => {
        const end = addDays(weekStart, 6);
        const sm = weekStart.getMonth(), em = end.getMonth();
        if (sm === em)
          return `${weekStart.getDate()}–${end.getDate()} ${MONTHS_GEN[sm]} ${weekStart.getFullYear()}`;
        return `${weekStart.getDate()} ${MONTHS_GEN[sm]} – ${end.getDate()} ${MONTHS_GEN[em]} ${weekStart.getFullYear()}`;
      })()
    : `${MONTHS_RU[month]} ${year}`;

  const addEvent = (ev) => setEvents(prev => [...prev, ev]);

  return (
    <div className="max-w-[1100px] mx-auto space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark">Календарь</h1>
          <p className="text-sm text-secondary mt-0.5">{headerLabel}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Prev / Today / Next */}
          <div className="flex items-center gap-1">
            <button onClick={goPrev}
              className="w-8 h-8 rounded-xl border border-border bg-white hover:bg-background
                         flex items-center justify-center text-secondary transition-colors">
              <ChevronLeft size={15} />
            </button>
            <button onClick={goToday}
              className="px-3 h-8 rounded-xl border border-border bg-white hover:bg-background
                         text-xs font-semibold text-secondary transition-colors">
              Сегодня
            </button>
            <button onClick={goNext}
              className="w-8 h-8 rounded-xl border border-border bg-white hover:bg-background
                         flex items-center justify-center text-secondary transition-colors">
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Week / Month toggle */}
          <div className="flex items-center gap-0.5 bg-white border border-border rounded-xl p-1">
            {['week', 'month'].map(m => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${viewMode === m ? 'text-white' : 'text-secondary hover:text-dark'}`}
                style={viewMode === m ? { backgroundColor: '#003087' } : {}}
              >
                {m === 'week' ? 'Неделя' : 'Месяц'}
              </button>
            ))}
          </div>

          {/* New meeting */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                       text-white transition-colors"
            style={{ backgroundColor: '#003087' }}
          >
            <Plus size={15} /> Запланировать встречу
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex gap-4 items-start">
        {viewMode === 'week' ? (
          <WeekView
            weekStart={weekStart}
            events={events}
            onEventClick={setPopupEvent}
            today={TODAY}
          />
        ) : (
          <MonthView
            year={year}
            month={month}
            events={events}
            onEventClick={setPopupEvent}
            today={TODAY}
          />
        )}

        {/* Always-visible upcoming panel */}
        <UpcomingPanel events={events} today={TODAY} onEventClick={setPopupEvent} />
      </div>

      {/* Modals */}
      {showModal && (
        <NewMeetingModal onClose={() => setShowModal(false)} onAdd={addEvent} />
      )}
      {popupEvent && (
        <EventPopup event={popupEvent} onClose={() => setPopupEvent(null)} />
      )}
    </div>
  );
}
