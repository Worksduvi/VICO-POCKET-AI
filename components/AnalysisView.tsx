
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, ResponsiveContainer, Tooltip as ReTooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { Note, AnalysisReport, AppSettings } from '../types';
import { Brain, TrendingUp, Search, PlusCircle, Maximize2, Activity, Network, Zap, Printer, GitMerge, DollarSign, Globe, Lock } from 'lucide-react';
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
      
      try {
        if (settings.apiKey) {
            // REAL ANALYSIS
            const ai = new GoogleGenAI({ apiKey: settings.apiKey });
            const modelName = 'gemini-2.5-flash-lite-latest'; // Fast model
            
            const systemPrompt = `
                You are a senior market analyst and financial advisor. 
                Analyze the user prompt: "${prompt}".
                Identify the two main entities being compared (Entity A and Entity B).
                Return a JSON object with strictly this schema:
                {
                    "entityAName": string,
                    "entityBName": string,
                    "fluctuationData": [{"month": "Jan", "valA": number, "valB": number, "sector": number}, ... for 6 months],
                    "radarData": [{"subject": string, "scoreA": number, "scoreB": number}, ... 5 subjects like Innovation, Cost, etc (0-150)],
                    "sentiment": {"positive": number, "neutral": number, "negative": number},
                    "summary": string (short executive summary),
                    "comparisonText": string (detailed CEO level comparison),
                    "extendedSummary": string (long detailed analysis > 1000 chars),
                    "productsA": string[] (top 5 products/services),
                    "productsB": string[] (top 5 products/services)
                }
                Use real web knowledge to approximate the data.
            `;

            const response = await ai.models.generateContent({
                model: modelName,
                contents: systemPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            entityAName: { type: Type.STRING },
                            entityBName: { type: Type.STRING },
                            fluctuationData: { 
                                type: Type.ARRAY, 
                                items: { 
                                    type: Type.OBJECT, 
                                    properties: { month: {type: Type.STRING}, valA: {type: Type.NUMBER}, valB: {type: Type.NUMBER}, sector: {type: Type.NUMBER} }
                                }
                            },
                            radarData: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: { subject: {type: Type.STRING}, scoreA: {type: Type.NUMBER}, scoreB: {type: Type.NUMBER} }
                                }
                            },
                            sentiment: {
                                type: Type.OBJECT,
                                properties: { positive: {type: Type.NUMBER}, neutral: {type: Type.NUMBER}, negative: {type: Type.NUMBER} }
                            },
                            summary: { type: Type.STRING },
                            comparisonText: { type: Type.STRING },
                            extendedSummary: { type: Type.STRING },
                            productsA: { type: Type.ARRAY, items: { type: Type.STRING } },
                            productsB: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                    }
                }
            });

            if (response.text) {
                const data = JSON.parse(response.text);
                setEntities([data.entityAName, data.entityBName]);
                
                // Map API data to Chart Format
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
                // Mock Generation based on entities if detected
                const e1 = entities[0] || 'Entity A';
                const e2 = entities[1] || 'Entity B';
                
                setRealFluctuationData([
                    { month: 'Jan', [e1]: 4000, [e2]: 2400, Sector: 2400 },
                    { month: 'Feb', [e1]: 3000, [e2]: 1398, Sector: 2210 },
                    { month: 'Mar', [e1]: 2000, [e2]: 9800, Sector: 2290 },
                    { month: 'Apr', [e1]: 2780, [e2]: 3908, Sector: 2000 },
                    { month: 'May', [e1]: 1890, [e2]: 4800, Sector: 2181 },
                    { month: 'Jun', [e1]: 2390, [e2]: 3800, Sector: 2500 },
                ]);

                setRealRadarData([
                    { subject: 'Innovación', A: 120, B: 110, fullMark: 150 },
                    { subject: 'Costo', A: 98, B: 130, fullMark: 150 },
                    { subject: 'Rendimiento', A: 86, B: 130, fullMark: 150 },
                    { subject: 'Market Share', A: 99, B: 100, fullMark: 150 },
                    { subject: 'Brand', A: 85, B: 90, fullMark: 150 },
                ]);

                setRealPieData([
                    { name: 'Positivo', value: 400 },
                    { name: 'Neutro', value: 300 },
                    { name: 'Negativo', value: 100 },
                ]);

                setRealSummary(`Análisis estratégico de ${e1} vs ${e2}. Patrones simulados indican alta volatilidad.`);
                setRealComparisonText(`${e1} lidera en el mercado corporativo, mientras ${e2} domina el sector consumo. Se recomienda precaución por fluctuaciones del sector.`);
                setRealExtendedSummary("Simulación de análisis extendido. Conecte su API Key en Perfil para datos reales de Gemini AI.");
                setRealProductsA([`${e1} Pro`, `${e1} Cloud`, `${e1} AI`]);
                setRealProductsB([`${e2} Home`, `${e2} One`, `${e2} X`]);

                setReportReady(true);
            }, 2000);
        }
      } catch (error) {
          console.error("Analysis Error", error);
          alert("Error en el análisis. Verifique su API Key.");
      } finally {
          setIsAnalyzing(false);
          if(onAnalysisComplete) {
              onAnalysisComplete({
                  id: Date.now().toString(),
                  prompt: prompt,
                  date: new Date().toISOString(),
                  summary: `Análisis: ${entities.join(' vs ')}`,
                  entities: entities
              });
          }
      }
  };

  const handlePrint = () => {
      window.print();
  };

  const COLORS = ['#4ade80', '#94a3b8', '#f87171'];

  return (
    <div className="h-full overflow-y-auto p-4 pb-24 space-y-6 print:p-0 print:overflow-visible">
      
      {/* AI Prompt Input (Hidden on Print) */}
      <div className="glass-panel p-4 rounded-xl space-y-3 print:hidden">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Brain className={isCyber ? "text-blue-400" : "text-yellow-500"} />
            Motor de Análisis Neural
          </h2>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ej: 'Comparativa entre Microsoft y Nvidia'..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none h-20 resize-none"
          />
          <div className="flex gap-2">
             <button 
                onClick={handleAnalyze}
                className={`flex-1 py-2 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95 ${isCyber ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-yellow-600 hover:bg-yellow-500'}`}
            >
                {isAnalyzing ? 'Escaneando Red...' : settings.apiKey ? 'Generar Informe REAL (Gemini)' : 'Generar Informe (Simulado)'}
                <Search size={16} />
            </button>
            {!settings.apiKey && (
                <div className="flex items-center justify-center px-3 bg-red-900/30 border border-red-500/30 rounded text-red-400" title="Sin API Key">
                    <Lock size={16}/>
                </div>
            )}
          </div>
      </div>

      {isAnalyzing && (
          <div className="text-center py-6 animate-pulse">
              <Activity className="mx-auto text-blue-400 mb-2 h-8 w-8 animate-spin" />
              <p className="text-xs text-blue-300 font-mono">
                 {settings.apiKey ? 'Consultando Gemini Neural Network...' : 'Realizando simulación heurística...'}
              </p>
          </div>
      )}

      {reportReady && (
        <div className="space-y-6 animate-in slide-in-from-bottom-10">
            
            {/* Header for Print */}
            <div className="hidden print:block text-center mb-6">
                <h1 className="text-2xl font-bold text-black">Informe Estratégico VICO</h1>
                <p className="text-sm text-gray-500">Generado el {new Date().toLocaleDateString()}</p>
            </div>

            {/* --- HYBRID COMPARATIVE WIDGET --- */}
            <div className="glass-panel p-6 rounded-xl border border-blue-500/30 bg-gradient-to-br from-slate-900 to-slate-800 print:bg-white print:border-black print:text-black">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2 print:border-black">
                    <GitMerge size={20} className="text-purple-400 print:text-black"/>
                    <h3 className="text-lg font-bold text-white print:text-black uppercase tracking-widest">Comparativa Ejecutiva: {entities.join(' vs ')}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Entity A */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <h4 className="font-bold text-blue-400 text-lg print:text-black">{entities[0]}</h4>
                        </div>
                        <ul className="text-xs text-slate-300 space-y-1 print:text-black pl-5 list-disc">
                            {realProductsA.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                    {/* Entity B */}
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

                {/* Detailed Comparison Text */}
                <div className="bg-slate-900/50 p-4 rounded-lg mb-6 print:bg-gray-100 print:text-black">
                    <h5 className="font-bold text-white text-xs mb-2 print:text-black flex items-center gap-1"><Brain size={12}/> Análisis CEO/CMO</h5>
                    <p className="text-xs text-slate-400 leading-relaxed text-justify print:text-black">
                        {realComparisonText}
                    </p>
                </div>

                {/* Triple Sector Stock Fluctuation Chart */}
                <div>
                    <h5 className="font-bold text-white text-xs mb-4 print:text-black flex items-center gap-1"><DollarSign size={12}/> Fluctuación Bursátil & Segmentación Mundial</h5>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={realFluctuationData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="month" tick={{fontSize: 10}} stroke="#94a3b8" />
                                <YAxis tick={{fontSize: 10}} stroke="#94a3b8" />
                                <ReTooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px'}} itemStyle={{color: '#fff'}} />
                                <Legend />
                                <Line type="monotone" dataKey={entities[0]} stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey={entities[1]} stroke="#a855f7" strokeWidth={2} />
                                <Line type="monotone" dataKey="Sector" stroke="#10b981" strokeDasharray="5 5" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between mt-2 text-[9px] text-slate-500 print:text-black">
                        <span className="flex items-center gap-1"><Globe size={10}/> NA/EU Trends</span>
                        <span className="flex items-center gap-1"><Globe size={10}/> APAC Growth</span>
                        <span className="flex items-center gap-1"><Globe size={10}/> LATAM Emerging</span>
                    </div>
                </div>
            </div>

            {/* Standard Widgets Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
                {/* Radar Comparison */}
                <div className="glass-panel p-4 rounded-xl bg-slate-900/50 print:border-black print:text-black">
                    <h3 className="text-[10px] font-bold text-purple-400 uppercase mb-2 flex items-center gap-1 print:text-black"><Network size={12}/> Radar de Competencia</h3>
                    <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={realRadarData}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{fontSize: 8, fill: '#64748b'}} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar name={entities[0]} dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                                <Radar name={entities[1]} dataKey="B" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                                <Legend wrapperStyle={{fontSize: '10px'}} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sentiment Pie */}
                <div className="glass-panel p-4 rounded-xl print:border-black print:text-black">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-2 print:text-black">Sentimiento Global</h3>
                    <div className="h-40 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={realPieData}
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {realPieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <ReTooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px'}}/>
                                    <Legend verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{fontSize: '10px', color: '#ccc'}}/>
                                </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Extended Summary Section */}
            <div className="glass-panel p-6 rounded-2xl relative border-t-2 border-t-blue-500/50 print:border-black print:text-black">
                <h3 className="font-bold mb-3 flex items-center gap-2 text-white text-sm uppercase tracking-wide print:text-black">
                <Maximize2 size={16} className="text-purple-500" />
                Conclusión IA
                </h3>
                
                <div className="text-slate-300 text-xs leading-relaxed text-justify space-y-4 font-mono print:text-black">
                    <p>
                        <strong>RESUMEN:</strong> {realSummary}
                    </p>
                </div>
                
                {showExtended && (
                    <div className="mt-4 pt-4 border-t border-slate-700 animate-in fade-in space-y-4 text-xs text-slate-400 print:text-black">
                        <p>
                            <strong>ANÁLISIS EXTENDIDO:</strong><br/><br/>
                            {realExtendedSummary}
                        </p>
                    </div>
                )}

                <button 
                    onClick={() => setShowExtended(!showExtended)}
                    className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] text-blue-400 uppercase tracking-widest font-bold flex items-center justify-center gap-2 border border-slate-600 hover:border-blue-400 transition-colors print:hidden"
                >
                    {showExtended ? 'CONTRAER INFORME' : 'EXTENDER ANÁLISIS (+2000 chars)'} <PlusCircle size={12}/>
                </button>
            </div>

            {/* Print Button */}
            <div className="flex justify-center pb-8 print:hidden">
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
                >
                    <Printer size={16}/> Imprimir Informe Completo
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;
