import React, { useState } from 'react';
// Importamos los iconos de lucide (asegúrate de que el importmap del index.html los soporte)
import { 
  Settings, Layout, Palette, Type, Globe, Shield, Download, 
  Upload, X, Coffee, Rss, Plus, Volume2, Save, BookOpen, 
  ChevronRight, HelpCircle, Zap, Activity 
} from 'lucide-react';

const ProfileView = ({ settings, setSettings, customButtons, setCustomButtons, dataVault }) => {
  const [newBtnLabel, setNewBtnLabel] = useState('');
  const [newBtnUrl, setNewBtnUrl] = useState('');
  const [newBtnColor, setNewBtnColor] = useState('#3b82f6');
  const [showManual, setShowManual] = useState(false);
  
  const [newRssTitle, setNewRssTitle] = useState('');
  const [newRssUrl, setNewRssUrl] = useState('');

  const RSS_SOURCES = [
    { title: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
    { title: 'Wired', url: 'https://www.wired.com/feed/rss' }
  ];

  const handleSaveSettings = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const addCustomButton = () => {
    if (!newBtnLabel || !newBtnUrl) return;
    const newBtn = {
      id: Date.now().toString(),
      label: newBtnLabel,
      url: newBtnUrl.startsWith('http') ? newBtnUrl : `https://${newBtnUrl}`,
      shape: 'square',
      color: newBtnColor
    };
    setCustomButtons([...customButtons, newBtn]);
    setNewBtnLabel('');
    setNewBtnUrl('');
  };

  const removeBtn = (id) => {
    setCustomButtons(customButtons.filter(b => b.id !== id));
  };

  const addRss = () => {
      if(!newRssUrl || !newRssTitle) return;
      const currentFeeds = settings.customRssFeeds || RSS_SOURCES;
      handleSaveSettings('customRssFeeds', [...currentFeeds, { title: newRssTitle, url: newRssUrl }]);
      setNewRssTitle('');
      setNewRssUrl('');
  };

  return (
    <div className="h-full p-4 pb-24 overflow-y-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Settings className="text-slate-400" /> VICO Core
      </h2>

      {/* Manual de Usuario */}
      <div 
        onClick={() => setShowManual(true)}
        className="glass-panel p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors border border-blue-500/30 group"
      >
          <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                  <BookOpen size={20} />
              </div>
              <div>
                  <h3 className="font-bold text-white text-sm">Manual de Usuario VICO</h3>
                  <p className="text-[10px] text-slate-400">Guía de funcionalidades y trucos</p>
              </div>
          </div>
          <ChevronRight size={16} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
      </div>

      {/* API Key Gemini */}
      <div className="glass-panel p-4 rounded-xl border border-blue-500/30">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Motor de Inteligencia</h3>
          <div className="flex gap-2">
              <input 
                type="password"
                value={settings.apiKey || ''}
                onChange={(e) => handleSaveSettings('apiKey', e.target.value)}
                placeholder="Pegar API Key aquí..."
                className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm"
              />
              <button 
                onClick={() => alert('API Key Guardada localmente.')}
                className="bg-green-600 text-white px-4 py-2 rounded font-bold text-xs flex items-center gap-2"
              >
                  <Save size={16}/> Guardar
              </button>
          </div>
      </div>

      {/* Diseñador de Botones */}
      <div className="glass-panel p-4 rounded-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Layout size={16}/> Botones Rápidos</h3>
        <div className="grid grid-cols-2 gap-2 mb-2">
            <input value={newBtnLabel} onChange={e => setNewBtnLabel(e.target.value)} placeholder="Nombre" className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-xs" />
            <input value={newBtnUrl} onChange={e => setNewBtnUrl(e.target.value)} placeholder="URL (google.com)" className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-xs" />
        </div>
        <button onClick={addCustomButton} className="w-full bg-blue-600 py-2 rounded text-white font-bold text-xs">Añadir Botón</button>
      </div>

      {/* Vault y Exportación */}
      <div className="glass-panel p-4 rounded-xl">
         <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Shield size={16}/> Data Vault</h3>
         <div className="grid grid-cols-2 gap-4">
             <button onClick={dataVault.export} className="flex flex-col items-center p-2 rounded bg-slate-800 border border-slate-600">
                <Download size={16} className="text-green-400 mb-1" />
                <span className="text-[10px] text-white">Exportar</span>
             </button>
             <label className="flex flex-col items-center p-2 rounded bg-slate-800 border border-slate-600 cursor-pointer">
                <Upload size={16} className="text-blue-400 mb-1" />
                <span className="text-[10px] text-white">Importar</span>
                <input type="file" className="hidden" onChange={dataVault.import} />
             </label>
         </div>
      </div>
    </div>
  );
};

export default ProfileView;
