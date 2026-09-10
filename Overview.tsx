import React, { useState, useEffect } from 'react';
import { Task, Note } from '../types';
import { Target, Zap, Trophy, ArrowRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OverviewProps {
  tasks: Task[];
  notes: Note[];
  onNavigate: (tab: string) => void;
}

const QUOTES = [
  "Foguete não tem ré. Amassa hoje, colhe amanhã.",
  "Procrastinação é o cemitério dos sonhos. Levanta e faz acontecer.",
  "A meta é não depender de ninguém. Vai pra cima, o topo é seu.",
  "Sangue, suor e código. O topo não tem elevador, é de escada.",
  "Enquanto você dorme, tem gente construindo impérios. Acorda pra vida.",
  "O que não te desafia não te transforma. Marcha nos planos."
];

export function Overview({ tasks, notes, onNavigate }: OverviewProps) {
  const [quoteIndex, setQuoteIndex] = useState(new Date().getDay() % QUOTES.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % QUOTES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const todo = tasks.filter(t => t.status === 'todo').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const done = tasks.filter(t => t.status === 'done').length;
  
  const DAILY_GOAL = 5;
  const goalProgressPercent = Math.min(Math.round((done / DAILY_GOAL) * 100), 100);
  const isGoalReached = done >= DAILY_GOAL;
  const currentQuote = QUOTES[quoteIndex];

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full pb-10">
      
      {/* Header + Quote */}
      <header className="flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400 tracking-tight">
            QG da Agência
          </h1>
          <p className="text-zinc-400 text-lg mt-1 font-medium">Visão geral do império. O jogo não para.</p>
        </div>

        <div className="bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/20 p-6 rounded-3xl relative overflow-hidden flex items-start gap-4">
          <div className="absolute -right-4 -top-4 opacity-5">
            <Quote size={120} />
          </div>
          <div className="bg-amber-500/20 p-3 rounded-xl text-amber-500 shrink-0 mt-1">
            <Zap size={24} className="fill-amber-500/50" />
          </div>
          <div className="z-10 w-full pr-4">
            <h4 className="text-amber-500 font-bold uppercase tracking-wider text-xs mb-2 flex items-center justify-between w-max gap-3">
              Visão Constante
              <motion.div
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
              />
            </h4>
            <div className="min-h-[4rem] flex items-center relative">
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl md:text-2xl font-bold text-zinc-100 leading-snug italic"
                >
                  "{currentQuote}"
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar (Gamification) */}
      <div className="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-3xl flex flex-col gap-5 relative overflow-hidden">
        {isGoalReached && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
        )}
        <div className="flex justify-between items-end relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-zinc-100 font-black text-xl uppercase tracking-tight">Nível de Dominância</h3>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${isGoalReached ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                {isGoalReached ? 'META BATIDA 🔥' : 'AMASSANDO'}
              </span>
            </div>
            <p className="text-zinc-500 text-sm font-medium mt-1">
              Meta Diária: <span className="text-zinc-300 font-bold">{done} / {DAILY_GOAL}</span> missões aniquiladas
            </p>
          </div>
          <div className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${isGoalReached ? 'from-emerald-400 to-teal-500' : 'from-amber-400 to-orange-500'}`}>
            {goalProgressPercent}%
          </div>
        </div>
        <div className="h-5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 relative z-10 p-0.5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${goalProgressPercent}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`h-full rounded-full relative ${isGoalReached ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
          >
            <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)' }}></div>
          </motion.div>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -4 }} onClick={() => onNavigate('kanban')} className="bg-zinc-900/40 border border-zinc-800/60 p-6 rounded-3xl cursor-pointer hover:border-zinc-500 transition-all duration-300 group shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-zinc-800 text-zinc-300 rounded-2xl group-hover:bg-zinc-700 transition-colors">
              <Target size={28} />
            </div>
            <span className="text-5xl font-black text-zinc-200 tracking-tighter">{todo}</span>
          </div>
          <h3 className="text-zinc-100 font-bold text-xl transition-colors">Na Agulha</h3>
          <p className="text-sm text-zinc-500 mt-1 font-medium">Missões aguardando ação</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} onClick={() => onNavigate('kanban')} className="bg-zinc-900/40 border border-zinc-800/60 p-6 rounded-3xl cursor-pointer hover:border-amber-500/50 transition-all duration-300 group shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
              <Zap size={28} />
            </div>
            <span className="text-5xl font-black text-amber-500 tracking-tighter">{inProgress}</span>
          </div>
          <h3 className="text-amber-500 font-bold text-xl transition-colors relative z-10">Amassando</h3>
          <p className="text-sm text-amber-500/60 mt-1 font-medium relative z-10">Na trincheira agora</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} onClick={() => onNavigate('kanban')} className="bg-zinc-900/40 border border-zinc-800/60 p-6 rounded-3xl cursor-pointer hover:border-emerald-500/50 transition-all duration-300 group shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
              <Trophy size={28} />
            </div>
            <span className="text-5xl font-black text-emerald-400 tracking-tighter">{done}</span>
          </div>
          <h3 className="text-emerald-400 font-bold text-xl transition-colors">Já Era</h3>
          <p className="text-sm text-emerald-500/60 mt-1 font-medium">Troféus na estante</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
        {/* Últimas Tarefas */}
        <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-zinc-100">Movimentações Recentes</h3>
            <button onClick={() => onNavigate('kanban')} className="text-sm font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 uppercase tracking-wider">
              Ir pro front <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="flex flex-col gap-3 flex-1">
            {tasks.length > 0 ? tasks.slice(-5).reverse().map(t => (
              <div key={t.id} className="flex items-center gap-4 p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 transition-colors group">
                <div className={`w-3 h-3 rounded-sm rotate-45 shadow-sm ${
                  t.status === 'done' ? 'bg-emerald-500 shadow-emerald-500/50' :
                  t.status === 'in-progress' ? 'bg-amber-500 shadow-amber-500/50' : 'bg-zinc-500 shadow-zinc-500/50'
                }`} />
                <span className="text-zinc-200 font-bold flex-1 truncate group-hover:text-white transition-colors">{t.title}</span>
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border ${
                  t.status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  t.status === 'in-progress' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                  {t.status === 'done' ? 'Já era' : t.status === 'in-progress' ? 'Amassando' : 'Na Agulha'}
                </span>
              </div>
            )) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 border border-dashed border-zinc-800/50 rounded-2xl bg-zinc-900/20 py-12 gap-2">
                <Target size={32} className="opacity-20" />
                <span className="font-medium">O campo de batalha tá limpo. Bora agir.</span>
              </div>
            )}
          </div>
        </div>

        {/* Últimas Ideias */}
        <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-zinc-100">Visão & Estratégia</h3>
            <button onClick={() => onNavigate('notes')} className="text-sm font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 uppercase tracking-wider">
              Ver Arsenal <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="flex flex-col gap-4 flex-1">
            {notes.length > 0 ? notes.slice(-3).reverse().map(n => (
              <div key={n.id} className="flex flex-col gap-2 p-5 bg-zinc-900/60 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                <span className="text-zinc-100 font-bold truncate text-lg">{n.title}</span>
                <span className="text-sm text-zinc-400 line-clamp-2 font-medium">{n.content}</span>
              </div>
            )) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 border border-dashed border-zinc-800/50 rounded-2xl bg-zinc-900/20 py-12 gap-2">
                <Zap size={32} className="opacity-20" />
                <span className="font-medium">Nenhuma ideia anotada. Pensa grande.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
