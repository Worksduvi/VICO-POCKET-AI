
export interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  date: string;
  tags?: string[];
  isExpanded?: boolean;
  color?: string; // New: Note color
  url?: string; // For Links
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO String
}

export interface CustomButton {
  id: string;
  label: string;
  url: string;
  shape: 'circle' | 'square';
  color: string;
}

export interface RSSFeed {
  title: string;
  url: string;
}

export interface AppSettings {
  apiKey: string;
  soundEnabled: boolean;
  theme: 'Gold' | 'Cyber' | 'Nature' | 'Nebula' | 'Minimal';
  phrases: string[];
  fontSize: 'sm' | 'base' | 'lg';
  highContrast: boolean;
  autoDeleteDays: number;
  biometricLock: boolean;
  hapticIntensity: 'low' | 'medium' | 'high';
  language: 'es' | 'en' | 'zh' | 'fil' | 'ms';
  showBadge: boolean;
  landingPage: 'dashboard' | 'notes';
  reducedMotion: boolean;
  developerMode: boolean;
  cloudSync: boolean;
  customRssFeeds: RSSFeed[]; // Updated to Object Array
}

export type ViewState = 'dashboard' | 'notes' | 'links' | 'analysis' | 'discovery' | 'calendar' | 'profile';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  imageUrl?: string;
  category: string;
  date: string;
  lang: 'es' | 'en';
}

export interface AnalysisReport {
    id: string;
    prompt: string;
    date: string;
    summary: string;
    entities: string[];
}
