import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NOSTALGIC_MEMORIES } from '../data/nostalgiaData';
import { colors } from '../theme/colors';

export const MemoriesGridMobile: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>নস্টালজিক মুহূর্তসমূহ (Memories)</Text>
      {NOSTALGIC_MEMORIES.map((mem) => (
        <View key={mem.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.dateTag}>{mem.date}</Text>
            <Text style={styles.categoryTag}>{mem.category.toUpperCase()}</Text>
          </View>
          <Text style={styles.title}>{mem.title}</Text>
          <Text style={styles.subtitle}>{mem.subtitle}</Text>
          <Text style={styles.story}>{mem.story}</Text>
          <Text style={styles.quote}>“{mem.quote}”</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dateTag: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryTag: {
    color: colors.sepia,
    fontSize: 9,
    fontWeight: 'bold',
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: 6,
  },
  story: {
    color: '#D2C9BD',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  quote: {
    color: colors.amber,
    fontSize: 11,
    fontStyle: 'italic',
  },
});
