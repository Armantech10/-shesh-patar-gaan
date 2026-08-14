import React, { useState, useEffect } from 'react';
import { Music, Sparkles, Volume2, KeyRound } from 'lucide-react';
import { ACOUSTIC_CHORDS } from '../data/nostalgiaData';
import { audioSynth } from '../utils/audioSynth';

export const InteractiveKeyboardChords: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [noteHistory, setNoteHistory] = useState<string[]>([]);

  const playNote = (chord: typeof ACOUSTIC_CHORDS[0]) => {
    audioSynth.playAcousticNote(chord.freq, 1.8);
    setActiveKey(chord.key);
    setNoteHistory((prev) => [...prev.slice(-7), chord.name]);
    setTimeout(() => {
      setActiveKey(null);
    }, 250);
  };

  // Listen to physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input/textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      const chord = ACOUSTIC_CHORDS.find((c) => c.key === key);
      if (chord) {
        e.preventDefault();
        playNote(chord);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="max-w-4xl mx-auto my-8 px-4 relative z-10">
      <div className="p-6 sm:p-8 rounded-2xl bg-[#1A1D23] border border-[#303642] shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#F27D26]/20 text-[#F27D26] border border-[#F27D26]/30">
                <Music className="w-4 h-4" />
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-bn-serif text-[#E0D8D0]">
                স্মৃতির একুস্টিক সুর (Interactive Acoustic Chords)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#E0D8D0]/60 font-bn-sans mt-0.5">
              কিবোর্ডের <span className="text-[#F27D26] font-mono font-bold">A, S, D, F, G, H, J, K</span> চাপুন অথবা বাটনে ক্লিক করে গানটির সুর তুলুন
            </p>
          </div>

          {/* Played Sequence History */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0C0E14] border border-[#303642] text-xs">
            <span className="text-[11px] text-[#E0D8D0]/40 font-mono uppercase tracking-wider">Tone:</span>
            {noteHistory.length === 0 ? (
              <span className="text-[#E0D8D0]/40 italic text-[11px]">কোনো কী প্রেস করুন...</span>
            ) : (
              <div className="flex gap-1.5 font-bold text-[#F27D26] text-xs font-mono">
                {noteHistory.map((n, i) => (
                  <span key={i} className="animate-fade-in">{n}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Acoustic Chord Keys Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
          {ACOUSTIC_CHORDS.map((chord) => {
            const isCurrentActive = activeKey === chord.key;
            return (
              <button
                key={chord.key}
                id={`chord-key-${chord.key}`}
                onClick={() => playNote(chord)}
                className={`group relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-xl border transition-all duration-150 active:scale-95 ${
                  isCurrentActive
                    ? 'bg-[#F27D26] border-[#FFB074] text-[#0C0E14] shadow-lg shadow-[#F27D26]/40 -translate-y-1.5'
                    : 'bg-[#0C0E14] border-[#303642] hover:border-[#F27D26]/50 text-[#E0D8D0] hover:-translate-y-0.5'
                }`}
              >
                {/* Keyboard Key Hint Badge */}
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs font-bold ${
                    isCurrentActive
                      ? 'bg-[#0C0E14] text-[#F27D26]'
                      : 'bg-[#1A1D23] text-[#E0D8D0]/80 group-hover:bg-[#252A35] border border-[#303642]'
                  }`}
                >
                  {chord.key}
                </div>

                {/* Bengali Swara Name */}
                <div className="my-2 text-center">
                  <span
                    className={`block font-bn-serif text-lg font-bold leading-tight ${
                      isCurrentActive ? 'text-[#0C0E14]' : 'text-[#E0D8D0]'
                    }`}
                  >
                    {chord.name}
                  </span>
                  <span
                    className={`block font-mono text-[10px] uppercase tracking-wider ${
                      isCurrentActive ? 'text-[#0C0E14]/80' : 'text-[#E0D8D0]/40'
                    }`}
                  >
                    {chord.chordName}
                  </span>
                </div>

                {/* String Pluck Line */}
                <div
                  className={`w-full h-1 rounded-full transition-all ${
                    isCurrentActive
                      ? 'bg-[#0C0E14] animate-pulse'
                      : 'bg-[#F27D26]/20 group-hover:bg-[#F27D26]/50'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Melody Presets Hints */}
        <div className="mt-6 pt-4 border-t border-[#303642] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#E0D8D0]/60 font-bn-sans">
            <Sparkles className="w-3.5 h-3.5 text-[#F27D26]" />
            <span>চেষ্টা করে দেখুন:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const seq = [ACOUSTIC_CHORDS[0], ACOUSTIC_CHORDS[3], ACOUSTIC_CHORDS[4], ACOUSTIC_CHORDS[0]];
                seq.forEach((c, idx) => setTimeout(() => playNote(c), idx * 350));
              }}
              className="px-3 py-1.5 rounded-xl bg-[#0C0E14] hover:bg-[#252A35] border border-[#303642] text-[#E0D8D0]/80 text-xs font-bn-sans transition-colors"
            >
              🎶 সুরের স্কেল (A - F - G - A)
            </button>

            <button
              onClick={() => {
                const seq = [ACOUSTIC_CHORDS[5], ACOUSTIC_CHORDS[3], ACOUSTIC_CHORDS[4], ACOUSTIC_CHORDS[0]];
                seq.forEach((c, idx) => setTimeout(() => playNote(c), idx * 350));
              }}
              className="px-3 py-1.5 rounded-xl bg-[#0C0E14] hover:bg-[#252A35] border border-[#303642] text-[#E0D8D0]/80 text-xs font-bn-sans transition-colors"
            >
              🎸 অ্যাকর্ড সিকোয়েন্স (H - F - G - A)
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
