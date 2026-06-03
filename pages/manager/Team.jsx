import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, CheckCircle, Clock,
  X, ExternalLink, TrendingUp, Users, FileCheck,
  LayoutGrid, List, Mail, MessageSquare, MoreVertical,
} from 'lucide-react';
import ProgressBar from '../../components/ui/ProgressBar';
import { teamMembers, idpStatusConfig } from '../../data/managerData';

const PRIMARY = '#003366';
const SUCCESS = '#1D9E75';

/* ── Helpers ─────────────────────────────────────────────── */
function gapColor(pct) {
  if (pct >= 80) return SUCCESS;
  if (pct >= 50) return '#B45309';
  return '#C0392B';
}
function CourseIcon({ status }) {
  if (status === 'completed')   return <CheckCircle size={13} className="text-success flex-shrink-0" />;
  if (status === 'in_progress') return <Clock size={13} className="text-accent flex-shrink-0" />;
  return <div className="w-3 h-3 rounded-full border-2 border-muted flex-shrink-0" />;
}

/* ── Segmented arc gauge (like reference) ───────────────────── */
function SegmentGauge({ value = 85 }) {
  const N = 15;
  const W = 200;
  const H = 110;
  const cx = W / 2;
  const cy = 86;            // arc centre raised so arc fills viewBox from top
  const r  = W * 0.375;    // 75
  const filledCount = Math.round((value / 100) * N);
  const segW = W * 0.091;
  const segH = (r * Math.PI / N) * 0.74;
  const toRad = d => (d * Math.PI) / 180;

  const blueScale = [
    '#001F5C','#002D80','#003A99','#0A4FBD','#1A62CC',
    '#2E75D8','#4488E4','#5A9AEE','#72ACF6','#8ABCF8',
    '#A2CCFA','#B8D9FC','#CCE6FE','#DBEEFF','#E8F4FF',
  ];

  return (
    <div className="w-full max-w-[175px] mx-auto">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        {Array.from({ length: N }, (_, i) => {
          const angleDeg = 180 - (i + 0.5) * (180 / N);
          const rad = toRad(angleDeg);
          const x = cx + r * Math.cos(rad);
          const y = cy - r * Math.sin(rad);
          const rotDeg = -angleDeg + 90;
          return (
            <rect key={i}
              x={x - segW / 2} y={y - segH / 2}
              width={segW} height={segH}
              rx={segH / 2} ry={segH / 2}
              fill={i < filledCount ? blueScale[i] : '#DDE8F6'}
              transform={`rotate(${rotDeg}, ${x}, ${y})`}
            />
          );
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#1A2533"
          style={{ fontSize: 33, fontWeight: 800, fontFamily: '-apple-system,sans-serif' }}>
          {value}%
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#5B6B7D"
          style={{ fontSize: 11, fontFamily: '-apple-system,sans-serif' }}>
          Средний KPI
        </text>
      </svg>
    </div>
  );
}

/* ── Derived stats ─────────────────────────────────────────── */
const avgKpi      = Math.round(teamMembers.reduce((s, m) => s + m.kpiScore, 0) / teamMembers.length);
const pendingCount = teamMembers.filter(m => m.idpStatus === 'pending_approval').length;

/* ── Main component ────────────────────────────────────────── */
export default function Team() {
  const navigate = useNavigate();
  const [selected,  setSelected]  = useState(null);
  const [search,    setSearch]    = useState('');
  const [viewMode,  setViewMode]  = useState('list');   // 'list' | 'grid'
  const [approved,  setApproved]  = useState([]);

  const filtered = teamMembers.filter(m =>
    search === '' ||
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = id => setApproved(prev => [...prev, id]);
  const isApproved    = id => approved.includes(id);
  const goToChat      = () => navigate('/manager/messages');

  return (
    <div className="max-w-[1200px] mx-auto space-y-5">

      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold text-dark">Команда</h1>
        <p className="text-sm text-secondary mt-0.5">
          Цифровые технологии · {teamMembers.length} сотрудников
        </p>
      </div>

      {/* ── Top statistics row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

        {/* 1. Total employees */}
        <div className="bg-white rounded-2xl border border-border px-4 py-3.5 shadow-card flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#EEF2F8', color: PRIMARY }}>
            <Users size={18} />
          </div>
          <div>
            <p className="text-2xl font-bold text-dark leading-tight">{teamMembers.length}</p>
            <p className="text-xs text-secondary mt-0.5">Всего сотрудников</p>
          </div>
        </div>

        {/* 2. Team KPI gauge */}
        <div className="bg-white rounded-2xl border border-border shadow-card px-4 pt-3.5 pb-3 flex flex-col">
          <p className="text-xs font-semibold text-secondary mb-1">KPI команды</p>
          <SegmentGauge value={avgKpi} />
        </div>

        {/* 3. Pending IDP approval */}
        <div className={`bg-white rounded-2xl border px-4 py-3.5 shadow-card flex items-center gap-3
          ${pendingCount > 0 ? 'border-warning/40' : 'border-border'}`}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
            <FileCheck size={18} />
          </div>
          <div>
            <p className="text-2xl font-bold text-dark leading-tight">{pendingCount}</p>
            <p className="text-xs text-secondary mt-0.5">Ожидают утверждения ИПР</p>
            {pendingCount > 0 && (
              <p className="text-[11px] font-semibold mt-1" style={{ color: '#B45309' }}>
                Требует действия ↗
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Search + view toggle ── */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Поиск сотрудников..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2.5 text-sm bg-white border border-border rounded-xl
                       text-dark placeholder-muted focus:border-accent/50 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1 bg-white border border-border rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setViewMode('list')}
            title="Список"
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-accent text-white' : 'text-muted hover:text-dark'}`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            title="Карточки"
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-accent text-white' : 'text-muted hover:text-dark'}`}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* ── LIST VIEW ── */}
      {viewMode === 'list' && (
        <div className="flex gap-4 items-start">
          <div className={`flex-1 min-w-0 transition-all ${selected ? 'max-w-[55%]' : 'max-w-full'}`}>
            <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr] gap-3 px-4 py-2.5
                              text-[11px] font-semibold text-muted uppercase tracking-wide border-b border-border">
                <span>Сотрудник</span>
                <span>Роль → Цель</span>
                <span>Прогресс KPI</span>
                <span>Статус</span>
              </div>
              <div className="divide-y divide-border">
                {filtered.map(member => {
                  const cfg      = idpStatusConfig[member.idpStatus];
                  const isActive = selected?.id === member.id;
                  return (
                    <button
                      key={member.id}
                      onClick={() => setSelected(isActive ? null : member)}
                      className={`w-full grid grid-cols-[2fr_2fr_1.5fr_1fr] gap-3 px-4 py-3.5
                                  text-left transition-all hover:bg-background
                                  ${isActive ? 'bg-[#EEF2F8]' : ''}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center
                                        text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: member.avatarColor }}>
                          {member.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-dark truncate">{member.name}</p>
                          <p className="text-xs text-secondary truncate">{member.level}</p>
                        </div>
                      </div>

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

                      <div className="flex items-center">
                        <div className="w-full">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-secondary">{member.kpiScore}%</span>
                          </div>
                          <ProgressBar
                            value={member.kpiScore}
                            color="accent"
                            height={5}
                          />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <span className="text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap"
                          style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                          {cfg.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {selected && (
            <DetailPanel
              member={selected}
              onClose={() => setSelected(null)}
              onApprove={handleApprove}
              approved={isApproved(selected.id)}
              onFullProfile={() => navigate('/profile')}
              onChat={goToChat}
            />
          )}
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {viewMode === 'grid' && (
        <>
          <div className={`grid gap-4 transition-all
            ${selected
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
            {filtered.map(member => (
              <EmployeeCard
                key={member.id}
                member={member}
                active={selected?.id === member.id}
                onSelect={() => setSelected(selected?.id === member.id ? null : member)}
                onChat={goToChat}
              />
            ))}
          </div>

          {selected && (
            <div className="mt-2">
              <DetailPanel
                member={selected}
                onClose={() => setSelected(null)}
                onApprove={handleApprove}
                approved={isApproved(selected.id)}
                onFullProfile={() => navigate('/profile')}
                onChat={goToChat}
                wide
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Employee Card (grid view) ────────────────────────────── */
function EmployeeCard({ member, active, onSelect, onChat }) {
  const cfg = idpStatusConfig[member.idpStatus];

  return (
    <div
      className={`bg-white rounded-2xl border shadow-card hover:shadow-card-hover
                  transition-all flex flex-col p-5 gap-3.5
                  ${active ? 'border-accent/40 ring-2 ring-accent/10' : 'border-border'}`}
    >
      {/* Top: avatar + menu */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col items-center gap-2.5 flex-1">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center
                       text-white text-xl font-bold shadow-sm"
            style={{ backgroundColor: member.avatarColor }}
          >
            {member.initials}
          </div>
          <div className="text-center">
            <p className="font-bold text-dark text-sm leading-tight">{member.name}</p>
            <p className="text-xs text-secondary mt-0.5">{member.role}</p>
            {member.idpStatus !== 'no_idp' && (
              <p className="text-[11px] text-muted mt-0.5 flex items-center justify-center gap-0.5">
                → <span className="font-semibold text-dark ml-0.5">{member.targetRole}</span>
              </p>
            )}
          </div>
        </div>
        <button className="text-muted hover:text-dark transition-colors mt-0.5 flex-shrink-0">
          <MoreVertical size={15} />
        </button>
      </div>

      {/* Status badge */}
      <div className="flex justify-center">
        <span
          className="text-[10px] font-bold px-3 py-1 rounded-full tracking-wide"
          style={{ backgroundColor: cfg.bg, color: cfg.color }}
        >
          {cfg.label.toUpperCase()}
        </span>
      </div>

      {/* KPI progress */}
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-secondary font-medium">Прогресс KPI</span>
          <span className="font-bold text-dark">{member.kpiScore}%</span>
        </div>
        <ProgressBar
          value={member.kpiScore}
          color="accent"
          height={6}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Email */}
      <div className="flex items-center gap-2 text-xs text-secondary">
        <Mail size={12} className="text-muted flex-shrink-0" />
        <span className="truncate">{member.email}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={onSelect}
          className="flex-1 py-2 rounded-xl text-xs font-semibold border border-border
                     text-secondary hover:border-accent/40 hover:text-accent transition-all"
        >
          Профиль
        </button>
        <button
          onClick={e => { e.stopPropagation(); onChat(); }}
          title="Написать сообщение"
          className="w-9 h-9 rounded-xl flex items-center justify-center border border-border
                     text-muted hover:border-accent/40 hover:text-accent hover:bg-accent-light
                     transition-all flex-shrink-0"
        >
          <MessageSquare size={15} />
        </button>
      </div>
    </div>
  );
}

/* ── Detail Panel ─────────────────────────────────────────── */
function DetailPanel({ member, onClose, onApprove, approved, onFullProfile, onChat, wide }) {
  const cfg = idpStatusConfig[member.idpStatus];

  return (
    <div
      className={`bg-white rounded-2xl border border-border shadow-card overflow-hidden animate-fade-in
        ${wide ? 'w-full' : 'w-[380px] flex-shrink-0 sticky top-6'}`}
    >
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
              {member.email && (
                <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
                  <Mail size={10} /> {member.email}
                </p>
              )}
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

        <div className="mt-3 flex items-center gap-3">
          <span
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: cfg.bg, color: cfg.color }}
          >
            {cfg.label}
          </span>
          <div className="flex-1">
            <ProgressBar
              value={member.kpiScore}
              color="accent"
              height={5}
            />
          </div>
          <span className="text-xs font-bold text-dark flex-shrink-0">KPI {member.kpiScore}%</span>
        </div>

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
            { label: '360°',   value: member.score360,       color: '#005DB9' },
            { label: 'KPI',    value: member.kpiScore,       color: SUCCESS },
            { label: 'Вовл.',  value: member.engagementScore, color: '#6D4FA0' },
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
        <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-3">Анализ компетенций</p>
        <div className="space-y-3">
          {member.gaps.map((gap, i) => {
            const pct    = Math.round((gap.current / gap.required) * 100);
            const capped = Math.min(pct, 100);
            return (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-medium text-dark">{gap.skill}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-secondary">{gap.current}/{gap.required}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${gapColor(pct)}20`, color: gapColor(pct) }}>
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${capped}%`, backgroundColor: gapColor(pct) }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* IDP Courses */}
      <div className="px-5 py-4 border-b border-border">
        <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-3">Курсы ИПР</p>
        <div className="space-y-2">
          {member.courses.map((c, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <CourseIcon status={c.status} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-dark leading-snug truncate">{c.title}</p>
                {c.status === 'in_progress' && (
                  <div className="mt-1"><ProgressBar value={c.progress} color="accent" height={3} /></div>
                )}
                {c.status === 'completed'   && <p className="text-[10px] text-success font-medium mt-0.5">Завершён</p>}
                {c.status === 'not_started' && <p className="text-[10px] text-muted mt-0.5">Не начат</p>}
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
        {member.idpStatus === 'pending_approval' && approved && (
          <div className="w-full py-2.5 rounded-xl text-sm font-semibold text-success bg-success-light flex items-center justify-center gap-2">
            <CheckCircle size={15} /> ИПР утверждён
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onFullProfile}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-dark border border-border
                       hover:bg-background transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink size={14} /> Полный профиль
          </button>
          <button
            onClick={onChat}
            title="Написать сообщение"
            className="w-11 h-11 rounded-xl flex items-center justify-center border border-border
                       text-muted hover:border-accent/40 hover:text-accent hover:bg-accent-light transition-all"
          >
            <MessageSquare size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
