import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, CloudRain, Disc3, Sparkles } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

interface BackgroundAmbienceProps {
  isPlaying: boolean;
  onRainToggle?: (active: boolean) => void;
}

export const BackgroundAmbience: React.FC<BackgroundAmbienceProps> = ({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rainEnabled, setRainEnabled] = useState(true);
  const [ambientSoundActive, setAmbientSoundActive] = useState(false);
  const [rainVolume, setRainVolume] = useState(0.4);
  const [tapeHissVolume, setTapeHissVolume] = useState(0.25);
  const [showMixer, setShowMixer] = useState(false);

  // Canvas particle animation (Raindrops + floating dust motes)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Rain particles
    const rainCount = rainEnabled ? 75 : 0;
    const drops: Array<{ x: number; y: number; length: number; speed: number; opacity: number }> = [];
    for (let i = 0; i < 90; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 22 + 10,
        speed: Math.random() * 8 + 6,
        opacity: Math.random() * 0.35 + 0.1,
      });
    }

    // Dust motes / nostalgic golden flecks
    const motes: Array<{ x: number; y: number; radius: number; vx: number; vy: number; opacity: number }> = [];
    for (let i = 0; i < 35; i++) {
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        opacity: Math.random() * 0.4 + 0.15,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render rain streaks
      if (rainEnabled) {
        ctx.strokeStyle = 'rgba(168, 198, 224, 0.28)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let i = 0; i < drops.length; i++) {
          const d = drops[i];
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 2, d.y + d.length);
          d.y += d.speed;
          d.x -= 0.8;
          if (d.y > height) {
            d.y = -d.length;
            d.x = Math.random() * (width + 100);
          }
        }
        ctx.stroke();
      }

      // Render floating warm nostalgia motes
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 175, 110, ${m.opacity * (isPlaying ? 1.2 : 0.8)})`;
        ctx.fill();

        m.x += m.vx;
        m.y += m.vy;

        if (m.x < 0) m.x = width;
        if (m.x > width) m.x = 0;
        if (m.y < 0) m.y = height;
        if (m.y > height) m.y = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [rainEnabled, isPlaying]);

  // Handle ambient audio synthesizer
  const toggleAmbientSound = () => {
    const nextState = !ambientSoundActive;
    setAmbientSoundActive(nextState);
    if (nextState) {
      audioSynth.updateAmbience(rainEnabled ? rainVolume : 0, tapeHissVolume);
    } else {
      audioSynth.updateAmbience(0, 0);
    }
  };

  const handleRainVolumeChange = (v: number) => {
    setRainVolume(v);
    if (ambientSoundActive && rainEnabled) {
      audioSynth.updateAmbience(v, tapeHissVolume);
    }
  };

  const handleTapeHissChange = (v: number) => {
    setTapeHissVolume(v);
    if (ambientSoundActive) {
      audioSynth.updateAmbience(rainEnabled ? rainVolume : 0, v);
    }
  };

  return (
    <>
      {/* Background canvas for rain & particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.85 }}
      />

      {/* Atmospheric Ambient Lighting Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-900/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-sky-950/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[400px] bg-stone-900/40 rounded-full blur-3xl" />
      </div>

      {/* Floating Ambient Controls Bar (Top Right) */}
      <div className="fixed top-5 right-5 z-40 flex items-center gap-2">
        <div className="relative">
          <button
            id="ambient-mixer-btn"
            onClick={() => setShowMixer(!showMixer)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 backdrop-blur-md shadow-lg ${
              ambientSoundActive
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                : 'bg-stone-900/70 border-stone-700/40 text-stone-300 hover:text-stone-100 hover:border-stone-600'
            }`}
            title="স্মৃতির আবহ সঙ্গীত (Rain & Tape Hiss Soundscape)"
          >
            <Disc3 className={`w-3.5 h-3.5 ${ambientSoundActive ? 'animate-spin-slow text-amber-400' : ''}`} />
            <span>আবহ শব্দ {ambientSoundActive ? 'চালু' : 'বন্ধ'}</span>
          </button>

          {/* Ambient Sound Mixer Drawer */}
          {showMixer && (
            <div className="absolute right-0 mt-2 w-72 p-4 rounded-2xl glass-panel-amber z-50 text-stone-200 text-xs shadow-2xl border border-amber-900/40">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-amber-900/40">
                <span className="font-semibold text-amber-200 flex items-center gap-1.5 font-bn-sans">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> স্মৃতির সাউন্ডস্কেপ
                </span>
                <button
                  onClick={toggleAmbientSound}
                  className={`p-1 rounded-md transition-colors ${
                    ambientSoundActive ? 'bg-amber-500/20 text-amber-300' : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {ambientSoundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              {/* Rain Sound Slider */}
              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <CloudRain className="w-3 h-3 text-sky-400" /> শ্রাবণের বৃষ্টি (Monsoon Rain)
                  </span>
                  <span>{Math.round(rainVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={rainVolume}
                  onChange={(e) => handleRainVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
              </div>

              {/* Tape Hiss / Vinyl Slider */}
              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <Disc3 className="w-3 h-3 text-amber-400" /> ভিনাইল ও ক্যাসেটের হিস (Tape Hiss)
                  </span>
                  <span>{Math.round(tapeHissVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={tapeHissVolume}
                  onChange={(e) => handleTapeHissChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-400">
                <span>বৃষ্টির অ্যানিমেশন</span>
                <button
                  onClick={() => setRainEnabled(!rainEnabled)}
                  className={`px-2 py-0.5 rounded text-[10px] ${
                    rainEnabled ? 'bg-sky-500/20 text-sky-300' : 'bg-stone-800 text-stone-500'
                  }`}
                >
                  {rainEnabled ? 'অন' : 'অফ'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
