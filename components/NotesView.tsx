
import React, { useState } from 'react';
import { Note } from '../types';
import { NOTE_COLORS } from '../constants';
import { Folder, Trash2, Plus, ChevronDown, ChevronUp, Copy, Tag, Volume2, Sparkles, StopCircle, Palette, ArrowRightCircle } from 'lucide-react';

interface NotesViewProps {
  notes: Note[];
  folders: string[];
  setNotes: (notes: Note[]) => void;
  setFolders: (folders: string[]) => void;
  isCyber: boolean;
}

const NotesView: React.FC<NotesViewProps> = ({ notes, folders, setNotes, setFolders, isCyber }) => {
  const [activeFolder, setActiveFolder] = useState<string>(folders[0]);
  const [newFolder, setNewFolder] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [speakingNoteId, setSpeakingNoteId] = useState<string | null>(null);
  const [colorPickerOpenId, setColorPickerOpenId] = useState<string | null>(null);

  const filteredNotes = notes.filter(n => n.folder === activeFolder);

  const addNote = () => {
    if (!noteTitle.trim()) return;
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteTitle,
      content: noteContent,
      folder: activeFolder,
      date: new Date().toISOString(),
      isExpanded: false,
      tags: [],
      color: ''
    };
    setNotes([newNote, ...notes]);
    setNoteTitle('');
    setNoteContent('');
  };

  const deleteNote = (id: string) => {
    if (confirm('¿Eliminar nota?')) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  const toggleExpand = (id: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, isExpanded: !n.isExpanded } : n));
  };

  const addFolder = () => {
    if (newFolder.trim() && !folders.includes(newFolder)) {
      setFolders([...folders, newFolder]);
      setNewFolder('');
      setIsAddingFolder(false);
    }
  };

  const deleteFolder = () => {
      if(folders.length <= 1) return;
      if(confirm(`¿Eliminar carpeta ${activeFolder} y sus notas?`)) {
          const newF = folders.filter(f => f !== activeFolder);
          setFolders(newF);
          setNotes(notes.filter(n => n.folder !== activeFolder));
          setActiveFolder(newF[0]);
      }
  };

  const handleSpeak = (e: React.MouseEvent, note: Note) => {
      e.stopPropagation();
      if (speakingNoteId === note.id) {
          window.speechSynthesis.cancel();
          setSpeakingNoteId(null);
      } else {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(`${note.title}. ${note.content}`);
          utterance.lang = 'es-ES';
          utterance.rate = 1.0;
          utterance.onend = () => setSpeakingNoteId(null);
          window.speechSynthesis.speak(utterance);
          setSpeakingNoteId(note.id);
      }
  };

  const handleAutoTag = (e: React.MouseEvent, note: Note) => {
      e.stopPropagation();
      const keywords = ['Importante', 'Trabajo', 'Idea', 'Proyecto', 'Urgente'];
      const randomTag = keywords[Math.floor(Math.random() * keywords.length)];
      
      const updatedTags = note.tags ? [...note.tags] : [];
      if(!updatedTags.includes(randomTag)) updatedTags.push(randomTag);

      setNotes(notes.map(n => n.id === note.id ? { ...n, tags: updatedTags } : n));
  };

  const updateNoteColor = (id: string, color: string) => {
      setNotes(notes.map(n => n.id === id ? { ...n, color } : n));
      setColorPickerOpenId(null);
  };

  const moveNote = (id: string, newFolder: string) => {
      setNotes(notes.map(n => n.id === id ? { ...n, folder: newFolder } : n));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Horizontal Scrollable Tabs */}
      <div className="flex overflow-x-auto gap-2 p-4 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-700 no-scrollbar">
        {folders.map(folder => (
          <button
            key={folder}
            onClick={() => setActiveFolder(folder)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeFolder === folder 
                ? (isCyber ? 'bg-blue-600 text-white shadow-[0_0_10px_#3b82f6]' : 'bg-yellow-600 text-white')
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {folder}
          </button>
        ))}
        <button 
          onClick={() => setIsAddingFolder(true)} 
          className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <Plus size={16} />
        </button>
      </div>

      {isAddingFolder && (
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex gap-2">
          <input 
            value={newFolder}
            onChange={e => setNewFolder(e.target.value)}
            placeholder="Nueva Carpeta..."
            className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-1 text-sm text-white"
          />
          <button onClick={addFolder} className="bg-green-600 px-3 py-1 rounded text-sm text-white">OK</button>
          <button onClick={() => setIsAddingFolder(false)} className="bg-red-600 px-3 py-1 rounded text-sm text-white">X</button>
        </div>
      )}

      {/* Quick Add Note */}
      <div className="p-4 space-y-2">
        <input 
          value={noteTitle}
          onChange={e => setNoteTitle(e.target.value)}
          placeholder={`Nueva nota en: ${activeFolder}`}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none placeholder:text-slate-500"
        />
        {noteTitle && (
            <div className="animate-in fade-in slide-in-from-top-2 space-y-2">
                <textarea 
                    value={noteContent}
                    onChange={e => setNoteContent(e.target.value)}
                    placeholder="Contenido..."
                    rows={3}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:border-blue-500 outline-none resize-none"
                />
                <button onClick={addNote} className={`w-full py-2 rounded-lg font-bold text-white transition-colors ${isCyber ? 'bg-blue-600 hover:bg-blue-500' : 'bg-yellow-600 hover:bg-yellow-500'}`}>
                    Guardar Nota
                </button>
            </div>
        )}
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {filteredNotes.length === 0 ? (
            <div className="text-center text-slate-500 py-10 flex flex-col items-center">
                <Folder className="w-12 h-12 mb-2 opacity-50" />
                <p>Carpeta vacía</p>
                <button onClick={deleteFolder} className="mt-4 text-xs text-red-500 flex items-center gap-1 hover:underline">
                    <Trash2 size={12} /> Eliminar esta carpeta
                </button>
            </div>
        ) : (
            filteredNotes.map(note => (
            <div 
                key={note.id} 
                className="rounded-xl p-4 transition-all hover:shadow-lg relative group border border-white/5"
                style={{ 
                    backgroundColor: note.color || 'rgba(11, 15, 26, 0.7)',
                    backdropFilter: 'blur(12px)'
                }}
            >
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{note.title}</h3>
                    <div className="flex gap-2 relative">
                         {/* Tools */}
                         <button onClick={(e) => handleSpeak(e, note)} className={`${speakingNoteId === note.id ? 'text-green-400 animate-pulse' : 'text-slate-400 hover:text-blue-400'}`}>
                            {speakingNoteId === note.id ? <StopCircle size={16} /> : <Volume2 size={16} />}
                         </button>
                         <button onClick={(e) => handleAutoTag(e, note)} className="text-slate-400 hover:text-purple-400">
                            <Sparkles size={16} />
                         </button>
                         <button onClick={() => setColorPickerOpenId(colorPickerOpenId === note.id ? null : note.id)} className="text-slate-400 hover:text-yellow-400">
                            <Palette size={16} />
                         </button>
                         <button onClick={() => deleteNote(note.id)} className="text-slate-400 hover:text-red-500">
                            <Trash2 size={16} />
                         </button>

                        {/* Color Picker Overlay */}
                        {colorPickerOpenId === note.id && (
                            <div className="absolute right-0 top-8 bg-slate-900 border border-slate-700 p-2 rounded-lg flex gap-1 shadow-xl z-20 animate-in fade-in">
                                {NOTE_COLORS.map(c => (
                                    <button
                                        key={c.name}
                                        onClick={() => updateNoteColor(note.id, c.value)}
                                        className="w-5 h-5 rounded-full border border-slate-500"
                                        style={{ backgroundColor: c.value || '#0b0f1a' }}
                                        title={c.name}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                <div 
                    onClick={() => toggleExpand(note.id)}
                    className="cursor-pointer"
                >
                    <p className={`text-slate-300 text-sm leading-relaxed ${!note.isExpanded ? 'line-clamp-2' : ''}`}>
                    {note.content}
                    </p>
                    
                    {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {note.tags.map((tag, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-black/30 text-slate-300 border border-white/10">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-center mt-2 text-white/30">
                        {note.isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center flex-wrap gap-2">
                    <span className="text-xs text-white/50">{new Date(note.date).toLocaleDateString()}</span>
                    <div className="flex gap-2 items-center">
                        <select 
                            className="bg-black/30 text-white/70 text-[10px] rounded px-1 py-0.5 border border-white/10 outline-none"
                            value={note.folder}
                            onChange={(e) => moveNote(note.id, e.target.value)}
                        >
                            {folders.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <Tag size={14} className="text-white/50" />
                        <Copy size={14} className="text-white/50 cursor-pointer hover:text-white" onClick={() => {
                             navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
                             alert("Copiado");
                        }}/>
                    </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default NotesView;
