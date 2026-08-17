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

export interface MobileLiveStats {
  activeListeners: number;
  peakConcurrent: number;
  todayTotalPlays: number;
  mostPlayedTrackTitle: string;
  mostPlayedTrackPlayCount: number;
  lastUpdated?: number;
}

// Mobile Firebase configuration reader using Expo EXPO_PUBLIC_FIREBASE_* prefix
const MOBILE_FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
};

export const isMobileFirebaseConfigured = (): boolean => {
  return Boolean(
    MOBILE_FIREBASE_CONFIG.apiKey &&
    MOBILE_FIREBASE_CONFIG.databaseURL &&
    MOBILE_FIREBASE_CONFIG.projectId
  );
};

class MobileFirebasePresenceService {
  private app: FirebaseApp | null = null;
  private db: Database | null = null;
  private sessionId: string;
  private isConnected = false;
  private activePresenceRef: any = null;
  private connectedRefUnsub: Unsubscribe | null = null;
  private presenceUnsub: Unsubscribe | null = null;
  private statsUnsub: Unsubscribe | null = null;
  private lastRecordedTrackId: string | null = null;

  constructor() {
    this.sessionId = `mobile_listener_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public isAvailable(): boolean {
    return isMobileFirebaseConfigured();
  }

  public initialize(
    onStatsUpdate: (stats: MobileLiveStats) => void,
    onConnectionStatus: (connected: boolean, configured: boolean) => void
  ): () => void {
    if (!isMobileFirebaseConfigured()) {
      console.log('[FIREBASE] Configuration missing: EXPO_PUBLIC_FIREBASE_* variables are not set in environment.');
      onConnectionStatus(false, false);
      return () => {};
    }

    try {
      if (!getApps().length) {
        this.app = initializeApp(MOBILE_FIREBASE_CONFIG);
      } else {
        this.app = getApps()[0];
      }

      this.db = getDatabase(this.app);
      console.log(`[FIREBASE] Configuration loaded: project=${MOBILE_FIREBASE_CONFIG.projectId}, database=${MOBILE_FIREBASE_CONFIG.databaseURL}`);

      // 1. Listen for connection state (.info/connected)
      const connectedRef = ref(this.db, '.info/connected');
      this.connectedRefUnsub = onValue(connectedRef, (snap) => {
        this.isConnected = snap.val() === true;
        if (this.isConnected) {
          console.log('[FIREBASE] Connected to Realtime Database');
        } else {
          console.log('[FIREBASE] Disconnected');
        }
        onConnectionStatus(this.isConnected, true);
      });

      // 2. Real-time active listeners count watching same 'presence' node as website
      const presenceRootRef = ref(this.db, 'presence');
      this.presenceUnsub = onValue(presenceRootRef, (snapshot) => {
        const data = snapshot.val();
        const activeCount = data ? Object.keys(data).length : 0;
        console.log(`[FIREBASE] Active listeners: ${activeCount}`);
        this.checkAndUpdatePeak(activeCount);
        this.fetchAggregatedStats(activeCount, onStatsUpdate);
      }, (error) => {
        console.warn('[FIREBASE] Error:', error);
      });

      return () => {
        this.cleanup();
      };
    } catch (e) {
      console.warn('[FIREBASE] Initialization error:', e);
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
    onStatsUpdate: (stats: MobileLiveStats) => void
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
      console.log(`[FIREBASE] Peak count: ${peak}`);

      onStatsUpdate({
        activeListeners: currentActive,
        peakConcurrent: peak,
        todayTotalPlays: totalPlays,
        mostPlayedTrackTitle: 'শেষ পাতার গান',
        mostPlayedTrackPlayCount: totalPlays,
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

  public async setSessionActive(trackId: string, trackTitle: string) {
    if (!this.db) return;
    try {
      const presenceRef = ref(this.db, `presence/${this.sessionId}`);
      this.activePresenceRef = presenceRef;
      await onDisconnect(presenceRef).remove();

      await set(presenceRef, {
        active: true,
        platform: 'mobile',
        trackId: trackId || 'yt_track',
        trackTitle: trackTitle || 'শেষ পাতার গান',
        startedAt: serverTimestamp(),
      });
      console.log(`[FIREBASE] Presence registered: ${this.sessionId}`);

      if (trackId && trackId !== this.lastRecordedTrackId) {
        this.lastRecordedTrackId = trackId;
        this.recordPlayEvent(trackId, trackTitle);
      }
    } catch (e) {
      console.warn('[FIREBASE] Set active listener error:', e);
    }
  }

  public async setSessionInactive() {
    if (!this.db) return;
    try {
      const presenceRef = ref(this.db, `presence/${this.sessionId}`);
      try {
        await onDisconnect(presenceRef).cancel();
      } catch {}
      await remove(presenceRef);
      this.activePresenceRef = null;
      console.log('[FIREBASE] Disconnected');
    } catch (e) {
      console.warn('[FIREBASE] Set inactive listener error:', e);
    }
  }

  private async recordPlayEvent(trackId: string, trackTitle: string) {
    if (!this.db) return;
    try {
      const todayKey = this.getTodayDateKey();
      const totalPlaysRef = ref(this.db, `stats/${todayKey}/totalPlays`);
      await set(totalPlaysRef, increment(1));

      const cleanKey = trackId.replace(/[.#$[\]]/g, '_');
      const trackRef = ref(this.db, `trackStats/${todayKey}/${cleanKey}`);
      await set(trackRef, {
        title: trackTitle || 'শেষ পাতার গান',
        playCount: 1,
        lastPlayedAt: serverTimestamp(),
      });
    } catch {}
  }

  public cleanup() {
    if (this.connectedRefUnsub) this.connectedRefUnsub();
    if (this.presenceUnsub) this.presenceUnsub();
    if (this.statsUnsub) this.statsUnsub();
    this.setSessionInactive();
  }
}

export const mobileFirebasePresence = new MobileFirebasePresenceService();
