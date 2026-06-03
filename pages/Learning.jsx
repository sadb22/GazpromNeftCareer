import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Search, Star, Clock, Users, ChevronRight,
  Play, CheckCircle, Sparkles, Calendar, TrendingUp,
} from 'lucide-react';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import DonutChart from '../components/ui/DonutChart';
import { courses, courseCategories } from '../data/courses';

export default function Learning() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Все');
  const [search, setSearch] = useState('');

  const activeCourses     = courses.filter(c => c.status === 'in_progress');
  const completedCourses  = courses.filter(c => c.status === 'completed');
  const recommendedCourses = courses.filter(c => c.recommended);

  const totalCompletedModules = courses.reduce((acc, c) => acc + c.completedModules, 0);
  const inProgressModules     = courses
    .filter(c => c.status === 'in_progress')
    .reduce((acc, c) => acc + (c.modules - c.completedModules), 0);
  const plannedModules        = courses
    .filter(c => c.status === 'not_started')
    .reduce((acc, c) => acc + c.modules, 0);
  const overallPct = Math.round(
    (totalCompletedModules / (totalCompletedModules + inProgressModules + plannedModules)) * 100
  );

  const filtered = courses.filter(c => {
    const matchCat    = activeCategory === 'Все' || c.category === activeCategory;
    const matchSearch = search === '' || c.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-[860px] mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-dark">Обучение</h1>
          <p className="text-sm text-secondary mt-0.5">
            {activeCourses.length} активных · {completedCourses.length} завершённых
          </p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Поиск курсов..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 text-sm bg-white border border-border rounded-xl
                       focus:border-accent/50 focus:outline-none transition-all w-48"
          />
        </div>
      </div>

      {/* ── Trajectory Progress (DonutChart) ── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#E8F0FA' }}>
            <TrendingUp size={18} className="text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-dark text-base leading-tight">Прогресс по траектории</h3>
            <p className="text-xs text-secondary mt-0.5">Выполнение учебного плана</p>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-2xl font-bold text-accent">{overallPct}%</p>
            <p className="text-xs text-secondary">модулей завершено</p>
          </div>
        </div>
        <DonutChart
          percentage={overallPct}
          completed={totalCompletedModules}
          inProgress={inProgressModules}
          planned={plannedModules}
          size={130}
        />
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Активных курсов', value: activeCourses.length,   color: '#005DB9', bg: '#E8F0FA' },
          { label: 'Завершено',       value: completedCourses.length, color: '#10B981', bg: '#D1FAE5' },
          { label: 'Часов обучения',  value: '124',                   color: '#8B5CF6', bg: '#EDE9FE' },
          { label: 'Рекомендовано',   value: recommendedCourses.length, color: '#F59E0B', bg: '#FEF3C7' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-4 shadow-card text-center">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-secondary mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Continue Learning ── */}
      {activeCourses.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-dark">Продолжить обучение</h2>
            <span className="text-xs text-secondary">{activeCourses.length} курса в процессе</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCourses.map(course => (
              <CourseCard key={course.id} course={course} onOpen={() => {}} />
            ))}
          </div>
        </section>
      )}

      {/* ── AI Recommended ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-warning" />
          <h2 className="text-base font-bold text-dark">Рекомендовано AI</h2>
          <span className="text-xs text-secondary">На основе вашего карьерного пути</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedCourses.filter(c => c.status !== 'completed').map(course => (
            <CourseCard key={course.id} course={course} highlighted onOpen={() => {}} />
          ))}
        </div>
      </section>

      {/* ── All Courses ── */}
      <section>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <div>
            <h2 className="text-base font-bold text-dark">Все курсы</h2>
            <p className="text-xs text-secondary">{filtered.length} из {courses.length}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {courseCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
                  ${activeCategory === cat
                    ? 'bg-accent text-white'
                    : 'bg-white border border-border text-secondary hover:border-accent/40'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(course => (
            <CourseCard key={course.id} course={course} onOpen={() => {}} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-secondary bg-white rounded-2xl border border-border">
            <BookOpen size={36} className="mx-auto mb-3 text-muted" />
            <p className="text-sm">Курсы не найдены</p>
          </div>
        )}
      </section>
    </div>
  );
}

/* ── Course Card (Skillbox style) ────────────────────────── */
function CourseCard({ course, highlighted, onOpen }) {
  const coverBg = `linear-gradient(135deg, ${course.categoryColor}18 0%, ${course.categoryColor}38 100%)`;

  return (
    <div
      className={`rounded-2xl border overflow-hidden shadow-card hover:shadow-card-hover transition-all
                  cursor-pointer group flex flex-col
        ${highlighted ? 'border-accent/25' : 'border-border'}`}
      onClick={onOpen}
    >
      {/* Cover band */}
      <div className="relative h-28 flex flex-col justify-between p-4" style={{ background: coverBg }}>
        {/* Badges top-right */}
        <div className="flex justify-end gap-1.5">
          {course.status === 'completed' && (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white shadow-sm"
              style={{ color: course.categoryColor }}>
              <CheckCircle size={11} /> Завершён
            </span>
          )}
          {course.recommended && course.status !== 'completed' && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: course.categoryColor }}>
              AI Pick
            </span>
          )}
        </div>

        {/* Category + level bottom-left */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
            style={{ backgroundColor: course.categoryColor }}>
            {course.category}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/80 text-secondary">
            {course.level}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-5 flex flex-col flex-1">
        <h4 className="text-sm font-bold text-dark leading-snug mb-1">{course.title}</h4>
        <p className="text-xs text-secondary mb-1">{course.provider}</p>
        <p className="text-xs text-muted mb-4 leading-relaxed line-clamp-2">{course.description}</p>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-secondary mb-4">
          <span className="flex items-center gap-1"><Clock size={11} /> {course.duration}</span>
          <span className="flex items-center gap-1">
            <Star size={11} style={{ fill: '#F59E0B', color: '#F59E0B' }} /> {course.rating}
          </span>
          <span className="flex items-center gap-1"><Users size={11} /> {course.reviews}</span>
        </div>

        {/* Progress */}
        {course.status === 'in_progress' && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-secondary">Прогресс</span>
              <span className="font-bold text-dark">{course.progress}%</span>
            </div>
            <ProgressBar value={course.progress} color={course.categoryColor} height={7} />
            <p className="text-[10px] text-muted mt-1.5">
              {course.completedModules} из {course.modules} модулей
            </p>
          </div>
        )}

        {/* Deadline */}
        {course.deadline && course.status !== 'completed' && (
          <p className="text-xs text-muted flex items-center gap-1 mb-4">
            <Calendar size={11} /> Дедлайн: {course.deadline}
          </p>
        )}

        {/* CTA button — pushed to bottom */}
        <div className="mt-auto">
          <button
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2
              ${course.status === 'in_progress'
                ? 'text-white hover:opacity-90'
                : course.status === 'completed'
                  ? 'bg-success-light text-success hover:bg-success hover:text-white'
                  : 'bg-accent-light text-accent hover:bg-accent hover:text-white border border-accent/20'}`}
            style={course.status === 'in_progress' ? { backgroundColor: course.categoryColor } : {}}
          >
            {course.status === 'in_progress' ? (
              <><Play size={13} /> Продолжить</>
            ) : course.status === 'completed' ? (
              <><CheckCircle size={13} /> Повторить</>
            ) : (
              <><Play size={13} /> Начать курс</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
