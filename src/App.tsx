import React, { useState, useEffect } from 'react';
import { BackgroundAmbience } from './components/BackgroundAmbience';
import { HeaderTitle } from './components/HeaderTitle';
import { LiveStationBar } from './components/LiveStationBar';
import { WalkmanCassette } from './components/WalkmanCassette';
import { RotatingQuotes } from './components/RotatingQuotes';
import { DiaryLastPage } from './components/DiaryLastPage';
import { InteractiveKeyboardChords } from './components/InteractiveKeyboardChords';
import { MemoriesGrid } from './components/MemoriesGrid';
import { GlassMusicPlayer } from './components/GlassMusicPlayer';
import { WriteMemoryModal } from './components/WriteMemoryModal';
import { YouTubeMusicProvider, useYouTubeMusic } from './context/YouTubeMusicContext';
import { LiveListenerProvider } from './context/LiveListenerContext';
import { INITIAL_SCRIBBLES } from './data/nostalgiaData';
import { ScribbleNote } from './types';

function MainAppContent() {
  const { isPlaying } = useYouTubeMusic();
  const [currentMood, setCurrentMood] = useState('cassette');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Load user's scribbles from localStorage or use initial memories
  const [scribbles, setScribbles] = useState<ScribbleNote[]>(() => {
    try {
      const saved = localStorage.getItem('shesh_patar_scribbles');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SCRIBBLES;
  });

  // Save scribbles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shesh_patar_scribbles', JSON.stringify(scribbles));
    } catch {}
  }, [scribbles]);

  const handleSaveScribble = (newNote: ScribbleNote) => {
    setScribbles((prev) => [newNote, ...prev]);
  };

  const handleLikeScribble = (id: string) => {
    setScribbles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
    );
  };

  return (
    <div className="min-h-screen bg-[#0C0E14] text-[#E0D8D0] relative selection:bg-[#F27D26] selection:text-[#0C0E14] pb-36 font-serif overflow-x-hidden">
      {/* Background Ambience & Radial Lighting */}
      <div className="fixed inset-0 pointer-events-none opacity-40 theme-bg-radial z-0" />
      <div className="fixed inset-0 pointer-events-none opacity-20 noise-overlay z-0" />

      {/* Vertical Aesthetic Typography Accents */}
      <aside aria-label="Decorative metadata" className="hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none select-none">
        <div className="vertical-text transform rotate-180 text-[10px] uppercase tracking-[0.5em] opacity-30 font-mono text-[#E0D8D0]">
          NOSTALGIA / MELANCHOLY / 1998 — SHESH PATAR GAAN
        </div>
      </aside>

      <aside aria-label="Decorative archival index" className="hidden lg:block fixed left-6 bottom-32 z-20 pointer-events-none select-none">
        <div className="text-[10px] uppercase tracking-[0.25em] opacity-30 font-mono text-[#E0D8D0] mb-1">
          Archival Index
        </div>
        <div className="text-xs font-mono text-[#F27D26]/80 tracking-wider">
          VOL. 98 — SIDE A
        </div>
      </aside>

      {/* Background Ambience (Rain, Particles, Vinyl Hiss) linked to real playback */}
      <BackgroundAmbience isPlaying={isPlaying} />

      {/* Main Content Container */}
      <main className="relative z-10">
        
        {/* Header with Title & Main Nostalgic Quote */}
        <HeaderTitle currentMood={currentMood} onMoodSelect={setCurrentMood} />

        {/* Real-time Live Listener Station Indicator */}
        <LiveStationBar />

        {/* Central Illustrated Object: The Vintage Sony Walkman connected to REAL YouTube Player */}
        <WalkmanCassette />

        {/* Rotating Nostalgic Bengali Quotes */}
        <RotatingQuotes />

        {/* Interactive Melody Instrument (Keyboard playable chords) */}
        <InteractiveKeyboardChords />

        {/* Central Visual Object: The "শেষ পাতা" (Open Notebook & User Memories) */}
        <DiaryLastPage
          scribbles={scribbles}
          onOpenWriteModal={() => setIsWriteModalOpen(true)}
          onLikeScribble={handleLikeScribble}
        />

        {/* Historical Bengali Nostalgia Archives (Tea stall, Letters, TDK cassettes) */}
        <MemoriesGrid />

        {/* Poetic Footer */}
        <footer className="text-center py-12 px-4 max-w-2xl mx-auto border-t border-stone-800/80 text-xs text-stone-500 font-bn-sans">
          <p className="font-handwriting text-xl text-amber-200/80 mb-2">
            “কিছু গান শেষ হয় না। শুধু মানুষটা বদলে যায়।”
          </p>
          <p className="font-mono text-[11px] text-stone-400">
            Dedicated to the rainy afternoons, handwritten letters, backbench diaries, and timeless Bengali songs.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-mono text-stone-500">
            <span>TAPE: SIDE A / SIDE B</span>
            <span>•</span>
            <span>AUTO REVERSE</span>
            <span>•</span>
            <span>SHESH PATAR GAAN © 1998–2026</span>
          </div>
        </footer>

      </main>

      {/* Fixed Bottom Glassmorphic Music Player connected to REAL YouTube Player */}
      <GlassMusicPlayer />

      {/* Interactive Write on the Last Page Modal */}
      <WriteMemoryModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSaveScribble={handleSaveScribble}
      />
    </div>
  );
}

export default function App() {
  return (
    <YouTubeMusicProvider>
      <LiveListenerProvider>
        <MainAppContent />
      </LiveListenerProvider>
    </YouTubeMusicProvider>
  );
}
