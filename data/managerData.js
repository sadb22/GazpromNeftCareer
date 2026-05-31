// ── Team members (IDP-enriched) ──────────────────────────────────────────────

export const teamMembers = [
  {
    id: 1,
    name: 'Иван Петров',
    initials: 'ИП',
    avatarColor: '#005DB9',
    role: 'Backend Developer',
    level: 'Middle',
    department: 'Цифровые технологии',
    targetRole: 'Senior AI Engineer',
    idpStatus: 'in_progress',       // in_progress | pending_approval | ready | no_idp
    idpProgress: 45,
    score360: 74,
    kpiScore: 82,
    engagementScore: 84,
    yearsAtCompany: 3.5,
    gaps: [
      { skill: 'Machine Learning', current: 38, required: 85 },
      { skill: 'MLOps',            current: 15, required: 75 },
      { skill: 'Cloud AI',         current: 28, required: 70 },
      { skill: 'Python',           current: 85, required: 90 },
    ],
    courses: [
      { title: 'Python для ML и Data Science',  status: 'in_progress', progress: 65 },
      { title: 'Cloud AI на базе AWS',           status: 'in_progress', progress: 20 },
      { title: 'MLOps: Деплой и мониторинг',    status: 'not_started',  progress: 0  },
      { title: 'SQL Advanced',                   status: 'completed',    progress: 100 },
    ],
    nextReview: '5 июня 2026',
    notes: 'Хорошая динамика по Python. Нужно активировать MLOps-трек.',
  },
  {
    id: 2,
    name: 'Анна Смирнова',
    initials: 'АС',
    avatarColor: '#6D4FA0',
    role: 'Product Analyst',
    level: 'Middle+',
    department: 'Продуктовые решения',
    targetRole: 'Lead Product Manager',
    idpStatus: 'pending_approval',
    idpProgress: 78,
    score360: 88,
    kpiScore: 91,
    engagementScore: 91,
    yearsAtCompany: 2.8,
    gaps: [
      { skill: 'Product Strategy',  current: 55, required: 85 },
      { skill: 'P&L Management',    current: 30, required: 80 },
      { skill: 'Stakeholder Mgmt',  current: 72, required: 85 },
      { skill: 'SQL',               current: 90, required: 80 },
    ],
    courses: [
      { title: 'Product Strategy Fundamentals', status: 'in_progress', progress: 80 },
      { title: 'P&L для PM',                    status: 'not_started',  progress: 0  },
      { title: 'Корпоративное лидерство',       status: 'completed',    progress: 100 },
    ],
    nextReview: '10 июня 2026',
    notes: 'Готова к переходу. ИПР ожидает вашего утверждения.',
  },
  {
    id: 3,
    name: 'Дмитрий Козлов',
    initials: 'ДК',
    avatarColor: '#1D9E75',
    role: 'DevOps Engineer',
    level: 'Senior',
    department: 'Инфраструктура',
    targetRole: 'Principal Engineer',
    idpStatus: 'ready',
    idpProgress: 92,
    score360: 82,
    kpiScore: 88,
    engagementScore: 76,
    yearsAtCompany: 5.2,
    gaps: [
      { skill: 'Architecture',    current: 82, required: 90 },
      { skill: 'Team Leadership', current: 78, required: 85 },
      { skill: 'Kubernetes',      current: 95, required: 90 },
      { skill: 'Cost Optim.',     current: 70, required: 75 },
    ],
    courses: [
      { title: 'System Architecture',  status: 'completed',    progress: 100 },
      { title: 'Team Leadership',       status: 'in_progress',  progress: 60  },
      { title: 'Principal Engineer Path', status: 'not_started', progress: 0  },
    ],
    nextReview: '12 июня 2026',
    notes: 'Высокий уровень готовности. Рекомендован к переводу.',
  },
  {
    id: 4,
    name: 'Мария Волкова',
    initials: 'МВ',
    avatarColor: '#B45309',
    role: 'Data Scientist',
    level: 'Junior',
    department: 'AI & Data',
    targetRole: 'Senior Data Scientist',
    idpStatus: 'in_progress',
    idpProgress: 28,
    score360: 91,
    kpiScore: 79,
    engagementScore: 96,
    yearsAtCompany: 1.2,
    gaps: [
      { skill: 'Deep Learning',   current: 25, required: 80 },
      { skill: 'MLOps',           current: 10, required: 70 },
      { skill: 'Production ML',   current: 20, required: 75 },
      { skill: 'Python',          current: 72, required: 85 },
    ],
    courses: [
      { title: 'Deep Learning Fundamentals', status: 'in_progress', progress: 35 },
      { title: 'Production ML Systems',      status: 'not_started',  progress: 0  },
      { title: 'MLOps Certification',        status: 'not_started',  progress: 0  },
    ],
    nextReview: '20 июня 2026',
    notes: 'Высокая мотивация, быстро обучается. Нужна поддержка в practical ML.',
  },
  {
    id: 5,
    name: 'Алексей Новиков',
    initials: 'АН',
    avatarColor: '#C05621',
    role: 'Frontend Developer',
    level: 'Middle',
    department: 'Цифровые технологии',
    targetRole: 'Tech Lead Frontend',
    idpStatus: 'no_idp',
    idpProgress: 0,
    score360: 76,
    kpiScore: 85,
    engagementScore: 82,
    yearsAtCompany: 4.0,
    gaps: [
      { skill: 'Architecture',          current: 55, required: 80 },
      { skill: 'Mentoring',             current: 48, required: 75 },
      { skill: 'Performance Optim.',    current: 60, required: 80 },
      { skill: 'React/TypeScript',      current: 88, required: 90 },
    ],
    courses: [
      { title: 'Frontend Architecture', status: 'in_progress', progress: 50 },
      { title: 'Tech Lead Skills',      status: 'not_started',  progress: 0  },
    ],
    nextReview: '25 июня 2026',
    notes: 'ИПР не сформирован. Рекомендуется начать процесс планирования.',
  },
];

// ── Manager user ──────────────────────────────────────────────────────────────

export const managerUser = {
  name: 'Сергей Громов',
  initials: 'СГ',
  role: 'Team Lead / Engineering Manager',
  department: 'Цифровые технологии',
  avatarColor: '#003366',
};

// ── IDP status labels & colours ───────────────────────────────────────────────

export const idpStatusConfig = {
  in_progress:       { label: 'В процессе',      color: '#005DB9', bg: '#E8F0FA' },
  pending_approval:  { label: 'Ожидает утв.',    color: '#B45309', bg: '#FEF3C7' },
  ready:             { label: 'Готов к росту',   color: '#1D9E75', bg: '#D1F5EB' },
  no_idp:            { label: 'Нет ИПР',         color: '#8A919E', bg: '#ECEEF2' },
};

// ── Calendar events for manager ──────────────────────────────────────────────

export const managerEvents = [
  { id: 1,  date: '2026-06-02', title: '1:1 Иван Петров',       type: 'one_on_one', time: '10:00', person: 'ИП', color: '#005DB9' },
  { id: 2,  date: '2026-06-04', title: '1:1 Мария Волкова',     type: 'one_on_one', time: '14:00', person: 'МВ', color: '#005DB9' },
  { id: 3,  date: '2026-06-05', title: 'Квартальные ревью',     type: 'review',     time: '15:00', person: null, color: '#003366' },
  { id: 4,  date: '2026-06-08', title: 'Интервью AI Engineer',  type: 'interview',  time: '16:00', person: 'ИП', color: '#C05621' },
  { id: 5,  date: '2026-06-10', title: 'Утверждение ИПР — АС',  type: 'idp',        time: '11:00', person: 'АС', color: '#B45309' },
  { id: 6,  date: '2026-06-12', title: '1:1 Дмитрий Козлов',   type: 'one_on_one', time: '13:00', person: 'ДК', color: '#005DB9' },
  { id: 7,  date: '2026-06-15', title: 'Дедлайн ИПР — Q2',     type: 'deadline',   time: null,    person: null, color: '#B45309' },
  { id: 8,  date: '2026-06-17', title: '1:1 Алексей Новиков',  type: 'one_on_one', time: '10:30', person: 'АН', color: '#005DB9' },
  { id: 9,  date: '2026-06-19', title: 'Team Retrospective',   type: 'team',       time: '15:00', person: null, color: '#1D9E75' },
  { id: 10, date: '2026-06-22', title: '1:1 Анна Смирнова',    type: 'one_on_one', time: '14:00', person: 'АС', color: '#005DB9' },
  { id: 11, date: '2026-06-25', title: 'Sprint Planning',      type: 'team',       time: '10:00', person: null, color: '#1D9E75' },
  { id: 12, date: '2026-06-30', title: 'End-of-month review',  type: 'review',     time: '16:00', person: null, color: '#003366' },
];

// ── Messages data for manager ────────────────────────────────────────────────

export const managerMessages = [
  {
    id: 1, from: 'Иван Петров', initials: 'ИП', avatarColor: '#005DB9',
    role: 'Backend Developer', unread: 2, online: true,
    lastMessage: 'Как продвигается Python курс?',
    time: '09:48',
    conversation: [
      { id: 1, own: false, text: 'Здравствуйте, Сергей! Записался на MLOps курс на следующей неделе.', time: '09:40' },
      { id: 2, own: true,  text: 'Отлично, Иван! Это высокий приоритет для вашего трека.', time: '09:45' },
      { id: 3, own: false, text: 'Как продвигается Python курс?', time: '09:48' },
    ],
  },
  {
    id: 2, from: 'Анна Смирнова', initials: 'АС', avatarColor: '#6D4FA0',
    role: 'Product Analyst', unread: 1, online: false,
    lastMessage: 'ИПР готов к вашему утверждению',
    time: '08:30',
    conversation: [
      { id: 1, own: false, text: 'Сергей, я завершила составление ИПР. Готово к вашему рассмотрению.', time: '08:25' },
      { id: 2, own: false, text: 'ИПР готов к вашему утверждению', time: '08:30' },
    ],
  },
  {
    id: 3, from: 'HR Отдел', initials: 'HR', avatarColor: '#A83265',
    role: 'HR Department', unread: 0, online: true,
    lastMessage: 'Следующий цикл оценки — 20 июня',
    time: 'вчера',
    conversation: [
      { id: 1, own: false, text: 'Напоминаем: следующий цикл 360° оценки стартует 20 июня. Пожалуйста, подготовьте списки оцениваемых.', time: 'вчера' },
      { id: 2, own: true,  text: 'Принято, подготовим списки до 15 июня.', time: 'вчера' },
      { id: 3, own: false, text: 'Следующий цикл оценки — 20 июня', time: 'вчера' },
    ],
  },
];
