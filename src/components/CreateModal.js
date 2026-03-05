import React, { useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { PLANS, generateUsername } from '../utils/helpers';

export default function CreateModal({ visible, onClose, config, onSubmit }) {
  const [target, setTarget] = useState('main');
  const [username, setUsername] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(3); // index 3 = 24 jam

  const handleSubmit = () => {
    const plan = PLANS[selectedPlan];
    const ssid = target === 'main' ? config.ssid1 : config.ssid2;
    const pass = target === 'main' ? config.pass1 : config.pass2;

    if (!pass) {
      onSubmit(null, 'Set password di Pengaturan dulu!');
      return;
    }

    const name = username.trim() || generateUsername();
    const voucher = {
      id: Date.now(),
      user: name,
      price: plan.price,
      h: plan.hours,
      rem: plan.hours * 3600,
      tot: plan.hours * 3600,
      status: 'active',
      ssid,
      pass,
      target,
      date: new Date().toLocaleString('id-ID'),
    };

    setUsername('');
    onSubmit(voucher, null);
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
            <Text style={styles.title}>Buat Akses Baru</Text>

            {/* WiFi Target */}
            <Text style={styles.sectionLabel}>Pilih Target WiFi</Text>
            <View style={styles.targetRow}>
              <TouchableOpacity
                style={[styles.targetBtn, target === 'main' && styles.targetActive]}
                onPress={() => setTarget('main')}
              >
                <Text style={[styles.targetText, target === 'main' && styles.targetTextActive]}>
                  UTAMA
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.targetBtn, target === 'ext' && styles.targetActive]}
                onPress={() => setTarget('ext')}
              >
                <Text style={[styles.targetText, target === 'ext' && styles.targetTextActive]}>
                  EXTENDER
                </Text>
              </TouchableOpacity>
            </View>

            {/* Username */}
            <TextInput
              style={styles.input}
              placeholder="Nama Pelanggan"
              placeholderTextColor="#94a3b8"
              value={username}
              onChangeText={setUsername}
            />

            {/* Plans */}
            <View style={styles.planGrid}>
              {PLANS.map((plan, i) => (
                <TouchableOpacity
                  key={plan.hours}
                  style={[styles.planBtn, selectedPlan === i && styles.planActive]}
                  onPress={() => setSelectedPlan(i)}
                >
                  <Text style={[styles.planLabel, selectedPlan === i && styles.planLabelActive]}>
                    {plan.label}
                  </Text>
                  <Text style={[styles.planPrice, selectedPlan === i && styles.planPriceActive]}>
                    Rp {(plan.price / 1000)}k
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Submit */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
              <Text style={styles.submitText}>PROSES VOUCHER</Text>
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
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 6,
    marginLeft: 2,
  },
  targetRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  targetBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f1f5f9',
    alignItems: 'center',
  },
  targetActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  targetText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  targetTextActive: { color: '#1e40af' },
  input: {
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  planGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  planBtn: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f1f5f9',
  },
  planActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  planLabel: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  planLabelActive: { color: '#1e40af' },
  planPrice: { fontSize: 10, fontWeight: '700', color: '#3b82f6', marginTop: 2 },
  planPriceActive: { color: '#1e40af' },
  submitBtn: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
