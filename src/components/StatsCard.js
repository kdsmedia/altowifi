import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatRupiah } from '../utils/helpers';

export default function StatsCard({ stats }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1e40af', '#3b82f6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.revenueCard}
      >
        <Text style={styles.revenueLabel}>Total Pendapatan</Text>
        <Text style={styles.revenueValue}>{formatRupiah(stats.revenue)}</Text>
      </LinearGradient>

      <View style={styles.row}>
        <View style={styles.smallCard}>
          <Text style={styles.smallLabel}>User Aktif</Text>
          <Text style={[styles.smallValue, { color: '#2563eb' }]}>{stats.active}</Text>
        </View>
        <View style={styles.smallCard}>
          <Text style={styles.smallLabel}>Expired</Text>
          <Text style={[styles.smallValue, { color: '#94a3b8' }]}>{stats.expired}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  revenueCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  revenueLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  revenueValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  row: { flexDirection: 'row', gap: 12 },
  smallCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  smallLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  smallValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
  },
});
