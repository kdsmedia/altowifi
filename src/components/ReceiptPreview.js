import React, { useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform as RNPlatform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { formatRupiah } from '../utils/helpers';

export default function ReceiptPreview({ voucher, onClose }) {
  const viewShotRef = useRef(null);

  if (!voucher) return null;

  const qrValue = `WIFI:S:${voucher.ssid};T:WPA;P:${voucher.pass};;`;

  const handleDownload = useCallback(async () => {
    try {
      if (!viewShotRef.current || !viewShotRef.current.capture) {
        Alert.alert('Error', 'Gagal menginisialisasi capture.');
        return;
      }
      const uri = await viewShotRef.current.capture();

      if (RNPlatform.OS === 'web') {
        Alert.alert('Info', 'Download tidak tersedia di web.');
        return;
      }

      const filename = `Voucher_${voucher.id}.png`;
      const destPath = `${FileSystem.cacheDirectory}${filename}`;

      // If capture returns a different location, copy it
      if (uri !== destPath) {
        await FileSystem.copyAsync({ from: uri, to: destPath });
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(destPath, {
          mimeType: 'image/png',
          dialogTitle: 'Simpan Voucher',
        });
      } else {
        Alert.alert('Berhasil', `Voucher disimpan: ${filename}`);
      }
    } catch (err) {
      console.error('Download error:', err);
      Alert.alert('Error', 'Gagal mengunduh gambar: ' + (err.message || ''));
    }
  }, [voucher]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Preview Struk</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeBtn}>Tutup</Text>
        </TouchableOpacity>
      </View>

      <ViewShot
        ref={viewShotRef}
        options={{ format: 'png', quality: 1.0, result: 'tmpfile' }}
        style={styles.receipt}
      >
        <View style={styles.receiptInner}>
          <Text style={styles.receiptBrand}>ALTOWIFI</Text>
          <Text style={styles.receiptSubtitle}>INTERNET PREMIUM DANI</Text>
          <View style={styles.dividerDashed} />

          <Text style={styles.receiptHeading}>Akses WiFi Otomatis</Text>
          <Text style={styles.receiptDate}>{voucher.date}</Text>

          <View style={styles.qrContainer}>
            <QRCode value={qrValue} size={200} backgroundColor="#fff" color="#000" />
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>SSID:</Text>
              <Text style={styles.detailValue}>{voucher.ssid}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>USER:</Text>
              <Text style={styles.detailValue}>{voucher.user.toUpperCase()}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>DURASI:</Text>
              <Text style={styles.detailValue}>{voucher.h} JAM</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>TARIF:</Text>
              <Text style={styles.detailValue}>{formatRupiah(voucher.price)}</Text>
            </View>
          </View>
        </View>
      </ViewShot>

      <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload} activeOpacity={0.8}>
        <Text style={styles.downloadBtnText}>📥  UNDUH GAMBAR STRUK</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  closeBtn: { fontSize: 12, fontWeight: '700', color: '#ef4444' },
  receipt: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  receiptInner: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  receiptBrand: {
    fontSize: 32,
    fontWeight: '900',
    color: '#000',
    fontFamily: RNPlatform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 2,
  },
  receiptSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 3,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    width: '100%',
    textAlign: 'center',
    fontFamily: RNPlatform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  dividerDashed: {
    width: '100%',
    height: 0,
    marginVertical: 0,
  },
  receiptHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    textTransform: 'uppercase',
    marginTop: 20,
    fontFamily: RNPlatform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  receiptDate: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.5)',
    marginTop: 4,
    marginBottom: 20,
    fontFamily: RNPlatform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  qrContainer: {
    padding: 8,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  detailsContainer: { width: '100%' },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  detailLabel: {
    fontSize: 14,
    color: '#000',
    fontFamily: RNPlatform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    fontFamily: RNPlatform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  downloadBtn: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  downloadBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
