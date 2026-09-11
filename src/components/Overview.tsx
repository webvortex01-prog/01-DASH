import React from 'react';
import { Target, Zap, Trophy, ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Task, Note, UserStats } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OverviewProps {
  tasks: Task[];
  notes: Note[];
  stats: UserStats;
  onNavigate: (tab: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({ tasks, notes, stats, onNavigate }) => {
  const todo = tasks.filter(t => t.status === 'todo').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const done = tasks.filter(t => t.status === 'done').length;

  const DAILY_GOAL = 5;
  const goalProgressPercent = Math.min(Math.round((done / DAILY_GOAL) * 100), 100);
  const isGoalReached = done >= DAILY_GOAL;

  const xpProgress = stats.xp % 100;

  // Chart data: Tasks completed over the last 7 days
  const today = startOfDay(new Date());
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(today, 6 - i);
    const completedThatDay = tasks.filter(t => 
      t.status === 'done' && 
      startOfDay(new Date(t.createdAt || 0)).getTime() === d.getTime()
    ).length;
    
    return {
      name: format(d, 'EEE', { locale: ptBR }).toUpperCase(),
      missões: completedThatDay
    };
  });

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-20">
      
      {/* Gamification Bar */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 relative overflow-hidden">
        <div className="flex justify-between items-end relative z-10 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center font-black text-2xl text-zinc-950 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
              {stats.level}
            </div>
            <div>
              <h3 className="text-zinc-100 font-black text-2xl uppercase tracking-tight">CEO Mode</h3>
              <p className="text-zinc-500 font-bold tracking-widest text-sm uppercase">Nível {stats.level}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-amber-500">{stats.xp} XP</div>
            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-1">Total Acumulado</p>
          </div>
        </div>
        
        <div className="h-4 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 relative z-10 p-0.5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 relative"
          >
            <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)' }}></div>
          </motion.div>
        </div>
        <p className="text-right text-[10px] uppercase font-bold text-zinc-500 mt-2 tracking-widest">{100 - xpProgress} XP PARA O NÍVEL {stats.level + 1}</p>
      </div>

      {/* Main Stats */}
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
        
        {/* Gráfico de Performance */}
        <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <TrendingUp className="text-amber-500" size={24} /> Performance (7 Dias)
            </h3>
          </div>
          
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMissao" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontWeight: 'bold' }} 
                  itemStyle={{ color: '#f59e0b' }}
                />
                <Area type="monotone" dataKey="missões" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorMissao)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

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

      </div>
    </div>
  );
};
