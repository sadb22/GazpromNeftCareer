import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Users, TrendingUp, BookOpen,
  ChevronRight, Sparkles, MapPin, Star,
} from 'lucide-react';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import ProgressBar from '../components/ui/ProgressBar';
import { employees } from '../data/employees';
import { useApp } from '../context/AppContext';

const deptFilters = ['Все', 'Цифровые технологии', 'AI & Data', 'Продуктовые решения', 'Инфраструктура'];

export default function Employees() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('Все');
  const [sort, setSort] = useState('readiness');

  const filtered = employees
    .filter(e => {
      const matchSearch = search === '' ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.role.toLowerCase().includes(search.toLowerCase());
      const matchDept = dept === 'Все' || e.department === dept;
      return matchSearch && matchDept;
    })
    .sort((a, b) => {
      if (sort === 'readiness') return b.readiness - a.readiness;
      if (sort === 'engagement') return b.engagement - a.engagement;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="max-w-[860px] mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-dark">Сотрудники</h1>
          <p className="text-sm text-secondary mt-0.5">
            {employees.length} сотрудников в системе
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 text-sm bg-white border border-border rounded-xl focus:border-accent/50 w-48 transition-all"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-border rounded-xl text-secondary focus:border-accent/50 transition-all"
          >
            <option value="readiness">По готовности</option>
            <option value="engagement">По вовлечённости</option>
            <option value="name">По имени</option>
          </select>
        </div>
      </div>

      {/* Dept filter */}
      <div className="flex gap-1.5 flex-wrap">
        {deptFilters.map(d => (
          <button
            key={d}
            onClick={() => setDept(d)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
              ${dept === d ? 'bg-accent text-white' : 'bg-white border border-border text-secondary hover:border-accent/40'}`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Сотрудников', value: employees.length, color: '#1A2533' },
          { label: 'Ср. готовность', value: `${Math.round(employees.reduce((a, e) => a + e.readiness, 0) / employees.length)}%`, color: '#005DB9' },
          { label: 'Ср. вовлечённость', value: `${Math.round(employees.reduce((a, e) => a + e.engagement, 0) / employees.length)}%`, color: '#10B981' },
          { label: 'Активных курсов', value: employees.reduce((a, e) => a + e.activeCourses, 0), color: '#8B5CF6' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-3 shadow-card text-center">
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-secondary mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((emp) => (
          <EmployeeCard
            key={emp.id}
            employee={emp}
            isMe={emp.id === user.id}
            onClick={() => navigate('/profile')}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-secondary">
          <Users size={36} className="mx-auto mb-2 text-muted" />
          <p>Сотрудники не найдены</p>
        </div>
      )}
    </div>
  );
}

function EmployeeCard({ employee: emp, isMe, onClick }) {
  return (
    <div
      className={`bg-white rounded-2xl border p-5 shadow-card cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 transition-all group
        ${isMe ? 'border-accent/40' : 'border-border'}`}
      onClick={onClick}
    >
      {/* Top */}
      <div className="flex items-start gap-3 mb-4">
        <Avatar initials={emp.initials} color={emp.avatarColor} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-dark text-base truncate">{emp.name}</h3>
            {isMe && <Badge variant="accent" className="text-[10px]">Вы</Badge>}
          </div>
          <p className="text-sm text-secondary">{emp.role}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Badge variant="muted" className="text-[10px]">{emp.level}</Badge>
            <span className="text-xs text-secondary flex items-center gap-0.5">
              <MapPin size={10} /> {emp.location}
            </span>
          </div>
        </div>
        <ChevronRight size={16} className="text-muted group-hover:text-accent transition-colors flex-shrink-0" />
      </div>

      {/* Target */}
      <div className="flex items-center gap-2 mb-3 p-2.5 rounded-xl bg-background border border-border">
        <TrendingUp size={13} className="text-accent flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-secondary">Целевая роль</p>
          <p className="text-xs font-semibold text-dark truncate">{emp.targetRole}</p>
        </div>
      </div>

      {/* Readiness */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-secondary">Готовность</span>
          <span className="font-bold text-dark">{emp.readiness}%</span>
        </div>
        <ProgressBar value={emp.readiness} color={emp.readiness >= 75 ? 'success' : emp.readiness >= 50 ? 'accent' : 'warning'} height={6} />
      </div>

      {/* Skills */}
      <div className="mb-3">
        <p className="text-[10px] text-secondary mb-1.5">Навыки</p>
        <div className="flex flex-wrap gap-1">
          {emp.skills.slice(0, 4).map(s => (
            <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-background border border-border text-secondary font-medium">
              {s}
            </span>
          ))}
          {emp.skills.length > 4 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-background border border-border text-muted">
              +{emp.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span
          className="text-xs font-semibold px-2 py-1 rounded-lg"
          style={{ backgroundColor: emp.mobilitySignalColor + '20', color: emp.mobilitySignalColor }}
        >
          {emp.mobilitySignal}
        </span>
        <div className="flex items-center gap-2 text-xs text-secondary">
          <span className="flex items-center gap-0.5"><BookOpen size={10} /> {emp.completedCourses}</span>
          <span>·</span>
          <span className="flex items-center gap-0.5"><Star size={10} className="text-warning" /> {emp.engagement}%</span>
        </div>
      </div>
    </div>
  );
}
