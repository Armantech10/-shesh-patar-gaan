import React, { useState } from 'react';
import { X, Send, PenTool, Sparkles, Music } from 'lucide-react';
import { ScribbleNote } from '../types';
import { audioSynth } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface WriteMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveScribble: (note: ScribbleNote) => void;
}

export const WriteMemoryModal: React.FC<WriteMemoryModalProps> = ({
  isOpen,
  onClose,
  onSaveScribble,
}) => {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [songDedication, setSongDedication] = useState('');
  const [inkColor, setInkColor] = useState<'blue' | 'sepia' | 'emerald' | 'black'>('blue');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    audioSynth.playCassetteClick('clack');

    // Launch celebratory nostalgic flower petal burst
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e63946', '#f4a261', '#e76f51', '#2a9d8f', '#9a031e'],
    });

    const newNote: ScribbleNote = {
      id: 'sc-' + Date.now(),
      text: text.trim(),
      author: author.trim() || 'শেষ বেঞ্চের সহযাত্রী',
      date: 'এইমাত্র',
      inkColor,
      songDedication: songDedication.trim() || undefined,
      likes: 1,
      rotation: Math.floor(Math.random() * 5 - 2.5),
    };

    onSaveScribble(newNote);
    setText('');
    setAuthor('');
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (Math.random() < 0.3) {
      audioSynth.playPenScratch();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl vintage-paper text-stone-900 shadow-2xl border-4 border-amber-900/40">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/10 hover:bg-stone-900/20 text-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b-2 border-stone-300 pb-3 mb-5">
          <span className="font-typewriter text-xs text-amber-900 uppercase tracking-widest block">
            THE LAST PAGE • MEMORY ENTRY
          </span>
          <h3 className="text-2xl font-bold font-bn-serif text-stone-900 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-amber-800" />
            শেষ পাতায় চিরকুট লিখুন
          </h3>
          <p className="text-xs font-bn-sans text-stone-600 mt-1">
            হারিয়ে যাওয়া কোনো গান, অপ্রকাশিত কথা বা ফেলে আসা বৃষ্টির স্মৃতি লিখে রেখে যান
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Ink Color Selector */}
          <div>
            <label className="block text-xs font-bold font-bn-sans text-stone-700 mb-1.5">
              কালির রঙ নির্বাচন করুন (Fountain Pen Ink):
            </label>
            <div className="flex items-center gap-3">
              {[
                { id: 'blue', name: 'রয়েল ব্লু', color: 'bg-blue-700', text: 'text-blue-900' },
                { id: 'sepia', name: 'সেপিয়া বাদামি', color: 'bg-amber-800', text: 'text-amber-900' },
                { id: 'emerald', name: 'পান্না সবুজ', color: 'bg-emerald-700', text: 'text-emerald-900' },
                { id: 'black', name: 'কালো কালি', color: 'bg-stone-900', text: 'text-stone-950' },
              ].map((ink) => (
                <button
                  key={ink.id}
                  type="button"
                  onClick={() => setInkColor(ink.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bn-sans flex items-center gap-1.5 border transition-all ${
                    inkColor === ink.id
                      ? 'bg-stone-900 text-white border-stone-900 shadow'
                      : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${ink.color}`} />
                  <span>{ink.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Textarea */}
          <div>
            <label className="block text-xs font-bold font-bn-sans text-stone-700 mb-1">
              আপনার স্মৃতি বা গানের লাইন:
            </label>
            <textarea
              required
              rows={4}
              value={text}
              onChange={handleInputChange}
              placeholder="“তোর কি মনে আছে সেই প্রথম রিকশায় ভেজার গানটা?...”"
              className={`w-full p-3.5 rounded-xl border-2 border-stone-300 focus:border-amber-700 focus:outline-none font-handwriting text-xl leading-relaxed bg-white/70 shadow-inner ${
                inkColor === 'blue' ? 'text-blue-900' : inkColor === 'sepia' ? 'text-amber-900' : inkColor === 'emerald' ? 'text-emerald-900' : 'text-stone-950'
              }`}
            />
          </div>

          {/* Name / Author & Song Dedication */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold font-bn-sans text-stone-700 mb-1">
                আপনার নাম বা ছদ্মনাম:
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="যেমন: ২০০৫ ব্যাচের ব্যাকবেঞ্চার"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-amber-700 focus:outline-none font-bn-sans text-sm bg-white/70"
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-bn-sans text-stone-700 mb-1">
                গানের উৎসর্গ (ঐচ্ছিক):
              </label>
              <input
                type="text"
                value={songDedication}
                onChange={(e) => setSongDedication(e.target.value)}
                placeholder="যেমন: স্মৃতির সুর / কোনো বিশেষ গান"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-amber-700 focus:outline-none font-bn-sans text-sm bg-white/70"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-stone-300 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bn-sans text-stone-600 hover:text-stone-900 transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold text-xs font-bn-sans flex items-center gap-2 shadow-lg shadow-amber-900/30 active:scale-95 transition-transform"
            >
              <Send className="w-4 h-4" />
              <span>ডায়েরির শেষ পাতায় সেঁটে দিন</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
