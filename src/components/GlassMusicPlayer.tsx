import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
  FileText,
  Video,
  VideoOff,
  Disc,
  Heart,
  Shuffle,
  X,
  Loader2
} from 'lucide-react';
import { useYouTubeMusic } from '../context/YouTubeMusicContext';
import { audioSynth } from '../utils/audioSynth';

export const GlassMusicPlayer: React.FC = () => {
  const {
    isPlaying,
    isLoading,
    statusMessage,
    currentTrack,
    volume,
    isMuted,
    playlist,
    togglePlay,
    playNext,
    playPrev,
    playTrackByIndex,
    seekTo,
    setVolume,
    toggleMute,
  } = useYouTubeMusic();

  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  // Handle Seek scrubber
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (currentTrack.duration > 0) {
      const newTime = (newProgress / 100) * currentTrack.duration;
      seekTo(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    setVolume(v);
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs) || secs <= 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      {/* Hidden container where the REAL YouTube Iframe API player attaches */}
      <div
        className={`fixed z-30 transition-all duration-300 ${
          showVideo
            ? 'bottom-28 right-4 sm:right-10 w-72 sm:w-80 h-44 rounded-2xl overflow-hidden border border-[#303642] shadow-2xl bg-black opacity-100 pointer-events-auto'
            : 'top-0 left-0 w-1 h-1 opacity-0 pointer-events-none -z-50 overflow-hidden'
        }`}
      >
        <div id="real-youtube-iframe-player" className="w-full h-full" />
      </div>

      {/* Floating Glassmorphic Player Bar (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-5 pointer-events-none">
        <div className="max-w-5xl mx-auto rounded-2xl backdrop-blur-xl bg-[#0C0E14]/85 bg-white/5 border border-white/10 p-4 sm:p-5 shadow-2xl pointer-events-auto">
          
          {/* Progress Bar (Full Width Top Scrubber linked to REAL YouTube audio) */}
          <div className="relative -mt-1 mb-3 group">
            <div className="flex justify-between items-end mb-1.5 text-[10px] font-mono opacity-60 text-[#E0D8D0]">
              <span className="font-mono">{formatTime(currentTrack.currentTime)}</span>
              <span className="font-mono">
                {currentTrack.duration > 0 ? formatTime(currentTrack.duration) : statusMessage}
              </span>
            </div>
            <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F27D26] to-[#FFB074] transition-all duration-150"
                style={{ width: `${currentTrack.progress}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={currentTrack.progress || 0}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between gap-3 sm:gap-6">
            
            {/* Left: Track Info & Album Art from REAL YouTube Playlist item */}
            <div className="flex items-center gap-3.5 min-w-0 max-w-[45%] sm:max-w-[38%]">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-[#F27D26]/20 border border-[#F27D26]/30 flex-shrink-0 flex items-center justify-center shadow-md">
                {currentTrack.videoId ? (
                  <img
                    src={`https://img.youtube.com/vi/${currentTrack.videoId}/hqdefault.jpg`}
                    alt={currentTrack.title}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover ${isPlaying ? 'scale-105 transition-transform duration-700' : ''}`}
                    onError={(e) => {
                      // Fallback icon if thumbnail fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Disc className={`w-6 h-6 text-[#F27D26] ${isPlaying ? 'animate-spin-slow' : ''}`} />
                )}
                {/* Center Accent */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0C0E14] border border-[#F27D26]" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm sm:text-base font-bold font-bn-serif text-[#E0D8D0] truncate leading-tight">
                    {currentTrack.title}
                  </h4>
                  <button
                    onClick={() => {
                      audioSynth.playNostalgiaChime();
                      setIsLiked(!isLiked);
                    }}
                    className="flex-shrink-0 text-[#E0D8D0]/40 hover:text-[#F27D26] transition-colors"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#F27D26] text-[#F27D26]' : ''}`} />
                  </button>
                </div>
                <p className="text-xs text-[#E0D8D0]/60 font-bn-sans truncate mt-0.5">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Center: Main Player Transport Controls */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2 sm:gap-4">
                
                {/* Shuffle */}
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`p-1.5 rounded-full hidden sm:block transition-colors ${
                    isShuffle ? 'text-[#F27D26] bg-[#F27D26]/20' : 'text-[#E0D8D0]/40 hover:text-[#E0D8D0]'
                  }`}
                  title="শাফল"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                </button>

                {/* Previous Track in Real YouTube Playlist */}
                <button
                  id="music-prev-btn"
                  onClick={() => {
                    audioSynth.playCassetteClick('press');
                    playPrev();
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 text-[#E0D8D0]/70 hover:text-white transition-all active:scale-95"
                  title="পূর্ববর্তী গান"
                >
                  <SkipBack className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>

                {/* Play / Pause Primary Button connected to real YouTube player */}
                <button
                  id="music-play-pause-btn"
                  onClick={() => {
                    audioSynth.playCassetteClick('press');
                    togglePlay();
                  }}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#F27D26] hover:bg-[#FFB074] text-[#0C0E14] flex items-center justify-center shadow-lg shadow-[#F27D26]/25 transition-transform active:scale-90"
                  title={isPlaying ? 'বিরতি (Pause)' : 'চালান (Play)'}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5 fill-[#0C0E14]" />
                  ) : (
                    <Play className="w-5 h-5 fill-[#0C0E14] translate-x-0.5" />
                  )}
                </button>

                {/* Next Track in Real YouTube Playlist */}
                <button
                  id="music-next-btn"
                  onClick={() => {
                    audioSynth.playCassetteClick('press');
                    playNext();
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 text-[#E0D8D0]/70 hover:text-white transition-all active:scale-95"
                  title="পরবর্তী গান"
                >
                  <SkipForward className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>

                {/* Video toggle button */}
                <button
                  onClick={() => setShowVideo(!showVideo)}
                  className={`p-1.5 rounded-full transition-colors ${
                    showVideo ? 'text-[#F27D26] bg-[#F27D26]/20' : 'text-[#E0D8D0]/40 hover:text-[#E0D8D0]'
                  }`}
                  title={showVideo ? 'ভিডিও লুকান' : 'ইউটিউব ভিডিও দেখুন'}
                >
                  {showVideo ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Real-time Visualizer Waves Bar */}
              <div className="flex items-center gap-0.5 h-2">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#F27D26] rounded-full transition-all duration-150"
                    style={{
                      height: isPlaying ? `${Math.random() * 8 + 2}px` : '2px',
                      opacity: isPlaying ? 0.9 : 0.2,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right: Drawer Actions (Playlist, Lyrics, Volume) */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              
              {/* Lyrics Toggle */}
              <button
                id="lyrics-btn"
                onClick={() => setShowLyrics(!showLyrics)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bn-sans flex items-center gap-1.5 transition-all ${
                  showLyrics
                    ? 'bg-[#F27D26]/20 border-[#F27D26] text-[#E0D8D0]'
                    : 'bg-[#1A1D23] border-[#303642] text-[#E0D8D0]/60 hover:text-[#E0D8D0] hover:border-[#303642]/90'
                }`}
                title="গানের লিরিক্স"
              >
                <FileText className="w-3.5 h-3.5 text-[#F27D26]" />
                <span className="hidden md:inline">লিরিক্স</span>
              </button>

              {/* Playlist Drawer Toggle */}
              <button
                id="playlist-btn"
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bn-sans flex items-center gap-1.5 transition-all ${
                  showPlaylist
                    ? 'bg-[#F27D26]/20 border-[#F27D26] text-[#E0D8D0]'
                    : 'bg-[#1A1D23] border-[#303642] text-[#E0D8D0]/60 hover:text-[#E0D8D0] hover:border-[#303642]/90'
                }`}
                title="প্লেলিস্ট (Playlist)"
              >
                <ListMusic className="w-3.5 h-3.5 text-[#F27D26]" />
                <span className="hidden md:inline">প্লেলিস্ট</span>
              </button>

              {/* Volume Slider (Desktop) */}
              <div className="hidden lg:flex items-center gap-2 bg-[#0C0E14] px-3 py-1.5 rounded-xl border border-[#303642]">
                <button onClick={toggleMute} className="text-[#E0D8D0]/50 hover:text-[#E0D8D0]">
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#F27D26]" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-[#1A1D23] rounded-lg appearance-none cursor-pointer accent-[#F27D26]"
                />
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Playlist Drawer Popup showing real playlist status */}
      {showPlaylist && (
        <div className="fixed bottom-28 right-4 sm:right-10 z-40 w-80 sm:w-96 max-h-[460px] p-5 rounded-2xl bg-[#1A1D23] border border-[#303642] shadow-2xl overflow-hidden flex flex-col animate-fade-in text-[#E0D8D0]">
          <div className="flex items-center justify-between pb-3 border-b border-[#303642] mb-3">
            <div className="flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-[#F27D26]" />
              <h4 className="font-bold font-bn-serif text-[#E0D8D0] text-sm">
                ইউটিউব প্লেলিস্ট ({currentTrack.playlistIndex + 1}/{currentTrack.totalTracks})
              </h4>
            </div>
            <button
              onClick={() => setShowPlaylist(false)}
              className="p-1 rounded-lg text-[#E0D8D0]/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            <div className="p-3.5 rounded-xl bg-[#0C0E14] border border-[#F27D26]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#F27D26] uppercase tracking-wider font-bold">
                  NOW PLAYING FROM YOUTUBE
                </span>
                <span className="w-2 h-2 rounded-full bg-[#F27D26] animate-pulse" />
              </div>
              <h5 className="font-bold font-bn-serif text-sm text-[#E0D8D0]">
                {currentTrack.title}
              </h5>
              <p className="text-xs text-[#E0D8D0]/60 font-bn-sans">
                {currentTrack.artist}
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#E0D8D0]/40 pt-1 border-t border-white/5">
                <span>সময়: {formatTime(currentTrack.currentTime)}</span>
                <span>মোট: {formatTime(currentTrack.duration)}</span>
              </div>
            </div>

            {playlist.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <p className="text-[11px] font-mono text-[#E0D8D0]/50 uppercase tracking-wider">
                  প্লেলিস্ট ট্র্যাকসমূহ ({playlist.length} টি গান):
                </p>
                {playlist.map((item, idx) => (
                  <button
                    key={item || idx}
                    onClick={() => playTrackByIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs font-bn-sans flex items-center justify-between transition-all ${
                      idx === currentTrack.playlistIndex
                        ? 'bg-[#F27D26]/20 border-[#F27D26] text-[#E0D8D0] font-bold'
                        : 'bg-[#0C0E14] border-[#303642] text-[#E0D8D0]/70 hover:bg-[#252A35]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] opacity-40 w-4">{idx + 1}</span>
                      <span className="truncate">{idx === currentTrack.playlistIndex ? currentTrack.title : `গান #${idx + 1}`}</span>
                    </div>
                    {idx === currentTrack.playlistIndex && isPlaying && (
                      <Disc className="w-3.5 h-3.5 text-[#F27D26] animate-spin-slow flex-shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 mt-2 border-t border-[#303642] text-[10px] font-mono text-[#E0D8D0]/40 text-center uppercase tracking-wider">
            Official YouTube IFrame Player Active
          </div>
        </div>
      )}

      {/* Lyrics Drawer Popup */}
      {showLyrics && (
        <div className="fixed bottom-28 left-4 sm:left-10 z-40 w-80 sm:w-96 max-h-[460px] p-6 rounded-2xl vintage-paper text-stone-900 shadow-2xl border-2 border-amber-900/30 overflow-hidden flex flex-col animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b-2 border-stone-300 mb-3">
            <div>
              <span className="font-mono text-[10px] text-amber-900 uppercase tracking-widest block font-bold">
                LYRICS ARCHIVE
              </span>
              <h4 className="font-bold font-bn-serif text-stone-900 text-base truncate max-w-[200px]">
                {currentTrack.title}
              </h4>
            </div>
            <button
              onClick={() => setShowLyrics(false)}
              className="p-1 rounded-lg text-stone-600 hover:text-stone-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 notebook-ruled font-handwriting text-base text-[#1e293b] pr-1 py-4 text-center">
            <p className="text-stone-700 font-bn-sans text-sm">
              ইউটিউব প্লেলিস্টের বর্তমান গান: <strong>{currentTrack.title}</strong>
            </p>
            <p className="italic text-amber-900 text-xs font-mono mt-4">
              [ইউটিউব প্লেয়ারের অডিও লাইভ শুনুন]
            </p>
          </div>

          <div className="pt-3 border-t border-stone-300 text-center font-handwriting text-xs text-amber-900">
            “কিছু গান শেষ হয় না...”
          </div>
        </div>
      )}
    </>
  );
};
