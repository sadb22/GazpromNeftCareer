import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { useApp } from '../context/AppContext';

/* ── AI response logic ─────────────────────────────────── */

const aiRules = [
  {
    keywords: ['python', 'питон'],
    answer: `Для перехода в AI Engineering рекомендую начать с **«Python для ML и Data Science»** — этот курс уже назначен вам и вы прошли 65%.

Следующий шаг после завершения: **MLOps Foundations** (зависит от Python ML).

📚 Оценочное время: 8 часов оставшегося материала (~3–4 недели при 2 ч/нед)`,
  },
  {
    keywords: ['mlops', 'деплой', 'деплоить'],
    answer: `MLOps — критичный навык для вашей целевой роли **Senior AI Engineer**.

Рекомендую курс **«MLOps: Деплой и мониторинг моделей»** на Coursera.
- ⏱️ Длительность: 12 часов
- 📅 Рекомендуемый старт: после завершения Python ML курса
- 📦 Зависимость: Python → ML Foundations → **MLOps**

Навык закроет второй по приоритету пробел в вашем профиле.`,
  },
  {
    keywords: ['ai engineer', 'аи инженер', 'перейти', 'переход', 'стать'],
    answer: `Ваш текущий прогресс к **Senior AI Engineer**: 45% (прогноз — Q1 2027).

Для перехода нужно закрыть 4 пробела в порядке приоритета:
1. 🔴 Machine Learning ← Python ML курс (в процессе, 65%)
2. 🔴 MLOps ← MLOps курс на Coursera
3. 🔴 Cloud AI ← AWS SageMaker курс (в процессе, 20%)
4. 🟡 LLM Engineering ← курс Yandex School (желательно)

Хорошая новость: **Backend Tech Lead** доступен уже сейчас — совпадение 91%. Это промежуточный шаг с ростом зарплаты +25%.`,
  },
  {
    keywords: ['аналитик', 'аналитику', 'product manager', 'продакт'],
    answer: `Для перехода в **Product Management** из текущей роли Backend Developer:

Ключевые пробелы:
- Product Strategy — нет в профиле
- P&L Management — нет в профиле
- Stakeholder Communication — частично есть

Рекомендую сначала посмотреть позицию **Data Platform Lead** (74% совпадение) — это промежуточный шаг с уклоном в аналитику данных.

📌 Переход в PM потребует 12–18 месяцев при активном обучении.`,
  },
  {
    keywords: ['курс', 'курсы', 'обучение', 'учиться', 'учить'],
    answer: `Ваши текущие активные курсы:
- 📚 **Python для ML** — 65% (дедлайн 15 июня)
- ☁️ **Cloud AI на базе AWS** — 20%

Рекомендованные, но не начатые:
- ⚙️ MLOps: Деплой и мониторинг — приоритет после Python ML
- 🧠 LLM Engineering — желательно к Q1 2027

Всего пройдено 7 курсов, 124 часа обучения.`,
  },
  {
    keywords: ['зарплата', 'грейд', 'grade', 'уровень'],
    answer: `На основе вашего профиля и целевой роли:

- Текущий уровень: **Middle Backend Developer**
- Промежуточная цель: **Senior Backend / Tech Lead** (+25% к зарплате)
- Финальная цель: **Senior AI Engineer** (~+40% от текущего)

Для повышения грейда в текущей роли нужен следующий ревью-цикл (Q2 2026 — уже запланирован).`,
  },
  {
    keywords: ['готовность', 'когда', 'сколько', 'времени'],
    answer: `Ваша текущая готовность к переходу: **68%** (+5% за последний месяц).

При текущем темпе обучения (≈29 ч/мес в июне):
- **Q3 2026** — завершение Python ML + Cloud AI
- **Q4 2026** — старт MLOps + Shadow Project
- **Q1 2027** — готовность к финальному интервью

Чтобы ускорить: +2 ч/нед на MLOps даст ~6 недель выигрыша.`,
  },
];

const quickQuestions = [
  'Как перейти в AI Engineer?',
  'Какой курс по Python?',
  'Когда я буду готов к переходу?',
  'Что такое MLOps и зачем он нужен?',
  'Какие курсы рекомендуются?',
];

function getAiAnswer(text) {
  const lower = text.toLowerCase();
  for (const rule of aiRules) {
    if (rule.keywords.some(k => lower.includes(k))) return rule.answer;
  }
  return `Хороший вопрос! Исходя из вашего профиля (**Backend Developer → Senior AI Engineer**), вот что я рекомендую:

Приоритет на ближайший квартал:
1. Завершить Python ML курс (осталось 35%)
2. Начать Cloud AI курс более активно (сейчас 20%)
3. Запланировать MLOps после июля

Если хотите уточнить — спросите конкретнее: "Как перейти в AI Engineer?" или "Какой курс по MLOps?"`;
}

function renderAnswer(text) {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    // bold markers
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className="mb-1 leading-relaxed">
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
      </p>
    );
  });
}

/* ── Component ─────────────────────────────────────────── */

export default function Messenger() {
  const { user } = useApp();
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'ai',
      text: `Привет, **${user.name}**! Я ваш AI-карьерный ассистент.\n\nМогу помочь:\n- Выбрать следующий курс\n- Объяснить что нужно для перехода в **${user.targetRole}**\n- Рассказать о вашем прогрессе и пробелах\n\nСпросите меня о чём угодно, связанном с вашей карьерой.`,
      time: 'Сейчас',
    },
  ]);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const bottomRef             = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg = { id: Date.now(), role: 'user', text: trimmed, time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    const delay = 800 + Math.random() * 600;
    setTimeout(() => {
      const answer = getAiAnswer(trimmed);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: answer, time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) }]);
      setTyping(false);
    }, delay);
  };

  const handleReset = () => {
    setMessages([{
      id: Date.now(), role: 'ai',
      text: `Начнём сначала! Я ваш AI-карьерный ассистент.\n\nЧто вас интересует?`,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] bg-background">

      {/* Left panel — quick questions */}
      <div className="w-56 bg-white border-r border-border flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-dark">AI Ассистент</p>
              <p className="text-[10px] text-success font-medium">● Онлайн</p>
            </div>
          </div>
        </div>

        <div className="p-3 flex-1">
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wide mb-2">Быстрые вопросы</p>
          <div className="space-y-1">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                disabled={typing}
                className="w-full text-left text-xs text-secondary p-2 rounded-lg hover:bg-background hover:text-dark transition-colors leading-snug flex items-start gap-1.5 group"
              >
                <ChevronRight size={11} className="flex-shrink-0 mt-0.5 text-muted group-hover:text-accent" />
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-border">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs text-secondary hover:border-accent/40 hover:text-dark transition-colors"
          >
            <RefreshCw size={12} /> Начать заново
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-14 bg-white border-b border-border flex items-center px-5 gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center">
            <Sparkles size={15} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-dark">AI Карьерный Ассистент</p>
            <p className="text-xs text-secondary">Карьера · Обучение · Развитие</p>
          </div>
          <Badge variant="accent" className="ml-auto text-[10px]">Личный ассистент</Badge>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'ai' ? (
                <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                  <Sparkles size={14} className="text-white" />
                </div>
              ) : (
                <Avatar initials={user.initials} color={user.avatarColor} size="sm" className="flex-shrink-0" />
              )}
              <div className={`max-w-lg flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
                  ${msg.role === 'user'
                    ? 'bg-accent text-white rounded-tr-sm'
                    : 'bg-white border border-border text-dark rounded-tl-sm shadow-sm'}`}>
                  {renderAnswer(msg.text)}
                </div>
                <span className="text-[10px] text-muted px-1">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                <Sparkles size={14} className="text-white" />
              </div>
              <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center h-4">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-border p-4">
          <div className="flex items-center gap-3 bg-background border border-border rounded-2xl px-4 py-2.5 focus-within:border-accent/50 transition-all">
            <input
              type="text"
              placeholder="Спросите о карьере, курсах, переходе..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              disabled={typing}
              className="flex-1 text-sm bg-transparent text-dark placeholder-muted focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing}
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                ${input.trim() && !typing ? 'bg-accent text-white hover:bg-accent-dark' : 'bg-border text-muted'}`}
            >
              <Send size={14} />
            </button>
          </div>
          <p className="text-[10px] text-muted text-center mt-2">AI-ответы генерируются на основе вашего профиля и карьерного трека</p>
        </div>
      </div>
    </div>
  );
}
