import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, X, Clock, Users,
  Calendar, UserPlus,
} from 'lucide-react';
import { calendarEvents } from '../data/calendarEvents';

const DAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS_RU  = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const MONTHS_GEN = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const PX_PER_HOUR = 66;
const START_HOUR = 8;
const END_HOUR = 19;
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

const TYPE_CFG = {
  meeting:   { bg: '#ECFDF5', border: '#10B981', text: '#059669', label: 'Встреча'  },
  learning:  { bg: '#F3EEFF', border: '#8B5CF6', text: '#7C3AED', label: 'Обучение' },
  review:    { bg: '#EEF3FF', border: '#3B6FE8', text: '#2952C8', label: 'Ревью'    },
  interview: { bg: '#FFEDD5', border: '#F97316', text: '#C05621', label: 'Интервью' },
  deadline:  { bg: '#FFF0F0', border: '#F87171', text: '#C0392B', label: 'Дедлайн'  },
  hr:        { bg: '#FCE7F3', border: '#EC4899', text: '#BE185D', label: 'HR'       },
  event:     { bg: '#EEF3FF', border: '#3B6FE8', text: '#2952C8', label: 'Событие'  },
};

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d; }
function fmtDate(d) { return d.toISOString().split('T')[0]; }
function fmtDay(d) { return d.getDate(); }
function fmtWeekday(d) { return DAYS_SHORT[d.getDay() === 0 ? 6 : d.getDay() - 1]; }
function parseMinutes(t) { if (!t) return null; const [h, m] = t.split(':').map(Number); return h * 60 + (m || 0); }
function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDayOfMonth(y, m) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }

function WeekView({ weekStart, events, onEventClick, today }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  return (
    <div className="flex-1 bg-white rounded-2xl border border-border shadow-card overflow-hidden flex flex-col">
      <div className="flex border-b border-border bg-background/40 flex-shrink-0">
        <div className="w-14 flex-shrink-0 relative">
          <span className="absolute right-2 bottom-0 translate-y-[50%] text-[10px] text-muted font-medium leading-none">{START_HOUR}:00</span>
        </div>
        {days.map((day, i) => {
          const isToday = fmtDate(day) === today;
          return (
            <div key={i} className="flex-1 text-center py-3 border-l border-border first:border-l-0">
              <p className="text-[11px] font-semibold text-muted uppercase tracking-wide">{fmtWeekday(day)}</p>
              <div className={`mx-auto mt-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isToday ? 'text-white' : 'text-dark'}`}
                style={isToday ? { backgroundColor: '#003087' } : {}}>{fmtDay(day)}</div>
            </div>
          );
        })}
      </div>
      <div className="overflow-y-auto flex-1" style={{ maxHeight: '560px' }}>
        <div className="flex">
          <div className="w-14 flex-shrink-0">
            {HOURS.map((h, idx) => (
              <div key={h} className="relative" style={{ height: PX_PER_HOUR }}>
                {idx > 0 && <span className="absolute right-2 top-0 -translate-y-1/2 text-[10px] text-muted font-medium leading-none">{h}:00</span>}
              </div>
            ))}
          </div>
          {days.map((day, di) => {
            const dateStr = fmtDate(day);
            const dayEvts = events.filter(e => e.date === dateStr);
            const isToday = dateStr === today;
            return (
              <div key={di} className={`flex-1 border-l border-border relative ${isToday ? 'bg-blue-50/30' : ''}`}>
                {HOURS.map((h, idx) => (
                  <div key={h} className={idx > 0 ? 'border-t border-border/60' : ''} style={{ height: PX_PER_HOUR }} />
                ))}
                {dayEvts.filter(e => !e.time).map(ev => {
                  const cfg = TYPE_CFG[ev.type] || TYPE_CFG.meeting;
                  return (
                    <div key={ev.id} onClick={() => onEventClick(ev)}
                      className="absolute left-1 right-1 top-1 z-10 cursor-pointer rounded-md px-1.5 py-0.5 text-[10px] font-bold truncate hover:opacity-90"
                      style={{ borderLeft: `3px solid ${cfg.border}`, backgroundColor: cfg.bg, color: cfg.text }}>
                      {ev.title}
                    </div>
                  );
                })}
                {dayEvts.filter(e => e.time).map(ev => {
                  const cfg = TYPE_CFG[ev.type] || TYPE_CFG.meeting;
                  const startMin = parseMinutes(ev.time);
                  const durMin = ev.duration || 60;
                  const topPx = ((startMin - START_HOUR * 60) / 60) * PX_PER_HOUR;
                  const heightPx = Math.max((durMin / 60) * PX_PER_HOUR - 3, 24);
                  return (
                    <div key={ev.id} onClick={() => onEventClick(ev)}
                      className="absolute left-1 right-1 z-10 cursor-pointer rounded-lg px-2 py-1 hover:brightness-95 transition-all overflow-hidden"
                      style={{ top: `${topPx}px`, height: `${heightPx}px`, backgroundColor: cfg.bg, borderLeft: `3px solid ${cfg.border}` }}>
                      <p className="text-[9px] font-semibold leading-none" style={{ color: cfg.border }}>{ev.time}</p>
                      <p className="text-[11px] font-bold leading-snug mt-0.5 truncate" style={{ color: cfg.text }}>{ev.title}</p>
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

function MonthView({ year, month, events, onEventClick, today }) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);
  const getDay = day => {
    const s = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === s);
  };
  return (
    <div className="flex-1 bg-white rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="grid grid-cols-7 border-b border-border bg-background/40">
        {DAYS_SHORT.map(d => <div key={d} className="py-2.5 text-center text-[11px] font-semibold text-muted uppercase tracking-wide">{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: firstDayIndex }).map((_, i) => <div key={`e-${i}`} className="h-28 border-b border-r border-border bg-background/20" />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayEvts = getDay(day);
          const isToday = dateStr === today;
          const isWeekend = (firstDayIndex + day - 1) % 7 >= 5;
          return (
            <div key={day} className={`h-28 border-b border-r border-border p-1.5 ${(firstDayIndex + day - 1) % 7 === 6 ? 'border-r-0' : ''} ${isWeekend ? 'bg-background/30' : 'hover:bg-background/50'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${isToday ? 'text-white' : isWeekend ? 'text-muted' : 'text-dark'}`}
                style={isToday ? { backgroundColor: '#003087' } : {}}>{day}</div>
              <div className="space-y-0.5 overflow-hidden">
                {dayEvts.slice(0, 3).map(ev => {
                  const cfg = TYPE_CFG[ev.type] || TYPE_CFG.meeting;
                  return (
                    <div key={ev.id} onClick={() => onEventClick(ev)}
                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md truncate cursor-pointer hover:opacity-90"
                      style={{ backgroundColor: cfg.bg, color: cfg.text, borderLeft: `2px solid ${cfg.border}` }}>
                      {ev.time && `${ev.time} `}{ev.title}
                    </div>
                  );
                })}
                {dayEvts.length > 3 && <div className="text-[9px] text-muted px-1">+{dayEvts.length - 3} ещё</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UpcomingPanel({ events, today, onEventClick }) {
  const upcoming = [...events].filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || '')).slice(0, 8);
  return (
    <div className="w-60 flex-shrink-0 bg-white rounded-2xl border border-border shadow-card flex flex-col overflow-hidden">
      <div className="px-4 py-3.5 border-b border-border">
        <p className="text-xs font-bold text-dark uppercase tracking-wide">Ближайшие события</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {upcoming.length === 0 && <p className="text-xs text-muted text-center py-6">Нет событий</p>}
        {upcoming.map(ev => {
          const cfg = TYPE_CFG[ev.type] || TYPE_CFG.meeting;
          const [, mm, dd] = ev.date.split('-');
          return (
            <div key={ev.id} onClick={() => onEventClick(ev)} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-background transition-colors cursor-pointer">
              <div className="w-1 min-h-[32px] rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: cfg.border }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-dark leading-snug truncate">{ev.title}</p>
                <p className="text-[10px] text-muted mt-0.5">{dd}.{mm}{ev.time && ` · ${ev.time}`}</p>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: cfg.bg, color: cfg.text }}>{cfg.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventPopup({ event, onClose }) {
  const cfg = TYPE_CFG[event.type] || TYPE_CFG.meeting;
  const [, mm, dd] = event.date.split('-');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/30" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-card-hover border border-border p-5 w-80 animate-fade-in">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.border }} />
            <h4 className="font-bold text-dark text-sm">{event.title}</h4>
          </div>
          <button onClick={onClose} className="w-6 h-6 rounded-lg hover:bg-background flex items-center justify-center text-muted"><X size={13} /></button>
        </div>
        <div className="space-y-2 text-xs text-secondary">
          <div className="flex items-center gap-2"><Calendar size={12} className="text-muted" /><span>{dd}.{mm}.2026{event.time ? ` · ${event.time}` : ''}</span></div>
          {event.duration > 0 && <div className="flex items-center gap-2"><Clock size={12} className="text-muted" /><span>{event.duration} мин</span></div>}
          {event.with && <div className="flex items-center gap-2"><Users size={12} className="text-muted" /><span className="font-medium text-dark">{event.with}</span></div>}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block" style={{ backgroundColor: cfg.bg, color: cfg.text }}>{cfg.label}</span>
        </div>
      </div>
    </div>
  );
}

function NewMeetingModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [timeStart, setTimeStart] = useState('10:00');
  const [timeEnd, setTimeEnd] = useState('11:00');
  const [participants, setParticipants] = useState('');

  const handleCreate = () => {
    if (!title.trim() || !date) return;
    const [sh, sm] = timeStart.split(':').map(Number);
    const [eh, em] = timeEnd.split(':').map(Number);
    const durMin = Math.max((eh * 60 + em) - (sh * 60 + sm), 30);
    onAdd({ id: Date.now(), date, title: title.trim(), type: 'meeting', time: timeStart, duration: durMin, with: participants || null });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/40" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-card-hover border border-border w-full max-w-md animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EEF3FF' }}>
              <Calendar size={16} style={{ color: '#3B6FE8' }} />
            </div>
            <h3 className="font-bold text-dark">Запланировать встречу</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-background flex items-center justify-center text-muted"><X size={14} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-secondary mb-1.5 block uppercase tracking-wide">Тема встречи</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Укажите тему встречи..."
              className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-xl focus:border-accent/50 focus:outline-none transition-all" />
          </div>
          <div>
            <label className="text-xs font-semibold text-secondary mb-1.5 block uppercase tracking-wide">Дата и время</label>
            <div className="grid grid-cols-3 gap-2">
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="col-span-3 sm:col-span-1 px-3 py-2.5 text-sm bg-background border border-border rounded-xl focus:border-accent/50 focus:outline-none" />
              <input type="time" value={timeStart} onChange={e => setTimeStart(e.target.value)}
                className="px-3 py-2.5 text-sm bg-background border border-border rounded-xl focus:border-accent/50 focus:outline-none" />
              <input type="time" value={timeEnd} onChange={e => setTimeEnd(e.target.value)}
                className="px-3 py-2.5 text-sm bg-background border border-border rounded-xl focus:border-accent/50 focus:outline-none" />
            </div>
            <p className="text-[10px] text-muted mt-1">Дата · Начало · Конец</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-secondary mb-1.5 block uppercase tracking-wide flex items-center gap-1.5">
              <UserPlus size={12} /> Участники
            </label>
            <input type="text" value={participants} onChange={e => setParticipants(e.target.value)} placeholder="Имя или email..."
              className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-xl focus:border-accent/50 focus:outline-none transition-all" />
          </div>
        </div>
        <div className="flex gap-2 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-border text-secondary hover:bg-background transition-colors">Отмена</button>
          <button onClick={handleCreate} disabled={!title.trim() || !date}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ backgroundColor: '#003087' }}>
            Создать встречу
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const TODAY = '2026-06-03';
  const [events, setEvents] = useState(calendarEvents);
  const [viewMode, setViewMode] = useState('week');
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date(TODAY)));
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [popupEvent, setPopupEvent] = useState(null);

  const goPrev = () => { if (viewMode === 'week') setWeekStart(d => addDays(d, -7)); else { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); } };
  const goNext = () => { if (viewMode === 'week') setWeekStart(d => addDays(d, 7)); else { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); } };
  const goToday = () => { setWeekStart(getMonday(new Date(TODAY))); setMonth(5); setYear(2026); };

  const headerLabel = viewMode === 'week'
    ? (() => {
        const end = addDays(weekStart, 6);
        const sm = weekStart.getMonth(), em = end.getMonth();
        return sm === em
          ? `${weekStart.getDate()}–${end.getDate()} ${MONTHS_GEN[sm]} ${weekStart.getFullYear()}`
          : `${weekStart.getDate()} ${MONTHS_GEN[sm]} – ${end.getDate()} ${MONTHS_GEN[em]} ${weekStart.getFullYear()}`;
      })()
    : `${MONTHS_RU[month]} ${year}`;

  return (
    <div className="max-w-[1100px] mx-auto space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark">Календарь</h1>
          <p className="text-sm text-secondary mt-0.5">{headerLabel}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <button onClick={goPrev} className="w-8 h-8 rounded-xl border border-border bg-white hover:bg-background flex items-center justify-center text-secondary transition-colors"><ChevronLeft size={15} /></button>
            <button onClick={goToday} className="px-3 h-8 rounded-xl border border-border bg-white hover:bg-background text-xs font-semibold text-secondary transition-colors">Сегодня</button>
            <button onClick={goNext} className="w-8 h-8 rounded-xl border border-border bg-white hover:bg-background flex items-center justify-center text-secondary transition-colors"><ChevronRight size={15} /></button>
          </div>
          <div className="flex items-center gap-0.5 bg-white border border-border rounded-xl p-1">
            {['week', 'month'].map(m => (
              <button key={m} onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === m ? 'text-white' : 'text-secondary hover:text-dark'}`}
                style={viewMode === m ? { backgroundColor: '#003087' } : {}}>
                {m === 'week' ? 'Неделя' : 'Месяц'}
              </button>
            ))}
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: '#003087' }}>
            <Plus size={15} /> Запланировать встречу
          </button>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        {viewMode === 'week'
          ? <WeekView weekStart={weekStart} events={events} onEventClick={setPopupEvent} today={TODAY} />
          : <MonthView year={year} month={month} events={events} onEventClick={setPopupEvent} today={TODAY} />}
        <UpcomingPanel events={events} today={TODAY} onEventClick={setPopupEvent} />
      </div>

      {showModal && <NewMeetingModal onClose={() => setShowModal(false)} onAdd={ev => setEvents(p => [...p, ev])} />}
      {popupEvent && <EventPopup event={popupEvent} onClose={() => setPopupEvent(null)} />}
    </div>
  );
}
