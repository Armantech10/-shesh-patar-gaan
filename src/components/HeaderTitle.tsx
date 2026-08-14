import React from 'react';
import { Sparkles, Radio, Bookmark, Heart, Flame } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

interface HeaderTitleProps {
  currentMood: string;
  onMoodSelect: (mood: string) => void;
}

export const HeaderTitle: React.FC<HeaderTitleProps> = ({ currentMood, onMoodSelect }) => {
  const moods = [
    { id: 'rain', label: 'বৃষ্টিভেজা দুপুর', icon: '🌧️' },
    { id: 'cassette', label: 'ওয়াকম্যান ও ক্যাসেট', icon: '📼' },
    { id: 'tea', label: 'টংয়ের চায়ের আড্ডা', icon: '☕' },
    { id: 'diary', label: 'ডায়েরির শেষ পাতা', icon: '📖' },
  ];

  return (
    <header className="relative pt-12 pb-6 max-w-5xl mx-auto px-4 sm:px-8 z-10">
      {/* Top Archival Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#303642]/60 mb-6 text-xs">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1D23] border border-[#303642] text-[#E0D8D0]/80 font-mono text-[11px] tracking-wider">
            <Radio className="w-3.5 h-3.5 text-[#F27D26] animate-pulse" />
            <span className="font-typewriter uppercase tracking-widest text-[10px]">TAPE 01 • DOLBY NR</span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] opacity-40 hidden sm:inline">
            Bengali Nostalgia Archives
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase tracking-[0.3em] opacity-40 block font-mono">Memory Archives</span>
          <span className="text-xs sm:text-sm font-mono opacity-70 text-[#E0D8D0]">VOL. 98 — SIDE A</span>
        </div>
      </div>

      {/* Main Refined Bengali Title */}
      <div className="text-center sm:text-left">
        <div className="inline-block">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-bn-serif text-[#E0D8D0] leading-[1.05] tracking-tight opacity-95 drop-shadow-xl">
            শেষ পাতার গান
          </h1>
          <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-[#F27D26] via-[#FFB074] to-transparent rounded-full mt-2 opacity-80" />
        </div>

        {/* Primary Thematic Quote with Distinct Left Border */}
        <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <p className="text-base sm:text-lg md:text-xl italic text-[#E0D8D0]/90 font-light border-l-2 border-[#F27D26] pl-4 sm:pl-5 max-w-xl text-left leading-relaxed">
            “কিছু গান শেষ হয় না।
            <br />
            <span className="text-[#E0D8D0]/60">শুধু মানুষটা বদলে যায়।”</span>
          </p>

          <div className="text-left sm:text-right text-xs font-mono text-[#E0D8D0]/40 uppercase tracking-widest pl-4 sm:pl-0">
            <span className="text-[#F27D26] block font-semibold mb-0.5">High Fidelity Audio</span>
            <span>Recorded in 1998</span>
          </div>
        </div>
      </div>

      {/* Nostalgic Mood Badges */}
      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono opacity-40 mr-1 hidden sm:inline">
          Mood Atmosphere:
        </span>
        {moods.map((m) => {
          const isActive = currentMood === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                audioSynth.playCassetteClick('press');
                onMoodSelect(m.id);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bn-sans flex items-center gap-2 transition-all duration-200 border ${
                isActive
                  ? 'bg-[#F27D26]/20 border-[#F27D26] text-[#E0D8D0] shadow-md shadow-[#F27D26]/10 scale-105 font-medium'
                  : 'bg-[#1A1D23] border-[#303642] text-[#E0D8D0]/60 hover:text-[#E0D8D0] hover:border-[#303642]/80'
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
