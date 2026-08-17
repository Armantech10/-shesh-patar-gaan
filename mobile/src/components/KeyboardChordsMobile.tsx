import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ACOUSTIC_CHORDS } from '../data/nostalgiaData';
import { colors } from '../theme/colors';

export const KeyboardChordsMobile: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>একুস্টিক গিটার কর্ড (Sargam Chords)</Text>
      <View style={styles.grid}>
        {ACOUSTIC_CHORDS.map((chord) => (
          <TouchableOpacity
            key={chord.key}
            style={styles.keyButton}
            activeOpacity={0.7}
          >
            <Text style={styles.noteName}>{chord.name}</Text>
            <Text style={styles.chordTag}>{chord.chordName}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  title: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keyButton: {
    width: '23%',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  noteName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: 'bold',
  },
  chordTag: {
    color: colors.primary,
    fontSize: 10,
    marginTop: 2,
  },
});
