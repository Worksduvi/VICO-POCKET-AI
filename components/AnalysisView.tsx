
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, ResponsiveContainer, Tooltip as ReTooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { Note, AnalysisReport, AppSettings } from '../types';
import { Brain, TrendingUp, Search, PlusCircle, Maximize2, Activity, Network, Zap, Printer, GitMerge, DollarSign, Globe, Lock, Link as LinkIcon } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface AnalysisViewProps {
  notes: Note[];
  isCyber: boolean;
  incomingData?: string;
  onAnalysisComplete?: (report: AnalysisReport) => void;
  settings: AppSettings;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ notes, isCyber, incomingData, onAnalysisComplete, settings }) => {
  const [prompt, setPrompt] = useState(incomingData || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showExtended, setShowExtended] = useState(false);
  const [entities, setEntities] = useState<string[]>([]);
  const [reportReady, setReportReady] = useState(false);
  const [sources, setSources] = useState<{title: string, uri: string}[]>([]);
  
  // Real Data State
  const [realFluctuationData, setRealFluctuationData] = useState<any[]>([]);
  const [realRadarData, setRealRadarData] = useState<any[]>([]);
  const [realPieData, setRealPieData] = useState<any[]>([]);
  const [realSummary, setRealSummary] = useState('');
  const [realExtendedSummary, setRealExtendedSummary] = useState('');
  const [realComparisonText, setRealComparisonText] = useState('');
  const [realProductsA, setRealProductsA] = useState<string[]>([]);
  const [realProductsB, setRealProductsB] = useState<string[]>([]);

  useEffect(() => {
      if(prompt) {
          const splitRegex = /(?:\s+vs\s+|\s+entre\s+|,|&)/i;
          const words = prompt.split(splitRegex)
              .map(w => w.trim())
              .filter(w => w.length > 2 && !['comparativa', 'comparar', 'de', 'y', 'entre'].includes(w.toLowerCase()));
          
          if(words.length >= 2) setEntities(words.slice(0, 2));
      }
  }, [prompt]);

  const handleAnalyze = async () => {
      if(!prompt.trim()) return;
      setIsAnalyzing(true);
      setShowExtended(false);
      setReportReady(false);
      setSources([]);
      
      try {
        if (settings.apiKey) {
            const ai = new GoogleGenAI({ apiKey: settings.apiKey });
            const modelName = 'gemini-2.0-flash-exp'; // Support Search Grounding
            
            const systemPrompt = `
                Eres un analista senior. Investiga en internet sobre: "${prompt}".
                Identifica las dos entidades principales.
                PROPORCIONA UNA RESPUESTA EN FORMATO JSON PLANO (sin bloques de código Markdown) que siga estrictamente este esquema:
                {
                    "entityAName": "Nombre A",
                    "entityBName": "Nombre B",
                    "fluctuationData": [{"month": "Ene", "valA": 100, "valB": 90, "sector": 95}, ... 6 meses],
                    "radarData": [{"subject": "Innovación", "scoreA": 120, "scoreB": 100}, ... 5 temas],
                    "sentiment": {"positive": 70, "neutral": 20, "negative": 10},
                    "summary": "Resumen ejecutivo real basado en la búsqueda",
                    "comparisonText": "Análisis comparativo profundo",
                    "extendedSummary": "Análisis extendido de más de 1000 caracteres con datos reales encontrados",
                    "productsA": ["Producto 1", "Producto 2"],
                    "productsB": ["Producto 3", "Producto 4"]
                }
                IMPORTANTE: Utiliza la herramienta Google Search para obtener datos reales y actuales.
            `;

            const response = await ai.models.generateContent({
                model: modelName,
                contents: systemPrompt,
                config: {
                    tools: [{ googleSearch: {} }]
                }
            });

            // Extract Grounding Chunks (URLs)
            const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (chunks) {
                const extractedSources = chunks
                    .filter((c: any) => c.web)
                    .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
                setSources(extractedSources);
            }

            if (response.text) {
                // Remove potential markdown code blocks if the model included them despite instructions
                const cleanJson = response.text.replace(/```json|```/g, '').trim();
                const data = JSON.parse(cleanJson);
                
                setEntities([data.entityAName, data.entityBName]);
                
                const chartFluc = data.fluctuationData.map((d: any) => ({
                    month: d.month,
                    [data.entityAName]: d.valA,
                    [data.entityBName]: d.valB,
                    Sector: d.sector
                }));
                setRealFluctuationData(chartFluc);

                const chartRadar = data.radarData.map((d: any) => ({
                    subject: d.subject,
                    A: d.scoreA,
                    B: d.scoreB,
                    fullMark: 150
                }));
                setRealRadarData(chartRadar);

                setRealPieData([
                    { name: 'Positivo', value: data.sentiment.positive },
                    { name: 'Neutro', value: data.sentiment.neutral },
                    { name: 'Negativo', value: data.sentiment.negative }
                ]);

                setRealSummary(data.summary);
                setRealComparisonText(data.comparisonText);
                setRealExtendedSummary(data.extendedSummary);
                setRealProductsA(data.productsA);
                setRealProductsB(data.productsB);

                setReportReady(true);
            }

        } else {
            // SIMULATION FALLBACK
            setTimeout(() => {
                const e1 = entities[0] || 'Entidad A';
                const e2 = entities[1] || 'Entidad B';
                setRealFluctuationData([{ month: 'Ene', [e1]: 4000, [e2]: 2400, Sector: 2400 }, { month: 'Feb', [e1]: 3000, [e2]: 1398, Sector: 2210 }, { month: 'Mar', [e1]: 2000, [e2]: 9800, Sector: 2290 }, { month: 'Abr', [e1]: 2780, [e2]: 3908, Sector: 2000 }, { month: 'May', [e1]: 1890, [e2]: 4800, Sector: 2181 }, { month: 'Jun', [e1]: 2390, [e2]: 3800, Sector: 2500 }]);
                setRealRadarData([{ subject: 'Innovación', A: 120, B: 110, fullMark: 150 }, { subject: 'Costo', A: 98, B: 130, fullMark: 150 }, { subject: 'Rendimiento', A: 86, B: 130, fullMark: 150 }, { subject: 'Market Share', A: 99, B: 100, fullMark: 150 }, { subject: 'Brand', A: 85, B: 90, fullMark: 150 }]);
                setRealPieData([{ name: 'Positivo', value: 400 }, { name: 'Neutro', value: 300 }, { name: 'Negativo', value: 100 }]);
                setRealSummary(`Análisis simulado de ${e1} vs ${e2}. Conecte su API Key para datos reales de internet.`);
                setRealComparisonText(`Datos aproximados basados en tendencias históricas. ${e1} mantiene estabilidad mientras ${e2} muestra picos de crecimiento.`);
                setRealExtendedSummary("Este es un informe generado mediante heurística local. Para una investigación verídica con Google Search, introduzca su API Key en el Perfil.");
                setRealProductsA([`${e1} Cloud`, `${e1} Enterprise`]);
                setRealProductsB([`${e2} Start`, `${e2} Pro`]);
                setReportReady(true);
            }, 2000);
        }
      } catch (error) {
          console.error("Analysis Error", error);
          alert("Error en el análisis. Inténtelo de nuevo o revise su API Key.");
      } finally {
          setIsAnalyzing(false);
          if(onAnalysisComplete) {
              onAnalysisComplete({ id: Date.now().toString(), prompt: prompt, date: new Date().toISOString(), summary: `Análisis Real: ${entities.join(' vs ')}`, entities: entities });
          }
      }
  };

  const handlePrint = () => window.print();
  const COLORS = ['#4ade80', '#94a3b8', '#f87171'];

  return (
    <div className="h-full overflow-y-auto p-4 pb-24 space-y-6 print:p-0 print:overflow-visible">
      <div className="glass-panel p-4 rounded-xl space-y-3 print:hidden">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Brain className={isCyber ? "text-blue-400" : "text-yellow-500"} />
            Motor de Análisis Neural (Investigación Real)
          </h2>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ej: 'Situación actual de Tesla vs BYD' o 'Comparativa Intel Core i9 vs Ryzen 9 2024'..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none h-20 resize-none"
          />
          <div className="flex gap-2">
             <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`flex-1 py-2 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95 ${isCyber ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-yellow-600 hover:bg-yellow-500'}`}
            >
                {isAnalyzing ? 'Investigando en Internet...' : settings.apiKey ? 'Analizar con Google Search' : 'Generar Simulación'}
                <Search size={16} />
            </button>
            {!settings.apiKey && (
                <div className="flex items-center justify-center px-3 bg-red-900/30 border border-red-500/30 rounded text-red-400" title="Sin API Key (Modo Simulado)">
                    <Lock size={16}/>
                </div>
            )}
          </div>
      </div>

      {isAnalyzing && (
          <div className="text-center py-6 animate-pulse">
              <Activity className="mx-auto text-blue-400 mb-2 h-8 w-8 animate-spin" />
              <p className="text-xs text-blue-300 font-mono">
                 {settings.apiKey ? 'Gemini está navegando por la web para ti...' : 'Calculando proyecciones simuladas...'}
              </p>
          </div>
      )}

      {reportReady && (
        <div className="space-y-6 animate-in slide-in-from-bottom-10">
            <div className="hidden print:block text-center mb-6">
                <h1 className="text-2xl font-bold text-black">Informe Estratégico Real - VICO</h1>
                <p className="text-sm text-gray-500">Generado mediante IA con Grounding el {new Date().toLocaleDateString()}</p>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-blue-500/30 bg-gradient-to-br from-slate-900 to-slate-800 print:bg-white print:border-black print:text-black">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2 print:border-black">
                    <GitMerge size={20} className="text-purple-400 print:text-black"/>
                    <h3 className="text-lg font-bold text-white print:text-black uppercase tracking-widest">{entities.join(' vs ')}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <h4 className="font-bold text-blue-400 text-lg print:text-black">{entities[0]}</h4>
                        </div>
                        <ul className="text-xs text-slate-300 space-y-1 print:text-black pl-5 list-disc">
                            {realProductsA.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                    <div className="space-y-2">
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <h4 className="font-bold text-purple-400 text-lg print:text-black">{entities[1]}</h4>
                        </div>
                        <ul className="text-xs text-slate-300 space-y-1 print:text-black pl-5 list-disc">
                             {realProductsB.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg mb-6 print:bg-gray-100 print:text-black">
                    <h5 className="font-bold text-white text-xs mb-2 print:text-black flex items-center gap-1"><Brain size={12}/> Veredicto Profesional</h5>
                    <p className="text-xs text-slate-400 leading-relaxed text-justify print:text-black">
                        {realComparisonText}
                    </p>
                </div>

                <div>
                    <h5 className="font-bold text-white text-xs mb-4 print:text-black flex items-center gap-1"><DollarSign size={12}/> Análisis de Tendencia</h5>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={realFluctuationData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="month" tick={{fontSize: 10}} stroke="#94a3b8" />
                                <YAxis tick={{fontSize: 10}} stroke="#94a3b8" />
                                <ReTooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px'}} itemStyle={{color: '#fff'}} />
                                <Legend />
                                <Line type="monotone" dataKey={entities[0]} stroke="#3b82f6" strokeWidth={2} />
                                <Line type="monotone" dataKey={entities[1]} stroke="#a855f7" strokeWidth={2} />
                                <Line type="monotone" dataKey="Sector" stroke="#10b981" strokeDasharray="5 5" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Grounding Sources */}
            {sources.length > 0 && (
                <div className="glass-panel p-4 rounded-xl border-l-4 border-l-green-500 bg-slate-900/40">
                    <h4 className="text-xs font-bold text-green-400 uppercase mb-3 flex items-center gap-2">
                        <Globe size={14}/> Fuentes Consultadas (Grounding)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {sources.map((s, idx) => (
                            <a 
                                key={idx} 
                                href={s.uri} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-[10px] text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded flex items-center gap-2 border border-slate-700 hover:border-green-500 transition-colors"
                            >
                                <LinkIcon size={12} className="text-green-500 flex-shrink-0"/>
                                <span className="truncate">{s.title}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-xl bg-slate-900/50">
                    <h3 className="text-[10px] font-bold text-purple-400 uppercase mb-2 flex items-center gap-1"><Network size={12}/> Comparativa de Atributos</h3>
                    <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={realRadarData}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{fontSize: 8, fill: '#64748b'}} />
                                <Radar name={entities[0]} dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                                <Radar name={entities[1]} dataKey="B" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel p-4 rounded-xl">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Percepción de Mercado</h3>
                    <div className="h-40 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={realPieData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                        {realPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <ReTooltip />
                                </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative border-t-2 border-t-blue-500/50 print:border-black print:text-black">
                <h3 className="font-bold mb-3 flex items-center gap-2 text-white text-sm uppercase tracking-wide print:text-black">
                    <Maximize2 size={16} className="text-purple-500" /> Resumen Ejecutivo
                </h3>
                <div className="text-slate-300 text-xs leading-relaxed text-justify font-mono print:text-black">
                    <p>{realSummary}</p>
                </div>
                {showExtended && (
                    <div className="mt-4 pt-4 border-t border-slate-700 animate-in fade-in space-y-4 text-xs text-slate-400 print:text-black">
                        <p>{realExtendedSummary}</p>
                    </div>
                )}
                <button 
                    onClick={() => setShowExtended(!showExtended)}
                    className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] text-blue-400 uppercase tracking-widest font-bold flex items-center justify-center gap-2 border border-slate-600 hover:border-blue-400 transition-colors print:hidden"
                >
                    {showExtended ? 'CONTRAER INFORME' : 'VER ANÁLISIS COMPLETO (+1000 chars)'} <PlusCircle size={12}/>
                </button>
            </div>

            <div className="flex justify-center pb-8 print:hidden">
                <button onClick={handlePrint} className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform">
                    <Printer size={16}/> Imprimir Informe Real
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;
