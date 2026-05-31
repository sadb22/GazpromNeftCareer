import React, { useState } from 'react';
import {
  Briefcase, MapPin, Users, Clock, ChevronRight,
  Sparkles, ArrowUpRight, Eye, UserCheck, CheckCircle,
} from 'lucide-react';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import ProgressBar from '../components/ui/ProgressBar';
import { opportunities } from '../data/opportunities';
import { useApp } from '../context/AppContext';

export default function Opportunities() {
  const { user } = useApp();
  const [applied, setApplied] = useState([]);
  const [filter, setFilter] = useState('all');

  const sorted = [...opportunities].sort((a, b) => b.compatibility - a.compatibility);
  const filtered = filter === 'all' ? sorted
    : filter === 'top' ? sorted.filter(o => o.compatibility >= 80)
    : sorted.filter(o => o.type === filter);

  const handleApply = (id) => {
    setApplied(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  return (
    <div className="max-w-[860px] mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-dark">Внутренние возможности</h1>
          <p className="text-sm text-secondary mt-0.5">
            AI подобрал {opportunities.length} подходящих позиции
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { key: 'all', label: 'Все' },
            { key: 'top', label: 'Топ совпадение' },
            { key: 'Повышение', label: 'Повышение' },
            { key: 'Переход', label: 'Переход' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
                ${filter === f.key ? 'bg-accent text-white' : 'bg-white border border-border text-secondary hover:border-accent/40'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      <div className="rounded-2xl p-4 border border-accent/20 bg-accent-light/30 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
          <Sparkles size={15} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-dark mb-0.5">AI Анализ совпадений</p>
          <p className="text-xs text-secondary">
            На основе ваших навыков и карьерной цели AI выявил 3 перспективных позиции.
            Лучшее совпадение: <strong className="text-dark">Backend Tech Lead (91%)</strong>.
            До полной готовности нужно закрыть 2 пробела в навыках.
          </p>
        </div>
      </div>

      {/* Opportunities */}
      <div className="space-y-4">
        {filtered.map((opp) => (
          <OpportunityCard
            key={opp.id}
            opp={opp}
            applied={applied.includes(opp.id)}
            onApply={() => handleApply(opp.id)}
            currentSkills={user.skills}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-secondary">
          <Briefcase size={36} className="mx-auto mb-2 text-muted" />
          <p>Позиции не найдены</p>
        </div>
      )}
    </div>
  );
}

function OpportunityCard({ opp, applied, onApply, currentSkills }) {
  const [expanded, setExpanded] = useState(false);
  const compatColor = opp.compatibility >= 85 ? '#10B981' : opp.compatibility >= 70 ? '#F59E0B' : '#8B9DB5';
  const matchingSkills = opp.existingSkills.filter(s => currentSkills.includes(s));
  const missingSkills = opp.requiredSkills;

  return (
    <Card className={`transition-all ${expanded ? 'ring-1 ring-accent/30' : ''}`}>
      {/* Top row */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0">
          <Briefcase size={20} className="text-accent" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-base font-bold text-dark">{opp.title}</h3>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: opp.badgeBg, color: opp.badgeColor }}
                >
                  {opp.badge}
                </span>
              </div>
              <p className="text-sm text-secondary">{opp.department} · {opp.division}</p>
            </div>

            {/* Compatibility Score */}
            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-bold" style={{ color: compatColor }}>{opp.compatibility}%</div>
              <div className="text-[10px] text-secondary">совпадение</div>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-secondary">
            <span className="flex items-center gap-1"><MapPin size={11} /> {opp.location}</span>
            <span className="flex items-center gap-1"><Users size={11} /> {opp.teamSize} чел.</span>
            <span className="flex items-center gap-1"><Clock size={11} /> {opp.remote}</span>
            <span style={{ color: '#10B981', fontWeight: 600 }}>{opp.salaryChange} к зарплате</span>
          </div>

          {/* Skills match */}
          <div className="mt-3">
            <ProgressBar value={opp.compatibility} height={6} color={opp.compatibility >= 85 ? 'success' : 'warning'} />
            <div className="flex justify-between text-[10px] mt-1">
              <span className="text-secondary">
                {matchingSkills.length} / {matchingSkills.length + missingSkills.length} навыков
              </span>
              <span style={{ color: compatColor }}>{opp.compatibility}% готовность</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skill chips */}
      <div className="flex flex-wrap gap-1.5 mt-4">
        {matchingSkills.map(s => (
          <span key={s} className="text-xs px-2 py-1 rounded-lg bg-success-light text-success font-medium flex items-center gap-1">
            <CheckCircle size={10} /> {s}
          </span>
        ))}
        {missingSkills.map(s => (
          <span key={s} className="text-xs px-2 py-1 rounded-lg bg-warning-light text-warning font-medium">
            + {s}
          </span>
        ))}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-border animate-fade-in">
          <p className="text-sm text-secondary mb-4 leading-relaxed">{opp.description}</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-background border border-border">
              <p className="text-xs text-secondary mb-1">Менеджер команды</p>
              <div className="flex items-center gap-2">
                <Avatar initials={opp.managerInitials} color="#005DB9" size="sm" />
                <span className="text-sm font-semibold text-dark">{opp.manager}</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-background border border-border">
              <p className="text-xs text-secondary mb-1">Дедлайн подачи</p>
              <p className="text-sm font-semibold text-dark">{opp.deadline}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-secondary">
            <span className="flex items-center gap-1"><Eye size={11} /> {opp.views} просмотров</span>
            <span className="flex items-center gap-1"><UserCheck size={11} /> {opp.applicants} откликов</span>
            <span>Опубликовано {opp.posted}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-secondary hover:text-dark flex items-center gap-1 font-medium transition-colors"
        >
          {expanded ? 'Скрыть' : 'Подробнее'} <ChevronRight size={13} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
        <div className="flex items-center gap-2">
          {applied ? (
            <Button variant="success" size="sm" icon={<CheckCircle size={13} />} disabled>
              Отклик отправлен
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm">
                Узнать больше
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onApply}
                iconRight={<ArrowUpRight size={13} />}
              >
                Откликнуться
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
