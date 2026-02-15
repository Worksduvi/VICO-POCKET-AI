import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Trash2, Plus } from 'lucide-react';

const CalendarView = ({ events, setEvents, isCyber }) => {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');

  const addEvent = () => {
    if (!date || !title) return;
    setEvents([...events, { id: Date.now().toString(), title, date }].sort((a,b) => new Date(a.date) - new Date(b.date)));
    setTitle('');
  };

  return (
    <div className="h-full p-4 pb-24 overflow-y-auto bg-[#0b0f1a]">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><CalendarIcon /> Agenda</h2>
      <div className="bg-slate-900 p-4 rounded-xl mb-4 space-y-2 border border-slate-800">
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-800 p-2 rounded text-white text-sm" />
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Evento..." className="w-full bg-slate-800 p-2 rounded text-white text-sm" />
        <button onClick={addEvent} className="w-full bg-blue-600 py-2 rounded font-bold text-sm text-white">Agendar</button>
      </div>
      <div className="space-y-2">
        {events.map(evt => (
          <div key={evt.id} className="flex justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <div>
              <div className="text-white text-sm">{evt.title}</div>
              <div className="text-[10px] text-slate-500">{new Date(evt.date).toLocaleString()}</div>
            </div>
            <button onClick={() => setEvents(events.filter(e => e.id !== evt.id))} className="text-red-500"><Trash2 size={16}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CalendarView;
