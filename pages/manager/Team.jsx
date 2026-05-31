import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ChevronRight, CheckCircle, Clock, AlertTriangle,
  X, ExternalLink, BookOpen, TrendingUp, Users, FileCheck,
} from 'lucide-react';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { teamMembers, idpStatusConfig } from '../../data/managerData';

const PRIMARY = '#003366';
const SUCCESS = '#1D9E75';

/* ── Gap colour logic ────────────────────────────────────── */
function gapColor(pct) {
  if (pct >= 80) return SUCCESS;
  if (pct >= 50) return '#B45309';
  return '#C0392B';
}
function gapVariant(pct) {
  if (pct >= 80) return 'success';
  if (pct >= 50) return 'warning';
  return 'danger';
}

/* ── Course status icon ──────────────────────────────────── */
function CourseIcon({ status }) {
  if (status === 'completed')   return <CheckCircle size={13} className="text-success flex-shrink-0" />;
  if (status === 'in_progress') return <Clock size={13} className="text-accent flex-shrink-0" />;
  return <div className="w-3 h-3 rounded-full border-2 border-muted flex-shrink-0" />;
}

/* ── KPI cards ───────────────────────────────────────────── */
const kpis = [
  {
    label: 'Всего сотрудников',
    value: teamMembers.length,
    icon: <Users size={18} />,
    bg: '#EEF2F8',
    color: PRIMARY,
  },
  {
    label: 'Активные ИПР',
    value: teamMembers.filter(m => m.idpStatus === 'in_progress').length,
    icon: <TrendingUp size={18} />,
    bg: '#E8F0FA',
    color: '#005DB9',
  },
  {
    label: 'Готовы к переходу',
    value: teamMembers.filter(m => m.idpStatus === 'ready').length,
    icon: <CheckCircle size={18} />,
    bg: '#D1F5EB',
    color: SUCCESS,
  },
  {
    label: 'Ожидают утверждения ИПР',
    value: teamMembers.filter(m => m.idpStatus === 'pending_approval').length,
    icon: <FileCheck size={18} />,
    bg: '#FEF3C7',
    color: '#B45309',
    isAction: true,
  },
];

/* ── Component ───────────────────────────────────────────── */
export default function Team() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [search,   setSearch]   = useState('');
  const [approved, setApproved] = useState([]);

  const filtered = teamMembers.filter(m =>
    search === '' ||
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = (id) => setApproved(prev => [...prev, id]);
  const isApproved    = (id) => approved.includes(id);

  return (
    <div className="max-w-[1200px] mx-auto space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-dark">Команда</h1>
        <p className="text-sm text-secondary mt-0.5">
          Цифровые технологии · {teamMembers.length} сотрудников
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl border p-4 shadow-card flex items-start gap-3
              ${k.isAction ? 'border-warning/40' : 'border-border'}`}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: k.bg, color: k.color }}
            >
              {k.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{k.value}</p>
              <p className="text-xs text-secondary mt-0.5 leading-snug">{k.label}</p>
              {k.isAction && k.value > 0 && (
                <p className="text-[10px] font-semibold mt-1" style={{ color: '#B45309' }}>
                  Требует действия ↗
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* List + Detail panel */}
      <div className="flex gap-4 items-start">

        {/* Team list */}
        <div className={`flex-1 min-w-0 transition-all ${selected ? 'max-w-[55%]' : 'max-w-full'}`}>
          <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Поиск сотрудников..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm bg-background border border-border rounded-xl text-dark placeholder-muted focus:border-accent/50 transition-all"
                />
              </div>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr] gap-3 px-4 py-2.5 text-[11px] font-semibold text-muted uppercase tracking-wide border-b border-border">
              <span>Сотрудник</span>
              <span>Роль → Цель</span>
              <span>Прогресс ИПР</span>
              <span>Статус</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {filtered.map(member => {
                const cfg     = idpStatusConfig[member.idpStatus];
                const isActive = selected?.id === member.id;
                return (
                  <button
                    key={member.id}
                    onClick={() => setSelected(isActive ? null : member)}
                    className={`w-full grid grid-cols-[2fr_2fr_1.5fr_1fr] gap-3 px-4 py-3.5 text-left transition-all hover:bg-background
                      ${isActive ? 'bg-[#EEF2F8]' : ''}`}
                  >
                    {/* Avatar + name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: member.avatarColor }}
                      >
                        {member.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-dark truncate">{member.name}</p>
                        <p className="text-xs text-secondary truncate">{member.level}</p>
                      </div>
                    </div>

                    {/* Role transition */}
                    <div className="flex items-center min-w-0">
                      <div className="min-w-0">
                        <p className="text-xs text-secondary truncate">{member.role}</p>
                        {member.idpStatus !== 'no_idp' && (
                          <p className="text-xs font-semibold text-dark truncate flex items-center gap-1 mt-0.5">
                            <span className="text-muted">→</span> {member.targetRole}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center">
                      {member.idpStatus === 'no_idp' ? (
                        <span className="text-xs text-muted">—</span>
                      ) : (
                        <div className="w-full">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-secondary">{member.idpProgress}%</span>
                          </div>
                          <ProgressBar
                            value={member.idpProgress}
                            color={member.idpProgress >= 80 ? SUCCESS : 'accent'}
                            height={5}
                          />
                        </div>
                      )}
                    </div>

                    {/* Status badge */}
                    <div className="flex items-center">
                      <span
                        className="text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <DetailPanel
            member={selected}
            onClose={() => setSelected(null)}
            onApprove={handleApprove}
            approved={isApproved(selected.id)}
            onFullProfile={() => {
              navigate('/profile');
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ── Detail Panel ────────────────────────────────────────── */
function DetailPanel({ member, onClose, onApprove, approved, onFullProfile }) {
  const cfg = idpStatusConfig[member.idpStatus];

  return (
    <div className="w-[380px] flex-shrink-0 bg-white rounded-2xl border border-border shadow-card overflow-hidden animate-fade-in sticky top-6">

      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base flex-shrink-0"
              style={{ backgroundColor: member.avatarColor }}
            >
              {member.initials}
            </div>
            <div>
              <h3 className="font-bold text-dark text-base leading-tight">{member.name}</h3>
              <p className="text-xs text-secondary mt-0.5">{member.role}</p>
              {member.idpStatus !== 'no_idp' && (
                <div className="flex items-center gap-1 mt-1 text-xs">
                  <span className="text-muted">→</span>
                  <span className="font-semibold text-dark">{member.targetRole}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:bg-background hover:text-dark transition-colors flex-shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Status + IDP progress */}
        <div className="mt-3 flex items-center gap-3">
          <span
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: cfg.bg, color: cfg.color }}
          >
            {cfg.label}
          </span>
          {member.idpStatus !== 'no_idp' && (
            <div className="flex-1">
              <ProgressBar
                value={member.idpProgress}
                color={member.idpProgress >= 80 ? SUCCESS : 'accent'}
                height={5}
              />
            </div>
          )}
          {member.idpStatus !== 'no_idp' && (
            <span className="text-xs font-bold text-dark flex-shrink-0">{member.idpProgress}%</span>
          )}
        </div>

        {/* Notes */}
        {member.notes && (
          <div className="mt-3 p-2.5 rounded-xl bg-background border border-border">
            <p className="text-xs text-secondary leading-relaxed">{member.notes}</p>
          </div>
        )}
      </div>

      {/* Scores */}
      <div className="px-5 py-4 border-b border-border">
        <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-3">Показатели</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '360°', value: member.score360, color: '#005DB9' },
            { label: 'KPI',  value: member.kpiScore, color: SUCCESS },
            { label: 'Вовл.', value: member.engagementScore, color: '#6D4FA0' },
          ].map(s => (
            <div key={s.label} className="text-center p-2.5 rounded-xl bg-background border border-border">
              <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}%</p>
              <p className="text-[10px] text-secondary mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gap Analysis */}
      <div className="px-5 py-4 border-b border-border">
        <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-3">
          Анализ компетенций
        </p>
        <div className="space-y-3">
          {member.gaps.map((gap, i) => {
            const pct = Math.round((gap.current / gap.required) * 100);
            const capped = Math.min(pct, 100);
            return (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-medium text-dark">{gap.skill}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-secondary">{gap.current}/{gap.required}</span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${gapColor(pct)}20`, color: gapColor(pct) }}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${capped}%`, backgroundColor: gapColor(pct) }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* IDP Courses */}
      <div className="px-5 py-4 border-b border-border">
        <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-3">
          Курсы ИПР
        </p>
        <div className="space-y-2">
          {member.courses.map((c, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <CourseIcon status={c.status} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-dark leading-snug truncate">{c.title}</p>
                {c.status === 'in_progress' && (
                  <div className="mt-1">
                    <ProgressBar value={c.progress} color="accent" height={3} />
                  </div>
                )}
                {c.status === 'completed' && (
                  <p className="text-[10px] text-success font-medium mt-0.5">Завершён</p>
                )}
                {c.status === 'not_started' && (
                  <p className="text-[10px] text-muted mt-0.5">Не начат</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-4 space-y-2">
        {member.idpStatus === 'pending_approval' && !approved && (
          <button
            onClick={() => onApprove(member.id)}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
            style={{ backgroundColor: SUCCESS }}
          >
            <CheckCircle size={15} /> Утвердить ИПР
          </button>
        )}
        {(member.idpStatus === 'pending_approval' && approved) && (
          <div className="w-full py-2.5 rounded-xl text-sm font-semibold text-success bg-success-light flex items-center justify-center gap-2">
            <CheckCircle size={15} /> ИПР утверждён
          </div>
        )}

        <button
          onClick={onFullProfile}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-dark border border-border hover:bg-background transition-colors flex items-center justify-center gap-2"
        >
          <ExternalLink size={14} /> Полный профиль
        </button>
      </div>
    </div>
  );
}
