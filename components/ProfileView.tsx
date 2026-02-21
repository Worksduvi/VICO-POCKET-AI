
import React, { useState } from 'react';
import { AppSettings, CustomButton } from '../types';
import { Settings, Layout, Palette, Type, Globe, Shield, Download, Upload, X, Coffee, Rss, Plus, Volume2, Save, BookOpen, ChevronRight, HelpCircle, Zap, Activity } from 'lucide-react';
import { RSS_SOURCES } from '../constants';

interface ProfileViewProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  customButtons: CustomButton[];
  setCustomButtons: (b: CustomButton[]) => void;
  dataVault: {
      export: () => void;
      import: (e: any) => void;
  }
}

const ProfileView: React.FC<ProfileViewProps> = ({ settings, setSettings, customButtons, setCustomButtons, dataVault }) => {
  const [newBtnLabel, setNewBtnLabel] = useState('');
  const [newBtnUrl, setNewBtnUrl] = useState('');
  const [newBtnColor, setNewBtnColor] = useState('#3b82f6');
  const [showManual, setShowManual] = useState(false);
  
  // RSS State
  const [newRssTitle, setNewRssTitle] = useState('');
  const [newRssUrl, setNewRssUrl] = useState('');

  const handleSaveSettings = (key: keyof AppSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const addCustomButton = () => {
    if (!newBtnLabel || !newBtnUrl) return;
    const newBtn: CustomButton = {
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

  const removeBtn = (id: string) => {
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

      {/* Manual Button */}
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

      {/* API Key Section */}
      <div className="glass-panel p-4 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Motor de Inteligencia</h3>
          <p className="text-xs text-slate-400 mb-2">Conecta Gemini (Google) para potenciar el análisis de mercado.</p>
          <div className="flex gap-2">
              <input 
                type="password"
                value={settings.apiKey}
                onChange={(e) => handleSaveSettings('apiKey', e.target.value)}
                placeholder="Pegar API Key aquí (sk-...)"
                className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white font-mono text-sm focus:border-blue-500 outline-none"
              />
              <button 
                onClick={() => alert('API Key Guardada y Encriptada (Local).')}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold flex items-center gap-2 text-xs"
              >
                  <Save size={16}/> Guardar
              </button>
          </div>
          <p className="text-[9px] text-slate-500 mt-2 italic">Si no tienes API Key, la app funcionará en modo "Simulación Heurística".</p>
      </div>

      {/* Coffee Support */}
      <div className="glass-panel p-4 rounded-xl flex items-center justify-between bg-gradient-to-r from-yellow-900/20 to-transparent">
          <div>
              <h3 className="font-bold text-yellow-500">Support Dev</h3>
              <p className="text-xs text-slate-400">Invítame un café si te gusta la app.</p>
          </div>
          <a href="https://www.paypal.com/paypalme/texiduvi" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#003087] hover:bg-[#00256b] px-4 py-2 rounded-full text-white font-bold text-sm transition-transform hover:scale-105 shadow-lg">
              <Coffee size={16} /> PayPal
          </a>
      </div>

      {/* RSS Manager */}
      <div className="glass-panel p-4 rounded-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2"><Rss size={16}/> Gestión de Fuentes</h3>
          <div className="flex flex-col gap-2">
              <input 
                value={newRssTitle}
                onChange={e => setNewRssTitle(e.target.value)}
                placeholder="Nombre (ej: Wired)"
                className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white"
              />
              <div className="flex gap-2">
                  <input 
                    value={newRssUrl}
                    onChange={e => setNewRssUrl(e.target.value)}
                    placeholder="https://feed.xml"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white"
                  />
                  <button onClick={addRss} className="bg-slate-700 px-3 rounded text-white"><Plus size={16}/></button>
              </div>
          </div>
          <div className="max-h-32 overflow-y-auto space-y-1">
              {(settings.customRssFeeds || RSS_SOURCES).map((feed, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] text-slate-400 bg-slate-900/50 p-1 rounded">
                      <div className="flex flex-col truncate w-4/5">
                          <span className="text-white font-bold">{feed.title}</span>
                          <span className="text-slate-500 truncate">{feed.url}</span>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* --- Module 1: Button Designer --- */}
      <div className="glass-panel p-4 rounded-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Layout size={16} className="text-blue-400"/> Diseñador de Botones
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-2">
            <input 
              value={newBtnLabel} 
              onChange={e => setNewBtnLabel(e.target.value)} 
              placeholder="Etiqueta" 
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-xs" 
            />
            <input 
              value={newBtnUrl} 
              onChange={e => setNewBtnUrl(e.target.value)} 
              placeholder="URL" 
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-xs" 
            />
        </div>
        <div className="flex gap-2 items-center mb-4">
            <input 
              type="color" 
              value={newBtnColor} 
              onChange={e => setNewBtnColor(e.target.value)} 
              className="h-8 w-12 bg-transparent border border-slate-700 rounded cursor-pointer" 
            />
            <button 
              onClick={addCustomButton} 
              className="flex-1 bg-blue-600 hover:bg-blue-500 transition-colors rounded px-3 py-2 text-white font-bold text-xs"
            >
              Crear Botón
            </button>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
            {customButtons.map(btn => (
                <div key={btn.id} className="relative group">
                     <div 
                        style={{ backgroundColor: btn.color }}
                        className="px-3 py-1 text-white font-bold text-[10px] rounded shadow opacity-90"
                     >
                        {btn.label}
                     </div>
                     <button 
                        onClick={() => removeBtn(btn.id)} 
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white shadow transform scale-0 group-hover:scale-100 transition-transform"
                     >
                       <X size={10} />
                     </button>
                </div>
            ))}
        </div>
      </div>

      {/* --- Module 2: System Settings --- */}
      <div className="glass-panel p-4 rounded-xl space-y-3">
         <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Sistema</h3>
         
         <div className="flex items-center justify-between">
            <label className="text-slate-300 flex items-center gap-2 text-xs"><Palette size={14}/> Tema</label>
            <select 
                value={settings.theme} 
                onChange={(e) => handleSaveSettings('theme', e.target.value)}
                className="bg-slate-900 text-white border border-slate-700 rounded px-2 py-1 text-[10px]"
            >
                <option value="Cyber">Cyber Blue</option>
                <option value="Gold">Luxury Gold</option>
                <option value="Nature">Nature Green</option>
                <option value="Nebula">Cosmic Nebula</option>
                <option value="Minimal">Dark Minimal</option>
            </select>
         </div>

         <div className="flex items-center justify-between">
            <label className="text-slate-300 flex items-center gap-2 text-xs"><Type size={14}/> Texto</label>
            <select 
                value={settings.fontSize} 
                onChange={(e) => handleSaveSettings('fontSize', e.target.value)}
                className="bg-slate-900 text-white border border-slate-700 rounded px-2 py-1 text-[10px]"
            >
                <option value="sm">Pequeño</option>
                <option value="base">Normal</option>
                <option value="lg">Grande</option>
            </select>
         </div>

         <div className="flex items-center justify-between">
            <label className="text-slate-300 flex items-center gap-2 text-xs"><Globe size={14}/> Idioma</label>
            <select 
                value={settings.language} 
                onChange={(e) => handleSaveSettings('language', e.target.value)}
                className="bg-slate-900 text-white border border-slate-700 rounded px-2 py-1 text-[10px]"
            >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="zh">中文 (Chinese)</option>
                <option value="fil">Filipino</option>
                <option value="ms">Melayu (Malay)</option>
            </select>
         </div>

         <div className="flex items-center justify-between">
            <label className="text-slate-300 flex items-center gap-2 text-xs"><Volume2 size={14}/> Sonidos</label>
            <input 
              type="checkbox" 
              checked={settings.soundEnabled} 
              onChange={(e) => handleSaveSettings('soundEnabled', e.target.checked)} 
              className="accent-blue-500 w-4 h-4" 
            />
         </div>
         
         <div className="flex items-center justify-between">
            <label className="text-slate-300 flex items-center gap-2 text-xs"><Shield size={14}/> Developer Mode</label>
            <input 
              type="checkbox" 
              checked={settings.developerMode} 
              onChange={(e) => handleSaveSettings('developerMode', e.target.checked)} 
              className="accent-purple-500 w-4 h-4" 
            />
         </div>
      </div>

      {/* --- Module 3: Data Vault --- */}
      <div className="glass-panel p-4 rounded-xl">
         <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Shield size={16} className="text-green-400" /> Data Vault
         </h3>
         <div className="grid grid-cols-2 gap-4">
             <button onClick={dataVault.export} className="flex flex-col items-center p-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600">
                <Download size={16} className="mb-1 text-green-400" />
                <span className="text-[10px] text-white">Exportar Backup</span>
             </button>
             <label className="flex flex-col items-center p-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 cursor-pointer">
                <Upload size={16} className="mb-1 text-blue-400" />
                <span className="text-[10px] text-white">Importar Backup</span>
                <input type="file" className="hidden" accept=".json" onChange={dataVault.import} />
             </label>
         </div>
      </div>

      {/* Manual Modal Overlay */}
      {showManual && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-lg max-h-[85vh] rounded-2xl flex flex-col shadow-2xl relative">
                
                {/* Modal Header */}
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800 rounded-t-2xl sticky top-0 z-10">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <BookOpen size={18} className="text-blue-400"/> Manual VICO OS
                    </h3>
                    <button onClick={() => setShowManual(false)} className="text-slate-400 hover:text-white transition-colors bg-slate-700/50 p-1 rounded-full">
                        <X size={20}/>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto space-y-8 text-sm text-slate-300 custom-scrollbar">
                    
                    {/* Section 1 */}
                    <section className="space-y-2">
                        <div className="flex items-center gap-2 text-white font-bold text-base border-b border-slate-700 pb-1 mb-2">
                             <Layout size={18} className="text-blue-500"/> 1. Dashboard & Widgets
                        </div>
                        <p className="leading-relaxed">
                            La pantalla principal es tu centro de comando. 
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400 text-xs">
                                <li><strong>Widgets:</strong> Accesos directos a Notas, Links y Análisis.</li>
                                <li><strong>Pomodoro:</strong> Toca el icono de cronómetro o el widget "Start Focus" para iniciar una sesión de concentración (25min).</li>
                                <li><strong>Historial:</strong> Accede a tus últimos 2 informes de IA directamente.</li>
                            </ul>
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-2">
                         <div className="flex items-center gap-2 text-white font-bold text-base border-b border-slate-700 pb-1 mb-2">
                             <Activity size={18} className="text-purple-500"/> 2. Análisis IA (Real vs Simulado)
                        </div>
                        <p className="leading-relaxed">
                            VICO cuenta con dos modos de operación en la pestaña <strong>IA ROI</strong>:
                        </p>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                            <div className="bg-slate-800 p-3 rounded-lg border-l-4 border-yellow-500">
                                <h5 className="font-bold text-white text-xs mb-1">Modo Simulación (Default)</h5>
                                <p className="text-[10px] text-slate-400">Funciona sin configuración. Genera datos heurísticos aproximados para demostraciones rápidas.</p>
                            </div>
                            <div className="bg-slate-800 p-3 rounded-lg border-l-4 border-green-500">
                                <h5 className="font-bold text-white text-xs mb-1">Modo Real (Gemini API)</h5>
                                <p className="text-[10px] text-slate-400">
                                    Introduce tu <strong>API Key</strong> en Perfil. VICO conectará con Google Gemini para buscar información real en la web, analizar competidores y generar estrategias de mercado verídicas.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="space-y-2">
                        <div className="flex items-center gap-2 text-white font-bold text-base border-b border-slate-700 pb-1 mb-2">
                             <Rss size={18} className="text-orange-500"/> 3. Discovery & RSS
                        </div>
                        <p className="leading-relaxed">
                           Mantente al día con noticias tech.
                           <br/>
                           <strong>Añadir Fuentes:</strong> Toca el botón <strong>(+)</strong> en la parte superior derecha de Discovery para añadir manualmente cualquier feed RSS (ej: blogs, periódicos).
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section className="space-y-2">
                         <div className="flex items-center gap-2 text-white font-bold text-base border-b border-slate-700 pb-1 mb-2">
                             <Shield size={18} className="text-green-500"/> 4. Privacidad y Datos
                        </div>
                        <p className="leading-relaxed">
                            VICO es una app <strong>Local-First</strong>. 
                            <br/>
                            Tus notas, API Keys y configuraciones se guardan en tu navegador. No tenemos servidores.
                            <br/>
                            Usa la sección <strong>Data Vault</strong> en Perfil para exportar una copia de seguridad (.json) regularmente.
                        </p>
                    </section>

                     <div className="bg-blue-900/20 p-4 rounded-xl text-center border border-blue-500/30">
                        <p className="text-xs text-blue-300 font-bold">¿Dudas? Usa el ChatBot flotante para asistencia rápida.</p>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-slate-700 bg-slate-800 rounded-b-2xl text-center">
                    <button 
                        onClick={() => setShowManual(false)} 
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-full font-bold text-xs transition-transform hover:scale-105 shadow-lg"
                    >
                        ¡Entendido, Iniciar!
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default ProfileView;
