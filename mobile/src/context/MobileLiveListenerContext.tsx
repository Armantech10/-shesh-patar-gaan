import React, { createContext, useContext, useState, useEffect } from 'react';
import { mobileFirebasePresence, MobileLiveStats } from '../services/mobileFirebasePresence';
import { useMobileYouTube } from './MobileYouTubeContext';

interface MobileLiveListenerContextType {
  stats: MobileLiveStats;
  isConnected: boolean;
  isConfigured: boolean;
  sessionId: string;
  emotionalMessage: string;
}

const MobileLiveListenerContext = createContext<MobileLiveListenerContextType | null>(null);

export const MobileLiveListenerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isPlaying, currentTrack } = useMobileYouTube();
  const [isConnected, setIsConnected] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  const [stats, setStats] = useState<MobileLiveStats>({
    activeListeners: 0,
    peakConcurrent: 0,
    todayTotalPlays: 0,
    mostPlayedTrackTitle: '',
    mostPlayedTrackPlayCount: 0,
  });

  useEffect(() => {
    const unsub = mobileFirebasePresence.initialize(
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

  useEffect(() => {
    if (isPlaying && currentTrack) {
      const tId = currentTrack.videoId || `track_${currentTrack.playlistIndex || 0}`;
      const tTitle = currentTrack.title || 'শেষ পাতার গান';
      mobileFirebasePresence.setSessionActive(tId, tTitle);
    } else {
      mobileFirebasePresence.setSessionInactive();
    }
  }, [isPlaying, currentTrack?.videoId, currentTrack?.title]);

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

  return (
    <MobileLiveListenerContext.Provider
      value={{
        stats,
        isConnected,
        isConfigured,
        sessionId: mobileFirebasePresence.getSessionId(),
        emotionalMessage: getEmotionalMessage(stats.activeListeners, isConfigured),
      }}
    >
      {children}
    </MobileLiveListenerContext.Provider>
  );
};

export const useMobileLiveListener = () => {
  const context = useContext(MobileLiveListenerContext);
  if (!context) {
    throw new Error('useMobileLiveListener must be used within a MobileLiveListenerProvider');
  }
  return context;
};
