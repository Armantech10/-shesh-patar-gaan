import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useMobileYouTube } from '../context/MobileYouTubeContext';
import { colors } from '../theme/colors';

export const GlassMusicPlayerMobile: React.FC = () => {
  const { currentTrack, currentArchive, isPlaying, togglePlay, playNext, playPrev } = useMobileYouTube();

  return (
    <View style={styles.bar}>
      {/* Progress Line */}
      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${Math.max(2, currentTrack.progress || 0)}%` }]} />
      </View>

      <View style={styles.content}>
        {/* Track Title & Artist */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentArchive.title} • {currentArchive.englishTitle}
          </Text>
        </View>

        {/* Mini Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={playPrev} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.controlIcon}>⏮</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playBtn}
            onPress={togglePlay}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={playNext} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.controlIcon}>⏭</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    backgroundColor: 'rgba(20, 23, 32, 0.95)',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingBottom: 8,
  },
  progressBackground: {
    height: 3,
    backgroundColor: colors.border,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: colors.text,
    fontSize: 13,
    fontWeight: 'bold',
  },
  artist: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  controlIcon: {
    color: colors.text,
    fontSize: 18,
  },
  playBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: '#0A0C10',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
