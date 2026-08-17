import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useMobileYouTube } from '../context/MobileYouTubeContext';
import { colors } from '../theme/colors';

export const WalkmanCassetteMobile: React.FC = () => {
  const {
    currentArchive,
    isPlaying,
    isPlayRequested,
    togglePlay,
    playNext,
    playPrev,
    statusMessage,
    onPlayerReady,
    onPlayerStateChange,
    onPlayerError,
    playerRef,
  } = useMobileYouTube();

  // Animated continuous rotation for cassette spools
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.stopAnimation();
    }
  }, [isPlaying, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.card}>
      {/* Walkman Top Brand Bar */}
      <View style={styles.topHeader}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandTitle}>SONY WALKMAN</Text>
          <Text style={styles.brandSub}>STEREO CASSETTE PLAYER • WM-EX674</Text>
        </View>
        <View style={styles.sideBadge}>
          <Text style={styles.sideText}>SIDE {currentArchive.side}</Text>
        </View>
      </View>

      {/* Primary Cassette Deck & Visible YouTube Player Frame */}
      <View style={styles.cassetteBody}>
        {/* Cassette Header Label */}
        <View style={styles.cassetteLabel}>
          <View style={styles.labelLine} />
          <View style={styles.labelHeader}>
            <Text style={styles.archiveTitle}>{currentArchive.title}</Text>
            <Text style={styles.archiveCatalog}>{currentArchive.catalogCode}</Text>
          </View>
          <Text style={styles.englishTitle}>{currentArchive.englishTitle}</Text>
          <Text style={styles.tapeNumberTag}>{currentArchive.tapeNumber}</Text>
        </View>

        {/* Visible Real YouTube Player Embed */}
        <View style={styles.playerFrame}>
          <YoutubePlayer
            ref={playerRef}
            height={180}
            play={isPlayRequested}
            playList={currentArchive.playlistId}
            onChangeState={onPlayerStateChange}
            onReady={onPlayerReady}
            onError={onPlayerError}
            forceAndroidAutoplay={true}
            webViewProps={{
              mediaPlaybackRequiresUserAction: false,
              allowsInlineMediaPlayback: true,
              androidLayerType: 'hardware',
            }}
          />
        </View>

        {/* Cassette Reel Section with Spinning Spools */}
        <View style={styles.tapeWindow}>
          {/* Left Spool */}
          <View style={styles.spoolContainer}>
            <Animated.View style={[styles.spoolWheel, { transform: [{ rotate: spin }] }]}>
              <View style={styles.spoolTeeth1} />
              <View style={styles.spoolTeeth2} />
              <View style={styles.spoolHub} />
            </Animated.View>
          </View>

          {/* Center Magnetic Tape Details */}
          <View style={styles.tapeCenterBar}>
            <View style={styles.magneticRibbon} />
            <Text style={styles.biasText}>{currentArchive.bias}</Text>
            <Text style={styles.stereoText}>STEREO • HIGH OUTPUT</Text>
          </View>

          {/* Right Spool */}
          <View style={styles.spoolContainer}>
            <Animated.View style={[styles.spoolWheel, { transform: [{ rotate: spin }] }]}>
              <View style={styles.spoolTeeth1} />
              <View style={styles.spoolTeeth2} />
              <View style={styles.spoolHub} />
            </Animated.View>
          </View>
        </View>
      </View>

      {/* Playback Status Bar */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, isPlaying ? styles.statusPlaying : styles.statusPaused]} />
        <Text style={styles.statusText}>{statusMessage}</Text>
      </View>

      {/* Physical Tactile Controls: PREV | PLAY/PAUSE | NEXT */}
      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.btnSecondary} onPress={playPrev} activeOpacity={0.7}>
          <Text style={styles.btnText}>⏮ PREV</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnPlay, isPlaying && styles.btnPlayActive]}
          onPress={togglePlay}
          activeOpacity={0.8}
        >
          <Text style={styles.btnPlayText}>{isPlaying ? '⏸ PAUSE' : '▶ PLAY'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSecondary} onPress={playNext} activeOpacity={0.7}>
          <Text style={styles.btnText}>NEXT ⏭</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161922',
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  brandContainer: {
    flex: 1,
  },
  brandTitle: {
    color: colors.primary,
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1.5,
  },
  brandSub: {
    color: colors.textSubtle,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  sideBadge: {
    backgroundColor: colors.surfaceLight,
    borderColor: colors.primaryDark,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  sideText: {
    color: colors.primaryLight,
    fontSize: 10,
    fontWeight: 'bold',
  },
  cassetteBody: {
    backgroundColor: '#1E2330',
    borderRadius: 12,
    borderColor: '#2D3446',
    borderWidth: 1.5,
    padding: 12,
  },
  cassetteLabel: {
    backgroundColor: '#2A2F3D',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  labelLine: {
    height: 2,
    backgroundColor: colors.primary,
    marginBottom: 6,
    borderRadius: 1,
  },
  labelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  archiveTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  archiveCatalog: {
    color: colors.sepia,
    fontSize: 10,
    fontWeight: 'bold',
  },
  englishTitle: {
    color: colors.primaryLight,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 2,
  },
  tapeNumberTag: {
    color: colors.textSubtle,
    fontSize: 9,
    marginTop: 4,
  },
  playerFrame: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 10,
  },
  tapeWindow: {
    backgroundColor: '#0D0F14',
    borderRadius: 8,
    borderColor: colors.border,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spoolContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spoolWheel: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: '#141720',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spoolTeeth1: {
    position: 'absolute',
    width: 36,
    height: 5,
    backgroundColor: colors.borderAccent,
    borderRadius: 2,
  },
  spoolTeeth2: {
    position: 'absolute',
    width: 5,
    height: 36,
    backgroundColor: colors.borderAccent,
    borderRadius: 2,
  },
  spoolHub: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.text,
  },
  tapeCenterBar: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  magneticRibbon: {
    width: '100%',
    height: 10,
    backgroundColor: '#2A1B15',
    borderRadius: 2,
    marginBottom: 4,
  },
  biasText: {
    color: colors.sepia,
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  stereoText: {
    color: colors.textSubtle,
    fontSize: 7,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusPlaying: {
    backgroundColor: colors.emerald,
  },
  statusPaused: {
    backgroundColor: colors.amber,
  },
  statusText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: 'bold',
  },
  btnPlay: {
    flex: 1.5,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPlayActive: {
    backgroundColor: colors.primaryDark,
  },
  btnPlayText: {
    color: '#0A0C10',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
