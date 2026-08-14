import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Sparkles, Copy, Check } from 'lucide-react';
import { NOSTALGIC_QUOTES } from '../data/nostalgiaData';
import { audioSynth } from '../utils/audioSynth';

export const RotatingQuotes: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentQuote = NOSTALGIC_QUOTES[currentIndex];

  // Auto rotate quotes every 6.5 seconds unless user hovers
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % NOSTALGIC_QUOTES.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    audioSynth.playNostalgiaChime();
    setCurrentIndex((prev) => (prev + 1) % NOSTALGIC_QUOTES.length);
  };

  const handlePrev = () => {
    audioSynth.playNostalgiaChime();
    setCurrentIndex((prev) => (prev - 1 + NOSTALGIC_QUOTES.length) % NOSTALGIC_QUOTES.length);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${currentQuote.bengali}" — ${currentQuote.source}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className="max-w-3xl mx-auto my-8 px-4 relative z-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Quote Display Container with Dark Border & High Contrast */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-[#1A1D23] border border-[#303642] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden group">
        
        {/* Background Watermark Quote Symbol */}
        <Quote className="absolute -top-4 -left-4 w-28 h-28 text-[#F27D26]/5 rotate-180 pointer-events-none" />
        <Quote className="absolute -bottom-4 -right-4 w-28 h-28 text-[#F27D26]/5 pointer-events-none" />

        {/* Top Header Tag & Progress Dots */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#F27D26]/15 border border-[#F27D26]/30 text-[#F27D26] text-[11px] font-bn-sans flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#F27D26]" />
              {currentQuote.mood}
            </span>
            <span className="text-xs text-[#E0D8D0]/50 font-mono hidden sm:inline">
              {currentQuote.source}
            </span>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {NOSTALGIC_QUOTES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  audioSynth.playNostalgiaChime();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-6 bg-[#F27D26]' : 'w-1.5 bg-[#303642] hover:bg-[#E0D8D0]/50'
                }`}
                title={`উদ্ধৃতি ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Bengali Quote Body */}
        <div className="min-h-[90px] flex flex-col justify-center transition-all duration-500 border-l-2 border-[#F27D26] pl-5 my-2">
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-bn-serif text-[#E0D8D0] leading-relaxed font-bold">
            “{currentQuote.bengali}”
          </blockquote>
          <p className="mt-2 text-xs sm:text-sm text-[#E0D8D0]/60 font-bn-sans italic">
            — {currentQuote.translation}
          </p>
        </div>

        {/* Bottom Actions & Navigation Bar */}
        <div className="mt-6 pt-4 border-t border-[#303642] flex items-center justify-between text-xs">
          
          {/* Copy Quote Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0C0E14] hover:bg-[#252A35] text-[#E0D8D0]/80 hover:text-white border border-[#303642] transition-colors"
            title="স্মৃতি কপি করুন"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#E0D8D0]/40" />}
            <span>{copied ? 'কপি হয়েছে' : 'উদ্ধৃতি কপি'}</span>
          </button>

          {/* Previous / Next Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-xl bg-[#0C0E14] hover:bg-[#252A35] text-[#E0D8D0]/70 hover:text-white transition-colors border border-[#303642]"
              title="পূর্ববর্তী উদ্ধৃতি"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-[#E0D8D0]/40 px-1">
              {currentIndex + 1} / {NOSTALGIC_QUOTES.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-xl bg-[#0C0E14] hover:bg-[#252A35] text-[#E0D8D0]/70 hover:text-white transition-colors border border-[#303642]"
              title="পরবর্তী উদ্ধৃতি"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
