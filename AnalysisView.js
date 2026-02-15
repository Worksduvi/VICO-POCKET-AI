import React, { useState } from 'react';
import { PieChart, Zap, Activity, Shield, TrendingUp } from 'lucide-react';

const AnalysisView = ({ isCyber, incomingData, settings }) => {
  return (
    <div className="p-4 space-y-6 pb-24 h-full overflow-y-auto bg-[#0b0f1a]">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <PieChart className="text-blue-500" /> IA ROI Analysis
      </h2>
      <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 text-center">
        <Activity size={48} className="mx-auto mb-4 text-blue-400 animate-pulse" />
        <p className="text-slate-300">Esperando datos para analizar...</p>
        {incomingData && <p className="mt-4 text-xs text-blue-400 italic">Datos recibidos: {incomingData.substring(0, 50)}...</p>}
      </div>
    </div>
  );
};

export default AnalysisView;
