import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebasePresence, LiveStats } from '../services/firebasePresence';
import { useYouTubeMusic } from './YouTubeMusicContext';

interface LiveListenerContextType {
  stats: LiveStats;
  isConnected: boolean;
  isConfigured: boolean;
  sessionId: string;
  emotionalMessage: string;
  hasCopiedLink: boolean;
  shareWebsite: () => Promise<void>;
}

const LiveListenerContext = createContext<LiveListenerContextType | null>(null);

export const LiveListenerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isPlaying, currentTrack } = useYouTubeMusic();
  const [isConnected, setIsConnected] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  const [stats, setStats] = useState<LiveStats>({
    activeListeners: 0,
    peakConcurrent: 0,
    todayTotalPlays: 0,
    mostPlayedTrackTitle: '',
    mostPlayedTrackPlayCount: 0,
  });

  // Initialize Firebase listeners once
  useEffect(() => {
    const unsub = firebasePresence.initialize(
      (newStats) => {
        setStats(newStats);
      },
      (connected, configured) => {
        setIsConnected(connected);
        setIsConfigured(configured);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  // Update presence strictly on real playback status changes
  useEffect(() => {
    if (isPlaying && currentTrack) {
      // User is actively listening
      const tId = currentTrack.videoId || `track_${currentTrack.playlistIndex || 0}`;
      const tTitle = currentTrack.title || 'শেষ পাতার গান';
      firebasePresence.setSessionActive(tId, tTitle);
    } else {
      // User paused or playback stopped
      firebasePresence.setSessionInactive();
    }
  }, [isPlaying, currentTrack?.videoId, currentTrack?.title]);

  // Derive Bengali emotional microcopy based on REAL listener count
  const getEmotionalMessage = (count: number, configured: boolean): string => {
    if (!configured) {
      return 'লাইভ স্ট্যাটাস সংযোগ অপেক্ষমান...';
    }
    if (count === 0) {
      return 'আজ রাতে গানটা একা বাজছে।';
    }
    if (count === 1) {
      return 'কেউ একজন এই মুহূর্তে শুনছে।';
    }
    if (count >= 2 && count <= 5) {
      return 'আরও কয়েকজন এই রাতটা ভাগ করে নিচ্ছে।';
    }
    return 'আজ রাতে আমরা একা নই।';
  };

  const shareWebsite = async () => {
    const shareData = {
      title: 'শেষ পাতার গান',
      text: 'শেষ পাতার গান — কিছু গান শেষ হয় না।',
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setHasCopiedLink(true);
        setTimeout(() => setHasCopiedLink(false), 4000);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setHasCopiedLink(true);
        setTimeout(() => setHasCopiedLink(false), 4000);
      } catch {}
    }
  };

  return (
    <LiveListenerContext.Provider
      value={{
        stats,
        isConnected,
        isConfigured,
        sessionId: firebasePresence.getSessionId(),
        emotionalMessage: getEmotionalMessage(stats.activeListeners, isConfigured),
        hasCopiedLink,
        shareWebsite,
      }}
    >
      {children}
    </LiveListenerContext.Provider>
  );
};

export const useLiveListener = () => {
  const context = useContext(LiveListenerContext);
  if (!context) {
    throw new Error('useLiveListener must be used within a LiveListenerProvider');
  }
  return context;
};
