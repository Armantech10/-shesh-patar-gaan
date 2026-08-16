import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCw, FastForward, Rewind, ArrowLeftRight, Volume2, Headphones } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';
import { useYouTubeMusic } from '../context/YouTubeMusicContext';

export const WalkmanCassette: React.FC = () => {
  const {
    isPlaying,
    isLoading,
    statusMessage,
    currentTrack,
    volume,
    currentArchive,
    isTransitioningArchive,
    togglePlay,
    playNext,
    playPrev,
    setVolume,
  } = useYouTubeMusic();

  const [side, setSide] = useState<'A' | 'B'>(currentArchive.side || 'A');
  const [isRewinding, setIsRewinding] = useState(false);
  const [pencilAngle, setPencilAngle] = useState(25);
  const [tapeCounter, setTapeCounter] = useState(128);
  const [vuLeft, setVuLeft] = useState(20);
  const [vuRight, setVuRight] = useState(25);

  // Sync cassette side display when currentArchive changes
  useEffect(() => {
    if (currentArchive && currentArchive.side) {
      setSide(currentArchive.side);
    }
  }, [currentArchive]);

  // Animate analog VU meters & tape counter dynamically ONLY when real audio is playing
  useEffect(() => {
    if (!isPlaying) {
      setVuLeft(6);
      setVuRight(8);
      return;
    }

    const interval = setInterval(() => {
      const base = 42 + Math.random() * 42;
      setVuLeft(Math.min(96, Math.max(10, base + (Math.random() * 20 - 10))));
      setVuRight(Math.min(96, Math.max(10, base + (Math.random() * 20 - 10))));
      setTapeCounter((prev) => (prev >= 999 ? 1 : prev + 1));
    }, 130);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Flip cassette side handler
  const handleFlipSide = () => {
    audioSynth.playCassetteClick('eject');
    setSide((prev) => (prev === 'A' ? 'B' : 'A'));
  };

  // Rewind with Nataraj 2B pencil interactive feature
  const handlePencilRewind = () => {
    audioSynth.playRewindWhir();
    setIsRewinding(true);
    setPencilAngle((prev) => prev + 720);
    setTapeCounter((prev) => Math.max(0, prev - 42));
    setTimeout(() => {
      setIsRewinding(false);
    }, 900);
  };

  const handleNext = () => {
    audioSynth.playCassetteClick('press');
    audioSynth.playFastForwardWhir();
    setTapeCounter((prev) => (prev + 45) % 999);
    playNext();
  };

  const handlePrev = () => {
    audioSynth.playCassetteClick('press');
    audioSynth.playRewindWhir();
    setTapeCounter((prev) => Math.max(0, prev - 45));
    playPrev();
  };

  const handleResetCounter = () => {
    audioSynth.playCassetteClick('press');
    setTapeCounter(0);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto my-6 sm:my-8 px-2 sm:px-6 select-none z-10">
      {/* 3D Realistic Walkman Body Enclosure */}
      <div className="relative rounded-3xl p-5 sm:p-7 walkman-chassis border border-[#272D3A] shadow-[0_40px_120px_rgba(0,0,0,0.95)] overflow-hidden">
        
        {/* Subtle Metallic Corner Screws */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-gradient-to-br from-stone-400 to-stone-800 border border-stone-900 flex items-center justify-center shadow-inner">
          <div className="w-1.5 h-[1px] bg-stone-950 rotate-45" />
        </div>
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-gradient-to-br from-stone-400 to-stone-800 border border-stone-900 flex items-center justify-center shadow-inner">
          <div className="w-1.5 h-[1px] bg-stone-950 -rotate-45" />
        </div>
        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-gradient-to-br from-stone-400 to-stone-800 border border-stone-900 flex items-center justify-center shadow-inner">
          <div className="w-1.5 h-[1px] bg-stone-950 -rotate-12" />
        </div>
        <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-gradient-to-br from-stone-400 to-stone-800 border border-stone-900 flex items-center justify-center shadow-inner">
          <div className="w-1.5 h-[1px] bg-stone-950 rotate-30" />
        </div>

        {/* Walkman Head Top Plate (Branding, Headphone Jack, Indicators) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-[#232936]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-black tracking-widest text-[#E87B28] uppercase border border-[#E87B28]/40 px-2 py-0.5 rounded bg-[#E87B28]/10">
              SONY WALKMAN
            </span>
            <span className="font-mono text-[10px] text-[#A59E95] tracking-wider hidden sm:inline">
              WM-FX290 • STEREO CASSETTE PLAYER
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#8E877E]">
            {/* 3.5mm Headphone Jack Visual */}
            <div className="flex items-center gap-1.5" title="3.5mm Stereo Headphone Output">
              <Headphones className="w-3.5 h-3.5 text-[#E87B28]" />
              <div className="w-4 h-4 rounded-full bg-[#080A0E] border-2 border-stone-600 shadow-inner flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-black" />
              </div>
            </div>

            {/* Mechanical Tape Counter */}
            <div
              onClick={handleResetCounter}
              className="cursor-pointer group flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#080A0E] border border-[#232936] shadow-inner"
              title="Click to Reset Tape Counter (000)"
            >
              <div className="flex gap-0.5 font-mono text-xs font-bold text-amber-500 tracking-wider">
                <span className="px-1 bg-[#12151D] rounded border border-stone-800 shadow-inner">
                  {String(tapeCounter).padStart(3, '0')[0]}
                </span>
                <span className="px-1 bg-[#12151D] rounded border border-stone-800 shadow-inner">
                  {String(tapeCounter).padStart(3, '0')[1]}
                </span>
                <span className="px-1 bg-[#12151D] rounded border border-stone-800 shadow-inner">
                  {String(tapeCounter).padStart(3, '0')[2]}
                </span>
              </div>
              <span className="text-[8px] font-mono text-[#8A847C] group-hover:text-[#E87B28] transition-colors">
                RESET
              </span>
            </div>

            {/* LED Status Indicator Bulb */}
            <div className="flex items-center gap-1.5">
              <div className="relative w-3.5 h-3.5 rounded-full bg-[#0D0F16] border border-stone-700 flex items-center justify-center">
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isPlaying
                      ? 'bg-[#E87B28] shadow-[0_0_8px_#E87B28] animate-pulse'
                      : 'bg-stone-800'
                  }`}
                />
              </div>
              <span className="font-mono text-[9px] font-bold tracking-wider text-[#9A938A] uppercase">
                {isLoading ? 'LOADING' : isPlaying ? 'PLAYING' : 'READY'}
              </span>
            </div>
          </div>
        </div>

        {/* Central Recessed Cassette Chamber & Viewing Hatch */}
        <div className="relative rounded-2xl bg-[#08090E] border-2 border-[#212733] p-3 sm:p-4 shadow-[inset_0_10px_25px_rgba(0,0,0,0.95)]">
          
          {/* Realistic Cassette Shell */}
          <div
            className={`relative rounded-xl p-3 sm:p-4 border-2 transition-all duration-500 cassette-scratches ${
              side === 'A'
                ? 'bg-gradient-to-b from-[#1A1E27] via-[#12151C] to-[#0E1017] border-[#303848]'
                : 'bg-[#12151B] border-[#29303E]'
            } shadow-[0_15px_35px_rgba(0,0,0,0.85)]`}
          >
            {/* Cassette Shell Molded Screws (5 standard points) */}
            <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-gradient-to-b from-stone-400 to-stone-700 border border-black flex items-center justify-center text-[7px] text-stone-900 font-mono shadow-inner">+</div>
            <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-gradient-to-b from-stone-400 to-stone-700 border border-black flex items-center justify-center text-[7px] text-stone-900 font-mono shadow-inner">+</div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-b from-stone-400 to-stone-700 border border-black flex items-center justify-center text-[7px] text-stone-900 font-mono shadow-inner">+</div>
            <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-gradient-to-b from-stone-400 to-stone-700 border border-black flex items-center justify-center text-[7px] text-stone-900 font-mono shadow-inner">+</div>
            <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-gradient-to-b from-stone-400 to-stone-700 border border-black flex items-center justify-center text-[7px] text-stone-900 font-mono shadow-inner">+</div>

            {/* Top Tape Notches for Type 1 Normal Bias */}
            <div className="absolute -top-1 left-12 w-6 h-1.5 bg-[#08090E] rounded-b border-x border-b border-[#303848]" />
            <div className="absolute -top-1 right-12 w-6 h-1.5 bg-[#08090E] rounded-b border-x border-b border-[#303848]" />

            {/* Authentic Worn Handwritten Bengali Paper Label */}
            <div className={`relative rounded-lg p-3 sm:p-3.5 cassette-label-worn text-stone-900 border border-stone-400 shadow-md transition-all duration-300 ${isTransitioningArchive ? 'opacity-30 blur-[1px]' : 'opacity-100 blur-0'}`}>
              
              {/* Header Spec Ribbon on Tape */}
              <div className="flex items-center justify-between border-b-2 border-dashed border-stone-400/80 pb-1.5 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-[#12151B] text-stone-100 font-mono text-[9px] font-bold rounded">
                    TDK D-90 • {currentArchive.tapeNumber}
                  </span>
                  <span className="font-mono text-[9px] tracking-wider text-stone-700 font-semibold hidden sm:inline">
                    {currentArchive.bias}
                  </span>
                </div>
                
                {/* Side Badge (Handwritten marker circle style) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-stone-600 uppercase font-bold">SIDE</span>
                  <div className="w-6 h-6 rounded-full border-2 border-red-700 bg-red-100/50 flex items-center justify-center font-mono font-black text-xs text-red-700 shadow-sm rotate-[-4deg]">
                    {side}
                  </div>
                </div>
              </div>

              {/* Dynamic Bengali Archive & Track Title */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs">{currentArchive.icon}</span>
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-amber-950 bg-amber-200/60 px-1.5 py-0.2 rounded">
                      {currentArchive.title}
                    </span>
                  </div>
                  <h3 className="font-bn-serif text-base sm:text-lg font-black text-stone-900 leading-tight tracking-tight drop-shadow-sm truncate">
                    {currentTrack.title || currentArchive.title}
                  </h3>
                  <p className="font-handwriting text-sm sm:text-base text-blue-950 font-bold leading-none mt-1 truncate">
                    {currentTrack.artist || currentArchive.subtitle}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <span className="font-typewriter text-[10px] text-stone-700 block uppercase tracking-wider">
                    {currentArchive.catalogCode}
                  </span>
                  <span className="font-mono text-[9px] text-stone-500">
                    90 MIN / ANALOG
                  </span>
                </div>
              </div>
            </div>

            {/* Central Acrylic Window with Rotating Spools & Visible Magnetic Ribbon */}
            <div className="relative my-3 mx-auto w-full h-24 sm:h-28 rounded-lg bg-[#07080D] border-2 border-[#232936] overflow-hidden flex items-center justify-between px-6 sm:px-12 shadow-[inset_0_4px_12px_rgba(0,0,0,0.95)]">
              
              {/* Acrylic Window Reflection & Specular Sheen */}
              <div className="absolute inset-0 cassette-acrylic-window pointer-events-none z-20" />
              
              {/* Measurement Scale Graduation Lines on Glass */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-6 text-[8px] font-mono text-stone-500 z-10 select-none">
                <span>100</span>
                <span className="text-[6px] opacity-40">| | |</span>
                <span>50</span>
                <span className="text-[6px] opacity-40">| | |</span>
                <span>0</span>
              </div>

              {/* Visible Magnetic Ferric Tape Ribbon Spanning Horizontally */}
              <div className="absolute bottom-3 left-8 right-8 h-2.5 bg-gradient-to-b from-[#2b1810] via-[#422518] to-[#1c0f0a] border-y border-[#5a3221]/40 shadow-sm z-0 opacity-90" />

              {/* LEFT CASSETTE REEL & SPOOL */}
              <div className="relative z-10 flex items-center justify-center">
                {/* Thick Magnetic Tape Pack (Left Spool Coil) */}
                <div
                  className={`absolute rounded-full bg-gradient-to-br from-[#351d12] via-[#21110a] to-[#100805] border border-[#48281a] shadow-md transition-all duration-700 ${
                    side === 'A' ? 'w-20 h-20 sm:w-22 sm:h-22' : 'w-14 h-14 sm:w-16 sm:h-16'
                  }`}
                  style={{
                    backgroundImage: 'radial-gradient(circle, transparent 40%, rgba(20, 10, 5, 0.9) 80%), repeating-radial-gradient(circle, #381e13 0, #381e13 1px, #1e0f09 1.5px, #1e0f09 2px)',
                  }}
                />

                {/* White 6-Toothed Cog Wheel Hub */}
                <div
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#f4f2ea] border-2 border-stone-400 flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.8),inset_0_2px_3px_rgba(255,255,255,0.9)] ${
                    isPlaying
                      ? isRewinding
                        ? 'animate-spin-fast'
                        : 'animate-spin-slow'
                      : 'animate-spin-paused'
                  }`}
                >
                  {/* Center Drive Hole */}
                  <div className="w-6 h-6 rounded-full bg-[#08090E] border border-stone-500 shadow-inner relative flex items-center justify-center">
                    <div className="absolute w-7 h-1.5 bg-[#f4f2ea] rounded-sm shadow-sm" />
                    <div className="absolute w-7 h-1.5 bg-[#f4f2ea] rounded-sm shadow-sm rotate-60" />
                    <div className="absolute w-7 h-1.5 bg-[#f4f2ea] rounded-sm shadow-sm -rotate-60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#08090E] z-10" />
                  </div>
                </div>
              </div>

              {/* Center Tape Level View / VU Level Bars */}
              <div className="flex-1 mx-2 sm:mx-6 flex flex-col items-center justify-center z-10">
                <div className="w-full max-w-[130px] px-2 py-1 rounded bg-[#08090E]/90 border border-[#232936] text-center backdrop-blur-sm">
                  <div className="flex justify-between items-center text-[8px] font-mono text-[#E87B28] mb-1">
                    <span>L</span>
                    <span className="text-[7px] text-[#8A847C]">VU ANALOG</span>
                    <span>R</span>
                  </div>
                  {/* Miniature Stereo VU Needle Indicators */}
                  <div className="space-y-1">
                    <div className="h-1 w-full bg-[#12151D] rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-[#E87B28] to-red-500 transition-all duration-100"
                        style={{ width: `${isPlaying ? vuLeft : 10}%` }}
                      />
                    </div>
                    <div className="h-1 w-full bg-[#12151D] rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-[#E87B28] to-red-500 transition-all duration-100"
                        style={{ width: `${isPlaying ? vuRight : 12}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT CASSETTE REEL & SPOOL */}
              <div className="relative z-10 flex items-center justify-center">
                {/* Thick Magnetic Tape Pack (Right Spool Coil) */}
                <div
                  className={`absolute rounded-full bg-gradient-to-br from-[#351d12] via-[#21110a] to-[#100805] border border-[#48281a] shadow-md transition-all duration-700 ${
                    side === 'A' ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-20 h-20 sm:w-22 sm:h-22'
                  }`}
                  style={{
                    backgroundImage: 'radial-gradient(circle, transparent 40%, rgba(20, 10, 5, 0.9) 80%), repeating-radial-gradient(circle, #381e13 0, #381e13 1px, #1e0f09 1.5px, #1e0f09 2px)',
                  }}
                />

                {/* White 6-Toothed Cog Wheel Hub */}
                <div
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#f4f2ea] border-2 border-stone-400 flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.8),inset_0_2px_3px_rgba(255,255,255,0.9)] ${
                    isPlaying
                      ? isRewinding
                        ? 'animate-spin-fast'
                        : 'animate-spin-slow'
                      : 'animate-spin-paused'
                  }`}
                >
                  {/* Center Drive Hole */}
                  <div className="w-6 h-6 rounded-full bg-[#08090E] border border-stone-500 shadow-inner relative flex items-center justify-center">
                    <div className="absolute w-7 h-1.5 bg-[#f4f2ea] rounded-sm shadow-sm" />
                    <div className="absolute w-7 h-1.5 bg-[#f4f2ea] rounded-sm shadow-sm rotate-60" />
                    <div className="absolute w-7 h-1.5 bg-[#f4f2ea] rounded-sm shadow-sm -rotate-60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#08090E] z-10" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Trapezoid Head Area with Pressure Pad & Guide Rollers */}
            <div className="relative mx-auto w-48 sm:w-64 h-5 sm:h-6 bg-[#08090E] rounded-t-lg border-t-2 border-x-2 border-[#232936] flex items-center justify-between px-3 mt-1 shadow-inner">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-300 to-amber-700 border border-black shadow-inner" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded bg-stone-700 border border-black" />
                <div className="w-8 h-2.5 rounded bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 border border-black flex items-center justify-center">
                  <div className="w-3 h-1 bg-stone-900 rounded-[1px]" />
                </div>
                <div className="w-2 h-2 rounded bg-stone-700 border border-black" />
              </div>
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-300 to-amber-700 border border-black shadow-inner" />
            </div>
          </div>
        </div>

        {/* Lower Utility Control Row (Volume Thumbwheel & Pencil Rewinder Tool) */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Left Side: Volume Level Dial */}
          <div className="sm:col-span-4 flex items-center justify-between px-3 py-2 rounded-xl bg-[#0D0F16] border border-[#212733] shadow-inner">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#8A847C] font-bold">
              OUTPUT
            </span>
            
            {/* Tactile Serrated Volume Thumbwheel */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-[#E87B28]" />
              <div className="flex flex-col items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-16 h-1.5 bg-[#1C212B] accent-[#E87B28] rounded-full cursor-pointer"
                  title="Master Volume Dial"
                />
                <span className="font-mono text-[8px] text-[#8A847C] mt-0.5">VOL {volume}%</span>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Nataraj 2B Pencil Rewind Tool */}
          <button
            id="pencil-rewind-btn"
            onClick={handlePencilRewind}
            className="sm:col-span-8 group relative p-2.5 rounded-xl bg-[#0D0F16] border border-[#212733] hover:border-[#E87B28]/50 transition-all duration-200 flex items-center justify-between text-left shadow-inner"
            title="ক্যাসেটের ফিতা পেঁচিয়ে গেলে নটরাজ পেন্সিল দিয়ে ঘোরান"
          >
            <div className="flex items-center gap-3">
              {/* Realistic Nataraj 2B Hexagonal Pencil Visual */}
              <div
                className="relative w-8 h-8 rounded-full bg-[#141720] border border-[#282F3E] flex items-center justify-center transition-transform duration-500 shadow-md"
                style={{ transform: `rotate(${pencilAngle}deg)` }}
              >
                <div className="relative w-6 h-2 rounded-[2px] bg-gradient-to-r from-red-600 via-black to-red-600 flex items-center justify-between px-0.5 shadow-sm">
                  <div className="w-1.5 h-2 bg-stone-300 border-r border-stone-500" />
                  <div className="w-1.5 h-2 bg-amber-200 border-l border-stone-900" />
                </div>
              </div>

              <div>
                <p className="text-xs font-bn-sans font-bold text-[#E2DAD1] flex items-center gap-1.5">
                  নটরাজ পেন্সিল দিয়ে ফিতা ঘোরান
                  <span className="px-1.5 py-0.2 bg-[#E87B28]/20 border border-[#E87B28]/40 text-[#E87B28] text-[9px] font-mono rounded">
                    2B
                  </span>
                </p>
                <p className="text-[10px] text-[#8A847C] font-mono">Interactive Pencil Spool Rewinder</p>
              </div>
            </div>

            <RotateCw className={`w-4 h-4 text-[#E87B28] ${isRewinding ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          </button>
        </div>

        {/* Physical 3D Tactile Mechanical Button Rail */}
        <div className="mt-4 pt-3 border-t border-[#232936] flex flex-wrap items-center justify-between gap-2.5">
          
          {/* Side A/B Flip Switch */}
          <button
            id="cassette-flip-btn"
            onClick={handleFlipSide}
            className="walkman-btn px-3.5 py-2 rounded-xl text-[#E2DAD1] text-xs font-mono font-bold flex items-center gap-2 border border-[#2E3646] active:scale-95 transition-transform"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#E87B28]" />
            <span>FLIP ({side === 'A' ? 'SIDE B' : 'SIDE A'})</span>
          </button>

          {/* Transport Mechanical Key Deck */}
          <div className="flex items-center gap-2">
            {/* REWIND Button */}
            <button
              id="cassette-prev-btn"
              onClick={handlePrev}
              className="walkman-btn p-2 sm:px-3 sm:py-2 rounded-xl text-[#D4CCC1] hover:text-white border border-[#2E3646] flex items-center gap-1 text-xs font-mono active:scale-95"
              title="Rewind / Previous Track in YouTube Playlist"
            >
              <Rewind className="w-4 h-4 fill-stone-400" />
              <span className="hidden sm:inline text-[10px]">REW</span>
            </button>

            {/* PLAY / PAUSE Button with 3D Depressed Mechanical Action */}
            <button
              id="cassette-play-pause-btn"
              onClick={() => {
                audioSynth.playCassetteClick('press');
                togglePlay();
              }}
              className={`walkman-btn-orange px-5 py-2 rounded-xl text-[#0A0C10] font-black text-xs font-mono uppercase tracking-wider flex items-center gap-2 border border-[#E87B28] shadow-lg transition-transform ${
                isPlaying ? 'walkman-btn-orange-pressed' : ''
              } active:scale-95`}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-[#0A0C10]" />
              ) : (
                <Play className="w-4 h-4 fill-[#0A0C10]" />
              )}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            {/* FAST FORWARD Button */}
            <button
              id="cassette-next-btn"
              onClick={handleNext}
              className="walkman-btn p-2 sm:px-3 sm:py-2 rounded-xl text-[#D4CCC1] hover:text-white border border-[#2E3646] flex items-center gap-1 text-xs font-mono active:scale-95"
              title="Fast Forward / Next Track in YouTube Playlist"
            >
              <span className="hidden sm:inline text-[10px]">FF</span>
              <FastForward className="w-4 h-4 fill-stone-400" />
            </button>
          </div>
        </div>

        {/* Real-time Status Notice */}
        <div className="mt-2.5 text-center">
          <span className="text-[10px] font-mono text-[#E87B28]/80 tracking-wider">
            {statusMessage}
          </span>
        </div>

      </div>
    </div>
  );
};

