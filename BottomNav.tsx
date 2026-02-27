import React from 'react';
import { Home, BookOpen, Heart, Activity, Moon } from 'lucide-react';
import { Tab } from './types';

interface BottomNavProps {
  currentTab: Tab;
  onChange: (tab: Tab) => void;
}

export function BottomNav({ currentTab, onChange }: BottomNavProps) {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'الرئيسية', icon: <Home className="w-6 h-6" /> },
    { id: 'quran', label: 'القرآن', icon: <BookOpen className="w-6 h-6" /> },
    { id: 'adhkar', label: 'الأذكار', icon: <Heart className="w-6 h-6" /> },
    { id: 'tasbeeh', label: 'السبحة', icon: <Activity className="w-6 h-6" /> },
    { id: 'ramadan', label: 'رمضان', icon: <Moon className="w-6 h-6" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-panel border-t-white/10 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <div className={`${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-200`}>
                {tab.icon}
              </div>
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
