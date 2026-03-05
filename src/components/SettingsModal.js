import React, { useState, useEffect } from 'react';
import {
  View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, ScrollView, Linking,
  KeyboardAvoidingView, Platform,
} from 'react-native';

export default function SettingsModal({ visible, onClose, config, onSave }) {
  const [ssid1, setSsid1] = useState('');
  const [pass1, setPass1] = useState('');
  const [ssid2, setSsid2] = useState('');
  const [pass2, setPass2] = useState('');

  useEffect(() => {
    if (visible) {
      setSsid1(config.ssid1 || '');
      setPass1(config.pass1 || '');
      setSsid2(config.ssid2 || '');
      setPass2(config.pass2 || '');
    }
  }, [visible, config]);

  const handleSave = () => {
    onSave({ ssid1, pass1, ssid2, pass2 });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Konfigurasi & Informasi</Text>

            {/* Connection Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pengaturan Koneksi</Text>

              <View style={[styles.wifiBox, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
                <Text style={[styles.wifiLabel, { color: '#2563eb' }]}>WiFi Utama</Text>
                <TextInput
                  style={[styles.wifiInput, { borderColor: '#bfdbfe' }]}
                  placeholder="SSID Utama"
                  placeholderTextColor="#94a3b8"
                  value={ssid1}
                  onChangeText={setSsid1}
                />
                <TextInput
                  style={[styles.wifiInput, { borderColor: '#bfdbfe' }]}
                  placeholder="Password Utama"
                  placeholderTextColor="#94a3b8"
                  value={pass1}
                  onChangeText={setPass1}
                  secureTextEntry
                />
              </View>

              <View style={[styles.wifiBox, { backgroundColor: '#faf5ff', borderColor: '#e9d5ff' }]}>
                <Text style={[styles.wifiLabel, { color: '#7c3aed' }]}>WiFi Extender</Text>
                <TextInput
                  style={[styles.wifiInput, { borderColor: '#e9d5ff' }]}
                  placeholder="SSID Extender"
                  placeholderTextColor="#94a3b8"
                  value={ssid2}
                  onChangeText={setSsid2}
                />
                <TextInput
                  style={[styles.wifiInput, { borderColor: '#e9d5ff' }]}
                  placeholder="Password Extender"
                  placeholderTextColor="#94a3b8"
                  value={pass2}
                  onChangeText={setPass2}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
                <Text style={styles.saveBtnText}>SIMPAN PENGATURAN</Text>
              </TouchableOpacity>
            </View>

            {/* About */}
            <View style={[styles.infoBox, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
              <Text style={[styles.infoTitle, { color: '#2563eb' }]}>Tentang Aplikasi</Text>
              <Text style={[styles.infoText, { color: '#1e40af' }]}>
                AltoWIFI adalah sistem manajemen voucher WiFi lokal yang dirancang untuk mempermudah
                Dani dalam mengelola akses hotspot pribadi secara mandiri tanpa mikrotik.
              </Text>
            </View>

            {/* Privacy */}
            <View style={[styles.infoBox, { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }]}>
              <Text style={[styles.infoTitle, { color: '#94a3b8' }]}>Privacy Policy</Text>
              <Text style={[styles.infoText, { color: '#64748b' }]}>
                Aplikasi ini tidak mengirimkan data ke server luar. Semua data tersimpan aman di perangkat Anda.
              </Text>
            </View>

            {/* Disclaimer */}
            <View style={[styles.infoBox, { backgroundColor: '#fffbeb', borderColor: '#fde68a' }]}>
              <Text style={[styles.infoTitle, { color: '#d97706' }]}>Disclaimer</Text>
              <Text style={[styles.infoText, { color: '#b45309' }]}>
                Kami tidak bertanggung jawab atas penggunaan jaringan yang melanggar hukum.
              </Text>
            </View>

            {/* Telegram */}
            <TouchableOpacity
              style={styles.telegramBtn}
              onPress={() => Linking.openURL('https://t.me/atomediaindonesia')}
              activeOpacity={0.8}
            >
              <Text style={styles.telegramText}>📨  Telegram Contact</Text>
              <Text style={styles.telegramArrow}>›</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.6)',
  },
  content: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1e293b',
  },
  section: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  wifiBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  wifiLabel: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  wifiInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 13,
    color: '#1e293b',
    marginBottom: 6,
  },
  saveBtn: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  infoBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoText: { fontSize: 11, lineHeight: 18 },
  telegramBtn: {
    backgroundColor: '#229ED9',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#229ED9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  telegramText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  telegramArrow: { color: 'rgba(255,255,255,0.5)', fontSize: 24, fontWeight: '700' },
});
