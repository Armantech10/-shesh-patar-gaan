import React, { useState } from 'react';
import { Radio, Share2, Check, BarChart2, Sparkles, Activity } from 'lucide-react';
import { useLiveListener } from '../context/LiveListenerContext';
import { useYouTubeMusic } from '../context/YouTubeMusicContext';

export const LiveStationBar: React.FC = () => {
  const { stats, isConnected, isConfigured, emotionalMessage, hasCopiedLink, shareWebsite, sessionId } = useLiveListener();
  const { currentTrack, isPlaying } = useYouTubeMusic();
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Bengali numerals converter for authentic aesthetic
  const toBengaliNumber = (num: number): string => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num)
      .split('')
      .map((d) => (bengaliDigits[parseInt(d, 10)] !== undefined ? bengaliDigits[parseInt(d, 10)] : d))
      .join('');
  };

  return (
    <section aria-label="Realtime Live Listener Station" className="relative z-20 max-w-5xl mx-auto px-4 sm:px-8 my-4 select-none">
      {/* Old Radio / Transmission Indicator Enclosure */}
      <div className="rounded-2xl p-3 sm:p-4 bg-[#0E1118] border border-[#232936] shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Radio Frequency & Real-time Live Listener Indicator */}
        <div className="flex items-center gap-3">
          {/* Live Indicator Stamped Box */}
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#151922] border border-[#283040] shadow-inner">
            <span className="relative flex h-2.5 w-2.5">
              {isConfigured && isConnected && stats.activeListeners > 0 && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  !isConfigured
                    ? 'bg-amber-600/70'
                    : isConnected && stats.activeListeners > 0
                    ? 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                    : 'bg-emerald-500'
                }`}
              />
            </span>
            <span className="font-mono font-bold text-[10px] tracking-widest text-[#E5DCD2] uppercase">
              LIVE BROADCAST
            </span>
          </div>

          {/* Active Listeners Count Display */}
          <div className="flex items-center gap-2">
            <div className="text-xs sm:text-sm font-bn-sans text-[#E2DAD1] font-bold flex items-center gap-1.5">
              {isConfigured ? (
                <>
                  <span className="font-mono text-sm sm:text-base font-black text-[#E87B28]">
                    {toBengaliNumber(stats.activeListeners)}
                  </span>
                  <span>জন শ্রোতা সরাসরি শুনছেন</span>
                </>
              ) : (
                <span className="text-[11px] font-mono text-[#8A847C]">
                  LIVE STATUS: অপেক্ষমান (Config Pending)
                </span>
              )}
            </div>

            {/* Radio Frequency Equalizer Bars */}
            <div className="hidden sm:flex items-center gap-0.5 h-3.5 px-1.5 bg-[#12151D] rounded border border-[#1E2430]">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 bg-[#E87B28] rounded-full transition-all duration-200"
                  style={{
                    height: stats.activeListeners > 0 ? `${(i % 3 + 1) * 3 + Math.random() * 4}px` : '3px',
                    opacity: stats.activeListeners > 0 ? 0.9 : 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center: Dynamic Contextual Bengali Message */}
        <div className="hidden md:flex items-center gap-2 text-xs font-bn-sans italic text-[#B5AEA5]">
          <Sparkles className="w-3.5 h-3.5 text-[#E87B28]" />
          <span>{emotionalMessage}</span>
        </div>

        {/* Right: Actions (Live Archive Modal + Web Share) */}
        <div className="flex items-center gap-2">
          {/* Creator Live Archive Summary Trigger */}
          <button
            id="station-live-stats-btn"
            onClick={() => setShowAdminModal(true)}
            className="px-3 py-1.5 rounded-xl bg-[#141822] border border-[#262E3D] text-xs font-bn-sans text-[#D4CCC1] hover:text-white hover:border-[#E87B28]/60 transition-all flex items-center gap-1.5"
            title="লাইভ স্টেশন ও আর্কাইভ পরিসংখ্যান"
          >
            <BarChart2 className="w-3.5 h-3.5 text-[#E87B28]" />
            <span className="hidden sm:inline">লাইভ আর্কাইভ</span>
          </button>

          {/* Web Share Button */}
          <button
            id="share-btn"
            onClick={shareWebsite}
            className="px-3 py-1.5 rounded-xl bg-[#E87B28] hover:bg-[#FF9D42] text-[#0A0C10] text-xs font-bn-sans font-bold transition-transform active:scale-95 flex items-center gap-1.5 shadow-md shadow-[#E87B28]/20"
            title="বন্ধুদের সাথে শেয়ার করুন"
          >
            {hasCopiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>কপি হয়েছে</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>শেয়ার</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Copied Link Toast message */}
      {hasCopiedLink && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 rounded-xl bg-[#141822] border border-[#E87B28] text-xs font-bn-sans text-[#E2DAD1] shadow-2xl z-30 animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4 text-[#E87B28]" />
          <span>“লিংক কপি হয়েছে। কাউকে পাঠিয়ে দাও।”</span>
        </div>
      )}

      {/* Live Archive & Creator View Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#10131B] border-2 border-[#262E3D] p-6 shadow-2xl text-[#E2DAD1]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#232936] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <div>
                  <h3 className="font-bold font-bn-serif text-lg text-[#F0E8DF]">
                    লাইভ স্টেশন ও আর্কাইভ পরিসংখ্যান
                  </h3>
                  <p className="font-mono text-[10px] text-[#A59E95] uppercase tracking-wider">
                    REAL-TIME LISTENER & BROADCAST ARCHIVES
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="p-1 rounded-lg text-[#8A847C] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Currently Playing Real YouTube Track */}
            <div className="p-4 rounded-xl bg-[#090B10] border border-[#232936] mb-4">
              <span className="text-[10px] font-mono text-[#E87B28] uppercase tracking-wider block font-bold mb-1">
                এখন বাজছে (CURRENTLY PLAYING)
              </span>
              {stats.activeListeners > 0 || isPlaying ? (
                <div>
                  <h4 className="font-bold font-bn-serif text-base text-[#F0E8DF]">
                    {currentTrack.title}
                  </h4>
                  <p className="text-xs font-bn-sans text-[#A59E95] mt-0.5">
                    {currentTrack.artist}
                  </p>
                </div>
              ) : (
                <p className="text-sm font-bn-sans text-[#8A847C] italic">
                  এখন কেউ শুনছে না
                </p>
              )}
            </div>

            {/* Real Statistics 3-Box Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* Box 1: Current Listeners */}
              <div className="p-3 rounded-xl bg-[#090B10] border border-[#232936] text-center">
                <span className="text-[10px] font-mono text-[#8A847C] uppercase block mb-1">
                  এখন শুনছে
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black text-[#E87B28]">
                  {toBengaliNumber(stats.activeListeners)}
                </span>
                <span className="text-[10px] font-bn-sans text-[#6E6860] block mt-0.5">শ্রোতা</span>
              </div>

              {/* Box 2: Peak Concurrent */}
              <div className="p-3 rounded-xl bg-[#090B10] border border-[#232936] text-center">
                <span className="text-[10px] font-mono text-[#8A847C] uppercase block mb-1">
                  সর্বোচ্চ একসাথে
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-400">
                  {toBengaliNumber(stats.peakConcurrent)}
                </span>
                <span className="text-[10px] font-bn-sans text-[#6E6860] block mt-0.5">সর্বোচ্চ পিক</span>
              </div>

              {/* Box 3: Total Plays Today */}
              <div className="p-3 rounded-xl bg-[#090B10] border border-[#232936] text-center">
                <span className="text-[10px] font-mono text-[#8A847C] uppercase block mb-1">
                  আজকের মোট প্লে
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black text-emerald-400">
                  {toBengaliNumber(stats.todayTotalPlays)}
                </span>
                <span className="text-[10px] font-bn-sans text-[#6E6860] block mt-0.5">প্লে ইভেন্ট</span>
              </div>
            </div>

            {/* Most Played Track Today */}
            <div className="p-3.5 rounded-xl bg-[#090B10] border border-[#232936] mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-[#8A847C] uppercase">
                  আজ সবচেয়ে বেশি বাজানো (TOP TRACK TODAY)
                </span>
                {stats.mostPlayedTrackPlayCount > 0 && (
                  <span className="text-[10px] font-mono text-[#E87B28]">
                    {toBengaliNumber(stats.mostPlayedTrackPlayCount)} বার বাজানো হয়েছে
                  </span>
                )}
              </div>
              <p className="font-bold font-bn-serif text-sm text-[#F0E8DF]">
                {stats.mostPlayedTrackTitle || 'আজকের প্রথম গানটি বাজান'}
              </p>
            </div>

            {/* Anonymous Session Token & Firebase Connection Status */}
            <div className="p-3 rounded-xl bg-[#141822] border border-[#232936] text-[10px] font-mono space-y-1">
              <div className="flex items-center justify-between text-[#8A847C]">
                <span>DATABASE STATUS:</span>
                <span className={isConnected ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {isConnected ? 'FIREBASE CONNECTED (.info/connected)' : isConfigured ? 'CONNECTING...' : 'PENDING CONFIGURATION'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#8A847C]">
                <span>ANONYMOUS SESSION:</span>
                <span className="text-[#D4CCC1] truncate max-w-[200px]">{sessionId}</span>
              </div>
              <div className="flex items-center justify-between text-[#8A847C]">
                <span>PRIVACY POLICY:</span>
                <span>NO PII / ZERO COOKIE TRACKING</span>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-5 text-right">
              <button
                onClick={() => setShowAdminModal(false)}
                className="px-5 py-2 rounded-xl bg-[#E87B28] hover:bg-[#FF9D42] text-[#0A0C10] text-xs font-bn-sans font-bold transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

