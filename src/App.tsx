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
    <div className="min-h-screen bg-[#0A0C10] text-[#E2DAD1] relative selection:bg-[#E87B28] selection:text-[#0A0C10] pb-32 font-serif overflow-x-hidden film-grain">
      {/* Background Ambience & Radial Lighting */}
      <div className="fixed inset-0 pointer-events-none opacity-50 theme-bg-radial z-0" />
      <div className="fixed inset-0 pointer-events-none opacity-25 noise-overlay z-0" />

      {/* Vertical Archival Typography Accents (Desktop only) */}
      <aside aria-label="Decorative metadata" className="hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none select-none">
        <div className="vertical-text transform rotate-180 text-[10px] uppercase tracking-[0.4em] opacity-35 font-mono text-[#B5AEA5]">
          NOSTALGIA / MELANCHOLY / 1998 — SHESH PATAR GAAN
        </div>
      </aside>

      <aside aria-label="Decorative archival index" className="hidden lg:block fixed left-6 bottom-32 z-20 pointer-events-none select-none">
        <div className="text-[10px] uppercase tracking-[0.25em] opacity-35 font-mono text-[#B5AEA5] mb-1">
          Archival Index
        </div>
        <div className="text-xs font-mono text-[#E87B28]/90 tracking-wider">
          VOL. 98 — SIDE A
        </div>
      </aside>

      {/* Background Ambience (Rain, Particles, Vinyl Hiss) linked to real playback */}
      <BackgroundAmbience isPlaying={isPlaying} />

      {/* Main Content Container */}
      <main className="relative z-10">
        
        {/* Archival Header with Printed Identity & Mood Categories */}
        <HeaderTitle />

        {/* Real-time Live Listener Broadcast Indicator */}
        <LiveStationBar />

        {/* Central Visual Centerpiece: Vintage Walkman Connected to REAL YouTube Player */}
        <WalkmanCassette />

        {/* Rotating Nostalgic Bengali Quotes */}
        <RotatingQuotes />

        {/* Interactive Acoustic Chords Synthesizer */}
        <InteractiveKeyboardChords />

        {/* Central Visual Object: Open Notebook & User Memory Scribbles */}
        <DiaryLastPage
          scribbles={scribbles}
          onOpenWriteModal={() => setIsWriteModalOpen(true)}
          onLikeScribble={handleLikeScribble}
        />

        {/* Historical Bengali Nostalgia Archives (Tea stall, Letters, TDK cassettes) */}
        <MemoriesGrid />

        {/* Archival Footer */}
        <footer className="text-center py-12 px-4 max-w-2xl mx-auto border-t border-[#232936] text-xs text-[#8A847C] font-bn-sans select-none">
          <p className="font-handwriting text-2xl text-amber-200/90 mb-2">
            “কিছু গান শেষ হয় না। শুধু মানুষটা বদলে যায়।”
          </p>
          <p className="font-mono text-[11px] text-[#A59E95] max-w-lg mx-auto leading-relaxed">
            Dedicated to the rainy afternoons, handwritten letters, backbench diaries, and timeless Bengali songs.
          </p>
          
          {/* Printed Archival Footer Markings */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-5 text-[10px] font-mono text-[#6E6860] uppercase tracking-widest">
            <span>ARCHIVAL INDEX</span>
            <span>•</span>
            <span>VOL. 98 — SIDE A</span>
            <span>•</span>
            <span>RECORDED / RESTORED / DIGITIZED</span>
            <span>•</span>
            <span>SHESH PATAR GAAN © 1998–2026</span>
          </div>
        </footer>

      </main>

      {/* Fixed Bottom Glassmorphic Player Bar connected to REAL YouTube Player */}
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

