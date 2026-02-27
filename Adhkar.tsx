import React, { useState } from 'react';
import { ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { adhkarData } from './adhkar';
import { AdhkarCategory, Thikr } from './types';

export function Adhkar() {
  const [selectedCategory, setSelectedCategory] = useState<AdhkarCategory | null>(null);

  if (selectedCategory) {
    return <AdhkarReader category={selectedCategory} onBack={() => setSelectedCategory(null)} />;
  }

  return (
    <div className="pb-24 px-4 pt-6">
      <h1 className="text-2xl font-bold text-white mb-6">الأذكار</h1>
      <div className="space-y-3">
        {adhkarData.map((category, i) => (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={category.id}
            onClick={() => setSelectedCategory(category)}
            className="w-full glass-panel rounded-2xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold ml-3 border border-amber-500/20">
                {category.items.length}
              </div>
              <span className="font-bold text-lg text-neutral-200">{category.title}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-500" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function AdhkarReader({ category, onBack }: { category: AdhkarCategory; onBack: () => void }) {
  const [counts, setCounts] = useState<Record<number, number>>(
    category.items.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
  );

  const handleTap = (item: Thikr) => {
    if (counts[item.id] < item.count) {
      setCounts(prev => ({ ...prev, [item.id]: prev[item.id] + 1 }));
    }
  };

  const resetCounts = () => {
    setCounts(category.items.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {}));
  };

  const progress = Object.keys(counts).reduce((acc, key) => {
    const item = category.items.find(i => i.id === Number(key));
    return acc + (counts[Number(key)] === item?.count ? 1 : 0);
  }, 0);

  const total = category.items.length;

  return (
    <div className="pb-24 pt-4 flex flex-col h-screen">
      {/* Header */}
      <div className="glass-panel px-4 py-3 flex items-center justify-between sticky top-0 z-10 border-x-0 border-t-0">
        <button onClick={onBack} className="p-2 -mr-2 text-neutral-400 hover:bg-white/5 rounded-full transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-lg text-white">{category.title}</h2>
        <button onClick={resetCounts} className="p-2 -ml-2 text-neutral-400 hover:bg-white/5 rounded-full transition-colors">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="glass-panel px-4 py-2 border-x-0 border-t-0">
        <div className="flex justify-between text-xs text-neutral-400 mb-1">
          <span>الإنجاز</span>
          <span>{progress} / {total}</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {category.items.map((item, i) => {
          const isDone = counts[item.id] >= item.count;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={item.id} 
              className={`rounded-2xl p-5 transition-all duration-300 ${
                isDone ? 'glass-panel-gold' : 'glass-panel'
              }`}
            >
              {item.description && (
                <div className="text-amber-400 text-sm font-bold mb-2">{item.description}</div>
              )}
              
              <p className="text-lg leading-loose font-serif text-neutral-200 whitespace-pre-line">
                {item.text}
              </p>
              
              {item.reference && (
                <div className="text-neutral-500 text-xs mt-3 border-t border-white/10 pt-2">
                  {item.reference}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => handleTap(item)}
                  disabled={isDone}
                  className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all active:scale-95 ${
                    isDone 
                      ? 'bg-amber-500/20 text-amber-400 cursor-default border border-amber-500/30' 
                      : 'bg-amber-500 text-black shadow-md hover:bg-amber-400'
                  }`}
                >
                  {isDone ? (
                    <span className="flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 ml-2" />
                      مكتمل
                    </span>
                  ) : (
                    <span>اضغط ({item.count - counts[item.id]})</span>
                  )}
                </button>
                
                <div className="mr-4 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-neutral-300">
                  {counts[item.id]} <span className="text-xs text-neutral-500 mx-1">/</span> {item.count}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
