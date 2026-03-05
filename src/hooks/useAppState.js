import { useState, useEffect, useRef, useCallback } from 'react';
import { loadVouchers, saveVouchers, loadConfig, saveConfig as persistConfig } from '../utils/storage';

export function useAppState() {
  const [vouchers, setVouchers] = useState([]);
  const [config, setConfig] = useState({
    ssid1: 'WiFi_Utama', pass1: '',
    ssid2: 'WiFi_Extender', pass2: '',
  });
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);
  const saveThrottle = useRef(0);

  // Load on mount
  useEffect(() => {
    (async () => {
      const [v, c] = await Promise.all([loadVouchers(), loadConfig()]);
      setVouchers(v);
      setConfig(c);
      setLoading(false);
    })();
  }, []);

  // Real-time countdown engine
  useEffect(() => {
    if (loading) return;

    intervalRef.current = setInterval(() => {
      setVouchers(prev => {
        let changed = false;
        const next = prev.map(v => {
          if (v.status !== 'active') return v;
          const rem = v.rem - 1;
          if (rem <= 0) {
            changed = true;
            return { ...v, rem: 0, status: 'expired' };
          }
          return { ...v, rem };
        });

        // Save periodically or on status change
        saveThrottle.current++;
        if (changed || saveThrottle.current >= 10) {
          saveThrottle.current = 0;
          saveVouchers(next);
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loading]);

  const addVoucher = useCallback((voucher) => {
    setVouchers(prev => {
      const next = [...prev, voucher];
      saveVouchers(next);
      return next;
    });
  }, []);

  const deleteVoucher = useCallback((id) => {
    setVouchers(prev => {
      const next = prev.filter(v => v.id !== id);
      saveVouchers(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setVouchers([]);
    saveVouchers([]);
  }, []);

  const updateConfig = useCallback(async (newConfig) => {
    setConfig(newConfig);
    await persistConfig(newConfig);
  }, []);

  // Stats
  const stats = vouchers.reduce(
    (acc, v) => {
      acc.revenue += v.price;
      if (v.status === 'active') acc.active++;
      else acc.expired++;
      return acc;
    },
    { revenue: 0, active: 0, expired: 0 }
  );

  return {
    vouchers,
    config,
    stats,
    loading,
    addVoucher,
    deleteVoucher,
    clearAll,
    updateConfig,
  };
}
