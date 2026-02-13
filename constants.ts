
export const DEFAULT_FOLDERS = [
  'Fijadas', 'Resumen', 'Hoy', 'Recordatorio', 'Subscripción', 
  'APIs', 'Proyectos', 'Código', 'Links', 'Recetas', 
  'Varios', 'Webs', 'Direcciones', 'Clientes', 'Negocios'
];

export const DEFAULT_PHRASES = [
  "El conocimiento es poder.",
  "Persiste y vencerás.",
  "La innovación distingue a los líderes.",
  "Crea, no solo consumas.",
  "VICO te acompaña."
];

export const RSS_SOURCES = [
  { title: 'Wired AI', url: 'https://www.wired.com/feed/tag/artificial-intelligence/latest/rss' },
  { title: 'TechCrunch AI', url: 'https://techcrunch.com/tag/artificial-intelligence/feed/' },
  { title: 'ComputerHoy', url: 'https://computerhoy.com/rss/tecnologia/inteligencia-artificial' },
  { title: 'Xataka Stream', url: 'https://www.feeder.co/stream/xataka/' },
  { title: 'Reprint', url: 'https://reprint.computer/' },
  { title: 'Xataka AI', url: 'https://www.xataka.com/categoria/inteligencia-artificial' },
  { title: 'Xataka Main', url: 'https://www.xataka.com/feed' }
];

export const NEWS_CATEGORIES = [
  'Actualidad IA', 'Live Coding', 'Machine Learning', 'Startups', 
  'Hardware', 'Ciberseguridad', 'Desarrollo Web', 'Móvil', 
  'Ciencia de Datos', 'Futurismo'
];

export const NOTE_COLORS = [
  { name: 'Default', value: '' }, // Glass/Dark default
  { name: 'Red', value: '#7f1d1d' },
  { name: 'Green', value: '#14532d' },
  { name: 'Blue', value: '#1e3a8a' },
  { name: 'Purple', value: '#581c87' },
  { name: 'Yellow', value: '#713f12' },
];

export const TRANSLATIONS = {
  es: {
    dashboard: 'HOME', notes: 'NOTAS', links: 'LINKS', analysis: 'IA ROI', discovery: 'DESCUBRE', agenda: 'AGENDA', profile: 'PERFIL',
    search_placeholder: 'Buscar...', new_folder: 'Nueva Carpeta', save: 'Guardar', copy: 'Copiado',
    analysis_title: 'Motor de Análisis Neural', analyze_btn: 'Generar Informe', processing: 'Procesando...',
    settings_title: 'VICO Core', theme: 'Tema', language: 'Idioma', support: 'Soporte',
    share_error: 'Error al compartir', share_cancel: 'Compartir cancelado'
  },
  en: {
    dashboard: 'HOME', notes: 'NOTES', links: 'LINKS', analysis: 'AI ROI', discovery: 'DISCOVER', agenda: 'CALENDAR', profile: 'PROFILE',
    search_placeholder: 'Search...', new_folder: 'New Folder', save: 'Save', copy: 'Copied',
    analysis_title: 'Neural Analysis Engine', analyze_btn: 'Generate Report', processing: 'Processing...',
    settings_title: 'VICO Core', theme: 'Theme', language: 'Language', support: 'Support',
    share_error: 'Share error', share_cancel: 'Share canceled'
  },
  zh: {
    dashboard: '首页', notes: '笔记', links: '链接', analysis: '分析', discovery: '发现', agenda: '日历', profile: '简介',
    search_placeholder: '搜索...', new_folder: '新建文件夹', save: '保存', copy: '已复制',
    analysis_title: '神经分析引擎', analyze_btn: '生成报告', processing: '处理中...',
    settings_title: 'VICO核心', theme: '主题', language: '语言', support: '支持',
    share_error: '分享错误', share_cancel: '分享已取消'
  },
  fil: {
    dashboard: 'HOME', notes: 'TALA', links: 'LINKS', analysis: 'PAGSUSURI', discovery: 'TUKLASIN', agenda: 'KALENDARYO', profile: 'PROFILE',
    search_placeholder: 'Maghanap...', new_folder: 'Bagong Folder', save: 'I-save', copy: 'Kinopya',
    analysis_title: 'Neural Analysis Engine', analyze_btn: 'Gumawa ng Ulat', processing: 'Pinoproseso...',
    settings_title: 'VICO Core', theme: 'Tema', language: 'Wika', support: 'Suporta',
    share_error: 'Error sa pagbabahagi', share_cancel: 'Kinansela ang pagbabahagi'
  },
  ms: {
    dashboard: 'LAMAN', notes: 'NOTA', links: 'PAUTAN', analysis: 'ANALISIS', discovery: 'TEROKA', agenda: 'KALENDAR', profile: 'PROFIL',
    search_placeholder: 'Cari...', new_folder: 'Folder Baru', save: 'Simpan', copy: 'Disalin',
    analysis_title: 'Enjin Analisis Neural', analyze_btn: 'Jana Laporan', processing: 'Memproses...',
    settings_title: 'Teras VICO', theme: 'Tema', language: 'Bahasa', support: 'Sokongan',
    share_error: 'Ralat perkongsian', share_cancel: 'Perkongsian dibatalkan'
  }
};

// Mock Data Generator for Discovery View (20 items with varied images)
export const GENERATE_MOCK_NEWS = (lang: string) => {
  const isEs = lang === 'es';
  const sources = ['Xataka', 'Wired', 'TechCrunch', 'TheVerge', 'Genbeta', 'VentureBeat', 'ArsTechnica', 'Engadget'];
  
  const baseTitles = [
    'GPT-5 y la Singularidad', 'Nuevas baterías de estado sólido', 'El fin del silicio', 
    'Coches voladores en 2025', 'IA en la medicina moderna', 'Hackers éticos vs Black Hat',
    'El futuro de React', 'WebAssembly domina la web', 'Computación Cuántica accesible',
    'Marte: La próxima frontera', 'Implantes neurales seguros', 'Drones autónomos de reparto',
    'Realidad Mixta en la educación', 'Criptomonedas verdes', 'El metaverso industrial',
    'Robótica en el hogar', 'Ciberseguridad cuántica', 'Impresión 3D de órganos',
    'Energía de fusión nuclear', 'La ética de la IA general'
  ];

  return Array.from({ length: 20 }).map((_, i) => ({
    id: `news-${i}-${Date.now()}`,
    title: isEs ? `${baseTitles[i % baseTitles.length]} - Informe VICO` : `${baseTitles[i % baseTitles.length]} (Translated) - VICO Report`,
    summary: isEs 
      ? 'Un análisis profundo sobre las implicaciones tecnológicas de este avance y cómo afectará al desarrollo de software en los próximos meses. Expertos sugieren un cambio de paradigma inminente.' 
      : 'A deep dive into the technological implications of this breakthrough and how it will affect software development in the coming months. Experts suggest an imminent paradigm shift.',
    source: sources[i % sources.length],
    url: `https://example.com/news/${i}`,
    category: NEWS_CATEGORIES[i % NEWS_CATEGORIES.length],
    imageUrl: `https://picsum.photos/seed/${i + 100}/150/150`, // Square-ish thumbnails
    date: new Date(Date.now() - i * 3600000).toISOString(),
    lang: isEs ? 'es' : 'en'
  }));
};
