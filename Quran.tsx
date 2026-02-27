import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { Surah, SurahDetail } from '../types';

export function Quran() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        setSurahs(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredSurahs = surahs.filter(s => 
    s.name.includes(searchQuery) || s.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedSurah) {
    return <SurahReader surah={selectedSurah} onBack={() => setSelectedSurah(null)} />;
  }

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">القرآن الكريم</h1>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-neutral-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-3 pr-10 py-3 glass-panel rounded-xl leading-5 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors"
          placeholder="ابحث عن سورة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="glass-panel rounded-xl p-4 h-20 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSurahs.map((surah, i) => (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.5) }}
              key={surah.number}
              onClick={() => setSelectedSurah(surah)}
              className="w-full glass-panel rounded-xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-right"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold ml-4 relative">
                  <BookOpen className="w-6 h-6 text-amber-500/20 absolute" />
                  <span className="relative z-10 text-sm">{surah.number}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-neutral-200">{surah.name}</h3>
                  <p className="text-xs text-neutral-400">{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {surah.numberOfAyahs} آية</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm text-neutral-500 font-sans">{surah.englishName}</p>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

function SurahReader({ surah, onBack }: { surah: Surah; onBack: () => void }) {
  const [detail, setDetail] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch with simple text edition
    fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/quran-simple`)
      .then(res => res.json())
      .then(data => {
        setDetail(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [surah.number]);

  return (
    <div className="pb-24 pt-4 flex flex-col h-screen">
      {/* Header */}
      <div className="glass-panel px-4 py-3 flex items-center justify-between sticky top-0 z-10 border-x-0 border-t-0">
        <button onClick={onBack} className="p-2 -mr-2 text-neutral-400 hover:bg-white/5 rounded-full transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className="font-bold text-lg text-white">{surah.name}</h2>
          <p className="text-xs text-neutral-400">الجزء {detail?.ayahs[0]?.juz || '-'}</p>
        </div>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center max-w-2xl mx-auto"
          >
            {surah.number !== 1 && surah.number !== 9 && (
              <div className="mb-8 text-2xl font-serif text-amber-400">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </div>
            )}
            
            <div className="leading-[3] text-2xl font-serif text-neutral-200 text-justify" style={{ direction: 'rtl' }}>
              {detail?.ayahs.map((ayah, index) => {
                // Remove Bismillah from the first ayah if it's not Al-Fatiha
                let text = ayah.text;
                if (surah.number !== 1 && index === 0 && text.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ')) {
                  text = text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ', '');
                }

                return (
                  <React.Fragment key={ayah.number}>
                    <span className="hover:bg-white/5 transition-colors rounded px-1">
                      {text}
                    </span>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-amber-500/30 text-amber-400 text-sm mx-2 bg-amber-500/10">
                      {ayah.numberInSurah}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
