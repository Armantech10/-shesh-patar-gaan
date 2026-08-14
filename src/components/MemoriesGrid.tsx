import React, { useState } from 'react';
import { BookOpen, Disc, Coffee, Mail, Sparkles, Heart, ChevronRight, X } from 'lucide-react';
import { NOSTALGIC_MEMORIES } from '../data/nostalgiaData';
import { NostalgicMemory } from '../types';
import { audioSynth } from '../utils/audioSynth';

export const MemoriesGrid: React.FC = () => {
  const [selectedMemory, setSelectedMemory] = useState<NostalgicMemory | null>(null);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'cassette':
        return <Disc className="w-4 h-4 text-amber-400" />;
      case 'diary':
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'tea':
        return <Coffee className="w-4 h-4 text-amber-500" />;
      case 'letters':
        return <Mail className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <section className="max-w-4xl mx-auto my-12 px-4 relative z-10">
      
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F27D26]/10 border border-[#F27D26]/30 text-[#F27D26] text-xs font-mono uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Archives & Memories
        </div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-bn-serif text-[#E0D8D0] tracking-tight">
          হারিয়ে যাওয়া দিনের মুহূর্তগুলো
        </h3>
        <p className="text-xs sm:text-sm text-[#E0D8D0]/60 font-bn-sans max-w-xl mx-auto mt-2">
          পেন্সিল দিয়ে ক্যাসেট ঘোরানো থেকে শুরু করে টংয়ের চায়ের আড্ডা — প্রতিটি স্মৃতি এক একটা আস্ত গান
        </p>
      </div>

      {/* Grid of Memory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {NOSTALGIC_MEMORIES.map((memory) => (
          <div
            key={memory.id}
            onClick={() => {
              audioSynth.playCassetteClick('press');
              setSelectedMemory(memory);
            }}
            className="group relative p-5 sm:p-6 rounded-2xl bg-[#1A1D23] border border-[#303642] hover:border-[#F27D26]/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Top Category Badge & Date */}
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#E0D8D0]/80">
                {getCategoryIcon(memory.category)}
                <span className="font-bn-sans">{memory.subtitle}</span>
              </span>
              <span className="font-mono text-[10px] text-[#F27D26] bg-[#0C0E14] px-2.5 py-0.5 rounded-full border border-[#303642]">
                {memory.date}
              </span>
            </div>

            {/* Title */}
            <h4 className="text-lg font-bold font-bn-serif text-[#E0D8D0] group-hover:text-[#F27D26] transition-colors mb-2">
              {memory.title}
            </h4>

            {/* Story excerpt */}
            <p className="text-xs sm:text-sm text-[#E0D8D0]/70 font-bn-sans leading-relaxed line-clamp-2 mb-4">
              {memory.story}
            </p>

            {/* Highlight quote */}
            <blockquote className="p-3 rounded-xl bg-[#0C0E14] border-l-2 border-[#F27D26] text-xs font-bn-serif text-[#FFB074] italic mb-4">
              “{memory.quote}”
            </blockquote>

            {/* Tags footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#303642] text-xs">
              <div className="flex flex-wrap gap-1.5">
                {memory.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0C0E14] text-[#E0D8D0]/50 border border-[#303642]">
                    #{t}
                  </span>
                ))}
              </div>
              <span className="text-[#F27D26] flex items-center gap-1 font-bn-sans text-xs group-hover:translate-x-1 transition-transform">
                স্মৃতি পড়ুন <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* Memory Detail Modal Popup */}
      {selectedMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl vintage-paper text-stone-900 shadow-2xl border-4 border-amber-900/30 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedMemory(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/10 hover:bg-stone-900/20 text-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b-2 border-stone-300 pb-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-900 mb-1">
                <span>{selectedMemory.date}</span>
                <span>•</span>
                <span>{selectedMemory.subtitle}</span>
              </div>
              <h3 className="text-2xl font-bold font-bn-serif text-stone-900">
                {selectedMemory.title}
              </h3>
            </div>

            {/* Poetic Quote Box */}
            <div className="p-4 rounded-xl bg-amber-900/10 border-l-4 border-amber-800 my-4">
              <p className="font-handwriting text-xl text-amber-950 italic">
                “{selectedMemory.quote}”
              </p>
            </div>

            {/* Full Story text */}
            <div className="space-y-3 font-bn-sans text-sm sm:text-base leading-relaxed text-stone-800">
              <p>{selectedMemory.story}</p>
              <p className="font-handwriting text-lg text-blue-900 font-semibold pt-2">
                “স্মৃতিরা কখনো মরে না, তারা শুধু এক খাতা থেকে অন্য খাতায় ঠিকানা বদল করে।”
              </p>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-stone-300 flex items-center justify-between text-xs">
              <div className="flex gap-2">
                {selectedMemory.tags.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-mono text-[10px]">
                    #{t}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setSelectedMemory(null)}
                className="px-4 py-1.5 rounded-lg bg-stone-900 text-amber-200 font-bn-sans font-bold text-xs hover:bg-stone-800 transition-colors"
              >
                স্মৃতির পাতা বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
