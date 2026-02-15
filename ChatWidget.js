import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const ChatWidget = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Hola, soy VICO AI. ¿En qué puedo ayudarte?' }]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { role: 'user', text: input };
    setMessages([...messages, newMsg]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: 'Estoy procesando tu solicitud en modo local...' }]);
    }, 1000);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="fixed bottom-24 right-4 p-4 rounded-full shadow-lg z-50 bg-blue-600">
        <Bot className="w-6 h-6 text-white" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm h-[400px] bg-slate-900 border border-slate-700 rounded-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between bg-slate-800">
              <span className="font-bold text-white">VICO Chat</span>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-600' : 'bg-slate-700 text-slate-200'}`}>{m.text}</div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-700 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-slate-800 border-none rounded-full px-4 text-white text-sm" placeholder="Escribe..." />
              <button onClick={handleSend} className="bg-blue-600 p-2 rounded-full"><Send size={16} className="text-white" /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ChatWidget;

