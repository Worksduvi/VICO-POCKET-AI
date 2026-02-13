import React, { useState } from 'react';
import { Folder, Trash2, Plus, ChevronDown, ChevronUp, Copy, Tag, Volume2, Sparkles, StopCircle, Palette } from 'lucide-react';

const NotesView = ({ notes, folders, setNotes, setFolders, isCyber }) => {
  const [activeFolder, setActiveFolder] = useState(folders[0]);
  const [newFolder, setNewFolder] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [speakingNoteId, setSpeakingNoteId] = useState(null);

  const filteredNotes = notes.filter(n => n.folder === activeFolder);
  const NOTE_COLORS = [
    { name: 'Default', value: '' },
    { name: 'Blue', value: '#1e3a8a' },
    { name: 'Red', value: '#7f1d1d' },
    { name: 'Green', value: '#064e3b' }
  ];

  const addNote = () => {
    if (!noteTitle.trim()) return;
    const newNote = {
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

  const deleteNote = (id) => {
    if (confirm('¿Eliminar nota?')) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0b0f1a]">
      {/* Tabs de Carpetas */}
      <div className="flex overflow-x-auto gap-2 p-4 border-b border-slate-800">
        {folders.map(folder => (
          <button key={folder} onClick={() => setActiveFolder(folder)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${activeFolder === folder ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
            {folder}
          </button>
        ))}
        <button onClick={() => setIsAddingFolder(true)} className="p-1.5 rounded-full bg-slate-800 text-slate-400"><Plus size={16} /></button>
      </div>

      {/* Lista de Notas */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {filteredNotes.map(note => (
          <div key={note.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="flex justify-between mb-2">
              <h3 className="font-bold text-white">{note.title}</h3>
              <button onClick={() => deleteNote(note.id)} className="text-slate-500 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
            <p className="text-slate-300 text-sm">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesView;