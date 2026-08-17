import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { ScribbleNote } from '../types';
import { colors } from '../theme/colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (note: ScribbleNote) => void;
}

export const WriteMemoryModalMobile: React.FC<Props> = ({ visible, onClose, onSave }) => {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');

  const handleSave = () => {
    if (!text.trim()) return;

    const newNote: ScribbleNote = {
      id: `sc-mob-${Date.now()}`,
      text: text.trim(),
      author: author.trim() || 'অচেনা শ্রোতা',
      date: 'আজ',
      inkColor: 'blue',
      likes: 1,
    };

    onSave(newNote);
    setText('');
    setAuthor('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>ডায়েরির শেষ পাতায় লিখুন (Write Memory)</Text>

          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="আপনার ফেলে আসা স্মৃতি বা প্রিয় গানের কথাটি লিখুন..."
            placeholderTextColor={colors.textSubtle}
            value={text}
            onChangeText={setText}
          />

          <TextInput
            style={styles.input}
            placeholder="আপনার নাম বা পরিচয় (ঐচ্ছিক)"
            placeholderTextColor={colors.textSubtle}
            value={author}
            onChangeText={setAuthor}
          />

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>বাতিল (Cancel)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
              <Text style={styles.submitText}>স্মৃতি সংরক্ষণ করুন (Save)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderColor: colors.border,
    borderWidth: 1,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: '#0D0F14',
    color: colors.text,
    borderRadius: 8,
    padding: 12,
    borderColor: colors.border,
    borderWidth: 1,
    minHeight: 90,
    textAlignVertical: 'top',
    fontSize: 14,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#0D0F14',
    color: colors.text,
    borderRadius: 8,
    padding: 12,
    borderColor: colors.border,
    borderWidth: 1,
    fontSize: 14,
    marginBottom: 16,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  submitBtn: {
    flex: 1.5,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#0A0C10',
    fontWeight: 'bold',
  },
});
