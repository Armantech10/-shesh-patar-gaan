import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { YOUTUBE_PLAYLIST_ID } from '../data/nostalgiaData';

export interface YouTubeTrackInfo {
  title: string;
  artist: string;
  duration: number;
  currentTime: number;
  progress: number;
  videoUrl?: string;
  videoId?: string;
  playlistIndex: number;
  totalTracks: number;
  playlistTitles?: string[];
}

interface YouTubeMusicContextType {
  isPlaying: boolean;
  isReady: boolean;
  isLoading: boolean;
  statusMessage: string;
  currentTrack: YouTubeTrackInfo;
  volume: number;
  isMuted: boolean;
  playlist: string[];
  playTrackByIndex: (index: number) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
}

const YouTubeMusicContext = createContext<YouTubeMusicContextType | null>(null);

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const YouTubeMusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('গান লোড হচ্ছে…');
  const [volume, setVolumeState] = useState(85);
  const [isMuted, setIsMuted] = useState(false);
  const [playlist, setPlaylist] = useState<string[]>([]);
  
  const [currentTrack, setCurrentTrack] = useState<YouTubeTrackInfo>({
    title: 'ইউটিউব প্লেলিস্ট (গান লোড হচ্ছে…)',
    artist: 'শেষ পাতার গান',
    duration: 0,
    currentTime: 0,
    progress: 0,
    playlistIndex: 0,
    totalTracks: 1,
  });

  const playerRef = useRef<any>(null);
  const isPlayingRef = useRef<boolean>(false);
  isPlayingRef.current = isPlaying;

  // Initialize YouTube IFrame API
  useEffect(() => {
    // Inject YouTube API script if not loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initYT = () => {
      if (!window.YT || !window.YT.Player) return;

      try {
        playerRef.current = new window.YT.Player('real-youtube-iframe-player', {
          height: '100%',
          width: '100%',
          playerVars: {
            listType: 'playlist',
            list: YOUTUBE_PLAYLIST_ID,
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            origin: window.location.origin,
            enablejsapi: 1,
            playsinline: 1,
          },
          events: {
            onReady: (event: any) => {
              setIsReady(true);
              setIsLoading(false);
              setStatusMessage('গান শুনতে PLAY চাপুন');
              try {
                event.target.setVolume(volume);
                const pl = event.target.getPlaylist();
                if (pl && Array.isArray(pl)) {
                  setPlaylist(pl);
                  setCurrentTrack(prev => ({
                    ...prev,
                    totalTracks: pl.length,
                  }));
                }
                // Extract video data if available
                updateTrackMetadata(event.target);
              } catch (e) {
                console.log('YT onReady notice:', e);
              }
            },
            onStateChange: (event: any) => {
              // event.data: -1 = unstarted, 0 = ended, 1 = playing, 2 = paused, 3 = buffering, 5 = cued
              if (event.data === 1) { // PLAYING
                setIsPlaying(true);
                setIsLoading(false);
                setStatusMessage('বাজছে...');
                updateTrackMetadata(event.target);
              } else if (event.data === 2) { // PAUSED
                setIsPlaying(false);
                setIsLoading(false);
                setStatusMessage('বিরতি (Paused)');
              } else if (event.data === 3) { // BUFFERING
                setIsLoading(true);
                setStatusMessage('গান লোড হচ্ছে…');
                updateTrackMetadata(event.target);
              } else if (event.data === 0) { // ENDED -> auto next in playlist
                setIsLoading(true);
                event.target.nextVideo();
              } else if (event.data === 5) { // CUED
                setIsLoading(false);
                updateTrackMetadata(event.target);
              }
            },
            onError: (err: any) => {
              console.warn('YouTube playback error:', err);
              setIsLoading(false);
              setStatusMessage('গান চালাতে আবার PLAY চাপুন।');
            }
          },
        });
      } catch (err) {
        console.error('Failed to init YouTube Player:', err);
        setStatusMessage('গান চালাতে আবার PLAY চাপুন।');
      }
    };

    if (window.YT && window.YT.Player) {
      initYT();
    } else {
      window.onYouTubeIframeAPIReady = initYT;
    }

    return () => {
      try {
        if (playerRef.current && playerRef.current.destroy) {
          playerRef.current.destroy();
        }
      } catch {}
    };
  }, []);

  // Update track title, artist, duration from YouTube Player
  const updateTrackMetadata = (player: any) => {
    if (!player) return;
    try {
      const data = player.getVideoData ? player.getVideoData() : null;
      const dur = player.getDuration ? player.getDuration() : 0;
      const index = player.getPlaylistIndex ? player.getPlaylistIndex() : 0;
      const pl = player.getPlaylist ? player.getPlaylist() : [];

      if (data && data.title) {
        setCurrentTrack(prev => ({
          ...prev,
          title: data.title || 'শেষ পাতার গান',
          artist: data.author || 'বাংলা স্মৃতির অ্যালবাম',
          duration: dur || prev.duration,
          videoId: data.video_id,
          playlistIndex: index,
          totalTracks: pl.length || prev.totalTracks || 1,
        }));
      }
    } catch {}
  };

  // Continuous polling of REAL playback time & progress while playing
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && isPlayingRef.current) {
        try {
          const curr = playerRef.current.getCurrentTime ? playerRef.current.getCurrentTime() : 0;
          const dur = playerRef.current.getDuration ? playerRef.current.getDuration() : 0;

          if (dur > 0) {
            setCurrentTrack(prev => ({
              ...prev,
              currentTime: curr,
              duration: dur,
              progress: Math.min(100, Math.max(0, (curr / dur) * 100)),
            }));
          } else if (curr > 0) {
            setCurrentTrack(prev => ({
              ...prev,
              currentTime: curr,
            }));
          }

          // If title was generic, try updating again
          const data = playerRef.current.getVideoData ? playerRef.current.getVideoData() : null;
          if (data && data.title && data.title !== currentTrack.title) {
            updateTrackMetadata(playerRef.current);
          }
        } catch {}
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Control Actions
  const togglePlay = () => {
    if (!playerRef.current) {
      setStatusMessage('গান লোড হচ্ছে…');
      return;
    }

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        // Required for browser autoplay policy: play is initiated directly by user interaction
        playerRef.current.playVideo();
        setIsPlaying(true);
        setStatusMessage('বাজছে...');
      }
    } catch (e) {
      console.warn('Play error:', e);
      setStatusMessage('গান চালাতে আবার PLAY চাপুন।');
    }
  };

  const playNext = () => {
    if (playerRef.current && playerRef.current.nextVideo) {
      try {
        setIsLoading(true);
        playerRef.current.nextVideo();
        setIsPlaying(true);
      } catch {}
    }
  };

  const playPrev = () => {
    if (playerRef.current && playerRef.current.previousVideo) {
      try {
        setIsLoading(true);
        playerRef.current.previousVideo();
        setIsPlaying(true);
      } catch {}
    }
  };

  const playTrackByIndex = (idx: number) => {
    if (playerRef.current && playerRef.current.playVideoAt) {
      try {
        setIsLoading(true);
        playerRef.current.playVideoAt(idx);
        setIsPlaying(true);
      } catch {}
    }
  };

  const seekTo = (seconds: number) => {
    if (playerRef.current && playerRef.current.seekTo) {
      try {
        playerRef.current.seekTo(seconds, true);
        setCurrentTrack(prev => ({
          ...prev,
          currentTime: seconds,
          progress: prev.duration > 0 ? (seconds / prev.duration) * 100 : 0,
        }));
      } catch {}
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    setIsMuted(vol === 0);
    if (playerRef.current && playerRef.current.setVolume) {
      try {
        playerRef.current.setVolume(vol);
      } catch {}
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (playerRef.current && playerRef.current.unMute) {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume || 70);
      }
    } else {
      setIsMuted(true);
      if (playerRef.current && playerRef.current.mute) {
        playerRef.current.mute();
      }
    }
  };

  return (
    <YouTubeMusicContext.Provider
      value={{
        isPlaying,
        isReady,
        isLoading,
        statusMessage,
        currentTrack,
        volume,
        isMuted,
        playlist,
        playTrackByIndex,
        togglePlay,
        playNext,
        playPrev,
        seekTo,
        setVolume,
        toggleMute,
      }}
    >
      {children}
    </YouTubeMusicContext.Provider>
  );
};

export const useYouTubeMusic = () => {
  const context = useContext(YouTubeMusicContext);
  if (!context) {
    throw new Error('useYouTubeMusic must be used within a YouTubeMusicProvider');
  }
  return context;
};
