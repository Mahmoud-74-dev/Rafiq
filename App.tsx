import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BottomNav } from './BottomNav';
import { Home } from './Home';
import { Quran } from './Quran';
import { Adhkar } from './Adhkar';
import { Tasbeeh } from './Tasbeeh';
import { Ramadan } from './Ramadan';
import { Tab } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('home');

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-amber-500/10 blur-[100px] pointer-events-none"></div>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto hide-scrollbar relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            {currentTab === 'home' && <Home />}
            {currentTab === 'quran' && <Quran />}
            {currentTab === 'adhkar' && <Adhkar />}
            {currentTab === 'tasbeeh' && <Tasbeeh />}
            {currentTab === 'ramadan' && <Ramadan />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentTab={currentTab} onChange={setCurrentTab} />
    </div>
  );
}
