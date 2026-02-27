import React, { useState, useEffect } from 'react';
import { RotateCcw, Target, Plus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TasbeehItem {
  id: string;
  text: string;
  count: number;
  goal: number;
}

const defaultAthkar: TasbeehItem[] = [
  { id: '1', text: 'سُبْحَانَ اللَّهِ', count: 0, goal: 100 },
  { id: '2', text: 'الْحَمْدُ لِلَّهِ', count: 0, goal: 100 },
  { id: '3', text: 'لَا إِلَهَ إِلَّا اللَّهُ', count: 0, goal: 100 },
  { id: '4', text: 'اللَّهُ أَكْبَرُ', count: 0, goal: 100 },
  { id: '5', text: 'أَسْتَغْفِرُ اللَّهَ', count: 0, goal: 100 },
  { id: '6', text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', count: 0, goal: 100 }
];

export function Tasbeeh() {
  const [athkar, setAthkar] = useState<TasbeehItem[]>(defaultAthkar);
  const [currentId, setCurrentId] = useState<string>('1');
  const [totalCount, setTotalCount] = useState(0);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);

  // Load saved data
  useEffect(() => {
    const savedAthkar = localStorage.getItem('tasbeeh_data');
    if (savedAthkar) {
      setAthkar(JSON.parse(savedAthkar));
    }
    const savedTotal = localStorage.getItem('tasbeeh_total');
    if (savedTotal) {
      setTotalCount(parseInt(savedTotal, 10));
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem('tasbeeh_data', JSON.stringify(athkar));
    localStorage.setItem('tasbeeh_total', totalCount.toString());
  }, [athkar, totalCount]);

  const currentThikr = athkar.find(a => a.id === currentId) || athkar[0];

  const handleTap = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    // Visual feedback (floating +1)
    let x = 50; // default center %
    let y = 50;
    
    if ('clientX' in e) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      x = ((e.clientX - rect.left) / rect.width) * 100;
      y = ((e.clientY - rect.top) / rect.height) * 100;
    }

    const newClick = { id: Date.now(), x, y };
    setClicks(prev => [...prev, newClick]);
    
    // Remove click after animation
    setTimeout(() => {
      setClicks(prev => prev.filter(c => c.id !== newClick.id));
    }, 1000);

    // Update counts
    setAthkar(prev => prev.map(item => 
      item.id === currentId 
        ? { ...item, count: item.count + 1 } 
        : item
    ));
    setTotalCount(prev => prev + 1);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const resetCurrentCount = () => {
    setAthkar(prev => prev.map(item => 
      item.id === currentId 
        ? { ...item, count: 0 } 
        : item
    ));
  };

  const updateGoal = (newGoal: number) => {
    setAthkar(prev => prev.map(item => 
      item.id === currentId 
        ? { ...item, goal: newGoal } 
        : item
    ));
  };

  const progress = Math.min((currentThikr.count / currentThikr.goal) * 100, 100);
  const isGoalReached = currentThikr.count >= currentThikr.goal;

  return (
    <div className="pb-24 px-4 pt-6 flex flex-col min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">السبحة الإلكترونية</h1>
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-bold">
          المجموع الكلي: {totalCount}
        </div>
      </div>

      {/* Selector */}
      <div className="mb-8 overflow-x-auto pb-4 -mx-4 px-4 hide-scrollbar flex gap-3">
        {athkar.map((thikr) => {
          const isDone = thikr.count >= thikr.goal;
          return (
            <button
              key={thikr.id}
              onClick={() => setCurrentId(thikr.id)}
              className={`shrink-0 whitespace-nowrap px-5 py-3 rounded-2xl font-bold transition-all relative overflow-hidden ${
                currentId === thikr.id
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'glass-panel text-neutral-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{thikr.text}</span>
                {isDone && <CheckCircle2 className={`w-4 h-4 ${currentId === thikr.id ? 'text-black' : 'text-amber-400'}`} />}
              </div>
              {/* Mini progress bar at bottom of unselected tabs */}
              {currentId !== thikr.id && (
                <div className="absolute bottom-0 left-0 h-1 bg-amber-500/30" style={{ width: `${Math.min((thikr.count / thikr.goal) * 100, 100)}%` }}></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Goal Setter */}
      <div className="glass-panel rounded-2xl p-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-neutral-300">
          <Target className="w-5 h-5 text-amber-400" />
          <span className="text-sm">الهدف اليومي</span>
        </div>
        <div className="flex items-center gap-3">
          {[33, 100, 1000].map(goal => (
            <button
              key={goal}
              onClick={() => updateGoal(goal)}
              className={`w-12 h-8 rounded-lg text-sm font-bold transition-colors ${
                currentThikr.goal === goal 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' 
                  : 'bg-white/5 text-neutral-400 hover:bg-white/10'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      {/* Main Counter Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative mt-4">
        <motion.div 
          key={currentThikr.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl md:text-2xl font-serif text-amber-400 mb-12 text-center leading-relaxed h-16 flex items-center justify-center px-4"
        >
          {currentThikr.text}
        </motion.div>

        {/* Big Button with SVG Progress Ring */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          
          {/* SVG Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
            <circle 
              cx="50" cy="50" r="48" 
              fill="none" 
              stroke="rgba(255,255,255,0.05)" 
              strokeWidth="4" 
            />
            <motion.circle 
              cx="50" cy="50" r="48" 
              fill="none" 
              stroke={isGoalReached ? "#34d399" : "#fbbf24"} 
              strokeWidth="4" 
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 300" }}
              animate={{ strokeDasharray: `${(progress / 100) * 301.59} 301.59` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </svg>

          {/* The Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleTap}
            className={`relative z-10 w-56 h-56 rounded-full shadow-[0_0_50px_rgba(251,191,36,0.15)] flex flex-col items-center justify-center transition-colors duration-300 overflow-hidden ${
              isGoalReached 
                ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 border-2 border-emerald-500/50 text-emerald-400' 
                : 'bg-gradient-to-br from-amber-500/10 to-amber-700/10 border-2 border-amber-500/30 text-amber-400'
            }`}
          >
            <span className="text-6xl font-bold mb-2">{currentThikr.count}</span>
            <span className="text-sm uppercase tracking-widest opacity-60">
              {isGoalReached ? 'اكتمل الهدف' : `من ${currentThikr.goal}`}
            </span>

            {/* Floating +1 Particles */}
            <AnimatePresence>
              {clicks.map(click => (
                <motion.div
                  key={click.id}
                  initial={{ opacity: 1, y: 0, scale: 0.5, x: '-50%' }}
                  animate={{ opacity: 0, y: -100, scale: 1.5, x: '-50%' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute text-2xl font-bold pointer-events-none"
                  style={{ left: `${click.x}%`, top: `${click.y}%` }}
                >
                  +1
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetCurrentCount}
          className="mt-12 w-14 h-14 glass-panel rounded-full shadow-md flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
