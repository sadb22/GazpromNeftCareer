import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, RefreshCw, Wifi, WifiOff, ChevronRight } from 'lucide-react';
import { managerUser, teamMembers } from '../../data/managerData';

const OLLAMA_URL = 'http://localhost:11434/api/chat';
const MODEL      = 'qwen2.5:32b-instruct';

const SYSTEM_PROMPT = `You are an AI assistant for a T&D (Training & Development) manager at Gazprom Neft.
You help the manager monitor team development, Individual Development Plan (IDP) progress, and employee readiness for career transitions.
Team context:
- ${teamMembers.length} employees total
- ${teamMembers.filter(m => m.idpStatus === 'ready').length} ready for transition
- ${teamMembers.filter(m => m.idpStatus === 'pending_approval').length} pending IDP approval
- ${teamMembers.filter(m => m.idpStatus === 'in_progress').length} active IDPs
Answer in Russian. Be concise and actionable. Use bullet points where helpful.`;

const QUICK_QUESTIONS = [
  'Кто готов к переходу в этом квартале?',
  'У кого самые большие пробелы в компетенциях?',
  'Что нужно сделать, чтобы утвердить ИПР Анны?',
  'Кому нужна поддержка в обучении?',
  'Как ускорить развитие Ивана Петрова?',
];

/* ── Fallback answers (when Ollama unavailable) ──────── */
const FALLBACK = [
  {
    keys: ['готов', 'переход', 'квартал'],
    answer: `**Готов к переходу:**
• Дмитрий Козлов (92% ИПР) — рекомендован к переводу на Principal Engineer. Осталось завершить Team Leadership курс.

Близко к готовности:
• Анна Смирнова (78%) — ИПР ожидает вашего утверждения. Финальный шаг перед подачей на Lead PM.`,
  },
  {
    keys: ['пробел', 'компетен', 'gap'],
    answer: `**Наибольшие пробелы:**
• Мария Волкова — MLOps 10/70, Deep Learning 25/80. Нужна структурированная поддержка.
• Иван Петров — MLOps 15/75. Курс Coursera назначен, но не начат.
• Анна Смирнова — P&L Management 30/80. Рекомендуется внешнее обучение.`,
  },
  {
    keys: ['анна', 'утверд', 'идп'],
    answer: `**Для утверждения ИПР Анны Смирновой:**
ИПР готов к рассмотрению. Ключевые шаги:
1. Просмотреть документ во вкладке "Команда" → Анна Смирнова → "Утвердить ИПР"
2. Согласовать бюджет курса P&L Management (~40 часов)
3. Определить ментора для Product Strategy блока

Прогресс: 78% · Оценка 360°: 88% · KPI: 91%`,
  },
  {
    keys: ['поддержка', 'обучение', 'помощь'],
    answer: `**Требуют поддержки:**
• **Алексей Новиков** — нет ИПР. Рекомендуется инициировать встречу для планирования.
• **Мария Волкова** — высокая мотивация, но нужен ментор для Production ML.
• **Иван Петров** — назначен MLOps курс, но не начат. Рекомендую 1:1 для активации.`,
  },
  {
    keys: ['иван', 'петров', 'ускор'],
    answer: `**Ускорение развития Ивана Петрова:**
Текущий прогресс: 45% · Прогноз: Q1 2027

Рекомендую:
1. Активировать MLOps курс (Coursera) — сейчас не начат, критичный для AI Engineer
2. Назначить Shadow Project в AI Team → Q4 2026
3. Рассмотреть промежуточную роль Backend Tech Lead (91% совпадение) как ступеньку

При темпе +2ч/нед на MLOps — сдвиг прогноза на Q4 2026.`,
  },
];

function getFallback(text) {
  const lower = text.toLowerCase();
  for (const f of FALLBACK) {
    if (f.keys.some(k => lower.includes(k))) return f.answer;
  }
  return `Хороший вопрос. Исходя из данных команды:

• **Приоритет 1:** Утвердить ИПР Анны Смирновой (ожидает с вчера)
• **Приоритет 2:** Помочь Алексею Новикову начать ИПР
• **Приоритет 3:** Поговорить с Иваном о старте MLOps курса

Уточните вопрос — я помогу с конкретным сотрудником или задачей.`;
}

function renderText(text) {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className="mb-1 leading-relaxed">
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
      </p>
    );
  });
}

export default function ManagerChat() {
  const [messages, setMessages]     = useState([{
    id: 1, role: 'ai',
    text: `Здравствуйте, **${managerUser.name}**! Я ваш AI-ассистент по развитию команды.\n\nМогу помочь:\n- Проанализировать прогресс ИПР\n- Определить приоритеты развития\n- Подготовить решение по утверждению планов\n\nЗадайте любой вопрос о вашей команде.`,
    time: 'Сейчас',
  }]);
  const [input,   setInput]   = useState('');
  const [typing,  setTyping]  = useState(false);
  const [ollamaOk, setOllamaOk] = useState(null); // null | true | false
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  /* Check if Ollama is alive */
  useEffect(() => {
    fetch('http://localhost:11434/api/tags', { signal: AbortSignal.timeout(2000) })
      .then(() => setOllamaOk(true))
      .catch(() => setOllamaOk(false));
  }, []);

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now(), role: 'user', text: trimmed,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const history = messages.map(m => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.text,
    }));

    if (ollamaOk) {
      try {
        const res = await fetch(OLLAMA_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...history,
              { role: 'user', content: trimmed },
            ],
            stream: false,
          }),
          signal: AbortSignal.timeout(30000),
        });

        if (!res.ok) throw new Error('Ollama error');
        const data = await res.json();
        const aiText = data?.message?.content || 'Не могу ответить на этот вопрос.';

        setMessages(prev => [...prev, {
          id: Date.now() + 1, role: 'ai', text: aiText,
          time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
        }]);
      } catch {
        setOllamaOk(false);
        addFallback(trimmed);
      }
    } else {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 500));
      addFallback(trimmed);
    }
    setTyping(false);
  };

  const addFallback = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now() + 1, role: 'ai', text: getFallback(text),
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  return (
    <div className="max-w-[820px] mx-auto h-[calc(100vh-72px)] flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-dark">AI-чат</h1>
          <p className="text-sm text-secondary mt-0.5">Ассистент по развитию команды</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border border-border bg-white">
          {ollamaOk === true  && <><Wifi size={12} className="text-success" /> <span className="text-success">Ollama подключён</span></>}
          {ollamaOk === false && <><WifiOff size={12} className="text-muted" /> <span className="text-muted">Демо-режим</span></>}
          {ollamaOk === null  && <><div className="w-2 h-2 rounded-full bg-warning animate-pulse" /> <span className="text-secondary">Проверка...</span></>}
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Quick questions */}
        <div className="w-48 flex-shrink-0 bg-white rounded-2xl border border-border shadow-card p-3 flex flex-col gap-2 h-fit">
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wide">Быстрые вопросы</p>
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => send(q)}
              disabled={typing}
              className="text-left text-xs text-secondary p-2 rounded-lg hover:bg-background hover:text-dark transition-colors leading-snug flex items-start gap-1.5 group"
            >
              <ChevronRight size={11} className="flex-shrink-0 mt-0.5 text-muted group-hover:text-accent" />
              {q}
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl border border-border shadow-card overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'ai' ? (
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#003366' }}
                  >
                    <Bot size={15} className="text-white" />
                  </div>
                ) : (
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: '#003366' }}
                  >
                    {managerUser.initials}
                  </div>
                )}
                <div className={`max-w-lg flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
                      ${msg.role === 'user'
                        ? 'text-white rounded-tr-sm'
                        : 'bg-background border border-border text-dark rounded-tl-sm'}`}
                    style={msg.role === 'user' ? { backgroundColor: '#003366' } : {}}
                  >
                    {renderText(msg.text)}
                  </div>
                  <span className="text-[10px] text-muted px-1">{msg.time}</span>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#003366' }}
                >
                  <Bot size={15} className="text-white" />
                </div>
                <div className="bg-background border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center h-4">
                    {[0, 150, 300].map(d => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ backgroundColor: '#003366', animationDelay: `${d}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            {ollamaOk === false && (
              <p className="text-xs text-muted text-center mb-2">
                Ollama не подключён · Работает демо-режим с mock-ответами
              </p>
            )}
            <div className="flex items-center gap-3 bg-background border border-border rounded-2xl px-4 py-2.5 focus-within:border-accent/40 transition-all">
              <input
                type="text"
                placeholder="Спросите о команде, ИПР, развитии..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
                disabled={typing}
                className="flex-1 text-sm bg-transparent text-dark placeholder-muted focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || typing}
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-40"
                style={{ backgroundColor: input.trim() && !typing ? '#003366' : '#E8EBF2' }}
              >
                <Send size={14} className={input.trim() && !typing ? 'text-white' : 'text-muted'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
