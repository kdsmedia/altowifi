import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * @param {{ visible, title, message, type, onClose, onConfirm }} props
 * type: 'success' | 'error' | 'confirm'
 */
export default function AlertPopup({ visible, title, message, type = 'success', onClose, onConfirm }) {
  const isConfirm = type === 'confirm';

  const iconContent = {
    success: { emoji: '✅', bg: '#dcfce7', color: '#22c55e' },
    error: { emoji: '⚠️', bg: '#fef3c7', color: '#f59e0b' },
    confirm: { emoji: '🗑️', bg: '#fee2e2', color: '#ef4444' },
  }[type] || { emoji: '✅', bg: '#dcfce7', color: '#22c55e' };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.backdrop} />
        <View style={styles.popup}>
          <View style={[styles.iconCircle, { backgroundColor: iconContent.bg }]}>
            <Text style={styles.iconEmoji}>{iconContent.emoji}</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {isConfirm ? (
            <View style={styles.confirmRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => { onConfirm?.(); onClose(); }}
              >
                <Text style={styles.confirmText}>Ya</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.okBtn} onPress={onClose}>
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.4)',
  },
  popup: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconEmoji: { fontSize: 22 },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
  },
  message: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  okBtn: {
    width: '100%',
    padding: 14,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  okText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  confirmRow: { flexDirection: 'row', gap: 8, width: '100%' },
  cancelBtn: {
    flex: 1,
    padding: 14,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: { color: '#64748b', fontSize: 14, fontWeight: '700' },
  confirmBtn: {
    flex: 1,
    padding: 14,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
