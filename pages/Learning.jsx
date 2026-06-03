import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Star, Clock, Users, ChevronRight,
  Play, CheckCircle, Sparkles, Calendar, TrendingUp,
  ArrowRight, Layers,
} from 'lucide-react';
import ProgressBar from '../components/ui/ProgressBar';
import DonutChart from '../components/ui/DonutChart';
import { courses } from '../data/courses';

/* ── Course Card ──────────────────────────────────────────── */
export function CourseCard({ course, highlighted, onOpen }) {
  const coverBg = `linear-gradient(135deg, ${course.categoryColor}18 0%, ${course.categoryColor}38 100%)`;
  return (
    <div
      className={`rounded-2xl border overflow-hidden shadow-card hover:shadow-card-hover transition-all cursor-pointer group flex flex-col ${highlighted ? 'border-accent/25' : 'border-border'}`}
      onClick={onOpen}
    >
      <div className="relative h-28 flex flex-col justify-between p-4" style={{ background: coverBg }}>
        <div className="flex justify-end gap-1.5">
          {course.status === 'completed' && (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white shadow-sm" style={{ color: course.categoryColor }}>
              <CheckCircle size={11} /> Завершён
            </span>
          )}
          {course.recommended && course.status !== 'completed' && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: course.categoryColor }}>AI Pick</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: course.categoryColor }}>{course.category}</span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/80 text-secondary">{course.level}</span>
        </div>
      </div>
      <div className="bg-white p-5 flex flex-col flex-1">
        <h4 className="text-sm font-bold text-dark leading-snug mb-1">{course.title}</h4>
        <p className="text-xs text-secondary mb-1">{course.provider}</p>
        <p className="text-xs text-muted mb-4 leading-relaxed line-clamp-2">{course.description}</p>
        <div className="flex items-center gap-4 text-xs text-secondary mb-4">
          <span className="flex items-center gap-1"><Clock size={11} /> {course.duration}</span>
          <span className="flex items-center gap-1"><Star size={11} style={{ fill: '#F59E0B', color: '#F59E0B' }} /> {course.rating}</span>
          <span className="flex items-center gap-1"><Users size={11} /> {course.reviews}</span>
        </div>
        {course.status === 'in_progress' && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-secondary">Прогресс</span>
              <span className="font-bold text-dark">{course.progress}%</span>
            </div>
            <ProgressBar value={course.progress} color={course.categoryColor} height={7} />
            <p className="text-[10px] text-muted mt-1.5">{course.completedModules} из {course.modules} модулей</p>
          </div>
        )}
        {course.deadline && course.status !== 'completed' && (
          <p className="text-xs text-muted flex items-center gap-1 mb-4"><Calendar size={11} /> Дедлайн: {course.deadline}</p>
        )}
        <div className="mt-auto">
          <button
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              course.status === 'in_progress' ? 'text-white hover:opacity-90'
                : course.status === 'completed' ? 'bg-success-light text-success hover:bg-success hover:text-white'
                : 'bg-accent-light text-accent hover:bg-accent hover:text-white border border-accent/20'}`}
            style={course.status === 'in_progress' ? { backgroundColor: course.categoryColor } : {}}>
            {course.status === 'in_progress' ? <><Play size={13} /> Продолжить</>
              : course.status === 'completed' ? <><CheckCircle size={13} /> Повторить</>
              : <><Play size={13} /> Начать курс</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────── */
export default function Learning() {
  const navigate = useNavigate();

  const activeCourses      = courses.filter(c => c.status === 'in_progress');
  const completedCourses   = courses.filter(c => c.status === 'completed');
  const recommendedCourses = courses.filter(c => c.recommended && c.status !== 'completed');

  const totalCompleted  = courses.reduce((acc, c) => acc + c.completedModules, 0);
  const inProgressMods  = courses.filter(c => c.status === 'in_progress').reduce((acc, c) => acc + (c.modules - c.completedModules), 0);
  const plannedMods     = courses.filter(c => c.status === 'not_started').reduce((acc, c) => acc + c.modules, 0);
  const overallPct = Math.round((totalCompleted / (totalCompleted + inProgressMods + plannedMods)) * 100);

  return (
    <div className="max-w-[900px] mx-auto space-y-7">

      {/* ── Header ── */}
      <div>
        <h1 className="text-xl font-bold text-dark">Обучение</h1>
        <p className="text-sm text-secondary mt-0.5">
          {activeCourses.length} активных · {completedCourses.length} завершённых
        </p>
      </div>

      {/* ── Trajectory Progress ── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor:'#EBF2FB', color:'#005DB9' }}>
            <TrendingUp size={18} />
          </div>
          <div>
            <h3 className="font-bold text-dark text-base">Прогресс по траектории</h3>
            <p className="text-xs text-secondary">Выполнение учебного плана</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-success font-semibold">+6% за месяц</p>
          </div>
        </div>

        {/* DonutChart + 4 equal stat cards */}
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            <DonutChart
              percentage={overallPct}
              completed={totalCompleted}
              inProgress={inProgressMods}
              planned={plannedMods}
              size={120}
            />
          </div>
          <div className="flex-1 grid grid-cols-4 gap-3">
            {[
              { label: 'Прогресс',      value: `${overallPct}%`, color: '#005DB9', bg: '#EBF2FB' },
              { label: 'Завершено мод.', value: totalCompleted,   color: '#1A7A4A', bg: '#D6EFE1' },
              { label: 'В процессе',    value: inProgressMods,   color: '#B45309', bg: '#FEF3C7' },
              { label: 'Часов обучения', value: '124',            color: '#6D4FA0', bg: '#EDE9F6' },
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-border p-4 text-center" style={{ backgroundColor: s.bg }}>
                <p className="text-2xl font-bold leading-none" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[11px] text-secondary mt-2 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Continue Learning ── */}
      {activeCourses.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-dark">Продолжить обучение</h2>
              <p className="text-xs text-secondary mt-0.5">{activeCourses.length} курса в процессе</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeCourses.map(c => <CourseCard key={c.id} course={c} onOpen={() => {}} />)}
          </div>
        </section>
      )}

      {/* ── AI Recommended ── */}
      {recommendedCourses.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
              <Sparkles size={16} className="text-warning" />
            </div>
            <div>
              <h2 className="text-base font-bold text-dark">Рекомендовано AI</h2>
              <p className="text-xs text-secondary">На основе вашего карьерного пути</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recommendedCourses.map(c => <CourseCard key={c.id} course={c} highlighted onOpen={() => {}} />)}
          </div>
        </section>
      )}

      {/* ── All Courses CTA ── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6 flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EBF2FB', color: '#005DB9' }}>
          <Layers size={22} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-dark text-base">Каталог курсов</h3>
          <p className="text-sm text-secondary mt-0.5">17 курсов · поиск, фильтры, категории</p>
        </div>
        <button
          onClick={() => navigate('/learning/all')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 flex-shrink-0"
          style={{ backgroundColor: '#005DB9' }}>
          Открыть все курсы <ArrowRight size={15} />
        </button>
      </div>

    </div>
  );
}
