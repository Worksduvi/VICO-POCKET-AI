import React, { useState } from 'react';
import { CalendarEvent } from '../types';
import { Calendar as CalendarIcon, Clock, Trash2 } from 'lucide-react';

interface CalendarViewProps {
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
  isCyber: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, setEvents, isCyber }) => {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');

  const addEvent = () => {
    if (!date || !title) return;
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title,
      date
    };
    setEvents([...events, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setTitle('');
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="h-full p-4 pb-24 overflow-y-auto">
       <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <CalendarIcon className={isCyber ? "text-blue-500" : "text-yellow-500"} />
          Agenda
      </h2>

      <div className="glass-panel p-4 rounded-xl mb-6 space-y-3">
        <label className="block text-xs text-slate-400 uppercase">Nueva Cita</label>
        <input 
          type="datetime-local" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white scheme-dark"
        />
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Descripción..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder:text-slate-600"
        />
        <button 
          onClick={addEvent}
          className={`w-full py-2 rounded-lg font-bold text-white ${isCyber ? 'bg-blue-600' : 'bg-yellow-600'}`}
        >
          Agendar
        </button>
      </div>

      <div className="space-y-2">
        {events.map(evt => (
          <div key={evt.id} className="flex items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
            <div className={`p-2 rounded-lg mr-3 ${isCyber ? 'bg-blue-900/30 text-blue-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
               <Clock size={20} />
            </div>
            <div className="flex-1">
              <div className="text-white font-medium">{evt.title}</div>
              <div className="text-xs text-slate-400">
                {new Date(evt.date).toLocaleString()}
              </div>
            </div>
            <button onClick={() => deleteEvent(evt.id)} className="text-slate-600 hover:text-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {events.length === 0 && <div className="text-center text-slate-600 py-10">Sin recordatorios pendientes</div>}
      </div>
    </div>
  );
};

export default CalendarView;
