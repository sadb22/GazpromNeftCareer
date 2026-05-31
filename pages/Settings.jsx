import React, { useState } from 'react';
import { Bell, Shield, User, Globe, Palette, Save } from 'lucide-react';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const sections = [
  { key: 'profile', icon: <User size={16} />, label: 'Профиль' },
  { key: 'notifications', icon: <Bell size={16} />, label: 'Уведомления' },
  { key: 'privacy', icon: <Shield size={16} />, label: 'Конфиденциальность' },
  { key: 'language', icon: <Globe size={16} />, label: 'Язык и регион' },
  { key: 'appearance', icon: <Palette size={16} />, label: 'Интерфейс' },
];

export default function Settings() {
  const [active, setActive] = useState('notifications');
  const [notifs, setNotifs] = useState({
    careerUpdates: true,
    learningReminders: true,
    opportunities: true,
    messages: true,
    reviews: true,
    emailDigest: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-[820px] mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-dark">Настройки</h1>
        <p className="text-sm text-secondary mt-0.5">Управление аккаунтом и предпочтениями</p>
      </div>

      <div className="flex gap-5">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {sections.map(s => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left
                ${active === s.key ? 'bg-accent-light text-accent font-semibold' : 'text-secondary hover:bg-background hover:text-dark'}`}
            >
              <span className={active === s.key ? 'text-accent' : 'text-muted'}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {active === 'notifications' && (
            <Card>
              <CardHeader title="Уведомления" subtitle="Управление оповещениями" icon={<Bell size={18} />} iconBg="#FEF3C7" iconColor="#F59E0B" />
              <div className="space-y-4">
                {[
                  { key: 'careerUpdates', label: 'Обновления карьерного пути', desc: 'Новые рекомендации AI и изменения маршрута' },
                  { key: 'learningReminders', label: 'Напоминания об обучении', desc: 'Дедлайны и прогресс по курсам' },
                  { key: 'opportunities', label: 'Внутренние возможности', desc: 'Новые позиции с высоким совпадением' },
                  { key: 'messages', label: 'Сообщения', desc: 'Личные сообщения и упоминания в каналах' },
                  { key: 'reviews', label: 'Ревью и встречи', desc: 'Напоминания о запланированных событиях' },
                  { key: 'emailDigest', label: 'Email-дайджест', desc: 'Еженедельная сводка на почту' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border">
                    <div>
                      <p className="text-sm font-semibold text-dark">{label}</p>
                      <p className="text-xs text-secondary mt-0.5">{desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifs(prev => ({ ...prev, [key]: !prev[key] }))}
                      className={`w-11 h-6 rounded-full transition-all flex-shrink-0 relative
                        ${notifs[key] ? 'bg-accent' : 'bg-border'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all
                        ${notifs[key] ? 'left-[22px]' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-end">
                <Button variant="primary" size="md" icon={<Save size={14} />} onClick={handleSave}>
                  {saved ? 'Сохранено!' : 'Сохранить'}
                </Button>
              </div>
            </Card>
          )}

          {active === 'profile' && (
            <Card>
              <CardHeader title="Профиль" subtitle="Личные данные" icon={<User size={18} />} iconBg="#E8F0FA" iconColor="#005DB9" />
              <div className="space-y-4">
                {[
                  { label: 'Имя', value: 'Иван Петров', type: 'text' },
                  { label: 'Email', value: 'i.petrov@gazpromneft.ru', type: 'email' },
                  { label: 'Телефон', value: '+7 (495) 123-45-67', type: 'tel' },
                  { label: 'Отдел', value: 'Цифровые технологии', type: 'text' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs font-semibold text-secondary mb-1.5 block">{f.label}</label>
                    <input
                      type={f.type}
                      defaultValue={f.value}
                      className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-xl text-dark focus:border-accent/50 transition-all"
                    />
                  </div>
                ))}
                <div className="flex justify-end mt-2">
                  <Button variant="primary" size="md" onClick={handleSave}>
                    {saved ? 'Сохранено!' : 'Сохранить'}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {(active === 'privacy' || active === 'language' || active === 'appearance') && (
            <Card>
              <div className="py-12 text-center text-secondary">
                <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center mx-auto mb-3">
                  {sections.find(s => s.key === active)?.icon}
                </div>
                <p className="text-sm font-semibold text-dark mb-1">{sections.find(s => s.key === active)?.label}</p>
                <p className="text-xs">Этот раздел в разработке</p>
                <Badge variant="muted" className="mt-3">Скоро</Badge>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
