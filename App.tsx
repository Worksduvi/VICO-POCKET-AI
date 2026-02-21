
import React, { useState, useEffect } from 'react';
import { Home, FileText, PieChart, Compass, Calendar, User, Timer, Bell, Box, MousePointer2, Bookmark, Zap, Activity, Grid } from 'lucide-react';
import { Note, AppSettings, ViewState, CalendarEvent, CustomButton, AnalysisReport } from './types';
import { DEFAULT_FOLDERS, DEFAULT_PHRASES, RSS_SOURCES, TRANSLATIONS } from './constants';
import NotesView from './components/NotesView';
import AnalysisView from './components/AnalysisView';
import DiscoveryView from './components/DiscoveryView';
import CalendarView from './components/CalendarView';
import ProfileView from './components/ProfileView';
import ChatWidget from './components/ChatWidget';
import PomodoroWidget from './components/PomodoroWidget';
import LinksView from './components/LinksView';

function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Storage error", error);
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

interface NavIconProps {
  view: ViewState;
  activeView: ViewState;
  setActiveView: (view: ViewState) => void;
  icon: any;
  label: string;
  theme: string;
}

const NavIcon: React.FC<NavIconProps> = ({ view, activeView, setActiveView, icon: Icon, label, theme }) => {
    let activeColor = 'text-yellow-500';
    let glowColor = 'shadow-[0_0_8px_#facc15] bg-yellow-500';

    if (theme === 'Cyber') { activeColor = 'text-blue-400'; glowColor = 'shadow-[0_0_8px_#60a5fa] bg-blue-400'; }
    else if (theme === 'Nature') { activeColor = 'text-emerald-400'; glowColor = 'shadow-[0_0_8px_#34d399] bg-emerald-400'; }
    else if (theme === 'Nebula') { activeColor = 'text-fuchsia-400'; glowColor = 'shadow-[0_0_8px_#e879f9] bg-fuchsia-400'; }
    else if (theme === 'Minimal') { activeColor = 'text-white'; glowColor = 'shadow-[0_0_8px_#ffffff] bg-white'; }

    return (
        <button 
            onClick={() => setActiveView(view)}
            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${activeView === view ? activeColor : 'text-slate-500 hover:text-slate-300'}`}
        >
            <Icon size={24} className={`mb-1 transition-transform ${activeView === view ? 'scale-110' : ''}`} />
            <span className="text-[9px] font-medium tracking-wide">{label}</span>
            {activeView === view && <div className={`w-1 h-1 rounded-full mt-1 ${glowColor}`}></div>}
        </button>
    );
};

// UI Sound Helper
const playUISound = (enabled: boolean) => {
    if(!enabled) return;
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
};

const App: React.FC = () => {
  const [activeView, setActiveView] = usePersistentState<ViewState>('view_state', 'dashboard');
  const [notes, setNotes] = usePersistentState<Note[]>('vico_notes', []);
  const [folders, setFolders] = usePersistentState<string[]>('vico_folders', DEFAULT_FOLDERS);
  const [events, setEvents] = usePersistentState<CalendarEvent[]>('vico_events', []);
  const [customButtons, setCustomButtons] = usePersistentState<CustomButton[]>('vico_buttons', []);
  const [analysisHistory, setAnalysisHistory] = usePersistentState<AnalysisReport[]>('vico_analysis_history', []);
  
  const [settings, setSettings] = usePersistentState<AppSettings>('vico_settings', {
    apiKey: '',
    soundEnabled: true,
    theme: 'Cyber',
    phrases: DEFAULT_PHRASES,
    fontSize: 'base',
    highContrast: false,
    autoDeleteDays: 30,
    biometricLock: false,
    hapticIntensity: 'medium',
    language: 'es',
    showBadge: true,
    landingPage: 'dashboard',
    reducedMotion: false,
    developerMode: false,
    cloudSync: true,
    customRssFeeds: RSS_SOURCES
  });

  const [currentPhrase, setCurrentPhrase] = useState('Iniciando...');
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [analysisData, setAnalysisData] = useState<string>('');
  
  // Pomodoro State (Lifted)
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoTime, setPomoTime] = useState(25 * 60);

  // Global Click Listener for Sounds
  useEffect(() => {
      const handleClick = () => playUISound(settings.soundEnabled);
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
  }, [settings.soundEnabled]);

  // Pomodoro Timer Logic
  useEffect(() => {
      let interval: any;
      if (pomoActive && pomoTime > 0) {
          interval = setInterval(() => setPomoTime(t => t - 1), 1000);
      } else if (pomoTime === 0 && pomoActive) {
          setPomoActive(false);
          alert("Pomodoro Terminado");
      }
      return () => clearInterval(interval);
  }, [pomoActive, pomoTime]);
  
  // Translation
  const t = TRANSLATIONS[settings.language as keyof typeof TRANSLATIONS] || TRANSLATIONS.es;

  // Theme Logic
  const getThemeColors = () => {
      switch(settings.theme) {
          case 'Gold': return 'bg-gradient-to-br from-yellow-900/40 to-slate-900 border-yellow-500/20 selection:bg-yellow-500/30';
          case 'Nature': return 'bg-gradient-to-br from-emerald-900/40 to-slate-900 border-emerald-500/20 selection:bg-emerald-500/30';
          case 'Nebula': return 'bg-gradient-to-br from-fuchsia-900/40 to-slate-900 border-fuchsia-500/20 selection:bg-fuchsia-500/30';
          case 'Minimal': return 'bg-slate-900 border-white/10 selection:bg-white/30';
          case 'Cyber': default: return 'bg-gradient-to-br from-blue-900/40 to-slate-900 border-blue-500/20 selection:bg-blue-500/30';
      }
  };

  const isCyber = settings.theme === 'Cyber'; // Legacy prop for some components, though now we have 5 themes.

  const exportData = () => {
      const data = { notes, folders, events, customButtons, settings, analysisHistory };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vico_backup_${new Date().toISOString().slice(0,10)}.json`;
      a.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const data = JSON.parse(event.target?.result as string);
              if(data.notes) setNotes(data.notes);
              if(data.folders) setFolders(data.folders);
              if(data.events) setEvents(data.events);
              if(data.customButtons) setCustomButtons(data.customButtons);
              if(data.settings) setSettings(data.settings);
              if(data.analysisHistory) setAnalysisHistory(data.analysisHistory);
              alert('Backup restaurado.');
              window.location.reload();
          } catch(err) {
              alert('Error al leer el archivo.');
          }
      };
      reader.readAsText(file);
  };

  const handleSendToAnalysis = (text: string) => {
      setAnalysisData(text);
      setActiveView('analysis');
  };

  const handleAnalysisComplete = (report: AnalysisReport) => {
      setAnalysisHistory([report, ...analysisHistory].slice(0, 10)); // Keep last 10
  };

  const renderContent = () => {
    try {
      switch(activeView) {
        case 'dashboard':
          return (
            <div className="p-4 space-y-6 pb-24 overflow-y-auto h-full">
              {/* Hero Section */}
              <div className={`p-6 rounded-2xl relative overflow-hidden border ${getThemeColors()}`}>
                 <h1 className="text-3xl font-bold text-white mb-2 cursor-default transition-all duration-300 hover:animate-halo">VICO POCKET</h1>
                 <p className="text-slate-400 italic text-sm">"{currentPhrase}"</p>
                 <button 
                  onClick={() => setShowPomodoro(true)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-300"
                 >
                     <Timer size={20} />
                 </button>
              </div>

              {/* --- 6 New Dashboard Widgets --- */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Widget 1: Quick Note */}
                  <div className="glass-panel p-3 rounded-xl flex flex-col items-center justify-center hover:bg-slate-800 cursor-pointer" onClick={() => setActiveView('notes')}>
                      <FileText size={20} className="text-blue-400 mb-1"/>
                      <span className="text-[10px] font-bold text-white">Nota Rápida</span>
                  </div>
                  {/* Widget 2: Link Saver */}
                  <div className="glass-panel p-3 rounded-xl flex flex-col items-center justify-center hover:bg-slate-800 cursor-pointer" onClick={() => setActiveView('links')}>
                      <Bookmark size={20} className="text-green-400 mb-1"/>
                      <span className="text-[10px] font-bold text-white">Guardar Link</span>
                  </div>
                   {/* Widget 3: Calendar Next */}
                   <div className="glass-panel p-3 rounded-xl flex flex-col items-center justify-center hover:bg-slate-800 cursor-pointer" onClick={() => setActiveView('calendar')}>
                      <Calendar size={20} className="text-yellow-400 mb-1"/>
                      <span className="text-[10px] font-bold text-white">Eventos ({events.length})</span>
                  </div>
                   {/* Widget 4: Start Focus */}
                   <div className="glass-panel p-3 rounded-xl flex flex-col items-center justify-center hover:bg-slate-800 cursor-pointer" onClick={() => setShowPomodoro(true)}>
                      <Zap size={20} className="text-purple-400 mb-1"/>
                      <span className="text-[10px] font-bold text-white">Start Focus</span>
                  </div>
                   {/* Widget 5: Analysis Shortcut */}
                   <div className="glass-panel p-3 rounded-xl flex flex-col items-center justify-center hover:bg-slate-800 cursor-pointer" onClick={() => setActiveView('analysis')}>
                      <Activity size={20} className="text-red-400 mb-1"/>
                      <span className="text-[10px] font-bold text-white">Nuevo Análisis</span>
                  </div>
                   {/* Widget 6: Discovery */}
                   <div className="glass-panel p-3 rounded-xl flex flex-col items-center justify-center hover:bg-slate-800 cursor-pointer" onClick={() => setActiveView('discovery')}>
                      <Compass size={20} className="text-orange-400 mb-1"/>
                      <span className="text-[10px] font-bold text-white">News Feed</span>
                  </div>
              </div>

              {/* Last 2 Analyses */}
              <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                      <Grid size={12}/> Últimos Análisis
                  </h3>
                  <div className="space-y-2">
                      {analysisHistory.length === 0 ? (
                          <div className="text-center py-4 text-xs text-slate-600 italic">Sin historial de análisis.</div>
                      ) : (
                          analysisHistory.slice(0, 2).map(rep => (
                              <div key={rep.id} className="glass-panel p-3 rounded-xl flex justify-between items-center cursor-pointer hover:bg-slate-800/50" onClick={() => { setAnalysisData(rep.prompt); setActiveView('analysis'); }}>
                                  <div>
                                      <div className="text-xs font-bold text-white truncate max-w-[200px]">{rep.prompt}</div>
                                      <div className="text-[10px] text-slate-400">{new Date(rep.date).toLocaleDateString()}</div>
                                  </div>
                                  <div className="bg-slate-800 p-1 rounded-full"><MousePointer2 size={12} className="text-blue-400"/></div>
                              </div>
                          ))
                      )}
                  </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => setActiveView('notes')}>
                    <span className="text-2xl font-bold text-white">{notes.length}</span>
                    <span className="text-xs text-slate-500 uppercase">{t.notes}</span>
                 </div>
                 <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => setActiveView('links')}>
                    <span className="text-2xl font-bold text-white">{notes.filter(n => n.folder === 'Links').length}</span>
                    <span className="text-xs text-slate-500 uppercase">{t.links}</span>
                 </div>
              </div>
            </div>
          );
        case 'notes':
          return <NotesView notes={notes} folders={folders} setNotes={setNotes} setFolders={setFolders} isCyber={isCyber} />;
        case 'links':
          return <LinksView notes={notes} setNotes={setNotes} isCyber={isCyber} />;
        case 'analysis':
          return <AnalysisView notes={notes} isCyber={isCyber} incomingData={analysisData} onAnalysisComplete={handleAnalysisComplete} settings={settings} />;
        case 'discovery':
          return <DiscoveryView addNote={(n) => setNotes([{...n, id: Date.now().toString(), content: n.content || '', title: n.title || '', date: n.date || '', folder: n.folder || 'Varios', isExpanded: false, tags: n.tags || [], color: '', url: n.url || ''}, ...notes])} sendToAnalysis={handleSendToAnalysis} isCyber={isCyber} settings={settings} setSettings={setSettings} />;
        case 'calendar':
          return <CalendarView events={events} setEvents={setEvents} isCyber={isCyber} />;
        case 'profile':
          return <ProfileView settings={settings} setSettings={setSettings} customButtons={customButtons} setCustomButtons={setCustomButtons} dataVault={{export: exportData, import: importData}} />;
        default:
          return <div>Vista no encontrada</div>;
      }
    } catch (e) {
      console.error("Render Error:", e);
      return <div className="p-4 text-red-500">Error en la vista: {activeView}</div>;
    }
  };

  const formatPomoTime = (s: number) => {
      const mins = Math.floor(s / 60);
      const secs = s % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed inset-0 overflow-hidden flex flex-col ${settings.fontSize === 'sm' ? 'text-sm' : settings.fontSize === 'lg' ? 'text-lg' : 'text-base'} ${getThemeColors()}`}>
      
      {/* Header Taskbar Timer */}
      {pomoActive && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900 z-50 flex justify-center overflow-visible">
              <div className="bg-slate-900 px-4 py-1 rounded-b-lg border border-slate-700 text-xs font-mono font-bold text-green-400 shadow-lg flex items-center gap-2" onClick={() => setShowPomodoro(true)}>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  {formatPomoTime(pomoTime)}
              </div>
          </div>
      )}

      <main className="flex-1 relative overflow-hidden bg-[#0b0f1a]">
        {renderContent()}
      </main>

      <ChatWidget settings={settings} />
      
      {showPomodoro && (
        <PomodoroWidget 
            onClose={() => setShowPomodoro(false)} 
            isCyber={isCyber} 
            // Pass state control to widget
            externalState={{active: pomoActive, time: pomoTime, setActive: setPomoActive, setTime: setPomoTime}}
        />
      )}

      <nav className="h-20 bg-[#0b0f1a]/90 backdrop-blur-xl border-t border-slate-800 flex justify-between items-center px-1 pb-2 z-50 fixed bottom-0 w-full shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <NavIcon view="dashboard" activeView={activeView} setActiveView={setActiveView} icon={Home} label={t.dashboard} theme={settings.theme} />
        <NavIcon view="notes" activeView={activeView} setActiveView={setActiveView} icon={FileText} label={t.notes} theme={settings.theme} />
        <NavIcon view="links" activeView={activeView} setActiveView={setActiveView} icon={Bookmark} label={t.links} theme={settings.theme} />
        <NavIcon view="analysis" activeView={activeView} setActiveView={setActiveView} icon={PieChart} label={t.analysis} theme={settings.theme} />
        <NavIcon view="discovery" activeView={activeView} setActiveView={setActiveView} icon={Compass} label={t.discovery} theme={settings.theme} />
        <NavIcon view="calendar" activeView={activeView} setActiveView={setActiveView} icon={Calendar} label={t.agenda} theme={settings.theme} />
        <NavIcon view="profile" activeView={activeView} setActiveView={setActiveView} icon={User} label={t.profile} theme={settings.theme} />
      </nav>
    </div>
  );
};

export default App;
