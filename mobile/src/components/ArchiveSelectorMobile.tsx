import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MUSIC_ARCHIVES } from '../data/nostalgiaData';
import { useMobileYouTube } from '../context/MobileYouTubeContext';
import { colors } from '../theme/colors';

export const ArchiveSelectorMobile: React.FC = () => {
  const { currentArchiveId, changeArchive } = useMobileYouTube();
  const archives = Object.values(MUSIC_ARCHIVES);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>নস্টালজিক আর্কাইভস (5 Archives)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {archives.map((archive) => {
          const isSelected = archive.id === currentArchiveId;
          return (
            <TouchableOpacity
              key={archive.id}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => changeArchive(archive.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.icon}>{archive.icon}</Text>
              <View>
                <Text style={[styles.title, isSelected && styles.textSelected]}>
                  {archive.title}
                </Text>
                <Text style={styles.tapeCode}>
                  {archive.tapeNumber} • {archive.catalogCode}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    gap: 10,
  },
  chipSelected: {
    backgroundColor: colors.surfaceLight,
    borderColor: colors.primary,
  },
  icon: {
    fontSize: 20,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  textSelected: {
    color: colors.primary,
  },
  tapeCode: {
    color: colors.textSubtle,
    fontSize: 10,
    marginTop: 2,
  },
});
