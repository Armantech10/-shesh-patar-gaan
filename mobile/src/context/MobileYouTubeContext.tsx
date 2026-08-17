import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { MUSIC_ARCHIVES } from '../data/nostalgiaData';
import { MusicArchive } from '../types';
import { PLAYER_STATES } from 'react-native-youtube-iframe';

export interface MobileTrackInfo {
  title: string;
  artist: string;
  duration: number;
  currentTime: number;
  progress: number;
  videoId?: string;
  playlistIndex: number;
  totalTracks: number;
}

interface MobileYouTubeContextType {
  isPlaying: boolean;
  isPlayRequested: boolean;
  isReady: boolean;
  isLoading: boolean;
  statusMessage: string;
  currentTrack: MobileTrackInfo;
  volume: number;
  isMuted: boolean;
  currentArchiveId: string;
  currentArchive: MusicArchive;
  verificationLog: Array<{ timestamp: string; archiveId: string; title: string; playlistId: string }>;
  changeArchive: (archiveId: string) => void;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  playNext: () => void;
  playPrev: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  onPlayerReady: () => void;
  onPlayerStateChange: (state: string) => void;
  onPlayerError: (error: string) => void;
  playerRef: React.RefObject<any>;
}

const MobileYouTubeContext = createContext<MobileYouTubeContextType | null>(null);

export const MobileYouTubeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentArchiveId, setCurrentArchiveId] = useState<string>('rain');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayRequested, setIsPlayRequested] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('প্লেয়ার প্রস্তুত হচ্ছে…');
  const [volume, setVolumeState] = useState(85);
  const [isMuted, setIsMuted] = useState(false);
  const [verificationLog, setVerificationLog] = useState<Array<{ timestamp: string; archiveId: string; title: string; playlistId: string }>>([]);

  const currentArchive = MUSIC_ARCHIVES[currentArchiveId] || MUSIC_ARCHIVES.rain;
  const activeArchiveIdRef = useRef<string>(currentArchiveId);

  // Single persistent YoutubePlayer ref used across all operations
  const playerRef = useRef<any>(null);

  const [currentTrack, setCurrentTrack] = useState<MobileTrackInfo>({
    title: `${currentArchive.title}`,
    artist: currentArchive.englishTitle,
    duration: 0,
    currentTime: 0,
    progress: 0,
    playlistIndex: 0,
    totalTracks: 1,
  });

  const logArchiveVerification = (archiveId: string) => {
    const archive = MUSIC_ARCHIVES[archiveId];
    if (!archive) return;

    const logEntry = {
      timestamp: new Date().toLocaleTimeString(),
      archiveId: archive.id,
      title: archive.title,
      playlistId: archive.playlistId,
    };

    console.log('[YT] ==================================================');
    console.log('[YT] [ARCHIVE VERIFICATION LOG]');
    console.log(`[YT] archiveId:  ${logEntry.archiveId}`);
    console.log(`[YT] title:      ${logEntry.title}`);
    console.log(`[YT] playlistId: ${logEntry.playlistId}`);
    console.log('[YT] ==================================================');

    setVerificationLog((prev) => [logEntry, ...prev.slice(0, 10)]);
  };

  useEffect(() => {
    console.log('[YT] MobileYouTubeProvider mounted');
    logArchiveVerification('rain');
  }, []);

  const queryPlayerDetails = () => {
    if (playerRef.current) {
      if (typeof playerRef.current.getVideoUrl === 'function') {
        playerRef.current
          .getVideoUrl()
          .then((url: string) => {
            if (url) {
              console.log(`[YT] current video: ${url}`);
            }
          })
          .catch(() => {});
      }
      console.log(`[YT] current playlist: ${currentArchive.playlistId}`);
    }
  };

  const changeArchive = (archiveId: string) => {
    const targetArchive = MUSIC_ARCHIVES[archiveId];
    if (!targetArchive || archiveId === activeArchiveIdRef.current) return;

    console.log(`[YT] playlist requested: ${targetArchive.title} (${targetArchive.playlistId})`);
    logArchiveVerification(archiveId);

    setCurrentArchiveId(archiveId);
    activeArchiveIdRef.current = archiveId;
    setIsLoading(true);
    setStatusMessage(`আর্কাইভ লোড হচ্ছে: ${targetArchive.title}…`);

    setCurrentTrack({
      title: `${targetArchive.title}`,
      artist: targetArchive.englishTitle,
      duration: 0,
      currentTime: 0,
      progress: 0,
      playlistIndex: 0,
      totalTracks: 1,
    });
  };

  const onPlayerReady = () => {
    console.log('[YT] player ready');
    setIsReady(true);
    setIsLoading(false);
    setStatusMessage('গান শুনতে PLAY চাপুন');
    queryPlayerDetails();
  };

  const onPlayerStateChange = (state: string) => {
    const upperState = state ? state.toUpperCase() : state;
    console.log(`[YT] state changed: ${upperState}`);
    queryPlayerDetails();

    if (state === PLAYER_STATES.PLAYING || state === 'playing') {
      setIsPlaying(true);
      setIsPlayRequested(true);
      setIsLoading(false);
      setStatusMessage('বাজছে...');

      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        playerRef.current
          .getCurrentTime()
          .then((curr: number) => {
            if (typeof curr === 'number') {
              setCurrentTrack((prev) => ({ ...prev, currentTime: curr }));
            }
          })
          .catch(() => {});
      }
    } else if (state === PLAYER_STATES.PAUSED || state === 'paused') {
      setIsPlaying(false);
      setIsPlayRequested(false);
      setIsLoading(false);
      setStatusMessage('বিরতি (Paused)');
    } else if (state === PLAYER_STATES.BUFFERING || state === 'buffering') {
      setIsLoading(true);
      setStatusMessage('গান লোড হচ্ছে…');
    } else if (state === PLAYER_STATES.ENDED || state === 'ended') {
      setIsPlaying(false);
      setIsPlayRequested(false);
      setIsLoading(false);
      setStatusMessage('গান শেষ হয়েছে');
    } else if (
      state === PLAYER_STATES.VIDEO_CUED ||
      state === 'video cued' ||
      state === PLAYER_STATES.UNSTARTED ||
      state === 'unstarted'
    ) {
      setIsLoading(false);
      setIsPlaying(false);
      setStatusMessage('গান শুনতে PLAY চাপুন');
    }
  };

  const onPlayerError = (error: string) => {
    console.log(`[YT] error: ${error}`);
    setIsLoading(false);
    setIsPlaying(false);
    setIsPlayRequested(false);
    setStatusMessage('গান চালাতে আবার PLAY চাপুন');
  };

  const play = () => {
    const refExists = Boolean(playerRef.current);
    console.log(`[YT] play requested, playerRef exists: ${refExists}`);
    console.log('[YT] APP PLAY PRESSED');
    console.log('[YT] calling player.playVideo()');
    setIsPlayRequested(true);

    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo('player.getCurrentTime()); player.playVideo(); (0', true);
    }
  };

  const pause = () => {
    const refExists = Boolean(playerRef.current);
    console.log(`[YT] pause requested, playerRef exists: ${refExists}`);
    console.log('[YT] APP PAUSE PRESSED');
    console.log('[YT] calling player.pauseVideo()');
    setIsPlayRequested(false);

    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo('player.getCurrentTime()); player.pauseVideo(); (0', true);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const playNext = () => {
    const refExists = Boolean(playerRef.current);
    console.log(`[YT] next requested, playerRef exists: ${refExists}`);
    console.log('[YT] APP NEXT PRESSED');
    console.log('[YT] calling player.nextVideo()');

    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo('0); player.nextVideo(); (0', true);
    }
  };

  const playPrev = () => {
    const refExists = Boolean(playerRef.current);
    console.log(`[YT] prev requested, playerRef exists: ${refExists}`);
    console.log('[YT] APP PREV PRESSED');
    console.log('[YT] calling player.previousVideo()');

    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo('0); player.previousVideo(); (0', true);
    }
  };

  const seekTo = (seconds: number) => {
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(seconds, true);
    }
    setCurrentTrack((prev) => ({
      ...prev,
      currentTime: seconds,
      progress: prev.duration > 0 ? (seconds / prev.duration) * 100 : 0,
    }));
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <MobileYouTubeContext.Provider
      value={{
        isPlaying,
        isPlayRequested,
        isReady,
        isLoading,
        statusMessage,
        currentTrack,
        volume,
        isMuted,
        currentArchiveId,
        currentArchive,
        verificationLog,
        changeArchive,
        togglePlay,
        play,
        pause,
        next: playNext,
        previous: playPrev,
        playNext,
        playPrev,
        seekTo,
        setVolume,
        toggleMute,
        onPlayerReady,
        onPlayerStateChange,
        onPlayerError,
        playerRef,
      }}
    >
      {children}
    </MobileYouTubeContext.Provider>
  );
};

export const useMobileYouTube = () => {
  const context = useContext(MobileYouTubeContext);
  if (!context) {
    throw new Error('useMobileYouTube must be used within a MobileYouTubeProvider');
  }
  return context;
};
