import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { INITIAL_SCRIBBLES } from '../data/nostalgiaData';
import { ScribbleNote } from '../types';
import { WriteMemoryModalMobile } from './WriteMemoryModalMobile';
import { colors } from '../theme/colors';

export const DiaryLastPageMobile: React.FC = () => {
  const [scribbles, setScribbles] = useState<ScribbleNote[]>(INITIAL_SCRIBBLES);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSaveNote = (newNote: ScribbleNote) => {
    setScribbles((prev) => [newNote, ...prev]);
  };

  const handleLike = (id: string) => {
    setScribbles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>ডায়েরির শেষ পাতা (The Last Page)</Text>
          <Text style={styles.subTitle}>ব্যাকবেঞ্চের কাটাকাটি ও বন্ধুদের গোপন লিরিক্স</Text>
        </View>

        <TouchableOpacity style={styles.writeBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.writeBtnText}>+ লিখুন</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scribblesList}>
        {scribbles.map((sc) => (
          <View key={sc.id} style={styles.noteCard}>
            <Text style={styles.noteText}>{sc.text}</Text>
            <View style={styles.noteFooter}>
              <Text style={styles.author}>— {sc.author} ({sc.date})</Text>

              <TouchableOpacity style={styles.likeBadge} onPress={() => handleLike(sc.id)}>
                <Text style={styles.likeText}>❤️ {sc.likes}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <WriteMemoryModalMobile
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveNote}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  subTitle: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  writeBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  writeBtnText: {
    color: '#0A0C10',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scribblesList: {
    gap: 10,
  },
  noteCard: {
    backgroundColor: '#161922',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
  },
  noteText: {
    color: '#F0E8DD',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  author: {
    color: colors.sepia,
    fontSize: 11,
  },
  likeBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  likeText: {
    color: colors.rose,
    fontSize: 11,
    fontWeight: '600',
  },
});
