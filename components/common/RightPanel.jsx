import React from 'react';
import { Sparkles, AlertCircle, Activity, ArrowUpRight, Clock, TrendingUp, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';

const aiInsights = [
  {
    id: 1,
    icon: <Brain size={14} />,
    title: 'Высокое совпадение',
    text: 'Backend Tech Lead: 91% совпадение с вашим профилем. Осталось 2 навыка.',
    action: 'Открыть',
    route: '/opportunities',
    color: '#10B981',
    bg: '#D1FAE5',
  },
  {
    id: 2,
    icon: <Sparkles size={14} />,
    title: 'AI-рекомендация',
    text: 'Завершите Python ML курс до 15 июня — ускорит готовность к переходу на 18%.',
    action: 'Учиться',
    route: '/learning',
    color: '#005DB9',
    bg: '#E8F0FA',
  },
  {
    id: 3,
    icon: <AlertCircle size={14} />,
    title: 'Пробел в навыках',
    text: 'MLOps — критичный навык для AI Engineer. Рекомендован курс Coursera.',
    action: 'Записаться',
    route: '/learning',
    color: '#F59E0B',
    bg: '#FEF3C7',
  },
];

const activityFeed = [
  { id: 1, text: 'Прогресс курса Python ML: 65%', time: '2 ч назад', icon: '📚' },
  { id: 2, text: 'Просмотрена вакансия AI Engineer', time: '5 ч назад', icon: '👀' },
  { id: 3, text: 'Сообщение от Сергея Громова', time: '1 д назад', icon: '💬' },
  { id: 4, text: 'Добавлен навык Docker', time: '3 д назад', icon: '✅' },
];

const managerSignals = [
  { label: 'Вовлеченность', value: 84, color: '#10B981' },
  { label: 'Производительность', value: 78, color: '#005DB9' },
  { label: 'Обучение', value: 90, color: '#8B5CF6' },
];

export default function RightPanel() {
  const navigate = useNavigate();

  return (
    <aside className="hidden xl:flex flex-col w-[280px] flex-shrink-0 bg-white border-l border-border overflow-y-auto">
      <div className="p-4 space-y-4">

        {/* AI Insights */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-accent" />
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">AI Инсайты</h3>
          </div>
          <div className="space-y-2">
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                className="p-3 rounded-xl border border-border hover:border-accent/30 transition-all cursor-pointer group"
                onClick={() => navigate(insight.route)}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: insight.bg, color: insight.color }}>
                    {insight.icon}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: insight.color }}>{insight.title}</span>
                </div>
                <p className="text-xs text-secondary leading-relaxed mb-2">{insight.text}</p>
                <button
                  className="text-xs font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all"
                  style={{ color: insight.color }}
                >
                  {insight.action} <ArrowUpRight size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Manager Signals */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-secondary" />
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">Сигналы менеджера</h3>
          </div>
          <div className="p-3 rounded-xl bg-background border border-border space-y-3">
            {managerSignals.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-secondary">{s.label}</span>
                  <span className="text-xs font-bold" style={{ color: s.color }}>{s.value}%</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.value}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
            <p className="text-xs text-muted">Обновлено: сегодня, 09:00</p>
          </div>
        </div>

        {/* Mobility Alert */}
        <div className="p-3 rounded-xl bg-success-light border border-success/20">
          <div className="flex items-start gap-2">
            <span className="text-base">🚀</span>
            <div>
              <p className="text-xs font-semibold text-success mb-0.5">Мобильность</p>
              <p className="text-xs text-secondary leading-relaxed">
                AI определил вас как <strong>готового к переходу</strong>. Рекомендован следующий шаг — интервью с командой AI & Data.
              </p>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity size={14} className="text-secondary" />
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">Активность</h3>
          </div>
          <div className="space-y-2">
            {activityFeed.map((item) => (
              <div key={item.id} className="flex items-start gap-2.5">
                <span className="text-sm flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-xs text-dark leading-snug">{item.text}</p>
                  <p className="text-[10px] text-muted mt-0.5 flex items-center gap-1">
                    <Clock size={9} /> {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}
