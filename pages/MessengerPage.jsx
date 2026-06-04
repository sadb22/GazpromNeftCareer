import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, Hash, ArrowLeft } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import { channels, directMessages, conversations } from '../data/messages';
import { useApp } from '../context/AppContext';

export default function MessengerPage() {
  const { user } = useApp();
  const [activeChat, setActiveChat] = useState('dm-gromov');
  const [allConvos, setAllConvos] = useState(conversations);
  const [input, setInput] = useState('');
  const [showList, setShowList] = useState(true); // mobile: list vs chat view
  const bottomRef = useRef(null);

  const currentConvo = allConvos[activeChat] || [];
  const allContacts = [...channels, ...directMessages];
  const currentContact = allContacts.find(c => c.id === activeChat);
  const totalUnread = allContacts.reduce((acc, c) => acc + (c.unread || 0), 0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat, allConvos]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newMsg = {
      id: Date.now(),
      sender: user.name,
      initials: user.initials,
      avatarColor: user.avatarColor,
      text: trimmed,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      own: true,
    };
    setAllConvos(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMsg],
    }));
    setInput('');
  };

  return (
    <div className="flex bg-background" style={{ height: 'calc(100vh - 56px)' }}>

      {/* ── Left panel ───────────────────────────── */}
      <div className={`${showList ? 'flex' : 'hidden'} md:flex w-full md:w-72 bg-white border-r border-border flex-col flex-shrink-0`}>
        <div className="px-4 pt-5 pb-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-dark text-base">Сообщения</h2>
            {totalUnread > 0 && (
              <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {totalUnread}
              </span>
            )}
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Поиск..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-background border border-border rounded-xl
                         focus:border-accent/50 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {/* Channels */}
          <p className="px-4 pt-2 pb-1.5 text-[10px] font-semibold text-muted uppercase tracking-wider">
            Каналы
          </p>
          {channels.map(ch => (
            <ChatItem
              key={ch.id}
              active={activeChat === ch.id}
              onClick={() => { setActiveChat(ch.id); setShowList(false); }}
              unread={ch.unread}
              time={ch.time}
              lastMessage={ch.lastMessage}
              title={ch.name}
              avatar={
                <div className="w-9 h-9 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0">
                  <Hash size={15} className="text-accent" />
                </div>
              }
            />
          ))}

          {/* Direct messages */}
          <p className="px-4 pt-3 pb-1.5 text-[10px] font-semibold text-muted uppercase tracking-wider">
            Личные сообщения
          </p>
          {directMessages.map(dm => (
            <ChatItem
              key={dm.id}
              active={activeChat === dm.id}
              onClick={() => { setActiveChat(dm.id); setShowList(false); }}
              unread={dm.unread}
              time={dm.time}
              lastMessage={dm.lastMessage}
              title={dm.name}
              avatar={
                <Avatar initials={dm.initials} color={dm.avatarColor} size="sm" online={dm.online} />
              }
            />
          ))}
        </div>
      </div>

      {/* ── Conversation area ────────────────────── */}
      <div className={`${showList ? 'hidden' : 'flex'} md:flex flex-1 flex-col min-w-0`}>
        {/* Header */}
        <div className="h-14 bg-white border-b border-border flex items-center px-4 gap-3 flex-shrink-0">
          {/* Back button — mobile only */}
          <button
            onClick={() => setShowList(true)}
            className="md:hidden p-1.5 rounded-xl text-secondary hover:bg-background transition-colors flex-shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          {currentContact && (
            <>
              {currentContact.type === 'channel' ? (
                <div className="w-8 h-8 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0">
                  <Hash size={16} className="text-accent" />
                </div>
              ) : (
                <Avatar
                  initials={currentContact.initials}
                  color={currentContact.avatarColor}
                  size="sm"
                  online={currentContact.online}
                />
              )}
              <div>
                <p className="text-sm font-bold text-dark">{currentContact.name}</p>
                {currentContact.role && (
                  <p className="text-xs text-secondary">{currentContact.role}</p>
                )}
                {currentContact.online !== undefined && (
                  <p className="text-[10px]" style={{ color: currentContact.online ? '#1A7A4A' : '#8A919E' }}>
                    {currentContact.online ? '● В сети' : '○ Не в сети'}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {currentConvo.length === 0 ? (
            <div className="h-full flex items-center justify-center text-secondary text-sm">
              Нет сообщений. Начните переписку!
            </div>
          ) : (
            currentConvo.map(msg => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.own ? 'flex-row-reverse' : ''}`}>
                {!msg.own && (
                  <Avatar
                    initials={msg.initials}
                    color={msg.avatarColor}
                    size="sm"
                    className="flex-shrink-0 mt-0.5"
                  />
                )}
                <div className={`flex flex-col gap-0.5 max-w-sm ${msg.own ? 'items-end' : 'items-start'}`}>
                  {!msg.own && (
                    <span className="text-[10px] font-semibold text-secondary px-1">{msg.sender}</span>
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                      ${msg.own
                        ? 'text-white rounded-tr-sm'
                        : 'bg-white border border-border text-dark rounded-tl-sm shadow-sm'}`}
                    style={msg.own ? { backgroundColor: '#003087' } : {}}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-muted px-1">{msg.time}</span>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-border p-4">
          <div className="flex items-center gap-3 bg-background border border-border rounded-2xl
                          px-4 py-2.5 focus-within:border-accent/50 transition-all">
            <input
              type="text"
              placeholder="Написать сообщение..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              className="flex-1 text-sm bg-transparent text-dark placeholder-muted focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                ${input.trim() ? 'bg-accent text-white hover:bg-accent-dark' : 'bg-border text-muted'}`}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatItem({ active, onClick, avatar, title, lastMessage, time, unread }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all
        ${active ? 'bg-accent-light border-r-2 border-accent' : 'hover:bg-background'}`}
    >
      {avatar}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className={`text-sm font-medium truncate ${active ? 'text-accent' : 'text-dark'}`}>
            {title}
          </p>
          <span className="text-[10px] text-muted flex-shrink-0">{time}</span>
        </div>
        <p className="text-xs text-secondary truncate">{lastMessage}</p>
      </div>
      {unread > 0 && (
        <span className="bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full
                         flex items-center justify-center flex-shrink-0">
          {unread}
        </span>
      )}
    </button>
  );
}
