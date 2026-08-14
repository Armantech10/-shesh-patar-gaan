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
      {/* Hidden container where the REAL YouTube Iframe API player attaches - DO NOT REMOVE */}
      <div
        className={`fixed z-30 transition-all duration-300 ${
          showVideo
            ? 'bottom-24 right-4 sm:right-8 w-72 sm:w-80 h-44 rounded-2xl overflow-hidden border border-[#262D3A] shadow-2xl bg-black opacity-100 pointer-events-auto'
            : 'top-0 left-0 w-1 h-1 opacity-0 pointer-events-none -z-50 overflow-hidden'
        }`}
      >
        <div id="real-youtube-iframe-player" className="w-full h-full" />
      </div>

      {/* Archival Now Playing Bar (Fixed Bottom Player Deck) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-2 sm:p-4 pointer-events-none">
        <div className="max-w-5xl mx-auto rounded-2xl backdrop-blur-md bg-[#0A0C10]/90 border border-[#232936] p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.95)] pointer-events-auto">
          
          {/* Progress Bar (Full Width Top Scrubber linked to REAL YouTube audio) */}
          <div className="relative -mt-1 mb-2.5 group">
            <div className="flex justify-between items-end mb-1 text-[10px] font-mono text-[#9A938A]">
              <span>{formatTime(currentTrack.currentTime)}</span>
              <span>
                {currentTrack.duration > 0 ? formatTime(currentTrack.duration) : statusMessage}
              </span>
            </div>
            <div className="relative w-full h-1.5 bg-[#171B24] rounded-full overflow-hidden border border-[#252B38]">
              <div
                className="h-full bg-gradient-to-r from-[#E87B28] to-[#FF9D42] transition-all duration-150"
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

          <div className="flex items-center justify-between gap-2 sm:gap-5">
            
            {/* Left: Track Info & Thumbnail from REAL YouTube Playlist item */}
            <div className="flex items-center gap-3 min-w-0 max-w-[48%] sm:max-w-[40%]">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-[#141720] border border-[#262D3A] flex-shrink-0 flex items-center justify-center shadow-md">
                {currentTrack.videoId ? (
                  <img
                    src={`https://img.youtube.com/vi/${currentTrack.videoId}/hqdefault.jpg`}
                    alt={currentTrack.title}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover ${isPlaying ? 'scale-105 transition-transform duration-700' : ''}`}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Disc className={`w-5 h-5 text-[#E87B28] ${isPlaying ? 'animate-spin-slow' : ''}`} />
                )}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-2 h-2 rounded-full bg-[#0A0C10] border border-[#E87B28]" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-bold font-bn-serif text-[#F0E8DF] truncate leading-tight">
                    {currentTrack.title}
                  </h4>
                  <button
                    onClick={() => {
                      audioSynth.playNostalgiaChime();
                      setIsLiked(!isLiked);
                    }}
                    className="flex-shrink-0 text-[#8A847C] hover:text-[#E87B28] transition-colors"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#E87B28] text-[#E87B28]' : ''}`} />
                  </button>
                </div>
                <p className="text-[11px] text-[#A59E95] font-bn-sans truncate mt-0.5">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Center: Main Transport Controls */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* Shuffle */}
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`p-1.5 rounded-lg hidden sm:block transition-colors ${
                    isShuffle ? 'text-[#E87B28] bg-[#E87B28]/15 border border-[#E87B28]/30' : 'text-[#8A847C] hover:text-[#E2DAD1]'
                  }`}
                  title="শাফল"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                </button>

                {/* Previous Track */}
                <button
                  id="music-prev-btn"
                  onClick={() => {
                    audioSynth.playCassetteClick('press');
                    playPrev();
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#282F3E] bg-[#12151D] flex items-center justify-center text-[#D4CCC1] hover:text-white hover:border-[#E87B28]/50 transition-all active:scale-95"
                  title="পূর্ববর্তী গান"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                {/* Play / Pause Primary Button connected to real YouTube player */}
                <button
                  id="music-play-pause-btn"
                  onClick={() => {
                    audioSynth.playCassetteClick('press');
                    togglePlay();
                  }}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#E87B28] hover:bg-[#FF9D42] text-[#0A0C10] flex items-center justify-center shadow-lg shadow-[#E87B28]/25 transition-transform active:scale-95"
                  title={isPlaying ? 'বিরতি (Pause)' : 'চালান (Play)'}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5 fill-[#0A0C10]" />
                  ) : (
                    <Play className="w-5 h-5 fill-[#0A0C10] translate-x-0.5" />
                  )}
                </button>

                {/* Next Track */}
                <button
                  id="music-next-btn"
                  onClick={() => {
                    audioSynth.playCassetteClick('press');
                    playNext();
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#282F3E] bg-[#12151D] flex items-center justify-center text-[#D4CCC1] hover:text-white hover:border-[#E87B28]/50 transition-all active:scale-95"
                  title="পরবর্তী গান"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                {/* Video toggle button */}
                <button
                  onClick={() => setShowVideo(!showVideo)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    showVideo ? 'text-[#E87B28] bg-[#E87B28]/15 border border-[#E87B28]/30' : 'text-[#8A847C] hover:text-[#E2DAD1]'
                  }`}
                  title={showVideo ? 'ভিডিও লুকান' : 'ইউটিউব ভিডিও দেখুন'}
                >
                  {showVideo ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Real-time Visualizer Waves Bar */}
              <div className="flex items-center gap-0.5 h-2">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#E87B28] rounded-full transition-all duration-150"
                    style={{
                      height: isPlaying ? `${Math.random() * 7 + 2}px` : '2px',
                      opacity: isPlaying ? 0.9 : 0.2,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right: Drawer Actions (Playlist, Lyrics, Volume) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              
              {/* Lyrics Toggle */}
              <button
                id="lyrics-btn"
                onClick={() => setShowLyrics(!showLyrics)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bn-sans flex items-center gap-1.5 transition-all ${
                  showLyrics
                    ? 'bg-[#E87B28]/20 border-[#E87B28] text-[#F0E8DF]'
                    : 'bg-[#12151D] border-[#252B38] text-[#A59E95] hover:text-[#F0E8DF]'
                }`}
                title="গানের লিরিক্স"
              >
                <FileText className="w-3.5 h-3.5 text-[#E87B28]" />
                <span className="hidden md:inline">লিরিক্স</span>
              </button>

              {/* Playlist Drawer Toggle */}
              <button
                id="playlist-btn"
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bn-sans flex items-center gap-1.5 transition-all ${
                  showPlaylist
                    ? 'bg-[#E87B28]/20 border-[#E87B28] text-[#F0E8DF]'
                    : 'bg-[#12151D] border-[#252B38] text-[#A59E95] hover:text-[#F0E8DF]'
                }`}
                title="প্লেলিস্ট (Playlist)"
              >
                <ListMusic className="w-3.5 h-3.5 text-[#E87B28]" />
                <span className="hidden md:inline">প্লেলিস্ট</span>
              </button>

              {/* Volume Slider (Desktop) */}
              <div className="hidden lg:flex items-center gap-2 bg-[#090B10] px-2.5 py-1 rounded-lg border border-[#232936]">
                <button onClick={toggleMute} className="text-[#8A847C] hover:text-[#E2DAD1]">
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#E87B28]" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-14 h-1 bg-[#171B24] rounded-lg appearance-none cursor-pointer accent-[#E87B28]"
                />
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Playlist Drawer Popup */}
      {showPlaylist && (
        <div className="fixed bottom-24 right-4 sm:right-8 z-40 w-80 sm:w-96 max-h-[440px] p-5 rounded-2xl bg-[#10131B] border border-[#262E3D] shadow-2xl overflow-hidden flex flex-col animate-fade-in text-[#E2DAD1]">
          <div className="flex items-center justify-between pb-3 border-b border-[#232936] mb-3">
            <div className="flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-[#E87B28]" />
              <h4 className="font-bold font-bn-serif text-[#F0E8DF] text-sm">
                ইউটিউব প্লেলিস্ট ({currentTrack.playlistIndex + 1}/{currentTrack.totalTracks})
              </h4>
            </div>
            <button
              onClick={() => setShowPlaylist(false)}
              className="p-1 rounded-lg text-[#8A847C] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            <div className="p-3 rounded-xl bg-[#08090E] border border-[#E87B28]/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#E87B28] uppercase tracking-wider font-bold">
                  NOW PLAYING FROM YOUTUBE
                </span>
                <span className="w-2 h-2 rounded-full bg-[#E87B28] animate-pulse" />
              </div>
              <h5 className="font-bold font-bn-serif text-sm text-[#F0E8DF]">
                {currentTrack.title}
              </h5>
              <p className="text-xs text-[#A59E95] font-bn-sans">
                {currentTrack.artist}
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8A847C] pt-1 border-t border-white/5">
                <span>সময়: {formatTime(currentTrack.currentTime)}</span>
                <span>মোট: {formatTime(currentTrack.duration)}</span>
              </div>
            </div>

            {playlist.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <p className="text-[10px] font-mono text-[#8A847C] uppercase tracking-wider">
                  প্লেলিস্ট ট্র্যাকসমূহ ({playlist.length} টি গান):
                </p>
                {playlist.map((item, idx) => (
                  <button
                    key={item || idx}
                    onClick={() => playTrackByIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs font-bn-sans flex items-center justify-between transition-all ${
                      idx === currentTrack.playlistIndex
                        ? 'bg-[#E87B28]/20 border-[#E87B28] text-[#F0E8DF] font-bold'
                        : 'bg-[#08090E] border-[#232936] text-[#B5AEA5] hover:bg-[#141822]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] opacity-40 w-4">{idx + 1}</span>
                      <span className="truncate">{idx === currentTrack.playlistIndex ? currentTrack.title : `গান #${idx + 1}`}</span>
                    </div>
                    {idx === currentTrack.playlistIndex && isPlaying && (
                      <Disc className="w-3.5 h-3.5 text-[#E87B28] animate-spin-slow flex-shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 mt-2 border-t border-[#232936] text-[10px] font-mono text-[#8A847C] text-center uppercase tracking-wider">
            Official YouTube IFrame Player Active
          </div>
        </div>
      )}

      {/* Lyrics Drawer Popup */}
      {showLyrics && (
        <div className="fixed bottom-24 left-4 sm:left-8 z-40 w-80 sm:w-96 max-h-[440px] p-5 rounded-2xl vintage-paper text-stone-900 shadow-2xl border-2 border-amber-900/30 overflow-hidden flex flex-col animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b-2 border-stone-300 mb-3">
            <div>
              <span className="font-mono text-[10px] text-amber-900 uppercase tracking-widest block font-bold">
                LYRICS ARCHIVE
              </span>
              <h4 className="font-bold font-bn-serif text-stone-900 text-sm truncate max-w-[200px]">
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

          <div className="flex-1 overflow-y-auto space-y-3 notebook-ruled font-handwriting text-base text-[#1e293b] pr-1 py-3 text-center">
            <p className="text-stone-800 font-bn-sans text-sm">
              ইউটিউব প্লেলিস্টের বর্তমান গান: <strong>{currentTrack.title}</strong>
            </p>
            <p className="italic text-amber-950 text-xs font-mono mt-4">
              [ইউটিউব প্লেয়ারের অডিও লাইভ শুনুন]
            </p>
          </div>

          <div className="pt-2 border-t border-stone-300 text-center font-handwriting text-xs text-amber-900">
            “কিছু গান শেষ হয় না...”
          </div>
        </div>
      )}
    </>
  );
};

