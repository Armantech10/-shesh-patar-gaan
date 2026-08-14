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
    togglePlay,
    playNext,
    playPrev,
    setVolume,
  } = useYouTubeMusic();

  const [side, setSide] = useState<'A' | 'B'>('A');
  const [isRewinding, setIsRewinding] = useState(false);
  const [pencilAngle, setPencilAngle] = useState(25);
  const [tapeCounter, setTapeCounter] = useState(128);
  const [vuLeft, setVuLeft] = useState(25);
  const [vuRight, setVuRight] = useState(30);

  // Animate analog VU meters & tape counter dynamically ONLY when real audio is playing
  useEffect(() => {
    if (!isPlaying) {
      setVuLeft(6);
      setVuRight(8);
      return;
    }

    const interval = setInterval(() => {
      const base = 45 + Math.random() * 40;
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

  // Rewind with pencil interactive feature
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
    <div className="relative w-full max-w-3xl mx-auto my-6 sm:my-10 px-2 sm:px-6 select-none z-10">
      {/* 3D Realistic Walkman Body Enclosure */}
      <div className="relative rounded-3xl p-5 sm:p-8 walkman-chassis border-2 border-[#333a47] shadow-[0_50px_130px_rgba(0,0,0,0.98)] overflow-hidden">
        
        {/* Subtle Metallic Corner Screws on Walkman Body */}
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
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#2d3442]">
          <div className="flex items-center gap-3">
            {/* Vintage Walkman Brand Emblem */}
            <div className="px-3 py-1 rounded bg-[#101319] border border-[#2b3342] shadow-inner flex items-center gap-2">
              <span className="font-mono text-xs font-black tracking-widest text-[#f27d26] uppercase">
                SONY
              </span>
              <span className="text-[10px] font-mono tracking-widest text-stone-400 font-bold border-l border-stone-700 pl-2">
                WALKMAN WM-EX1
              </span>
            </div>
            
            {/* Auto Reverse & Dolby System Badges */}
            <div className="hidden sm:flex items-center gap-1.5 text-[9px] font-mono text-stone-400">
              <span className="px-2 py-0.5 rounded bg-[#151922] border border-[#252c38]">
                AUTO REVERSE
              </span>
              <span className="px-2 py-0.5 rounded bg-[#151922] border border-[#252c38] text-[#f27d26]/90 font-bold">
                DOLBY B NR
              </span>
            </div>
          </div>

          {/* Mechanical Tape Counter & 3.5mm Headphone Jack */}
          <div className="flex items-center gap-4">
            {/* 3.5mm Headphone Jack Visual */}
            <div className="flex items-center gap-1.5" title="3.5mm Stereo Headphone Output">
              <Headphones className="w-3.5 h-3.5 text-[#f27d26]" />
              <div className="w-4 h-4 rounded-full bg-[#0a0c10] border-2 border-stone-500 shadow-inner flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-black" />
              </div>
            </div>

            {/* Analog Mechanical Odometer Tape Counter */}
            <div
              onClick={handleResetCounter}
              className="cursor-pointer group flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#090b0e] border border-[#28303e] shadow-inner"
              title="Click to Reset Tape Counter (000)"
            >
              <div className="flex gap-0.5 font-mono text-xs font-bold text-amber-500 tracking-wider">
                <span className="px-1 bg-[#141820] rounded border border-stone-800 shadow-inner">
                  {String(tapeCounter).padStart(3, '0')[0]}
                </span>
                <span className="px-1 bg-[#141820] rounded border border-stone-800 shadow-inner">
                  {String(tapeCounter).padStart(3, '0')[1]}
                </span>
                <span className="px-1 bg-[#141820] rounded border border-stone-800 shadow-inner">
                  {String(tapeCounter).padStart(3, '0')[2]}
                </span>
              </div>
              <span className="text-[8px] font-mono text-stone-500 group-hover:text-[#f27d26] transition-colors">
                RESET
              </span>
            </div>

            {/* LED Status Indicator Bulb */}
            <div className="flex items-center gap-1.5">
              <div className="relative w-3.5 h-3.5 rounded-full bg-[#12151b] border border-stone-700 flex items-center justify-center">
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isPlaying
                      ? 'bg-[#f27d26] shadow-[0_0_8px_#f27d26] animate-pulse'
                      : 'bg-stone-800'
                  }`}
                />
              </div>
              <span className="font-mono text-[9px] font-bold tracking-wider text-stone-400 uppercase">
                {isLoading ? 'LOADING' : isPlaying ? 'PLAYING' : 'READY'}
              </span>
            </div>
          </div>
        </div>

        {/* Central Recessed Cassette Chamber & Acrylic Viewing Hatch */}
        <div className="relative rounded-2xl bg-[#090b10] border-2 border-[#2a303d] p-3 sm:p-5 shadow-[inset_0_10px_25px_rgba(0,0,0,0.95)]">
          
          {/* Realistic Cassette Shell */}
          <div
            className={`relative rounded-xl p-3 sm:p-4 border-2 transition-all duration-500 cassette-scratches ${
              side === 'A'
                ? 'bg-gradient-to-b from-[#1d222c] via-[#141820] to-[#0f1218] border-[#373f50]'
                : 'bg-gradient-to-b from-[#181c24] via-[#11141b] to-[#0c0e13] border-[#303848]'
            } shadow-[0_15px_35px_rgba(0,0,0,0.85)]`}
          >
            {/* Cassette Shell Molded Screws (5 standard points) */}
            <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-gradient-to-b from-stone-400 to-stone-700 border border-black flex items-center justify-center text-[7px] text-stone-900 font-mono shadow-inner">+</div>
            <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-gradient-to-b from-stone-400 to-stone-700 border border-black flex items-center justify-center text-[7px] text-stone-900 font-mono shadow-inner">+</div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-b from-stone-400 to-stone-700 border border-black flex items-center justify-center text-[7px] text-stone-900 font-mono shadow-inner">+</div>
            <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-gradient-to-b from-stone-400 to-stone-700 border border-black flex items-center justify-center text-[7px] text-stone-900 font-mono shadow-inner">+</div>
            <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-gradient-to-b from-stone-400 to-stone-700 border border-black flex items-center justify-center text-[7px] text-stone-900 font-mono shadow-inner">+</div>

            {/* Top Tape Notches for Type 1 Normal Bias */}
            <div className="absolute -top-1 left-12 w-6 h-1.5 bg-[#090b10] rounded-b border-x border-b border-[#373f50]" />
            <div className="absolute -top-1 right-12 w-6 h-1.5 bg-[#090b10] rounded-b border-x border-b border-[#373f50]" />

            {/* Authentic Worn Handwritten Bengali Paper Label */}
            <div className="relative rounded-lg p-3 sm:p-3.5 cassette-label-worn text-stone-900 border border-stone-400 shadow-md">
              
              {/* Header Spec Ribbon on Tape */}
              <div className="flex items-center justify-between border-b-2 border-dashed border-stone-400/80 pb-1.5 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-[#12151b] text-stone-100 font-mono text-[9px] font-bold rounded">
                    TDK D-90
                  </span>
                  <span className="font-mono text-[9px] tracking-wider text-stone-700 font-semibold hidden sm:inline">
                    IEC-I / NORMAL BIAS 120µs EQ
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

              {/* Handwritten Bengali Song Title from REAL YouTube Playlist */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="min-w-0 pr-2">
                  <h3 className="font-bn-serif text-lg sm:text-xl font-black text-stone-900 leading-tight tracking-tight drop-shadow-sm truncate">
                    {currentTrack.title || 'শেষ পাতার গান (সাইড-এ)'}
                  </h3>
                  <p className="font-handwriting text-base sm:text-lg text-blue-900 font-bold leading-none mt-1 truncate">
                    {currentTrack.artist || '“খাতার শেষ পাতার সুরগুলো • ১৯৯৮”'}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <span className="font-typewriter text-[10px] text-stone-700 block uppercase tracking-wider">
                    LOW NOISE
                  </span>
                  <span className="font-mono text-[9px] text-stone-500">
                    OUTPUT HIGH
                  </span>
                </div>
              </div>
            </div>

            {/* Central Acrylic Window with Rotating Spools & Visible Magnetic Ribbon */}
            <div className="relative my-3 mx-auto w-full h-24 sm:h-28 rounded-lg bg-[#08090d] border-2 border-[#2b3342] overflow-hidden flex items-center justify-between px-6 sm:px-12 shadow-[inset_0_4px_12px_rgba(0,0,0,0.95)]">
              
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
                  className={`absolute rounded-full bg-gradient-to-br from-[#3b2014] via-[#24130c] to-[#120a06] border border-[#522e1d] shadow-md transition-all duration-700 ${
                    side === 'A' ? 'w-20 h-20 sm:w-22 sm:h-22' : 'w-14 h-14 sm:w-16 sm:h-16'
                  }`}
                  style={{
                    backgroundImage: 'radial-gradient(circle, transparent 40%, rgba(20, 10, 5, 0.9) 80%), repeating-radial-gradient(circle, #3d2215 0, #3d2215 1px, #21120a 1.5px, #21120a 2px)',
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
                  <div className="w-6 h-6 rounded-full bg-[#090b10] border border-stone-500 shadow-inner relative flex items-center justify-center">
                    {/* 6 Teeth Protrusions inside the cog */}
                    <div className="absolute w-7 h-1.5 bg-[#f4f2ea] rounded-sm shadow-sm" />
                    <div className="absolute w-7 h-1.5 bg-[#f4f2ea] rounded-sm shadow-sm rotate-60" />
                    <div className="absolute w-7 h-1.5 bg-[#f4f2ea] rounded-sm shadow-sm -rotate-60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#090b10] z-10" />
                  </div>
                </div>
              </div>

              {/* Center Tape Level View / VU Level Bars */}
              <div className="flex-1 mx-2 sm:mx-6 flex flex-col items-center justify-center z-10">
                <div className="w-full max-w-[140px] px-2 py-1 rounded bg-[#090b10]/90 border border-[#2b3342] text-center backdrop-blur-sm">
                  <div className="flex justify-between items-center text-[8px] font-mono text-[#f27d26] mb-1">
                    <span>L</span>
                    <span className="text-[7px] text-stone-400">VU ANALOG</span>
                    <span>R</span>
                  </div>
                  {/* Miniature Stereo VU Needle Indicators */}
                  <div className="space-y-1">
                    <div className="h-1 w-full bg-[#161a22] rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-[#f27d26] to-red-500 transition-all duration-100"
                        style={{ width: `${isPlaying ? vuLeft : 10}%` }}
                      />
                    </div>
                    <div className="h-1 w-full bg-[#161a22] rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-[#f27d26] to-red-500 transition-all duration-100"
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
                  className={`absolute rounded-full bg-gradient-to-br from-[#3b2014] via-[#24130c] to-[#120a06] border border-[#522e1d] shadow-md transition-all duration-700 ${
                    side === 'A' ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-20 h-20 sm:w-22 sm:h-22'
                  }`}
                  style={{
                    backgroundImage: 'radial-gradient(circle, transparent 40%, rgba(20, 10, 5, 0.9) 80%), repeating-radial-gradient(circle, #3d2215 0, #3d2215 1px, #21120a 1.5px, #21120a 2px)',
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
                  <div className="w-6 h-6 rounded-full bg-[#090b10] border border-stone-500 shadow-inner relative flex items-center justify-center">
                    {/* 6 Teeth Protrusions inside the cog */}
                    <div className="absolute w-7 h-1.5 bg-[#f4f2ea] rounded-sm shadow-sm" />
                    <div className="absolute w-7 h-1.5 bg-[#f4f2ea] rounded-sm shadow-sm rotate-60" />
                    <div className="absolute w-7 h-1.5 bg-[#f4f2ea] rounded-sm shadow-sm -rotate-60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#090b10] z-10" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Trapezoid Head Area with Pressure Pad & Guide Rollers */}
            <div className="relative mx-auto w-48 sm:w-64 h-6 bg-[#0a0d12] rounded-t-lg border-t-2 border-x-2 border-[#2b3342] flex items-center justify-between px-3 mt-1 shadow-inner">
              {/* Left Guide Roller Pin */}
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-300 to-amber-700 border border-black shadow-inner" />
              
              {/* Central Magnetic Read Head Pressure Pad Cutout */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded bg-stone-700 border border-black" />
                <div className="w-8 h-2.5 rounded bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 border border-black flex items-center justify-center">
                  <div className="w-3 h-1 bg-stone-900 rounded-[1px]" />
                </div>
                <div className="w-2 h-2 rounded bg-stone-700 border border-black" />
              </div>

              {/* Right Guide Roller Pin */}
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-300 to-amber-700 border border-black shadow-inner" />
            </div>
          </div>
        </div>

        {/* Lower Utility Control Row (Volume Thumbwheel & Pencil Rewinder Tool) */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Left Side: Volume Level Dial */}
          <div className="sm:col-span-4 flex items-center justify-between px-3 py-2 rounded-2xl bg-[#10131a] border border-[#252c3a] shadow-inner">
            <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400 font-bold">
              OUTPUT
            </span>
            
            {/* Tactile Serrated Volume Thumbwheel */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-[#f27d26]" />
              <div className="flex flex-col items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-16 h-1.5 bg-[#1f2532] accent-[#f27d26] rounded-full cursor-pointer"
                  title="Master Volume Dial"
                />
                <span className="font-mono text-[8px] text-stone-400 mt-0.5">VOL {volume}%</span>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Nataraj 2B Pencil Rewind Tool */}
          <button
            id="pencil-rewind-btn"
            onClick={handlePencilRewind}
            className="sm:col-span-8 group relative p-3 rounded-2xl bg-[#0e1117] border border-[#272e3c] hover:border-[#f27d26]/50 transition-all duration-200 flex items-center justify-between text-left shadow-inner"
            title="ক্যাসেটের ফিতা পেঁচিয়ে গেলে নটরাজ পেন্সিল দিয়ে ঘোরান"
          >
            <div className="flex items-center gap-3">
              {/* Realistic Nataraj 2B Hexagonal Pencil Visual */}
              <div
                className="relative w-9 h-9 rounded-full bg-[#151922] border border-[#303848] flex items-center justify-center transition-transform duration-500 shadow-md"
                style={{ transform: `rotate(${pencilAngle}deg)` }}
              >
                {/* Pencil Hexagon Body with Classic Red-Black Stripes */}
                <div className="relative w-7 h-2 rounded-[2px] bg-gradient-to-r from-red-600 via-black to-red-600 flex items-center justify-between px-0.5 shadow-sm">
                  {/* Silver Ferrule & Pink Eraser on left */}
                  <div className="w-1.5 h-2 bg-stone-300 border-r border-stone-500" />
                  {/* Sharpened Wood & Graphite Tip on right */}
                  <div className="w-1.5 h-2 bg-amber-200 border-l border-stone-900" />
                </div>
              </div>

              <div>
                <p className="text-xs font-bn-sans font-bold text-stone-200 flex items-center gap-1.5">
                  নটরাজ পেন্সিল দিয়ে ফিতা ঘোরান
                  <span className="px-1.5 py-0.2 bg-[#f27d26]/20 border border-[#f27d26]/40 text-[#f27d26] text-[9px] font-mono rounded">
                    2B
                  </span>
                </p>
                <p className="text-[10px] text-stone-400 font-mono">Interactive Pencil Spool Rewinder</p>
              </div>
            </div>

            <RotateCw className={`w-4 h-4 text-[#f27d26] ${isRewinding ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          </button>
        </div>

        {/* Physical 3D Tactile Mechanical Button Rail */}
        <div className="mt-4 pt-3.5 border-t border-[#2d3442] flex flex-wrap items-center justify-between gap-2.5">
          
          {/* Side A/B Flip Mechanical Switch Button */}
          <button
            id="cassette-flip-btn"
            onClick={handleFlipSide}
            className="walkman-btn px-4 py-2 rounded-xl text-stone-200 text-xs font-mono font-bold flex items-center gap-2 border border-[#3a4354] active:scale-95 transition-transform"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#f27d26]" />
            <span>DIR / FLIP ({side === 'A' ? 'SIDE B' : 'SIDE A'})</span>
          </button>

          {/* Transport Mechanical Key Deck */}
          <div className="flex items-center gap-2">
            {/* REWIND Button */}
            <button
              id="cassette-prev-btn"
              onClick={handlePrev}
              className="walkman-btn p-2.5 sm:px-3 sm:py-2.5 rounded-xl text-stone-300 hover:text-white border border-[#3a4354] flex items-center gap-1.5 text-xs font-mono active:scale-95"
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
              className={`walkman-btn-orange px-6 py-2.5 rounded-xl text-[#0c0e14] font-black text-xs font-mono uppercase tracking-wider flex items-center gap-2 border border-[#f59e0b] shadow-lg transition-transform ${
                isPlaying ? 'walkman-btn-orange-pressed' : ''
              } active:scale-95`}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-[#0c0e14]" />
              ) : (
                <Play className="w-4 h-4 fill-[#0c0e14]" />
              )}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            {/* FAST FORWARD Button */}
            <button
              id="cassette-next-btn"
              onClick={handleNext}
              className="walkman-btn p-2.5 sm:px-3 sm:py-2.5 rounded-xl text-stone-300 hover:text-white border border-[#3a4354] flex items-center gap-1.5 text-xs font-mono active:scale-95"
              title="Fast Forward / Next Track in YouTube Playlist"
            >
              <span className="hidden sm:inline text-[10px]">FF</span>
              <FastForward className="w-4 h-4 fill-stone-400" />
            </button>
          </div>
        </div>

        {/* Real-time Status Notice */}
        <div className="mt-3 text-center">
          <span className="text-[10px] font-mono text-[#f27d26]/80 tracking-wider">
            {statusMessage}
          </span>
        </div>

      </div>
    </div>
  );
};
