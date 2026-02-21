import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { AppSettings } from '../types';

interface ChatWidgetProps {
  settings: AppSettings;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([
    { role: 'bot', text: 'Hola, soy VICO. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setIsSending(true);
    const newMsg = { role: 'user' as const, text: input };
    setMessages([...messages, newMsg]);
    setInput('');
    
    // Simulate API call / Haptic Feedback
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: `Procesando: "${newMsg.text}"... (Simulación)` }]);
      setIsSending(false);
    }, 1000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-4 p-4 rounded-full shadow-lg z-50 transition-all duration-300 ${settings.theme === 'Gold' ? 'bg-yellow-600' : 'bg-blue-600'} hover:scale-110`}
      >
        <Bot className="w-6 h-6 text-white" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-start sm:items-center sm:justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => {
            if(e.target === e.currentTarget) setIsOpen(false);
        }}>
          <div className="w-full max-w-sm h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-white">VICO Chat</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-slate-700 text-slate-200 rounded-bl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isSending && <div className="text-xs text-slate-500 italic ml-2">VICO está escribiendo...</div>}
            </div>

            <div className="p-4 border-t border-slate-700 bg-slate-800 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe a VICO..."
                className="flex-1 bg-slate-900 border border-slate-600 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <button 
                onClick={handleSend}
                className={`p-2 rounded-full transition-all duration-200 ${isSending ? 'bg-green-500 scale-95' : 'bg-blue-600 hover:bg-blue-500'}`}
              >
                <Send className={`w-5 h-5 text-white ${isSending ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
