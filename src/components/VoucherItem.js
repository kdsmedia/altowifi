import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatTime, formatRupiah, calcRemaining } from '../utils/helpers';

function VoucherItem({ voucher, tick, onPreview, onDelete }) {
  const rem = voucher.status === 'active' ? calcRemaining(voucher.expiresAt) : 0;
  const perc = voucher.tot > 0 ? (rem / voucher.tot) * 100 : 0;
  const barColor =
    rem < 600 ? '#ef4444' : rem < 3600 ? '#f59e0b' : '#3b82f6';
  const isExpired = voucher.status === 'expired';

  return (
    <View style={[styles.card, isExpired && styles.cardExpired]}>
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.userName} numberOfLines={1}>{voucher.user}</Text>
          <Text style={[styles.timer, isExpired ? styles.timerExpired : styles.timerActive]}>
            {isExpired ? 'Selesai' : formatTime(rem)}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.infoText}>{voucher.ssid} • {voucher.h} Jam • {formatRupiah(voucher.price)}</Text>
        </View>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${Math.max(0, Math.min(100, perc))}%`, backgroundColor: barColor }]} />
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onPreview(voucher)} style={styles.actionBtn}>
          <Text style={styles.previewIcon}>👁</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(voucher.id)} style={styles.actionBtn}>
          <Text style={styles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default React.memo(VoucherItem);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardExpired: { opacity: 0.5 },
  body: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: { fontSize: 14, fontWeight: '700', color: '#1e293b', flex: 1, marginRight: 8 },
  timer: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  timerActive: { color: '#2563eb' },
  timerExpired: { color: '#ef4444' },
  info: { marginTop: 4 },
  infoText: { fontSize: 10, color: '#94a3b8', fontWeight: '500' },
  barBg: {
    height: 5,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 8,
  },
  barFill: { height: '100%', borderRadius: 10 },
  actions: { flexDirection: 'row', gap: 4, marginLeft: 8 },
  actionBtn: { padding: 8 },
  previewIcon: { fontSize: 16 },
  deleteIcon: { fontSize: 16 },
});
