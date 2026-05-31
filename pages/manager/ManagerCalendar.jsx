import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { managerEvents } from '../../data/managerData';

const DAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS_RU = ['Январь','Февраль','Март','Апрель','Май','Июнь',
                   'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  let d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday-based
}

const TYPE_LABELS = {
  one_on_one: '1:1',
  review:     'Ревью',
  idp:        'ИПР',
  deadline:   'Дедлайн',
  interview:  'Интервью',
  team:       'Команда',
};

export default function ManagerCalendar() {
  const [year,  setYear]  = useState(2026);
  const [month, setMonth] = useState(5); // June
  const [events, setEvents]     = useState(managerEvents);
  const [showNew, setShowNew]   = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate,  setNewDate]  = useState('');
  const [newTime,  setNewTime]  = useState('10:00');
  const [selected, setSelected] = useState(null);

  const daysInMonth   = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  const goLeft  = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const goRight = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const addEvent = () => {
    if (!newTitle.trim() || !newDate) return;
    setEvents(prev => [...prev, {
      id: Date.now(), date: newDate, title: newTitle.trim(),
      type: 'one_on_one', time: newTime, person: null, color: '#003366',
    }]);
    setNewTitle(''); setNewDate(''); setShowNew(false);
  };

  return (
    <div className="max-w-[860px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-dark">Календарь</h1>
          <p className="text-sm text-secondary mt-0.5">{MONTHS_RU[month]} {year}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={goLeft}  className="w-8 h-8 rounded-xl border border-border bg-white hover:bg-background flex items-center justify-center text-secondary transition-colors"><ChevronLeft size={15} /></button>
          <button onClick={goRight} className="w-8 h-8 rounded-xl border border-border bg-white hover:bg-background flex items-center justify-center text-secondary transition-colors"><ChevronRight size={15} /></button>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors ml-2"
            style={{ backgroundColor: '#003366' }}
          >
            <Plus size={15} /> Запланировать 1:1
          </button>
        </div>
      </div>

      {/* New event modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/40">
          <div className="bg-white rounded-2xl shadow-card-hover border border-border p-6 w-full max-w-sm animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-dark">Запланировать 1:1</h3>
              <button onClick={() => setShowNew(false)} className="w-7 h-7 rounded-lg hover:bg-background flex items-center justify-center text-muted">
                <X size={14} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-secondary mb-1 block">Название</label>
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  placeholder="1:1 с сотрудником..."
                  className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-xl focus:border-accent/50 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-secondary mb-1 block">Дата</label>
                  <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-xl focus:border-accent/50 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary mb-1 block">Время</label>
                  <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-xl focus:border-accent/50 transition-all" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowNew(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-border text-secondary hover:bg-background transition-colors">Отмена</button>
              <button onClick={addEvent} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors" style={{ backgroundColor: '#003366' }}>Создать</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 items-start">
        {/* Calendar grid */}
        <div className="flex-1 bg-white rounded-2xl border border-border shadow-card overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {DAYS_RU.map(d => (
              <div key={d} className="py-2.5 text-center text-xs font-semibold text-secondary">{d}</div>
            ))}
          </div>
          {/* Day cells */}
          <div className="grid grid-cols-7">
            {/* Empty leading cells */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`e-${i}`} className="h-24 border-b border-r border-border bg-background/30" />
            ))}
            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const dayEvents = getEventsForDay(day);
              const isToday   = year === 2026 && month === 5 && day === 3;
              return (
                <div
                  key={day}
                  className={`h-24 border-b border-r border-border p-1.5 cursor-pointer hover:bg-background/50 transition-colors
                    ${(firstDayIndex + day - 1) % 7 === 6 ? 'border-r-0' : ''}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1
                    ${isToday ? 'text-white' : 'text-dark'}`}
                    style={isToday ? { backgroundColor: '#003366' } : {}}
                  >
                    {day}
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map(ev => (
                      <div
                        key={ev.id}
                        onClick={() => setSelected(ev)}
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md text-white truncate cursor-pointer hover:opacity-90"
                        style={{ backgroundColor: ev.color }}
                      >
                        {ev.time && `${ev.time} `}{ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] text-muted px-1">+{dayEvents.length - 2}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event detail */}
        {selected ? (
          <div className="w-64 flex-shrink-0 bg-white rounded-2xl border border-border shadow-card p-4 animate-fade-in">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-bold text-dark text-sm leading-snug">{selected.title}</h4>
              <button onClick={() => setSelected(null)} className="w-6 h-6 rounded-lg hover:bg-background flex items-center justify-center text-muted">
                <X size={12} />
              </button>
            </div>
            <div
              className="w-full h-1 rounded-full mb-3"
              style={{ backgroundColor: selected.color }}
            />
            <div className="space-y-2 text-xs text-secondary">
              <p><span className="font-semibold text-dark">Дата:</span> {selected.date}</p>
              {selected.time && <p><span className="font-semibold text-dark">Время:</span> {selected.time}</p>}
              <p><span className="font-semibold text-dark">Тип:</span> {TYPE_LABELS[selected.type] || selected.type}</p>
              {selected.person && <p><span className="font-semibold text-dark">Участник:</span> {selected.person}</p>}
            </div>
          </div>
        ) : (
          /* Upcoming events list */
          <div className="w-64 flex-shrink-0 bg-white rounded-2xl border border-border shadow-card p-4">
            <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-3">Ближайшие</p>
            <div className="space-y-2">
              {[...managerEvents]
                .filter(e => e.date >= `${year}-${String(month + 1).padStart(2,'0')}-03`)
                .sort((a, b) => a.date.localeCompare(b.date))
                .slice(0, 6)
                .map(ev => (
                  <div
                    key={ev.id}
                    className="flex items-start gap-2 cursor-pointer hover:bg-background p-1.5 rounded-lg transition-colors"
                    onClick={() => setSelected(ev)}
                  >
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: ev.color }} />
                    <div>
                      <p className="text-xs font-semibold text-dark leading-snug">{ev.title}</p>
                      <p className="text-[10px] text-muted">{ev.date.replace('2026-', '').replace('-', '.')} {ev.time}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
