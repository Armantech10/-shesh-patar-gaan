import React, { useState } from 'react';
import { PenTool, Heart, Sparkles, Music, Bookmark, CornerDownRight, MessageSquarePlus } from 'lucide-react';
import { ScribbleNote } from '../types';
import { audioSynth } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface DiaryLastPageProps {
  scribbles: ScribbleNote[];
  onOpenWriteModal: () => void;
  onLikeScribble: (id: string) => void;
}

export const DiaryLastPage: React.FC<DiaryLastPageProps> = ({
  scribbles,
  onOpenWriteModal,
  onLikeScribble,
}) => {
  const [activeTab, setActiveTab] = useState<'diary' | 'notes'>('diary');

  // Trigger nostalgic flower petals explosion
  const handlePetalBurst = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { x, y },
      colors: ['#e63946', '#f4a261', '#e76f51', '#d4a373', '#9a031e'],
      shapes: ['circle'],
      scalar: 0.8,
      ticks: 120,
    });
  };

  return (
    <section className="max-w-4xl mx-auto my-10 px-4 relative z-10">
      
      {/* Section Header with Authentic Label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h2 className="text-2xl sm:text-3xl font-bold font-bn-serif text-amber-100">
              খাতার শেষ পাতা (The Last Page)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 font-bn-sans">
            টিফিন পিরিয়ডের গান, কর্ড চার্ট আর কখনো প্রকাশ না পাওয়া অপ্রকাশিত কথা
          </p>
        </div>

        {/* Action Button to Write on the Last Page */}
        <button
          id="write-memory-btn"
          onClick={() => {
            audioSynth.playCassetteClick('press');
            onOpenWriteModal();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs font-bn-sans shadow-lg shadow-amber-950/50 transition-all active:scale-95"
        >
          <PenTool className="w-4 h-4" />
          <span>শেষ পাতায় লিখে যান</span>
        </button>
      </div>

      {/* The Iconic Physical Notebook Representation */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-800 bg-[#f4ecd8] text-[#2b2620]">
        
        {/* Notebook Binding Ring Spine (Left edge) */}
        <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-10 bg-gradient-to-r from-stone-900 via-stone-800 to-[#e2d5bd] z-20 flex flex-col justify-around py-4 items-center">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-4 h-2 rounded-full bg-stone-950 border border-stone-600 shadow-inner" />
          ))}
        </div>

        {/* Notebook Page Main Area */}
        <div className="relative pl-10 sm:pl-16 pr-6 sm:pr-10 py-8 sm:py-10 vintage-paper min-h-[500px]">
          
          {/* Authentic Crimson Notebook Vertical Margin Line */}
          <div className="absolute top-0 bottom-0 left-12 sm:left-20 w-[1.5px] bg-red-400/40 pointer-events-none" />

          {/* Coffee/Tea Cup Ring Stain Texture */}
          <div className="absolute top-12 right-12 w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-amber-900/15 pointer-events-none rotate-12 blur-[0.5px]" />
          <div className="absolute top-14 right-14 w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-amber-950/10 pointer-events-none" />

          {/* Pressed Dried Krishnachura Petal / Flower Graphic */}
          <div
            onClick={handlePetalBurst}
            className="absolute bottom-8 right-8 cursor-pointer group p-2 transition-transform hover:scale-110"
            title="ডায়েরির ভাঁজে শুকনো অপরাজিতা ও কৃষ্ণচূড়া (ক্লিক করুন)"
          >
            <div className="relative w-12 h-12 flex items-center justify-center">
              <span className="text-3xl filter drop-shadow-md select-none transform rotate-45 group-hover:rotate-12 transition-transform">
                🌺
              </span>
            </div>
            <span className="text-[9px] font-handwriting text-amber-900/60 block text-center">
              শুকনো পাপড়ি
            </span>
          </div>

          {/* Notebook Header Stamp */}
          <div className="flex flex-wrap items-center justify-between border-b-2 border-stone-300 pb-3 mb-6">
            <div>
              <span className="font-typewriter text-xs text-stone-500 uppercase tracking-widest block">
                DIARY ENTRY • PAGE 144 (FINAL)
              </span>
              <span className="font-handwriting text-lg text-amber-900 font-bold">
                ক্লাস অফ ২০০৪ — শেষ বেঞ্চের চিরকুট
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-handwriting text-stone-600">
              <span>তারিখ: শ্রাবণ মেঘ</span>
              <span>•</span>
              <span>স্থান: আর্টস বিল্ডিংয়ের সিঁড়ি</span>
            </div>
          </div>

          {/* Handwritten Guitar Chord Charts at the Top Margin */}
          <div className="mb-6 p-3 rounded-lg bg-amber-900/5 border border-amber-900/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-amber-800" />
              <span className="text-xs font-bold font-bn-sans text-stone-800">
                গানের কর্ড চার্ট (Song Chords):
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs font-bold text-amber-900">
              <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300">Am (লা)</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300">Dm (রে)</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300">G7 (পা)</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300">C (সা)</span>
            </div>
          </div>

          {/* Handwritten Poem / Lyrics Notebook Ruled Section */}
          <div className="space-y-4 notebook-ruled font-handwriting text-lg sm:text-xl text-[#1f2937]">
            <p className="text-blue-900/90 font-semibold">
              “কিছু গান ডায়েরির শেষ পাতায় সুর হয়ে আজীবন বেঁচে থাকে...”
            </p>
            <p className="text-stone-800">
              টিচারের চক ভাঙার শব্দ, বাইরে আকাশ ভাঙা বর্ষা, আর খাতার কোনায় তোমার নামের আদ্যক্ষর...
            </p>
            <p className="text-amber-950 font-bold">
              কিছু মানুষ গান হয়ে থেকে যায়, কিছু সুর আজীবন অপ্রকাশিত চিঠি হয়ে রয়ে যায়।
            </p>
          </div>

          {/* Interactive Scribbled Notes on the Last Page (Masonry / Sticky Notes Grid) */}
          <div className="mt-8 pt-6 border-t-2 border-stone-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bn-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-700" />
                স্মৃতির চিরকুটসমূহ ({scribbles.length})
              </h4>
              <span className="text-xs font-handwriting text-stone-600">
                (হৃদয়ে দোলা দেওয়া চিরকুটে লাইক দিন)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scribbles.map((note) => {
                const inkStyles = {
                  blue: 'text-[#1e3a8a] border-blue-200 bg-blue-50/70',
                  sepia: 'text-[#78350f] border-amber-200 bg-amber-50/70',
                  emerald: 'text-[#064e3b] border-emerald-200 bg-emerald-50/70',
                  black: 'text-[#18181b] border-stone-300 bg-stone-100/70',
                }[note.inkColor || 'blue'];

                return (
                  <div
                    key={note.id}
                    className={`relative p-4 rounded-xl border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 ${inkStyles}`}
                    style={{ transform: `rotate(${note.rotation || 0}deg)` }}
                  >
                    {/* Pin/Tape on Top of Sticky Note */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3.5 bg-amber-200/80 border border-amber-300 rounded shadow-xs rotate-[-2deg]" />

                    <p className="font-handwriting text-base sm:text-lg leading-snug font-medium mb-3 pt-1">
                      {note.text}
                    </p>

                    {note.songDedication && (
                      <div className="mb-2 text-xs font-bn-sans text-stone-600 flex items-center gap-1">
                        <Music className="w-3 h-3 text-amber-700" />
                        <span>উৎসর্গ: {note.songDedication}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-black/10 text-xs font-bn-sans">
                      <span className="font-semibold text-stone-700">{note.author}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-stone-500">{note.date}</span>
                        <button
                          onClick={() => {
                            audioSynth.playNostalgiaChime();
                            onLikeScribble(note.id);
                          }}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
                          title="ভালোবাসা দিন"
                        >
                          <Heart className="w-3.5 h-3.5 fill-red-500/20 text-red-600 hover:fill-red-500 transition-colors" />
                          <span className="font-bold text-xs">{note.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Marginalia Doodles (Tic Tac Toe & Hearts) */}
          <div className="mt-8 pt-4 border-t border-dashed border-stone-400 flex flex-wrap items-center justify-between text-xs font-handwriting text-stone-600">
            <div className="flex items-center gap-4">
              <span className="border border-stone-400 px-2 py-0.5 rounded">❌ ⭕ ❌ / ব্যাকবেঞ্চার জয়ী</span>
              <span>•</span>
              <span>ক্যাসেট সাইড-এ শেষ... উল্টে দাও</span>
            </div>
            <div className="text-amber-900 font-bold">
              “সুর কখনো ফুরায় না...”
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
