import React, { useState } from 'react';
import { Search, Bookmark, Plus, ExternalLink, Trash2, Tag } from 'lucide-react';

const LinksView = ({ notes, setNotes, isCyber }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const linkItems = notes.filter(n => n.folder === 'Links');
  const filteredLinks = linkItems.filter(link => 
      link.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addNewLink = () => {
      if(!newUrl) return;
      const newLink = {
          id: Date.now().toString(),
          title: newTitle || newUrl,
          content: newUrl,
          url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`,
          folder: 'Links',
          date: new Date().toISOString(),
          tags: []
      };
      setNotes([newLink, ...notes]);
      setIsAdding(false);
      setNewUrl('');
      setNewTitle('');
  };

  return (
    <div className="h-full flex flex-col bg-[#0b0f1a]">
        <div className="p-4 border-b border-slate-800 sticky top-0 bg-[#0b0f1a] z-10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Bookmark className="text-blue-500" /> Links Pocket
            </h2>
            <div className="flex gap-2">
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar..." 
                       className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" />
                <button onClick={() => setIsAdding(true)} className="bg-blue-600 px-3 rounded-lg text-white"><Plus size={20} /></button>
            </div>
        </div>

        {isAdding && (
            <div className="p-4 bg-slate-800 border-b border-slate-700 space-y-2">
                <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://..." className="w-full bg-slate-900 p-2 rounded text-white text-sm" />
                <button onClick={addNewLink} className="w-full bg-green-600 py-2 rounded text-white font-bold">Guardar Link</button>
            </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
            {filteredLinks.map(link => (
                <div key={link.id} className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex justify-between items-center">
                    <div>
                        <h3 className="text-white font-bold text-sm truncate">{link.title}</h3>
                        <p className="text-slate-500 text-[10px]">{link.url || link.content}</p>
                    </div>
                    <div className="flex gap-3">
                        <a href={link.url || link.content} target="_blank" rel="noreferrer" className="text-blue-400"><ExternalLink size={16} /></a>
                        <button onClick={() => setNotes(notes.filter(n => n.id !== link.id))} className="text-slate-500 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default LinksView;
