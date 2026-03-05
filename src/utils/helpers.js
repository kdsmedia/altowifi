export function formatTime(seconds) {
  if (seconds <= 0) return 'Selesai';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function formatRupiah(num) {
  return 'Rp ' + num.toLocaleString('id-ID');
}

export function formatDate(dateStr) {
  if (dateStr) return dateStr;
  return new Date().toLocaleString('id-ID');
}

export function generateUsername() {
  return 'USER-' + Math.floor(100 + Math.random() * 899);
}

/**
 * Calculate remaining seconds from an expiry timestamp.
 * Returns 0 if already expired.
 */
export function calcRemaining(expiresAt) {
  if (!expiresAt) return 0;
  const diff = Math.floor((expiresAt - Date.now()) / 1000);
  return diff > 0 ? diff : 0;
}

export const PLANS = [
  { hours: 1, price: 2000, label: '1 Jam' },
  { hours: 5, price: 5000, label: '5 Jam' },
  { hours: 12, price: 10000, label: '12 Jam' },
  { hours: 24, price: 15000, label: '24 Jam' },
];
