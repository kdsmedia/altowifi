import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, Platform,
  ActivityIndicator,
} from 'react-native';
import { useAppState } from '../src/hooks/useAppState';
import StatsCard from '../src/components/StatsCard';
import VoucherItem from '../src/components/VoucherItem';
import ReceiptPreview from '../src/components/ReceiptPreview';
import CreateModal from '../src/components/CreateModal';
import SettingsModal from '../src/components/SettingsModal';
import AlertPopup from '../src/components/AlertPopup';

// Bundled native asset — no network needed
const LOGO_IMG = require('../assets/logo.png');

export default function HomeScreen() {
  const {
    vouchers, config, stats, loading,
    addVoucher, deleteVoucher, clearAll, updateConfig,
  } = useAppState();

  const [createVisible, setCreateVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [previewVoucher, setPreviewVoucher] = useState(null);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', type: 'success', onConfirm: null });

  const showAlert = useCallback((title, message, type = 'success', onConfirm = null) => {
    setAlert({ visible: true, title, message, type, onConfirm });
  }, []);

  const closeAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, visible: false }));
  }, []);

  const handleCreateSubmit = useCallback((voucher, error) => {
    if (error) {
      showAlert('Error', error, 'error');
      return;
    }
    addVoucher(voucher);
    setPreviewVoucher(voucher);
    setCreateVisible(false);
    showAlert('Berhasil', `Voucher ${voucher.user} berhasil dibuat!`);
  }, [addVoucher, showAlert]);

  const handleDeleteVoucher = useCallback((id) => {
    const v = vouchers.find(v => v.id === id);
    showAlert(
      'Hapus Voucher?',
      `Voucher ${v?.user || ''} akan dihapus.`,
      'confirm',
      () => {
        deleteVoucher(id);
        if (previewVoucher?.id === id) setPreviewVoucher(null);
      }
    );
  }, [vouchers, deleteVoucher, previewVoucher, showAlert]);

  const handleClearAll = useCallback(() => {
    showAlert('Reset Data?', 'Semua riwayat akan dihapus.', 'confirm', () => {
      clearAll();
      setPreviewVoucher(null);
    });
  }, [clearAll, showAlert]);

  const handleSaveConfig = useCallback(async (newConfig) => {
    await updateConfig(newConfig);
    setSettingsVisible(false);
    showAlert('Berhasil', 'Pengaturan disimpan');
  }, [updateConfig, showAlert]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  const sortedVouchers = [...vouchers].reverse();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header / Navbar */}
      <View style={styles.navbar}>
        <View style={styles.navLeft}>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => setSettingsVisible(true)}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
          <Image source={LOGO_IMG} style={styles.logo} />
          <View>
            <Text style={styles.brandName}>AltoWIFI</Text>
            <Text style={styles.brandSub}>Admin Panel v2.5</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setCreateVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>+ Voucher</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StatsCard stats={stats} />

        {/* Receipt Preview */}
        {previewVoucher && (
          <ReceiptPreview
            voucher={previewVoucher}
            onClose={() => setPreviewVoucher(null)}
          />
        )}

        {/* User Monitoring */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Monitoring User</Text>
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.resetBtn}>RESET</Text>
          </TouchableOpacity>
        </View>

        {sortedVouchers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📡</Text>
            <Text style={styles.emptyText}>Belum ada voucher aktif</Text>
            <Text style={styles.emptySubtext}>Tap "+ Voucher" untuk membuat akses baru</Text>
          </View>
        ) : (
          sortedVouchers.map(v => (
            <VoucherItem
              key={v.id}
              voucher={v}
              onPreview={setPreviewVoucher}
              onDelete={handleDeleteVoucher}
            />
          ))
        )}
      </ScrollView>

      {/* Modals */}
      <CreateModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        config={config}
        onSubmit={handleCreateSubmit}
      />
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        config={config}
        onSave={handleSaveConfig}
      />
      <AlertPopup
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={closeAlert}
        onConfirm={alert.onConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  navLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  settingsBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: { fontSize: 20 },
  logo: { width: 32, height: 32, borderRadius: 6 },
  brandName: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  brandSub: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  addBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  resetBtn: {
    fontSize: 10,
    fontWeight: '700',
    color: '#f87171',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 14, fontWeight: '600', color: '#94a3b8' },
  emptySubtext: { fontSize: 11, color: '#cbd5e1', marginTop: 4 },
});
