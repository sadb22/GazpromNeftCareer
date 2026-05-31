import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Users, Video, Calendar as CalIcon } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { calendarEvents } from '../data/calendarEvents';

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const WEEK_START = new Date('2026-06-01');
const weekDates = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(WEEK_START);
  d.setDate(WEEK_START.getDate() + i);
  return d;
});

const typeColors = {
  meeting: { bg: '#D1FAE5', color: '#059669', label: 'Встреча' },
  learning: { bg: '#EDE9FE', color: '#7C3AED', label: 'Обучение' },
  review: { bg: '#E8F0FA', color: '#0284C7', label: 'Ревью' },
  interview: { bg: '#FFEDD5', color: '#EA580C', label: 'Интервью' },
  deadline: { bg: '#FEF3C7', color: '#D97706', label: 'Дедлайн' },
  hr: { bg: '#FCE7F3', color: '#BE185D', label: 'HR' },
  event: { bg: '#E8F0FA', color: '#005DB9', label: 'Событие' },
};

function getEventsForDate(date) {
  const dateStr = date.toISOString().split('T')[0];
  return calendarEvents.filter(e => e.date === dateStr);
}

function getHourPosition(time) {
  if (!time) return null;
  const [h, m] = time.split(':').map(Number);
  return (h - 9) * 60 + m;
}

export default function Calendar() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const today = '2026-06-03';

  const upcoming = calendarEvents
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <div className="flex h-[calc(100vh-56px)] bg-background">
      {/* Left sidebar */}
      <div className="w-64 bg-white border-r border-border flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <ChevronLeft size={16} className="text-secondary cursor-pointer hover:text-dark" />
            <h3 className="text-sm font-bold text-dark flex-1 text-center">Июнь 2026</h3>
            <ChevronRight size={16} className="text-secondary cursor-pointer hover:text-dark" />
          </div>
          {/* Mini calendar */}
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {DAYS.map(d => (
              <div key={d} className="text-[10px] font-semibold text-muted py-1">{d}</div>
            ))}
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const dateStr = `2026-06-${String(day).padStart(2, '0')}`;
              const hasEvents = calendarEvents.some(e => e.date === dateStr);
              const isToday = dateStr === today;
              return (
                <div
                  key={i}
                  className={`text-xs py-1 rounded-lg cursor-pointer relative
                    ${isToday ? 'bg-accent text-white font-bold' : 'hover:bg-background text-secondary'}`}
                >
                  {day}
                  {hasEvents && !isToday && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h4 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-3">Ближайшие</h4>
          <div className="space-y-2">
            {upcoming.map(event => {
              const tc = typeColors[event.type] || typeColors.event;
              return (
                <div
                  key={event.id}
                  className="p-2.5 rounded-xl cursor-pointer hover:bg-background transition-colors"
                  style={{ borderLeft: `3px solid ${event.color}` }}
                  onClick={() => setSelectedEvent(event)}
                >
                  <p className="text-xs font-semibold text-dark leading-snug">{event.title}</p>
                  <p className="text-[10px] text-secondary mt-0.5">
                    {event.date.split('-').reverse().slice(0, 2).join('.')} {event.time && `· ${event.time}`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Calendar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header row */}
        <div className="bg-white border-b border-border sticky top-0 z-10">
          <div className="flex items-center px-4 py-3 gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-semibold">
              <CalIcon size={13} /> Неделя
            </button>
            <div className="flex items-center gap-1 ml-2">
              <button className="p-1.5 rounded-lg hover:bg-background transition-colors">
                <ChevronLeft size={15} className="text-secondary" />
              </button>
              <span className="text-sm font-semibold text-dark px-2">1–7 июня 2026</span>
              <button className="p-1.5 rounded-lg hover:bg-background transition-colors">
                <ChevronRight size={15} className="text-secondary" />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid border-t border-border" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
            <div className="p-2" />
            {weekDates.map((date, i) => {
              const dateStr = date.toISOString().split('T')[0];
              const isToday = dateStr === today;
              return (
                <div key={i} className={`p-2 text-center border-l border-border ${isToday ? 'bg-accent-light/40' : ''}`}>
                  <p className="text-xs text-secondary">{DAYS[i]}</p>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto mt-0.5 text-sm font-bold
                    ${isToday ? 'bg-accent text-white' : 'text-dark'}`}>
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid relative" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
            {HOURS.map((hour, hi) => (
              <React.Fragment key={hour}>
                <div className="p-2 text-right text-[10px] text-muted border-b border-border h-16 flex items-start justify-end pt-1.5">
                  {hour}
                </div>
                {weekDates.map((date, di) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const isToday = dateStr === today;
                  const eventsHere = calendarEvents.filter(e => {
                    if (e.date !== dateStr || !e.time) return false;
                    const [h] = e.time.split(':').map(Number);
                    return h === 9 + hi;
                  });
                  return (
                    <div
                      key={di}
                      className={`border-l border-b border-border h-16 p-0.5 relative ${isToday ? 'bg-accent-light/10' : ''}`}
                    >
                      {eventsHere.map(event => (
                        <div
                          key={event.id}
                          className="w-full rounded-lg px-2 py-1 cursor-pointer hover:opacity-90 transition-opacity text-white text-[10px] font-semibold leading-tight overflow-hidden"
                          style={{ backgroundColor: event.color, minHeight: '28px' }}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <p className="truncate">{event.title}</p>
                          {event.time && <p className="opacity-80">{event.time}</p>}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Event Detail Popup */}
      {selectedEvent && (
        <div className="w-64 bg-white border-l border-border p-4 flex-shrink-0">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-bold text-dark leading-snug flex-1">{selectedEvent.title}</h3>
            <button onClick={() => setSelectedEvent(null)} className="text-muted hover:text-dark text-lg leading-none">×</button>
          </div>
          <div
            className="w-full h-1.5 rounded-full mb-4"
            style={{ backgroundColor: selectedEvent.color }}
          />
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-secondary">
              <CalIcon size={14} className="flex-shrink-0" />
              <span>{selectedEvent.date.split('-').reverse().join('.')} {selectedEvent.time && `· ${selectedEvent.time}`}</span>
            </div>
            {selectedEvent.duration > 0 && (
              <div className="flex items-center gap-2 text-secondary">
                <Clock size={14} className="flex-shrink-0" />
                <span>{selectedEvent.duration} мин</span>
              </div>
            )}
            {selectedEvent.with && (
              <div className="flex items-center gap-2 text-secondary">
                <Users size={14} className="flex-shrink-0" />
                <span>{selectedEvent.with}</span>
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-dark transition-colors">
              Принять
            </button>
            <button className="flex-1 py-2 rounded-xl bg-background border border-border text-secondary text-xs font-semibold hover:text-dark transition-colors">
              Отказать
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
