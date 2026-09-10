import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flame, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

export function Focus() {
  const [customMinutes, setCustomMinutes] = useState(30);
  const [timeLeft, setTimeLeft] = useState(customMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [isSettingTime, setIsSettingTime] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      // Confetti celebration when timer hits zero
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#ea580c', '#c2410c'],
        zIndex: 9999
      });
      // Try to play a notification sound
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play();
      } catch(e) {}
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? customMinutes * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? customMinutes * 60 : 5 * 60);
  };

  const applyCustomTime = (minutes: number) => {
    setCustomMinutes(minutes);
    setTimeLeft(minutes * 60);
    setIsSettingTime(false);
    setMode('focus');
    setIsActive(false);
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
            className={`px-4 py-2.5 rounded-xl font-bold transition-all text-sm ${
              mode === 'focus' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Foco Total
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all text-sm ${
              mode === 'break' ? 'bg-zinc-700 text-zinc-100 shadow-md' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Respiro (5m)
          </button>
          <button
            onClick={() => setIsSettingTime(!isSettingTime)}
            className={`px-3 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center ${
              isSettingTime ? 'bg-zinc-800 text-amber-500' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Configurar Tempo"
          >
            <Settings size={18} />
          </button>
        </div>

        {isSettingTime && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-wrap items-center justify-center gap-2 mt-2"
          >
            {[15, 30, 45, 60, 90, 120].map(min => (
              <button
                key={min}
                onClick={() => applyCustomTime(min)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  customMinutes === min 
                    ? 'bg-amber-500/10 border-amber-500 text-amber-500' 
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                }`}
              >
                {min} min
              </button>
            ))}
          </motion.div>
        )}

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
