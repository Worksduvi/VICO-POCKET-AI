import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Timer } from 'lucide-react';

const PomodoroWidget = ({ onClose, externalState }) => {
  const { active, time, setActive, setTime } = externalState;

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-72 p-6 bg-slate-900 border border-blue-500/50 rounded-2xl text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500"><X size={20}/></button>
        <Timer size={32} className="mx-auto mb-2 text-blue-400" />
        <h3 className="text-white font-bold mb-4">Zen Focus</h3>
        <div className="text-5xl font-mono text-white mb-6">{formatTime(time)}</div>
        <div className="flex justify-center gap-4">
          <button onClick={() => setActive(!active)} className={`p-4 rounded-full ${active ? 'bg-red-500' : 'bg-blue-600'}`}>
            {active ? <Pause text="white"/> : <Play text="white"/>}
          </button>
          <button onClick={() => { setActive(false); setTime(25 * 60); }} className="p-4 bg-slate-700 rounded-full"><RotateCcw text="white"/></button>
        </div>
      </div>
    </div>
  );
};
export default PomodoroWidget;
