import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { managerMessages, managerUser } from '../../data/managerData';

const PRIMARY = '#003366';

export default function ManagerMessages() {
  const [convos, setConvos] = useState(
    managerMessages.reduce((acc, m) => ({ ...acc, [m.id]: m.conversation }), {})
  );
  const [active, setActive] = useState(managerMessages[0]);
  const [input,  setInput]  = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active, convos]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const msg = {
      id: Date.now(), own: true, text: trimmed,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
    };
    setConvos(prev => ({ ...prev, [active.id]: [...(prev[active.id] || []), msg] }));
    setInput('');
  };

  return (
    <div className="flex h-[calc(100vh-56px)] bg-background">
      {/* Contacts list */}
      <div className="w-64 bg-white border-r border-border flex flex-col flex-shrink-0">
        <div className="px-4 py-4 border-b border-border">
          <h2 className="font-bold text-dark text-sm">Сообщения</h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {managerMessages.map(m => (
            <button
              key={m.id}
              onClick={() => setActive(m)}
              className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-background
                ${active.id === m.id ? 'bg-[#EEF2F8]' : ''}`}
            >
              <div className="relative flex-shrink-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: m.avatarColor }}
                >
                  {m.initials}
                </div>
                {m.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <p className="text-sm font-semibold text-dark truncate">{m.from}</p>
                  <span className="text-[10px] text-muted flex-shrink-0">{m.time}</span>
                </div>
                <p className="text-xs text-secondary truncate">{m.lastMessage}</p>
              </div>
              {m.unread > 0 && (
                <span
                  className="min-w-[18px] h-4.5 flex items-center justify-center rounded-full text-[10px] font-bold text-white px-1 flex-shrink-0"
                  style={{ backgroundColor: '#C0392B' }}
                >
                  {m.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-14 bg-white border-b border-border flex items-center px-5 gap-3 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: active.avatarColor }}
          >
            {active.initials}
          </div>
          <div>
            <p className="text-sm font-bold text-dark">{active.from}</p>
            <p className="text-xs text-secondary">{active.role} · {active.online ? 'онлайн' : 'не в сети'}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {(convos[active.id] || []).map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.own ? 'flex-row-reverse' : ''}`}>
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ backgroundColor: msg.own ? PRIMARY : active.avatarColor }}
              >
                {msg.own ? managerUser.initials : active.initials}
              </div>
              <div className={`max-w-sm flex flex-col gap-1 ${msg.own ? 'items-end' : 'items-start'}`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                    ${msg.own ? 'text-white rounded-tr-sm' : 'bg-white border border-border text-dark rounded-tl-sm shadow-sm'}`}
                  style={msg.own ? { backgroundColor: PRIMARY } : {}}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-muted px-1">{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-border p-4">
          <div className="flex items-center gap-3 bg-background border border-border rounded-2xl px-4 py-2.5 focus-within:border-accent/40 transition-all">
            <input
              type="text"
              placeholder={`Написать ${active.from}...`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              className="flex-1 text-sm bg-transparent text-dark placeholder-muted focus:outline-none"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40"
              style={{ backgroundColor: input.trim() ? PRIMARY : '#E8EBF2' }}
            >
              <Send size={14} className={input.trim() ? 'text-white' : 'text-muted'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
