import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { ArchiveSelectorMobile } from '../components/ArchiveSelectorMobile';
import { WalkmanCassetteMobile } from '../components/WalkmanCassetteMobile';
import { LiveStationBarMobile } from '../components/LiveStationBarMobile';
import { RotatingQuotesMobile } from '../components/RotatingQuotesMobile';
import { KeyboardChordsMobile } from '../components/KeyboardChordsMobile';
import { DiaryLastPageMobile } from '../components/DiaryLastPageMobile';
import { MemoriesGridMobile } from '../components/MemoriesGridMobile';
import { GlassMusicPlayerMobile } from '../components/GlassMusicPlayerMobile';
import { colors } from '../theme/colors';

export const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* App Title Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>শেষ পাতার গান</Text>
          <Text style={styles.appSubtitle}>SHESH PATAR GAAN • NOSTALGIC BENGALI AUDIO ARCHIVE</Text>
        </View>

        {/* Live Broadcast Badge & Presence */}
        <LiveStationBarMobile />

        {/* Central Walkman Cassette Visualizer */}
        <WalkmanCassetteMobile />

        {/* 5 Mood Archives Selector */}
        <ArchiveSelectorMobile />

        {/* Rotating Bengali Quotes */}
        <RotatingQuotesMobile />

        {/* Interactive Sargam Chords Synthesizer */}
        <KeyboardChordsMobile />

        {/* Notebook / Diary Last Page Scribbles */}
        <DiaryLastPageMobile />

        {/* Bengali Nostalgia Stories Grid */}
        <MemoriesGridMobile />

        {/* Archival Mobile Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerQuote}>“কিছু গান শেষ হয় না। শুধু মানুষটা বদলে যায়।”</Text>
          <Text style={styles.footerCode}>ARCHIVAL INDEX • VOL. 98 — SIDE A • MOBILE EDITION</Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Mini Player */}
      <GlassMusicPlayerMobile />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  appTitle: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  appSubtitle: {
    color: colors.textSubtle,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 4,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    alignItems: 'center',
    marginTop: 16,
  },
  footerQuote: {
    color: colors.amber,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 6,
  },
  footerCode: {
    color: colors.textSubtle,
    fontSize: 9,
    letterSpacing: 1,
  },
});
