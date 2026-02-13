import React, { useState, useEffect } from 'react';
import { Home, FileText, PieChart, Compass, Calendar, User, Bookmark, Timer } from 'lucide-react';
import NotesView from './components/NotesView.js';
import LinksView from './components/LinksView.js';
import AnalysisView from './components/AnalysisView.js';
import DiscoveryView from './components/DiscoveryView.js';
import ProfileView from './components/ProfileView.js';
import CalendarView from './components/CalendarView.js';
import ChatWidget from './components/ChatWidget.js';
import PomodoroWidget from './components/PomodoroWidget.js';

function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) { return initialValue; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
  return [state, setState];
}

const NavIcon = ({ view, activeView, setActiveView, icon: Icon, label, theme }) => {
  const isActive = activeView === view;
  const activeColor = theme === 'Cyber' ? 'text-blue-400' : 'text-yellow-500';
  return (
    <button onClick={() => setActiveView(view)} className={`flex flex-col items-center justify-center w-full h-full transition-all ${isActive ? activeColor : 'text-slate-500'}`}>
      <Icon size={24} />
      <span className="text-[9px] font-medium">{label}</span>
      {isActive && <div className={`w-1 h-1 rounded-full mt-1 ${theme === 'Cyber' ? 'bg-blue-400' : 'bg-yellow-500'}`}></div>}
    </button>
  );
};

const App = () => {
  const [activeView, setActiveView] = usePersistentState('view_state', 'dashboard');
  const [notes, setNotes] = usePersistentState('vico_notes', []);
  const [events, setEvents] = usePersistentState('vico_events', []);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [settings, setSettings] = usePersistentState('vico_settings', { theme: 'Cyber', language: 'es', soundEnabled: true });

  useEffect(() => {
    let interval;
    if (pomoActive && pomoTime > 0) {
      interval = setInterval(() => setPomoTime(t => t - 1), 1000);
    } else if (pomoTime === 0) {
      setPomoActive(false);
      alert("¡Tiempo terminado!");
    }
    return () => clearInterval(interval);
  }, [pomoActive, pomoTime]);

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard':
        return (
          <div className="p-4 space-y-6 pb-24 overflow-y-auto h-full">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/20 relative">
               <h1 className="text-3xl font-bold text-white mb-2">VICO AI</h1>
               <p className="text-slate-400 italic text-sm">"Sistema Inteligente Activo"</p>
               <button onClick={() => setShowPomodoro(true)} className="absolute top-4 right-4 text-slate-400"><Timer/></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-panel p-4 rounded-xl flex flex-col items-center bg-slate-800/50" onClick={() => setActiveView('notes')}>
                <FileText size={20} className="text-blue-400 mb-1"/><span className="text-[10px] font-bold text-white">Notas</span>
              </div>
              <div className="glass-panel p-4 rounded-xl flex flex-col items-center bg-slate-800/50" onClick={() => setActiveView('calendar')}>
                <Calendar size={20} className="text-yellow-400 mb-1"/><span className="text-[10px] font-bold text-white">Agenda</span>
              </div>
            </div>
          </div>
        );
      case 'notes': return <NotesView notes={notes} folders={['Personal', 'Trabajo', 'Ideas']} setNotes={setNotes} setFolders={()=>{}} isCyber={true} />;
      case 'links': return <LinksView notes={notes} setNotes={setNotes} isCyber={true} />;
      case 'calendar': return <CalendarView events={events} setEvents={setEvents} isCyber={true} />;
      case 'analysis': return <AnalysisView isCyber={true} settings={settings} />;
      case 'discovery': return <DiscoveryView isCyber={true} settings={settings} />;
      case 'profile': return <ProfileView settings={settings} setSettings={setSettings} dataVault={{export: ()=>{}, import: ()=>{}}} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col bg-[#0b0f1a]">
      <main className="flex-1 relative overflow-hidden">{renderContent()}</main>
      <ChatWidget settings={settings} />
      {showPomodoro && <PomodoroWidget onClose={() => setShowPomodoro(false)} externalState={{active: pomoActive, time: pomoTime, setActive: setPomoActive, setTime: setPomoTime}} />}
      <nav className="h-20 bg-[#0b0f1a]/90 backdrop-blur-xl border-t border-slate-800 flex justify-between items-center px-1 pb-2 z-50 fixed bottom-0 w-full">
        <NavIcon view="dashboard" activeView={activeView} setActiveView={setActiveView} icon={Home} label="Home" theme={settings.theme} />
        <NavIcon view="notes" activeView={activeView} setActiveView={setActiveView} icon={FileText} label="Notas" theme={settings.theme} />
        <NavIcon view="calendar" activeView={activeView} setActiveView={setActiveView} icon={Calendar} label="Agenda" theme={settings.theme} />
        <NavIcon view="analysis" activeView={activeView} setActiveView={setActiveView} icon={PieChart} label="IA" theme={settings.theme} />
        <NavIcon view="profile" activeView={activeView} setActiveView={setActiveView} icon={User} label="Perfil" theme={settings.theme} />
      </nav>
    </div>
  );
};
export default App; 
