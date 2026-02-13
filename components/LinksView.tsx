
import React, { useState } from 'react';
import { Note } from '../types';
import { Search, Tag, Trash2, ExternalLink, Edit2, Plus, Bookmark, X, Save } from 'lucide-react';

interface LinksViewProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  isCyber: boolean;
}

const LinksView: React.FC<LinksViewProps> = ({ notes, setNotes, isCyber }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTags, setEditTags] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  
  // Filter only notes in "Links" folder
  const linkItems = notes.filter(n => n.folder === 'Links');
  
  const filteredLinks = linkItems.filter(link => 
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      link.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const startEdit = (link: Note) => {
      setEditingId(link.id);
      setEditTitle(link.title);
      setEditTags(link.tags?.join(', ') || '');
  };

  const saveEdit = () => {
      if(!editingId) return;
      const tagsArray = editTags.split(',').map(t => t.trim()).filter(t => t);
      setNotes(notes.map(n => n.id === editingId ? { ...n, title: editTitle, tags: tagsArray } : n));
      setEditingId(null);
  };

  const deleteLink = (id: string) => {
      if(confirm('¿Borrar este enlace?')) {
          setNotes(notes.filter(n => n.id !== id));
      }
  };

  const addNewLink = () => {
      if(!newUrl) return;
      const newLink: Note = {
          id: Date.now().toString(),
          title: editTitle || newUrl,
          content: newUrl, // Content stores the URL effectively or description
          url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`,
          folder: 'Links',
          date: new Date().toISOString(),
          tags: editTags.split(',').map(t => t.trim()).filter(t => t)
      };
      setNotes([newLink, ...notes]);
      setIsAdding(false);
      setNewUrl('');
      setEditTitle('');
      setEditTags('');
  };

  return (
    <div className="h-full flex flex-col pb-24 relative">
        <div className="p-4 bg-slate-900/90 backdrop-blur border-b border-slate-700 sticky top-0 z-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Bookmark className={isCyber ? "text-blue-500" : "text-yellow-500"} />
                Links Pocket
            </h2>
            
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                    <input 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Buscar enlaces o etiquetas..."
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                    />
                </div>
                <button onClick={() => setIsAdding(true)} className="bg-blue-600 px-3 rounded-lg text-white">
                    <Plus size={20} />
                </button>
            </div>
        </div>

        {/* Add Modal */}
        {isAdding && (
            <div className="p-4 bg-slate-800 border-b border-slate-700 animate-in fade-in space-y-3">
                <div className="flex justify-between text-white text-sm font-bold">
                    <span>Nuevo Enlace</span>
                    <button onClick={() => setIsAdding(false)}><X size={16}/></button>
                </div>
                <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://..." className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm" />
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Título (Opcional)" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm" />
                <input value={editTags} onChange={e => setEditTags(e.target.value)} placeholder="Etiquetas (separadas por coma)" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm" />
                <button onClick={addNewLink} className="w-full bg-green-600 py-2 rounded text-white font-bold text-sm">Guardar Link</button>
            </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredLinks.length === 0 ? (
                <div className="text-center text-slate-500 mt-10">
                    <Bookmark size={48} className="mx-auto mb-2 opacity-20" />
                    <p>No hay enlaces guardados</p>
                </div>
            ) : (
                filteredLinks.map(link => (
                    <div key={link.id} className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 hover:border-slate-600 transition-colors">
                        {editingId === link.id ? (
                            <div className="space-y-2">
                                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded p-1 text-white text-sm" />
                                <input value={editTags} onChange={e => setEditTags(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded p-1 text-white text-xs" />
                                <div className="flex gap-2">
                                    <button onClick={saveEdit} className="bg-green-600 px-3 py-1 rounded text-white text-xs flex items-center gap-1"><Save size={12}/> Guardar</button>
                                    <button onClick={() => setEditingId(null)} className="bg-slate-700 px-3 py-1 rounded text-white text-xs">Cancelar</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-white font-bold text-sm truncate w-3/4">{link.title}</h3>
                                    <div className="flex gap-3">
                                        <a href={link.url || link.content} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">
                                            <ExternalLink size={16} />
                                        </a>
                                        <button onClick={() => startEdit(link)} className="text-slate-500 hover:text-white">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => deleteLink(link.id)} className="text-slate-500 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-slate-500 text-[10px] truncate mb-2">{link.url || link.content}</p>
                                <div className="flex flex-wrap gap-1">
                                    {link.tags?.map((tag, i) => (
                                        <span key={i} className="flex items-center gap-1 bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] border border-slate-700">
                                            <Tag size={8} /> {tag}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    </div>
  );
};

export default LinksView;
