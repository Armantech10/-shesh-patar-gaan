import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NOSTALGIC_QUOTES } from '../data/nostalgiaData';
import { colors } from '../theme/colors';

export const RotatingQuotesMobile: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % NOSTALGIC_QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const quote = NOSTALGIC_QUOTES[index];

  return (
    <View style={styles.card}>
      <Text style={styles.moodBadge}>{quote.mood}</Text>
      <Text style={styles.quoteBengali}>“{quote.bengali}”</Text>
      <Text style={styles.translation}>{quote.translation}</Text>
      <Text style={styles.source}>— {quote.source}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#12141C',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    alignItems: 'center',
  },
  moodBadge: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  quoteBengali: {
    color: '#FFF8F0',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  translation: {
    color: colors.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 6,
  },
  source: {
    color: colors.sepia,
    fontSize: 10,
    marginTop: 8,
  },
});
