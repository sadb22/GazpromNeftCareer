import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, SlidersHorizontal, X } from 'lucide-react';
import { CourseCard } from './Learning';
import { courses, courseCategories } from '../data/courses';

/* Extended catalog with 17 courses */
const extraCourses = [
  {
    id: 101,
    title: 'Docker и Kubernetes для разработчиков',
    provider: 'Внутренняя академия',
    category: 'MLOps',
    categoryColor: '#8B5CF6',
    categoryBg: '#EDE9FE',
    duration: '14 ч',
    level: 'Продвинутый',
    progress: 0,
    rating: 4.8,
    reviews: 224,
    tags: ['Docker', 'Kubernetes', 'DevOps'],
    status: 'not_started',
    deadline: '1 октября 2026',
    instructor: 'Антон Рябов',
    description: 'Контейнеризация приложений и оркестрация с Kubernetes на практике.',
    recommended: false,
    skillGapCover: 'MLOps',
    modules: 16,
    completedModules: 0,
  },
  {
    id: 102,
    title: 'Data Engineering: Пайплайны и ETL',
    provider: 'Coursera',
    category: 'AI/ML',
    categoryColor: '#005DB9',
    categoryBg: '#EBF2FB',
    duration: '18 ч',
    level: 'Продвинутый',
    progress: 0,
    rating: 4.7,
    reviews: 143,
    tags: ['ETL', 'Spark', 'Airflow'],
    status: 'not_started',
    deadline: null,
    instructor: 'Евгений Носков',
    description: 'Построение надежных дата-пайплайнов с Apache Spark и Airflow.',
    recommended: false,
    skillGapCover: null,
    modules: 20,
    completedModules: 0,
  },
  {
    id: 103,
    title: 'Agile и Scrum для технических команд',
    provider: 'Внутренняя академия',
    category: 'Soft Skills',
    categoryColor: '#10B981',
    categoryBg: '#D1FAE5',
    duration: '4 ч',
    level: 'Базовый',
    progress: 0,
    rating: 4.4,
    reviews: 389,
    tags: ['Agile', 'Scrum', 'Kanban'],
    status: 'not_started',
    deadline: null,
    instructor: 'Ольга Федорова',
    description: 'Практическое применение Agile-методологий в разработке.',
    recommended: false,
    skillGapCover: null,
    modules: 5,
    completedModules: 0,
  },
  {
    id: 104,
    title: 'Azure ML: Облачное машинное обучение',
    provider: 'Microsoft Learn',
    category: 'Cloud',
    categoryColor: '#F97316',
    categoryBg: '#FFEDD5',
    duration: '12 ч',
    level: 'Средний',
    progress: 0,
    rating: 4.6,
    reviews: 97,
    tags: ['Azure', 'ML', 'Cloud'],
    status: 'not_started',
    deadline: null,
    instructor: 'Microsoft Expert',
    description: 'Разработка и развертывание ML-моделей в экосистеме Microsoft Azure.',
    recommended: false,
    skillGapCover: 'Cloud AI',
    modules: 14,
    completedModules: 0,
  },
  {
    id: 105,
    title: 'Python Advanced: Паттерны и оптимизация',
    provider: 'Внутренняя академия',
    category: 'Backend',
    categoryColor: '#EC4899',
    categoryBg: '#FCE7F3',
    duration: '9 ч',
    level: 'Продвинутый',
    progress: 0,
    rating: 4.9,
    reviews: 276,
    tags: ['Python', 'Design Patterns', 'Performance'],
    status: 'not_started',
    deadline: null,
    instructor: 'Антон Соколов',
    description: 'Продвинутые техники программирования на Python: паттерны, метапрограммирование.',
    recommended: false,
    skillGapCover: null,
    modules: 11,
    completedModules: 0,
  },
  {
    id: 106,
    title: 'PostgreSQL: Оптимизация и репликация',
    provider: 'Внутренняя академия',
    category: 'Базы данных',
    categoryColor: '#0D9488',
    categoryBg: '#CCFBF1',
    duration: '7 ч',
    level: 'Экспертный',
    progress: 0,
    rating: 4.8,
    reviews: 134,
    tags: ['PostgreSQL', 'Replication', 'Performance'],
    status: 'not_started',
    deadline: null,
    instructor: 'Игорь Семенов',
    description: 'Репликация, шардирование и тонкая настройка PostgreSQL.',
    recommended: false,
    skillGapCover: null,
    modules: 8,
    completedModules: 0,
  },
  {
    id: 107,
    title: 'Публичные выступления и презентации',
    provider: 'Внутренняя академия',
    category: 'Soft Skills',
    categoryColor: '#10B981',
    categoryBg: '#D1FAE5',
    duration: '3 ч',
    level: 'Базовый',
    progress: 0,
    rating: 4.3,
    reviews: 541,
    tags: ['Communication', 'Presentation', 'Speaking'],
    status: 'not_started',
    deadline: null,
    instructor: 'HR Отдел',
    description: 'Навыки эффективных презентаций и публичных выступлений.',
    recommended: false,
    skillGapCover: null,
    modules: 4,
    completedModules: 0,
  },
  {
    id: 108,
    title: 'Мониторинг ML-моделей в продакшне',
    provider: 'Coursera',
    category: 'MLOps',
    categoryColor: '#8B5CF6',
    categoryBg: '#EDE9FE',
    duration: '10 ч',
    level: 'Продвинутый',
    progress: 0,
    rating: 4.7,
    reviews: 88,
    tags: ['Monitoring', 'MLOps', 'Prometheus'],
    status: 'not_started',
    deadline: null,
    instructor: 'ML Expert',
    description: 'Системы мониторинга качества данных и дрейфа моделей.',
    recommended: true,
    skillGapCover: 'MLOps',
    modules: 12,
    completedModules: 0,
  },
  {
    id: 109,
    title: 'Управление временем и приоритетами',
    provider: 'Внутренняя академия',
    category: 'Soft Skills',
    categoryColor: '#10B981',
    categoryBg: '#D1FAE5',
    duration: '2 ч',
    level: 'Базовый',
    progress: 0,
    rating: 4.2,
    reviews: 712,
    tags: ['Productivity', 'Time Management'],
    status: 'not_started',
    deadline: null,
    instructor: 'HR Отдел',
    description: 'Методы тайм-менеджмента и расстановки приоритетов.',
    recommended: false,
    skillGapCover: null,
    modules: 3,
    completedModules: 0,
  },
  {
    id: 110,
    title: 'Feature Engineering для ML',
    provider: 'Yandex School',
    category: 'AI/ML',
    categoryColor: '#005DB9',
    categoryBg: '#EBF2FB',
    duration: '8 ч',
    level: 'Средний',
    progress: 0,
    rating: 4.8,
    reviews: 167,
    tags: ['Feature Engineering', 'ML', 'Data'],
    status: 'not_started',
    deadline: null,
    instructor: 'Яндекс AI',
    description: 'Техники создания информативных признаков для ML-моделей.',
    recommended: false,
    skillGapCover: 'Machine Learning',
    modules: 10,
    completedModules: 0,
  },
];

const allCoursesCatalog = [...courses, ...extraCourses];
const allCategories = ['Все', 'AI/ML', 'MLOps', 'Cloud', 'Backend', 'Soft Skills', 'Базы данных'];
const statusFilters = [
  { key: 'all', label: 'Все статусы' },
  { key: 'in_progress', label: 'В процессе' },
  { key: 'not_started', label: 'Не начато' },
  { key: 'completed', label: 'Завершено' },
];
const sortOptions = [
  { key: 'default', label: 'По умолчанию' },
  { key: 'rating', label: 'По рейтингу' },
  { key: 'duration', label: 'По длительности' },
  { key: 'recommended', label: 'Рекомендованные' },
];

export default function AllCourses() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Все');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  let filtered = allCoursesCatalog.filter(c => {
    const matchCat    = category === 'Все' || c.category === category;
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.provider.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchCat && matchSearch && matchStatus;
  });

  if (sortBy === 'rating')      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  if (sortBy === 'recommended') filtered = [...filtered].sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));

  return (
    <div className="max-w-[960px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/learning')}
          className="w-9 h-9 rounded-xl border border-border bg-white flex items-center justify-center text-secondary hover:text-dark hover:border-accent/40 transition-all flex-shrink-0">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-dark">Каталог курсов</h1>
          <p className="text-sm text-secondary mt-0.5">{filtered.length} из {allCoursesCatalog.length} курсов</p>
        </div>
      </div>

      {/* Search + filters bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Поиск по названию или провайдеру..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-border rounded-xl focus:border-accent/50 focus:outline-none transition-all shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
              <X size={13} />
            </button>
          )}
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 text-sm bg-white border border-border rounded-xl text-dark focus:border-accent/50 focus:outline-none transition-all shadow-sm cursor-pointer">
            {statusFilters.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
        <div className="relative">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 text-sm bg-white border border-border rounded-xl text-dark focus:border-accent/50 focus:outline-none transition-all shadow-sm cursor-pointer">
            {sortOptions.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 flex-wrap">
        {allCategories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              category === cat ? 'bg-accent text-white shadow-sm' : 'bg-white border border-border text-secondary hover:border-accent/40 hover:text-accent'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Course grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(c => <CourseCard key={c.id} course={c} highlighted={c.recommended} onOpen={() => {}} />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-border">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#EBF2FB' }}>
            <Search size={22} className="text-accent" />
          </div>
          <p className="text-base font-semibold text-dark mb-1">Курсы не найдены</p>
          <p className="text-sm text-secondary">Попробуйте изменить фильтры или поисковый запрос</p>
          <button onClick={() => { setSearch(''); setCategory('Все'); setStatusFilter('all'); }}
            className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold border border-border text-secondary hover:bg-background transition-colors">
            Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  );
}
