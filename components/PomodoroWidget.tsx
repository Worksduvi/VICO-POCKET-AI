
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Timer } from 'lucide-react';

interface PomodoroWidgetProps {
  onClose: () => void;
  isCyber: boolean;
  externalState?: {
      active: boolean;
      time: number;
      setActive: (a: boolean) => void;
      setTime: (t: number) => void;
  }
}

const PomodoroWidget: React.FC<PomodoroWidgetProps> = ({ onClose, isCyber, externalState }) => {
  // Use external state if provided, otherwise local (fallback)
  const [localTime, setLocalTime] = useState(25 * 60);
  const [localActive, setLocalActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  const timeLeft = externalState ? externalState.time : localTime;
  const isActive = externalState ? externalState.active : localActive;
  
  const setTime = externalState ? externalState.setTime : setLocalTime;
  const setActive = externalState ? externalState.setActive : setLocalActive;

  // Local interval only if no external state (legacy support)
  useEffect(() => {
    if(!externalState) {
        let interval: any;
        if (isActive && timeLeft > 0) {
        interval = setInterval(() => {
            setTime(timeLeft - 1);
        }, 1000);
        } else if (timeLeft === 0) {
        setActive(false);
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        alert('Tiempo terminado');
        }
        return () => clearInterval(interval);
    }
  }, [isActive, timeLeft, externalState]);

  const toggleTimer = () => setActive(!isActive);
  const resetTimer = () => {
    setActive(false);
    setTime(mode === 'focus' ? 25 * 60 : 5 * 60);
  };
  
  const switchMode = () => {
      const newMode = mode === 'focus' ? 'break' : 'focus';
      setMode(newMode);
      setTime(newMode === 'focus' ? 25 * 60 : 5 * 60);
      setActive(false);
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className={`w-80 p-6 rounded-2xl shadow-2xl relative ${isCyber ? 'bg-slate-900 border border-blue-500/50' : 'bg-slate-900 border border-yellow-500/50'}`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center">
          <div className={`mb-4 p-3 rounded-full ${isCyber ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            <Timer size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Zen Focus</h3>
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-6">{mode === 'focus' ? 'Modo Productivo' : 'Modo Descanso'}</p>
          
          <div className={`text-6xl font-mono font-bold mb-8 ${isCyber ? 'text-white' : 'text-yellow-100'}`}>
            {formatTime(timeLeft)}
          </div>

          <div className="flex gap-4 mb-6">
            <button 
                onClick={toggleTimer}
                className={`p-4 rounded-full text-white transition-all hover:scale-110 ${isActive ? 'bg-red-500' : (isCyber ? 'bg-blue-600' : 'bg-yellow-600')}`}
            >
                {isActive ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
            </button>
            <button 
                onClick={resetTimer}
                className="p-4 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition-all"
            >
                <RotateCcw />
            </button>
          </div>

          <button onClick={switchMode} className="text-xs text-slate-500 underline hover:text-white">
            Cambiar a {mode === 'focus' ? 'Descanso (5min)' : 'Enfoque (25min)'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroWidget;
