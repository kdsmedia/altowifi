import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_K = 'altowifi_data_v8';
const CONFIG_K = 'altowifi_config_v8';
const MIGRATE_K = 'altowifi_migrated_v8';

const DEFAULT_CONFIG = {
  ssid1: 'WiFi_Utama',
  pass1: '',
  ssid2: 'WiFi_Extender',
  pass2: '',
};

/**
 * Migrate v7 vouchers (rem-based) to v8 (expiresAt-based).
 * Only runs once. Old vouchers get an estimated expiresAt.
 */
async function migrateIfNeeded() {
  try {
    const done = await AsyncStorage.getItem(MIGRATE_K);
    if (done) return;

    const oldData = await AsyncStorage.getItem('altowifi_data_v7');
    if (oldData) {
      const oldVouchers = JSON.parse(oldData);
      const now = Date.now();
      const migrated = oldVouchers.map(v => ({
        ...v,
        expiresAt: v.expiresAt || (v.status === 'active' ? now + (v.rem || 0) * 1000 : now),
      }));
      await AsyncStorage.setItem(STORAGE_K, JSON.stringify(migrated));
    }

    // Also migrate config
    const oldConfig = await AsyncStorage.getItem('altowifi_config_v7');
    if (oldConfig) {
      await AsyncStorage.setItem(CONFIG_K, oldConfig);
    }

    await AsyncStorage.setItem(MIGRATE_K, '1');
  } catch (e) {
    console.warn('Migration failed', e);
  }
}

export async function loadVouchers() {
  try {
    await migrateIfNeeded();
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
    await migrateIfNeeded();
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
