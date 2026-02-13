import React, { useState, useEffect } from 'react';
import { Home, FileText, PieChart, Compass, Calendar, User, Timer, Bookmark, Zap, Activity, Grid, MousePointer2 } from 'lucide-react';

// Helper para persistencia
function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

const NavIcon = ({ view, activeView, setActiveView, icon: Icon, label, theme }) => {
    let activeColor = 'text-yellow-500';
    let glowColor = 'shadow-[0_0_8px_#facc15] bg-yellow-500';

    if (theme === 'Cyber') { activeColor = 'text-blue-400'; glowColor = 'shadow-[0_0_8px_#60a5fa] bg-blue-400'; }
    else if (theme === 'Nature') { activeColor = 'text-emerald-400'; glowColor = 'shadow-[0_0_8px_#34d399] bg-emerald-400'; }

    return (
        <button onClick={() => setActiveView(view)} className={`flex flex-col items-center justify-center w-full h-full transition-all ${activeView === view ? activeColor : 'text-slate-500'}`}>
            <Icon size={24} className={activeView === view ? 'scale-110' : ''} />
            <span className="text-[9px] font-medium">{label}</span>
            {activeView === view && <div className={`w-1 h-1 rounded-full mt-1 ${glowColor}`}></div>}
        </button>
    );
};

const App = () => {
  const [activeView, setActiveView] = usePersistentState('view_state', 'dashboard');
  const [notes, setNotes] = usePersistentState('vico_notes', []);
  const [settings, setSettings] = usePersistentState('vico_settings', {
    theme: 'Cyber',
    language: 'es',
    soundEnabled: true
  });

  const renderContent = () => {
      if (activeView === 'dashboard') {
          return (
            <div className="p-4 space-y-6 pb-24 overflow-y-auto h-full">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/20">
                 <h1 className="text-3xl font-bold text-white mb-2">VICO AI</h1>
                 <p className="text-slate-400 italic text-sm">"Sistema Inteligente Activo"</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                  <div className="glass-panel p-4 rounded-xl flex flex-col items-center bg-slate-800/50" onClick={() => setActiveView('notes')}>
                      <FileText size={20} className="text-blue-400 mb-1"/>
                      <span className="text-[10px] font-bold text-white">Notas</span>
                  </div>
                  <div className="glass-panel p-4 rounded-xl flex flex-col items-center bg-slate-800/50" onClick={() => setActiveView('links')}>
                      <Bookmark size={20} className="text-green-400 mb-1"/>
                      <span className="text-[10px] font-bold text-white">Links</span>
                  </div>
              </div>
            </div>
          );
      }
      return <div className="p-10 text-center">Cargando modulo {activeView}...</div>;
  };

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col bg-[#0b0f1a]">
      <main className="flex-1 relative overflow-hidden">{renderContent()}</main>
      <nav className="h-20 bg-[#0b0f1a]/90 backdrop-blur-xl border-t border-slate-800 flex justify-between items-center px-1 pb-2 z-50 fixed bottom-0 w-full">
        <NavIcon view="dashboard" activeView={activeView} setActiveView={setActiveView} icon={Home} label="Home" theme={settings.theme} />
        <NavIcon view="notes" activeView={activeView} setActiveView={setActiveView} icon={FileText} label="Notas" theme={settings.theme} />
        <NavIcon view="links" activeView={activeView} setActiveView={setActiveView} icon={Bookmark} label="Links" theme={settings.theme} />
        <NavIcon view="profile" activeView={activeView} setActiveView={setActiveView} icon={User} label="Perfil" theme={settings.theme} />
      </nav>
    </div>
  );
};

export default App;