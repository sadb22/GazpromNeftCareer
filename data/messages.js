export const channels = [
  {
    id: 'general',
    name: 'Общий',
    type: 'channel',
    unread: 3,
    lastMessage: 'Не забудьте про ревью в пятницу',
    time: '14:32',
  },
  {
    id: 'ai-data',
    name: 'AI & Data команда',
    type: 'channel',
    unread: 0,
    lastMessage: 'Деплой прошел успешно 🚀',
    time: '12:15',
  },
  {
    id: 'career',
    name: 'Карьерное развитие',
    type: 'channel',
    unread: 1,
    lastMessage: 'Открылась новая вакансия AI Engineer',
    time: '11:04',
  },
  {
    id: 'digital',
    name: 'Цифровые технологии',
    type: 'channel',
    unread: 0,
    lastMessage: 'Следующий спринт стартует в понедельник',
    time: 'вчера',
  },
];

export const directMessages = [
  {
    id: 'dm-gromov',
    name: 'Сергей Громов',
    initials: 'СГ',
    avatarColor: '#005DB9',
    role: 'Team Lead',
    unread: 2,
    lastMessage: 'Как продвигается Python курс?',
    time: '09:48',
    online: true,
  },
  {
    id: 'dm-smirnova',
    name: 'Анна Смирнова',
    initials: 'АС',
    avatarColor: '#8B5CF6',
    role: 'Product Analyst',
    unread: 0,
    lastMessage: 'Спасибо за помощь с SQL!',
    time: 'вчера',
    online: false,
  },
  {
    id: 'dm-hr',
    name: 'HR Отдел',
    initials: 'HR',
    avatarColor: '#EC4899',
    role: 'HR Manager',
    unread: 1,
    lastMessage: 'Приглашение на оценку готово',
    time: 'вчера',
    online: true,
  },
  {
    id: 'dm-noskov',
    name: 'Евгений Носков',
    initials: 'ЕН',
    avatarColor: '#10B981',
    role: 'Head of AI & Data',
    unread: 0,
    lastMessage: 'Жду CV на позицию AI Engineer',
    time: '2 дня назад',
    online: false,
  },
];

export const conversations = {
  general: [
    { id: 1, sender: 'Сергей Громов', initials: 'СГ', avatarColor: '#005DB9', text: 'Всем привет! Напоминаю о квартальном ревью в эту пятницу в 15:00.', time: '14:25', own: false },
    { id: 2, sender: 'Анна Смирнова', initials: 'АС', avatarColor: '#8B5CF6', text: 'Спасибо, записала! Нужно что-то подготовить?', time: '14:27', own: false },
    { id: 3, sender: 'Иван Петров', initials: 'ИП', avatarColor: '#005DB9', text: 'Буду. Подготовлю отчет по прогрессу за квартал.', time: '14:29', own: true },
    { id: 4, sender: 'Сергей Громов', initials: 'СГ', avatarColor: '#005DB9', text: 'Не забудьте про ревью в пятницу. Подготовьте краткий отчет о прогрессе за квартал — примерно 5-7 слайдов.', time: '14:32', own: false },
  ],
  'ai-data': [
    { id: 1, sender: 'Евгений Носков', initials: 'ЕН', avatarColor: '#10B981', text: 'Команда, деплой модели v2.3 прошел успешно 🚀', time: '12:10', own: false },
    { id: 2, sender: 'Мария Волкова', initials: 'МВ', avatarColor: '#F59E0B', text: 'Отлично! Метрики улучшились на 12%', time: '12:13', own: false },
    { id: 3, sender: 'Иван Петров', initials: 'ИП', avatarColor: '#005DB9', text: 'Деплой прошел успешно 🚀', time: '12:15', own: true },
  ],
  career: [
    { id: 1, sender: 'HR Отдел', initials: 'HR', avatarColor: '#EC4899', text: 'Коллеги, открылась новая вакансия AI Engineer в команду Upstream Digital. Высокое совпадение с несколькими сотрудниками!', time: '11:00', own: false },
    { id: 2, sender: 'Иван Петров', initials: 'ИП', avatarColor: '#005DB9', text: 'Интересно! Открылась новая вакансия AI Engineer', time: '11:04', own: true },
  ],
  digital: [
    { id: 1, sender: 'Алексей Новиков', initials: 'АН', avatarColor: '#F97316', text: 'Следующий спринт стартует в понедельник. Планирование в 10:00.', time: 'вчера', own: false },
  ],
  'dm-gromov': [
    { id: 1, sender: 'Сергей Громов', initials: 'СГ', avatarColor: '#005DB9', text: 'Привет! Видел что ты записался на Python ML курс — молодец! 👍', time: '09:40', own: false },
    { id: 2, sender: 'Иван Петров', initials: 'ИП', avatarColor: '#005DB9', text: 'Да, уже прошел 65%. Очень интересно, особенно блок про pandas.', time: '09:43', own: true },
    { id: 3, sender: 'Сергей Громов', initials: 'СГ', avatarColor: '#005DB9', text: 'Как продвигается Python курс? Скоро будем рассматривать кандидатов на AI Engineer.', time: '09:48', own: false },
  ],
  'dm-smirnova': [
    { id: 1, sender: 'Анна Смирнова', initials: 'АС', avatarColor: '#8B5CF6', text: 'Ваня, ты не подскажешь как сделать оконные функции в PostgreSQL?', time: 'вчера', own: false },
    { id: 2, sender: 'Иван Петров', initials: 'ИП', avatarColor: '#005DB9', text: 'Конечно! Используй OVER (PARTITION BY ... ORDER BY ...). Покажу пример.', time: 'вчера', own: true },
    { id: 3, sender: 'Анна Смирнова', initials: 'АС', avatarColor: '#8B5CF6', text: 'Спасибо за помощь с SQL!', time: 'вчера', own: false },
  ],
  'dm-hr': [
    { id: 1, sender: 'HR Отдел', initials: 'HR', avatarColor: '#EC4899', text: 'Иван, добрый день! Приглашение на оценку компетенций готово. Дата: 10 июня, 11:00.', time: 'вчера', own: false },
    { id: 2, sender: 'Иван Петров', initials: 'ИП', avatarColor: '#005DB9', text: 'Приглашение на оценку готово', time: 'вчера', own: true },
  ],
  'dm-noskov': [
    { id: 1, sender: 'Евгений Носков', initials: 'ЕН', avatarColor: '#10B981', text: 'Иван, вижу высокое совпадение с позицией AI Engineer. Заинтересован?', time: '2 дня назад', own: false },
    { id: 2, sender: 'Иван Петров', initials: 'ИП', avatarColor: '#005DB9', text: 'Да, очень! Активно прохожу нужные курсы.', time: '2 дня назад', own: true },
    { id: 3, sender: 'Евгений Носков', initials: 'ЕН', avatarColor: '#10B981', text: 'Жду CV на позицию AI Engineer', time: '2 дня назад', own: false },
  ],
};
