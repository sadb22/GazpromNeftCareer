import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Search, Star, Clock, Users, ChevronRight,
  Play, CheckCircle, Sparkles, Filter,
} from 'lucide-react';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { courses, courseCategories } from '../data/courses';

export default function Learning() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Все');
  const [search, setSearch] = useState('');

  const activeCourses = courses.filter(c => c.status === 'in_progress');
  const completedCourses = courses.filter(c => c.status === 'completed');
  const recommendedCourses = courses.filter(c => c.recommended);

  const filtered = courses.filter(c => {
    const matchCat = activeCategory === 'Все' || c.category === activeCategory;
    const matchSearch = search === '' || c.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-[860px] mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-dark">Обучение</h1>
          <p className="text-sm text-secondary mt-0.5">
            {activeCourses.length} активных · {completedCourses.length} завершённых
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Поиск курсов..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 text-sm bg-white border border-border rounded-xl focus:border-accent/50 transition-all w-48"
            />
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Активных курсов', value: activeCourses.length, color: '#005DB9', bg: '#E8F0FA' },
          { label: 'Завершено', value: completedCourses.length, color: '#10B981', bg: '#D1FAE5' },
          { label: 'Часов обучения', value: '124', color: '#8B5CF6', bg: '#EDE9FE' },
          { label: 'Рекомендовано', value: recommendedCourses.length, color: '#F59E0B', bg: '#FEF3C7' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-3 shadow-card text-center">
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-secondary mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Continue Learning */}
      {activeCourses.length > 0 && (
        <Card>
          <CardHeader
            title="Продолжить обучение"
            subtitle="Курсы в процессе"
            icon={<Play size={18} />}
            iconBg="#E8F0FA"
            iconColor="#005DB9"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeCourses.map((course) => (
              <CourseCard key={course.id} course={course} onOpen={() => {}} />
            ))}
          </div>
        </Card>
      )}

      {/* AI Recommended */}
      <Card>
        <CardHeader
          title="Рекомендовано AI"
          subtitle="На основе вашего карьерного пути"
          icon={<Sparkles size={18} />}
          iconBg="#FEF3C7"
          iconColor="#F59E0B"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendedCourses.filter(c => c.status !== 'completed').map((course) => (
            <CourseCard key={course.id} course={course} highlighted onOpen={() => {}} />
          ))}
        </div>
      </Card>

      {/* All Courses */}
      <Card>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="font-semibold text-dark">Все курсы</h3>
            <p className="text-xs text-secondary">{filtered.length} из {courses.length}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {courseCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
                  ${activeCategory === cat ? 'bg-accent text-white' : 'bg-background border border-border text-secondary hover:border-accent/40'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} onOpen={() => {}} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-secondary">
            <BookOpen size={32} className="mx-auto mb-2 text-muted" />
            <p className="text-sm">Курсы не найдены</p>
          </div>
        )}
      </Card>
    </div>
  );
}

function CourseCard({ course, highlighted, onOpen }) {
  return (
    <div
      className={`p-4 rounded-xl border transition-all cursor-pointer group
        ${highlighted ? 'border-accent/30 bg-accent-light/20 hover:bg-accent-light/40' : 'border-border hover:border-accent/30 hover:bg-background'}`}
      onClick={onOpen}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: course.categoryBg, color: course.categoryColor }}
            >
              {course.category}
            </span>
            {course.recommended && (
              <Badge variant="accent" className="text-[10px]">AI</Badge>
            )}
            {course.status === 'completed' && (
              <Badge variant="success" className="text-[10px]">Завершён</Badge>
            )}
          </div>
          <h4 className="text-sm font-semibold text-dark leading-snug">{course.title}</h4>
          <p className="text-xs text-secondary mt-0.5">{course.provider}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-secondary mb-3">
        <span className="flex items-center gap-1"><Clock size={10} /> {course.duration}</span>
        <span className="flex items-center gap-1"><Star size={10} className="text-warning" fill="#F59E0B" /> {course.rating}</span>
        <span className="flex items-center gap-1"><Users size={10} /> {course.reviews}</span>
      </div>

      {course.status === 'in_progress' && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-secondary">Прогресс</span>
            <span className="font-bold text-dark">{course.progress}%</span>
          </div>
          <ProgressBar
            value={course.progress}
            color={course.categoryColor}
            height={5}
          />
        </div>
      )}

      {course.deadline && (
        <p className="text-xs text-muted mb-3">Дедлайн: {course.deadline}</p>
      )}

      <Button
        variant={course.status === 'in_progress' ? 'primary' : course.status === 'completed' ? 'success' : 'secondary'}
        size="sm"
        className="w-full justify-center"
        icon={course.status === 'completed' ? <CheckCircle size={13} /> : <Play size={13} />}
      >
        {course.status === 'in_progress' ? 'Продолжить' : course.status === 'completed' ? 'Повторить' : 'Начать'}
      </Button>
    </div>
  );
}
