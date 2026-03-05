import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_K = 'altowifi_data_v7';
const CONFIG_K = 'altowifi_config_v7';

const DEFAULT_CONFIG = {
  ssid1: 'WiFi_Utama',
  pass1: '',
  ssid2: 'WiFi_Extender',
  pass2: '',
};

export async function loadVouchers() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_K);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveVouchers(vouchers) {
  try {
    await AsyncStorage.setItem(STORAGE_K, JSON.stringify(vouchers));
  } catch (e) {
    console.warn('Failed to save vouchers', e);
  }
}

export async function loadConfig() {
  try {
    const raw = await AsyncStorage.getItem(CONFIG_K);
    return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : { ...DEFAULT_CONFIG };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export async function saveConfig(config) {
  try {
    await AsyncStorage.setItem(CONFIG_K, JSON.stringify(config));
  } catch (e) {
    console.warn('Failed to save config', e);
  }
}
