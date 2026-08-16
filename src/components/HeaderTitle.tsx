import React from 'react';
import { Radio, Disc } from 'lucide-react';
import { MOOD_CATEGORIES } from '../data/nostalgiaData';
import { useYouTubeMusic } from '../context/YouTubeMusicContext';
import { audioSynth } from '../utils/audioSynth';

export const HeaderTitle: React.FC = () => {
  const { currentArchiveId, currentArchive, changeArchive } = useYouTubeMusic();

  return (
    <header className="relative pt-10 pb-4 max-w-5xl mx-auto px-4 sm:px-8 z-10 select-none">
      
      {/* 1. Printed Archival Identification System (Top Header Markings) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#232836] mb-8 font-mono text-[11px] tracking-widest text-[#B5AEA5]">
        <div className="flex items-center gap-3 flex-wrap">
          {/* TAPE Stamped Label */}
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#101319] border border-[#2B3242] text-[#E5DCD2] text-[10px] font-bold">
            <Radio className="w-3 h-3 text-[#E87B28] animate-pulse" />
            <span className="font-typewriter uppercase tracking-widest">{currentArchive.tapeNumber} • DOLBY NR</span>
          </div>

          <span className="text-[#E87B28]/80 text-[10px] uppercase tracking-[0.25em] font-semibold border-l border-[#2B3242] pl-3">
            BENGALI NOSTALGIA ARCHIVES
          </span>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] opacity-60">
            {currentArchive.catalogCode}
          </div>
          <div className="px-2 py-0.5 rounded bg-[#101319] border border-[#2B3242] text-[#E87B28] text-[10px] font-bold">
            VOL. 98 — SIDE {currentArchive.side}
          </div>
        </div>
      </div>

      {/* 2. Hero Identity */}
      <div className="text-center sm:text-left mb-8">
        <div className="inline-block relative">
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#E87B28] block mb-1 font-bold">
            SHESH PATAR GAAN — DIGITAL CASSETTE ARCHIVE
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-bn-serif text-[#F0E8DF] leading-[1.05] tracking-tight drop-shadow-md">
            শেষ পাতার গান
          </h1>
          <div className="h-0.5 w-28 sm:w-36 bg-gradient-to-r from-[#E87B28] via-[#FF9D42] to-transparent mt-2" />
        </div>

        {/* Emotionally Appropriate Bengali Tagline */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-base sm:text-xl italic text-[#D4CCC1] font-light border-l-2 border-[#E87B28] pl-4 max-w-xl text-left leading-relaxed font-bn-serif">
            “কিছু গান শেষ হয় না।
            <br />
            <span className="text-[#A59E95] not-italic text-sm font-bn-sans">শুধু মানুষটা বদলে যায়।” — শেষ পাতার ডায়েরি, ১৯৯৮</span>
          </p>

          <div className="text-left sm:text-right text-[10px] font-mono text-[#8E877E] uppercase tracking-widest pl-4 sm:pl-0 border-l sm:border-l-0 border-[#2B3242]">
            <span className="text-[#E87B28] block font-bold mb-0.5">High Fidelity Analog Master</span>
            <span>{currentArchive.englishTitle}</span>
          </div>
        </div>
      </div>

      {/* 3. Mood Archive (Horizontal Category Selector with 5 Real Playlists) */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#A59E95] font-bold flex items-center gap-1.5">
            <Disc className="w-3 h-3 text-[#E87B28]" /> ARCHIVE SELECTOR (আবহ বিভাগ):
          </span>
          <span className="text-[10px] font-mono text-[#6E6860] hidden sm:inline">
            SELECT ATMOSPHERE TO LOAD PLAYLIST
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {MOOD_CATEGORIES.map((m) => {
            const isActive = currentArchiveId === m.id;
            return (
              <button
                key={m.id}
                id={`mood-tab-${m.id}`}
                onClick={() => {
                  audioSynth.playCassetteClick('press');
                  changeArchive(m.id);
                }}
                className={`relative px-3.5 py-2.5 rounded-xl text-xs font-bn-sans flex items-center gap-2 flex-shrink-0 transition-all duration-200 border ${
                  isActive
                    ? 'bg-[#E87B28]/15 border-[#E87B28] text-[#F0E8DF] font-bold shadow-md shadow-[#E87B28]/10'
                    : 'bg-[#12151C] border-[#252C3A] text-[#B5AEA5] hover:text-[#F0E8DF] hover:border-[#333D50]'
                }`}
                title={m.subtitle}
              >
                {/* Subtle Stamped Active Marker */}
                {isActive && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E87B28] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E87B28]" />
                  </span>
                )}
                <span className="text-sm">{m.icon}</span>
                <span>{m.label}</span>
                {isActive && (
                  <span className="text-[9px] font-mono text-[#E87B28] uppercase tracking-wider pl-1 border-l border-[#E87B28]/30 hidden md:inline">
                    SELECTED
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </header>
  );
};


