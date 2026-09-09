import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame } from 'lucide-react';
import { motion } from 'motion/react';

export function Focus() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a sound or notification here if possible
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center max-w-4xl mx-auto py-10">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-3 flex items-center justify-center gap-3">
          <Flame size={36} className="text-orange-500" />
          MODO CAVERNA
        </h2>
        <p className="text-zinc-400 text-lg">Zera as distrações. O mundo lá fora que espere, agora é hora de amassar.</p>
      </div>

      <div className="bg-zinc-900/60 border border-zinc-800/80 p-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-8 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
        
        <div className="flex bg-zinc-950/50 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => switchMode('focus')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm ${
              mode === 'focus' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Foco Total (25m)
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm ${
              mode === 'break' ? 'bg-zinc-700 text-zinc-100 shadow-md' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Respiro (5m)
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <motion.div 
            animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className={`text-[6rem] font-black tracking-tighter leading-none ${
              isActive ? 'text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'text-zinc-200'
            }`}
          >
            {formatTime(timeLeft)}
          </motion.div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={resetTimer}
            className="w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition-all"
          >
            <RotateCcw size={24} />
          </button>
          <button
            onClick={toggleTimer}
            className={`w-20 h-20 flex items-center justify-center rounded-[2rem] transition-all transform hover:scale-105 shadow-xl ${
              isActive 
                ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20' 
                : 'bg-amber-500 text-zinc-950 border border-amber-400 shadow-amber-500/20'
            }`}
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
          </button>
        </div>
      </div>
      
      <div className="mt-12 text-center text-zinc-500 font-medium">
        "Enquanto os caras dormem, o império tá sendo erguido."
      </div>
    </div>
  );
}
