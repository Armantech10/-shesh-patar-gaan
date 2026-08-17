import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useMobileLiveListener } from '../context/MobileLiveListenerContext';
import { colors } from '../theme/colors';

export const LiveStationBarMobile: React.FC = () => {
  const { stats, emotionalMessage } = useMobileLiveListener();

  return (
    <View style={styles.container}>
      <View style={styles.badgeRow}>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE BROADCAST</Text>
        </View>

        <View style={styles.statsBadge}>
          <Text style={styles.statsText}>
            🎧 {stats.activeListeners} জন শুনছেন (Peak: {stats.peakConcurrent})
          </Text>
        </View>
      </View>

      <Text style={styles.quoteText}>{emotionalMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.rose,
  },
  liveText: {
    color: colors.rose,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statsBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statsText: {
    color: colors.sepia,
    fontSize: 11,
  },
  quoteText: {
    color: colors.text,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
});
