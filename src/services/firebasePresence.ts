import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  onValue,
  set,
  remove,
  onDisconnect,
  serverTimestamp,
  increment,
  Database,
  Unsubscribe
} from 'firebase/database';
import { FIREBASE_CONFIG, isFirebaseConfigured } from '../config/firebaseConfig';

export interface LiveStats {
  activeListeners: number;
  peakConcurrent: number;
  todayTotalPlays: number;
  mostPlayedTrackTitle: string;
  mostPlayedTrackPlayCount: number;
  lastUpdated?: number;
}

export interface LiveListenerSession {
  sessionId: string;
  trackId: string;
  trackTitle: string;
  startedAt: any;
  active: boolean;
}

class FirebasePresenceService {
  private app: FirebaseApp | null = null;
  private db: Database | null = null;
  private sessionId: string;
  private isConnected = false;
  private activePresenceRef: any = null;
  private connectedRefUnsub: Unsubscribe | null = null;
  private presenceUnsub: Unsubscribe | null = null;
  private statsUnsub: Unsubscribe | null = null;
  private topTrackUnsub: Unsubscribe | null = null;
  private lastRecordedTrackId: string | null = null;

  constructor() {
    // Generate an anonymous random session ID: listener_<random>
    this.sessionId = `listener_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public isAvailable(): boolean {
    return isFirebaseConfigured();
  }

  public initialize(
    onStatsUpdate: (stats: LiveStats) => void,
    onConnectionStatus: (connected: boolean, configured: boolean) => void
  ): () => void {
    if (!isFirebaseConfigured()) {
      onConnectionStatus(false, false);
      return () => {};
    }

    try {
      if (!getApps().length) {
        this.app = initializeApp(FIREBASE_CONFIG);
      } else {
        this.app = getApps()[0];
      }

      this.db = getDatabase(this.app);

      // 1. Listen for connection state (.info/connected)
      const connectedRef = ref(this.db, '.info/connected');
      this.connectedRefUnsub = onValue(connectedRef, (snap) => {
        this.isConnected = snap.val() === true;
        onConnectionStatus(this.isConnected, true);
      });

      // 2. Real-time active listeners listener
      const presenceRootRef = ref(this.db, 'presence');
      this.presenceUnsub = onValue(presenceRootRef, (snapshot) => {
        const data = snapshot.val();
        const activeCount = data ? Object.keys(data).length : 0;

        // Automatically update peak listeners if this count exceeds current peak
        this.checkAndUpdatePeak(activeCount);

        // Fetch aggregate daily stats
        this.fetchAggregatedStats(activeCount, onStatsUpdate);
      }, (error) => {
        console.warn('Firebase presence read warning:', error);
      });

      // 3. Listen to daily stats
      const todayKey = this.getTodayDateKey();
      const statsRef = ref(this.db, `stats/${todayKey}`);
      this.statsUnsub = onValue(statsRef, (snap) => {
        const statsData = snap.val() || {};
        // Trigger update
        this.presenceUnsub && this.presenceUnsub(); // re-eval
      });

      return () => {
        this.cleanup();
      };
    } catch (e) {
      console.warn('Firebase initialization warning:', e);
      onConnectionStatus(false, false);
      return () => {};
    }
  }

  private getTodayDateKey(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private async checkAndUpdatePeak(activeCount: number) {
    if (!this.db || activeCount <= 0) return;
    try {
      const todayKey = this.getTodayDateKey();
      const peakRef = ref(this.db, `stats/${todayKey}/peakConcurrent`);
      // Read current peak once
      const snap = await new Promise<any>((resolve) => {
        onValue(peakRef, (s) => resolve(s.val()), { onlyOnce: true });
      });
      const currentPeak = typeof snap === 'number' ? snap : 0;
      if (activeCount > currentPeak) {
        await set(peakRef, activeCount);
      }
    } catch {}
  }

  private async fetchAggregatedStats(
    currentActive: number,
    onStatsUpdate: (stats: LiveStats) => void
  ) {
    if (!this.db) {
      onStatsUpdate({
        activeListeners: currentActive,
        peakConcurrent: currentActive,
        todayTotalPlays: 0,
        mostPlayedTrackTitle: '',
        mostPlayedTrackPlayCount: 0,
      });
      return;
    }

    try {
      const todayKey = this.getTodayDateKey();
      const todayStatsRef = ref(this.db, `stats/${todayKey}`);
      const snap = await new Promise<any>((resolve) => {
        onValue(todayStatsRef, (s) => resolve(s.val()), { onlyOnce: true });
      });

      const todayStats = snap || {};
      const peak = Math.max(currentActive, todayStats.peakConcurrent || 0);
      const totalPlays = todayStats.totalPlays || 0;

      // Find most played track today from tracksStats
      const tracksRef = ref(this.db, `trackStats/${todayKey}`);
      const tracksSnap = await new Promise<any>((resolve) => {
        onValue(tracksRef, (s) => resolve(s.val()), { onlyOnce: true });
      });

      let topTitle = '';
      let topCount = 0;
      if (tracksSnap) {
        for (const tid in tracksSnap) {
          const item = tracksSnap[tid];
          if (item && item.playCount > topCount) {
            topCount = item.playCount;
            topTitle = item.title || tid;
          }
        }
      }

      onStatsUpdate({
        activeListeners: currentActive,
        peakConcurrent: peak,
        todayTotalPlays: totalPlays,
        mostPlayedTrackTitle: topTitle,
        mostPlayedTrackPlayCount: topCount,
        lastUpdated: Date.now(),
      });
    } catch {
      onStatsUpdate({
        activeListeners: currentActive,
        peakConcurrent: currentActive,
        todayTotalPlays: 0,
        mostPlayedTrackTitle: '',
        mostPlayedTrackPlayCount: 0,
      });
    }
  }

  /**
   * Called ONLY when audio is actively playing and user has started playback
   */
  public async setSessionActive(trackId: string, trackTitle: string) {
    if (!this.db) return;

    try {
      const presenceRef = ref(this.db, `presence/${this.sessionId}`);
      this.activePresenceRef = presenceRef;

      // Setup onDisconnect handler to clean up automatically if client closes browser
      await onDisconnect(presenceRef).remove();

      // Write session presence
      await set(presenceRef, {
        active: true,
        trackId: trackId || 'yt_track',
        trackTitle: trackTitle || 'শেষ পাতার গান',
        startedAt: serverTimestamp(),
      });

      // Record play count once per track in this session
      if (trackId && trackId !== this.lastRecordedTrackId) {
        this.lastRecordedTrackId = trackId;
        this.recordPlayEvent(trackId, trackTitle);
      }
    } catch (e) {
      console.warn('Set active listener error:', e);
    }
  }

  /**
   * Called when audio pauses or stops
   */
  public async setSessionInactive() {
    if (!this.db) return;

    try {
      const presenceRef = ref(this.db, `presence/${this.sessionId}`);
      // Cancel onDisconnect first, then remove
      try {
        await onDisconnect(presenceRef).cancel();
      } catch {}
      await remove(presenceRef);
      this.activePresenceRef = null;
    } catch (e) {
      console.warn('Set inactive listener error:', e);
    }
  }

  /**
   * Records a valid real play event in today's statistics
   */
  private async recordPlayEvent(trackId: string, trackTitle: string) {
    if (!this.db) return;
    try {
      const todayKey = this.getTodayDateKey();
      
      // Increment total plays today
      const totalPlaysRef = ref(this.db, `stats/${todayKey}/totalPlays`);
      await set(totalPlaysRef, increment(1));

      // Increment specific track play count
      // Clean trackId for Firebase path key (alphanumeric and dashes/underscores)
      const cleanKey = trackId.replace(/[.#$[\]]/g, '_');
      const trackRef = ref(this.db, `trackStats/${todayKey}/${cleanKey}`);
      
      const snap = await new Promise<any>((resolve) => {
        onValue(trackRef, (s) => resolve(s.val()), { onlyOnce: true });
      });

      if (snap) {
        await set(trackRef, {
          title: trackTitle || snap.title || 'শেষ পাতার গান',
          playCount: (snap.playCount || 0) + 1,
          lastPlayedAt: serverTimestamp(),
        });
      } else {
        await set(trackRef, {
          title: trackTitle || 'শেষ পাতার গান',
          playCount: 1,
          lastPlayedAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.warn('Record play event warning:', e);
    }
  }

  public cleanup() {
    if (this.connectedRefUnsub) this.connectedRefUnsub();
    if (this.presenceUnsub) this.presenceUnsub();
    if (this.statsUnsub) this.statsUnsub();
    if (this.topTrackUnsub) this.topTrackUnsub();
    this.setSessionInactive();
  }
}

export const firebasePresence = new FirebasePresenceService();
