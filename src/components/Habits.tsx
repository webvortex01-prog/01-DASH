import React, { useState } from 'react';
import { Target, Plus, Check, Trash2 } from 'lucide-react';
import { Habit } from '../types';

interface HabitsProps {
  habits: Habit[];
  onAddHabit: (title: string) => void;
  onToggleHabit: (habitId: string, dateStr: string) => void;
  onDeleteHabit: (id: string) => void;
}

export const Habits: React.FC<HabitsProps> = ({ habits, onAddHabit, onToggleHabit, onDeleteHabit }) => {
  const [newHabit, setNewHabit] = useState('');

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim()) {
      onAddHabit(newHabit.trim());
      setNewHabit('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <div className="bg-amber-500 p-3 rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.2)]">
          <Target className="text-zinc-950" size={28} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-zinc-100 uppercase tracking-tighter">Rastreador de Hábitos</h1>
          <p className="text-zinc-400 font-medium mt-1">Disciplina é liberdade. Não quebre a corrente.</p>
        </div>
      </div>

      <form onSubmit={handleAdd} className="mb-8 flex gap-3 shrink-0">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Ex: Beber 2L de Água, Ler 10 páginas..."
          className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl px-5 py-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-medium"
        />
        <button
          type="submit"
          disabled={!newHabit.trim()}
          className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:hover:bg-amber-500 text-zinc-950 px-6 rounded-xl font-black uppercase tracking-wider transition-colors flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.15)]"
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 pb-20 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {habits.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500">
            <Target size={48} strokeWidth={1.5} className="mb-4 opacity-50" />
            <p className="font-medium text-lg">Nenhum hábito rastreado ainda.</p>
            <p className="text-sm mt-1">Adicione seu primeiro hábito acima para começar a ganhar XP.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {habits.map((habit) => {
              const isCompletedToday = (habit.completedDates || []).includes(todayStr);
              // Calculate streak
              let streak = 0;
              let current = new Date(today);
              while (true) {
                const checkStr = current.toISOString().split('T')[0];
                if ((habit.completedDates || []).includes(checkStr)) {
                  streak++;
                  current.setDate(current.getDate() - 1);
                } else if (checkStr === todayStr) {
                  // If not completed today, check yesterday
                  current.setDate(current.getDate() - 1);
                } else {
                  break;
                }
              }

              return (
                <div key={habit.id} className="bg-zinc-900/50 border border-zinc-800/80 p-4 rounded-2xl flex items-center justify-between group hover:border-amber-500/30 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => onToggleHabit(habit.id, todayStr)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        isCompletedToday 
                          ? 'bg-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.3)] text-zinc-950 scale-105' 
                          : 'bg-zinc-950 border-2 border-zinc-700 text-transparent hover:border-amber-500/50'
                      }`}
                    >
                      <Check size={24} strokeWidth={3} />
                    </button>
                    <div>
                      <h3 className={`font-bold text-lg transition-colors ${isCompletedToday ? 'text-zinc-100' : 'text-zinc-300'}`}>
                        {habit.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                          Ofensiva: {streak} {streak === 1 ? 'dia' : 'dias'} 🔥
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    className="p-3 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                    title="Excluir Hábito"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
