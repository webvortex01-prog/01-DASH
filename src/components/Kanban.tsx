import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { Plus, Trash2, Crosshair, Zap, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface KanbanProps {
  tasks: Task[];
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onAddTask: (status: TaskStatus, title: string, desc: string) => void;
  onDeleteTask: (id: string) => void;
}

const COLUMNS: { id: TaskStatus; title: string; subtitle: string; color: string; icon: React.FC<any> }[] = [
  { id: 'todo', title: 'NA AGULHA', subtitle: 'Pra ontem', color: 'bg-zinc-800/50 text-zinc-300 border-zinc-700', icon: Crosshair },
  { id: 'in-progress', title: 'AMASSANDO', subtitle: 'Foco total agora', color: 'bg-amber-500/10 text-amber-500 border-amber-500/30', icon: Zap },
  { id: 'done', title: 'JÁ ERA', subtitle: 'Dominado', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: Trophy },
];

export function Kanban({ tasks, onUpdateStatus, onAddTask, onDeleteTask }: KanbanProps) {
  const [isAdding, setIsAdding] = useState<TaskStatus | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('taskId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task && task.status !== 'done' && status === 'done') {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#10b981', '#34d399', '#fcd34d', '#f59e0b'],
                zIndex: 9999
            });
        }
        onUpdateStatus(taskId, status);
    }
  };

  const handleAddTask = (status: TaskStatus) => {
    if (!newTaskTitle.trim()) {
        setIsAdding(null);
        return;
    }
    onAddTask(status, newTaskTitle, newTaskDesc);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setIsAdding(null);
  };

  const handleDelete = (id: string) => {
    onDeleteTask(id);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full w-full overflow-x-auto pb-4">
      {COLUMNS.map(col => {
        const Icon = col.icon;
        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="flex-1 min-w-[320px] max-w-sm flex flex-col bg-zinc-900/40 rounded-[2rem] border border-zinc-800/80 p-5 shadow-sm"
          >
            <div className={`mb-6 px-4 py-3 rounded-2xl border w-full flex items-center justify-between ${col.color}`}>
              <div className="flex items-center gap-3">
                <Icon size={20} className={col.id === 'in-progress' ? 'fill-amber-500/20' : ''} />
                <div className="flex flex-col">
                  <span className="font-black tracking-wider text-sm">{col.title}</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-70 font-bold">{col.subtitle}</span>
                </div>
              </div>
              <span className="font-black text-lg bg-black/20 px-3 py-1 rounded-xl">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-4 overflow-y-auto min-h-[150px] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent pr-2">
              {tasks.filter(t => t.status === col.id).map(task => (
                <motion.div
                  layout
                  layoutId={task.id}
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className={`bg-zinc-900 border-l-4 p-5 rounded-2xl cursor-grab active:cursor-grabbing group transition-all duration-200 shadow-md ${
                    col.id === 'in-progress' ? 'border-l-amber-500 border-t border-r border-b border-zinc-800 hover:border-amber-500/50' : 
                    col.id === 'done' ? 'border-l-emerald-500 border-t border-r border-b border-zinc-800 opacity-60 hover:opacity-100' :
                    'border-l-zinc-600 border-t border-r border-b border-zinc-800 hover:border-zinc-500'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-zinc-100 leading-snug">{task.title}</h4>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-zinc-950 rounded-md"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {task.description && (
                    <p className="text-sm text-zinc-400 mt-3 line-clamp-3 font-medium">{task.description}</p>
                  )}
                </motion.div>
              ))}

              {isAdding === col.id ? (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-900 border border-amber-500/50 p-4 rounded-2xl flex flex-col gap-3 mt-2 shadow-xl shadow-amber-500/5 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Qual a missão?"
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 font-bold focus:outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-600"
                    onKeyDown={e => { if (e.key === 'Enter') handleAddTask(col.id); }}
                  />
                  <textarea
                    placeholder="Detalhes (opcional)..."
                    value={newTaskDesc}
                    onChange={e => setNewTaskDesc(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 font-medium focus:outline-none focus:border-amber-500 resize-none h-20 transition-colors scrollbar-thin placeholder:text-zinc-700"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => setIsAdding(null)} className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 px-4 py-2 transition-colors">Arregar</button>
                    <button onClick={() => handleAddTask(col.id)} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs px-5 py-2 rounded-xl font-black uppercase tracking-wider transition-colors shadow-md">Manda Bala</button>
                  </div>
                </motion.div>
              ) : (
                <button
                  onClick={() => setIsAdding(col.id)}
                  className="flex items-center justify-center gap-2 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/5 py-4 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-amber-500/50 transition-all duration-200 mt-2 font-bold uppercase tracking-wider text-xs"
                >
                  <Plus size={18} />
                  Nova Missão
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
