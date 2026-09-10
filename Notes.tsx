import React, { useState } from 'react';
import { Note } from '../types';
import { Plus, Trash2, ShieldAlert, Crosshair } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotesProps {
  notes: Note[];
  onAddNote: (title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

export function Notes({ notes, onAddNote, onDeleteNote }: NotesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAdd = () => {
    if (!title.trim() && !content.trim()) return setIsAdding(false);
    onAddNote(title.trim() || 'Visão sem título', content.trim());
    setTitle('');
    setContent('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    onDeleteNote(id);
  };

  return (
    <div className="w-full h-full flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-zinc-900/40 p-8 rounded-[2rem] border border-zinc-800/80 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-zinc-50 flex items-center gap-4 uppercase tracking-tight">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
              <Crosshair size={28} />
            </div>
            Arsenal de Ideias
          </h2>
          <p className="text-zinc-400 font-medium mt-2 ml-16 text-lg">Anota as sacadas antes que evaporem. Estratégia é tudo.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 py-4 rounded-2xl font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 active:scale-95 relative z-10"
        >
          <Plus size={20} strokeWidth={3} />
          Nova Visão
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-zinc-900 border-2 border-amber-500 p-6 rounded-3xl flex flex-col gap-4 shadow-2xl shadow-amber-500/10 relative overflow-hidden"
            >
              <input
                autoFocus
                type="text"
                placeholder="Qual é a visão?"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="bg-transparent border-b-2 border-zinc-800 px-2 py-3 text-xl text-zinc-100 font-black focus:outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-600"
              />
              <textarea
                placeholder="Desenrola a estratégia aqui, sem filtro..."
                value={content}
                onChange={e => setContent(e.target.value)}
                className="bg-transparent px-2 py-3 text-zinc-300 font-medium focus:outline-none resize-none h-48 placeholder:text-zinc-700 scrollbar-thin"
              />
              <div className="flex justify-end gap-3 mt-auto pt-4">
                <button onClick={() => setIsAdding(false)} className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 px-5 py-3 transition-colors">Abortar</button>
                <button onClick={handleAdd} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs px-6 py-3 rounded-xl font-black uppercase tracking-wider transition-all shadow-md">Registrar</button>
              </div>
            </motion.div>
          )}

          {notes.map(note => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={note.id}
              className="bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/50 p-6 rounded-3xl flex flex-col gap-4 group transition-all shadow-sm"
            >
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-bold text-xl text-zinc-100 line-clamp-2 leading-tight">{note.title}</h3>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950 hover:bg-zinc-900 p-2.5 rounded-xl border border-transparent hover:border-red-500/30"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-zinc-400 font-medium whitespace-pre-wrap flex-1 leading-relaxed text-sm">{note.content}</p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800/80">
                <ShieldAlert size={14} className="text-amber-500/70" />
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                  Registrado em {new Date(note.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {!isAdding && notes.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-zinc-500 bg-zinc-900/20 border-2 border-dashed border-zinc-800/80 rounded-[3rem] mt-4">
                <div className="p-6 bg-zinc-900/80 rounded-3xl mb-6 shadow-inner">
                  <Crosshair size={48} className="text-zinc-700" />
                </div>
                <p className="font-black text-xl text-zinc-400 uppercase tracking-widest mb-2">Arsenal Vazio</p>
                <p className="font-medium text-zinc-500">Mente vazia. Quando a visão bater, joga aqui pra não perder.</p>
            </div>
        )}
      </div>
    </div>
  );
}
