import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Mail, Phone, Calendar, Award, TrendingUp,
  BookOpen, Briefcase, ChevronRight, Sparkles, CheckCircle,
  Clock, Star, Edit3,
} from 'lucide-react';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import ProgressBar from '../components/ui/ProgressBar';
import { useApp } from '../context/AppContext';
import { courses } from '../data/courses';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  const completedCourses = courses.filter(c => c.status === 'completed');
  const activeCourses = courses.filter(c => c.status === 'in_progress');

  const tabs = [
    { key: 'overview', label: 'Обзор' },
    { key: 'skills', label: 'Навыки' },
    { key: 'learning', label: 'Обучение' },
    { key: 'career', label: 'Карьера' },
  ];

  return (
    <div className="max-w-[820px] mx-auto space-y-5">

      {/* Profile Header Card */}
      <Card padding="p-0" className="overflow-hidden">
        {/* Blue banner */}
        <div
          className="h-28 flex items-end justify-end px-6 pb-4"
          style={{ background: 'linear-gradient(135deg, #005DB9 0%, #004A94 100%)' }}
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/settings')}
            icon={<Edit3 size={13} />}
            className="bg-white/20 text-white hover:bg-white/30 border-0"
          >
            Редактировать
          </Button>
        </div>

        {/* Content — avatar overlaps banner via negative margin */}
        <div className="px-6 pb-6">
          {/* Avatar row */}
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="relative flex-shrink-0">
              <Avatar
                initials={user.initials}
                color={user.avatarColor}
                size="2xl"
                className="ring-4 ring-white shadow-sm"
              />
              <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-success rounded-full border-2 border-white block" />
            </div>
            <div className="pb-1 min-w-0">
              <h1 className="text-xl font-bold text-dark leading-tight">{user.name}</h1>
              <p className="text-sm text-secondary mt-0.5">{user.role} · {user.level}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-secondary">
                  <MapPin size={11} /> {user.location}
                </span>
                <span className="text-muted text-xs">·</span>
                <span className="text-xs text-secondary">{user.department}</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-secondary leading-relaxed mb-4">{user.bio}</p>

          {/* Achievements */}
          <div className="flex flex-wrap gap-2 mb-5">
            {user.achievements.map((a, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl bg-warning-light text-warning font-semibold">
                <Award size={11} /> {a}
              </span>
            ))}
          </div>

          {/* Contact row */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-secondary pt-4 border-t border-border">
            <span className="flex items-center gap-1.5"><Mail size={12} /> {user.email}</span>
            <span className="flex items-center gap-1.5"><Phone size={12} /> {user.phone}</span>
            <span className="flex items-center gap-1.5"><Calendar size={12} /> {user.yearsAtCompany} лет в компании</span>
          </div>
        </div>
      </Card>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Button variant="primary" size="lg" onClick={() => navigate('/career')}
          icon={<TrendingUp size={16} />} className="justify-center">
          Сформировать путь
        </Button>
        <Button variant="secondary" size="lg" onClick={() => navigate('/learning')}
          icon={<BookOpen size={16} />} className="justify-center">
          Открыть обучение
        </Button>
        <Button variant="outline" size="lg" onClick={() => navigate('/opportunities')}
          icon={<Briefcase size={16} />} className="justify-center">
          Создать предложение
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white p-1 rounded-2xl border border-border">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all
              ${activeTab === tab.key ? 'bg-accent text-white shadow-sm' : 'text-secondary hover:text-dark'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Career Target */}
          <Card>
            <CardHeader
              title="Карьерная цель"
              icon={<TrendingUp size={18} />}
              iconBg="#E8F0FA"
              iconColor="#005DB9"
            />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-secondary">Текущая роль</p>
                  <p className="text-sm font-semibold text-dark">{user.role}</p>
                </div>
                <ChevronRight size={16} className="text-accent" />
                <div className="text-right">
                  <p className="text-xs text-secondary">Цель</p>
                  <p className="text-sm font-semibold text-accent">{user.targetRole}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-secondary">Прогресс</span>
                  <span className="font-bold text-dark">{user.careerProgress}%</span>
                </div>
                <ProgressBar value={user.careerProgress} color="accent" height={8} />
              </div>
              <div className="p-3 rounded-xl bg-background border border-border text-center">
                <p className="text-xs text-secondary">Прогноз перехода</p>
                <p className="text-lg font-bold text-accent mt-0.5">Q1 2027</p>
              </div>
            </div>
          </Card>

          {/* Key Metrics */}
          <Card>
            <CardHeader
              title="Ключевые метрики"
              icon={<Star size={18} />}
              iconBg="#FEF3C7"
              iconColor="#F59E0B"
            />
            <div className="space-y-3">
              {[
                { label: 'Готовность к переходу', value: user.readiness, color: 'accent' },
                { label: 'Вовлеченность', value: user.engagement, color: 'success' },
                { label: 'Вероятность повышения', value: user.promotionProbability, color: 'purple' },
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-secondary">{m.label}</span>
                    <span className="font-bold text-dark">{m.value}%</span>
                  </div>
                  <ProgressBar value={m.value} color={m.color} height={6} />
                </div>
              ))}
              <div className="p-2.5 rounded-xl bg-success-light text-center mt-2">
                <p className="text-xs font-semibold text-success">Сигнал мобильности: {user.mobilitySignal}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="space-y-5">
          <Card>
            <CardHeader
              title="Текущие навыки"
              subtitle={`${user.skills.length} подтверждённых навыка`}
              icon={<CheckCircle size={18} />}
              iconBg="#D1FAE5"
              iconColor="#10B981"
            />
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-success-light text-success text-sm font-semibold"
                >
                  <CheckCircle size={12} /> {skill}
                </span>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader
              title="Пробелы в навыках"
              subtitle="Нужны для целевой роли"
              icon={<TrendingUp size={18} />}
              iconBg="#FEF3C7"
              iconColor="#F59E0B"
            />
            <div className="flex flex-wrap gap-2">
              {user.skillGaps.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-warning-light text-warning text-sm font-semibold border border-warning/20"
                >
                  + {skill}
                </span>
              ))}
            </div>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/learning')}
              className="mt-4"
              iconRight={<ChevronRight size={14} />}
            >
              Закрыть пробелы через обучение
            </Button>
          </Card>
        </div>
      )}

      {activeTab === 'learning' && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Завершено', value: user.completedCourses, color: '#10B981' },
              { label: 'Активных', value: user.activeCourses, color: '#005DB9' },
              { label: 'Часов', value: user.learningHours, color: '#8B5CF6' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-4 text-center shadow-card">
                <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-secondary">{s.label}</p>
              </div>
            ))}
          </div>
          <Card>
            <CardHeader title="История обучения" icon={<BookOpen size={18} />} iconBg="#D1FAE5" iconColor="#10B981" />
            <div className="space-y-2">
              {[...activeCourses, ...completedCourses].map((course) => (
                <div key={course.id} className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: course.categoryBg }}>
                    <BookOpen size={14} style={{ color: course.categoryColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark truncate">{course.title}</p>
                    <p className="text-xs text-secondary">{course.provider}</p>
                  </div>
                  {course.status === 'completed' ? (
                    <Badge variant="success" className="text-[10px]">Завершён</Badge>
                  ) : (
                    <div className="w-20">
                      <ProgressBar value={course.progress} color="accent" height={4} />
                      <p className="text-[10px] text-accent text-right mt-0.5">{course.progress}%</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'career' && (
        <Card>
          <CardHeader
            title="Карьерный маршрут"
            icon={<TrendingUp size={18} />}
            iconBg="#E8F0FA"
            iconColor="#005DB9"
          />
          <div className="space-y-3">
            {user.learningPath.map((step, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-background border border-border">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${step.status === 'completed' ? 'bg-success text-white'
                    : step.status === 'in_progress' ? 'bg-accent text-white'
                    : 'bg-border text-secondary'}`}>
                  {step.status === 'completed' ? <CheckCircle size={14} /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-dark truncate">{step.title}</p>
                  <p className="text-xs text-secondary">{step.quarter}</p>
                </div>
                {step.status === 'in_progress' && (
                  <div className="w-24">
                    <ProgressBar value={step.progress} color="accent" height={4} />
                    <p className="text-[10px] text-accent text-right mt-0.5">{step.progress}%</p>
                  </div>
                )}
                {step.status === 'not_started' && (
                  <Badge variant="muted" className="text-[10px]">Далее</Badge>
                )}
              </div>
            ))}
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/career')}
            className="mt-4 w-full justify-center"
          >
            Открыть полный карьерный путь
          </Button>
        </Card>
      )}
    </div>
  );
}
