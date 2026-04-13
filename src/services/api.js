import { API_ENDPOINT } from '../config';

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

export const normalizeRow = (row) => ({
  waktu: row.waktu || row.timestamp || row.time || '',
  adc: toNumber(row.adc),
  kelembaban: toNumber(row.kelembaban),
  status: String(row.status || 'unknown').toLowerCase(),
});

export async function fetchSensorData() {
  const url = `${API_ENDPOINT}?mode=getData`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`API gagal: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  const records = Array.isArray(payload?.data)
    ? payload.data.map(normalizeRow)
    : Array.isArray(payload)
      ? payload.map(normalizeRow)
      : [];

  records.sort((a, b) => new Date(b.waktu) - new Date(a.waktu));
  return {
    meta: payload.meta || {},
    records,
  };
}
