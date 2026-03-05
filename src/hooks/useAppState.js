import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import { loadVouchers, saveVouchers, loadConfig, saveConfig as persistConfig } from '../utils/storage';
import { calcRemaining } from '../utils/helpers';

export function useAppState() {
  const [vouchers, setVouchers] = useState([]);
  const [config, setConfig] = useState({
    ssid1: 'WiFi_Utama', pass1: '',
    ssid2: 'WiFi_Extender', pass2: '',
  });
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0); // Force re-render trigger
  const intervalRef = useRef(null);
  const saveThrottle = useRef(0);
  const appStateRef = useRef(AppState.currentState);

  // Load on mount
  useEffect(() => {
    (async () => {
      const [v, c] = await Promise.all([loadVouchers(), loadConfig()]);
      setVouchers(v);
      setConfig(c);
      setLoading(false);
    })();
  }, []);

  // AppState listener: when app returns from background, force re-calc
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App came back to foreground — expire any vouchers that should have expired
        setVouchers(prev => {
          let changed = false;
          const updated = prev.map(v => {
            if (v.status !== 'active') return v;
            const rem = calcRemaining(v.expiresAt);
            if (rem <= 0) {
              changed = true;
              return { ...v, status: 'expired' };
            }
            return v;
          });
          if (changed) saveVouchers(updated);
          return changed ? updated : prev;
        });
        // Force a tick to update displayed times
        setTick(t => t + 1);
      }
      appStateRef.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  // Real-time display tick (1 second interval)
  // This only bumps a counter to trigger re-render. Actual remaining
  // is always calculated from expiresAt timestamp, so background drift
  // doesn't matter.
  useEffect(() => {
    if (loading) return;

    intervalRef.current = setInterval(() => {
      // Check for newly-expired vouchers
      setVouchers(prev => {
        let changed = false;
        const updated = prev.map(v => {
          if (v.status !== 'active') return v;
          const rem = calcRemaining(v.expiresAt);
          if (rem <= 0) {
            changed = true;
            return { ...v, status: 'expired' };
          }
          return v;
        });

        // Persist on status change or every 30 ticks (~30s)
        saveThrottle.current++;
        if (changed || saveThrottle.current >= 30) {
          saveThrottle.current = 0;
          saveVouchers(updated);
        }

        if (changed) return updated;
        return prev;
      });

      // Bump tick to re-render countdown display
      setTick(t => t + 1);
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
    tick, // consumers use this to know when to re-read calcRemaining
    addVoucher,
    deleteVoucher,
    clearAll,
    updateConfig,
  };
}
