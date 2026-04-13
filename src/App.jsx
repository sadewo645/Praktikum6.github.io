import { useEffect, useMemo, useState } from 'react';
import ChartsPanel from './components/ChartsPanel';
import DataTable from './components/DataTable';
import LoadingSkeleton from './components/LoadingSkeleton';
import SummaryCard from './components/SummaryCard';
import StatusBadge from './components/StatusBadge';
import { AUTO_REFRESH_MS } from './config';
import { fetchSensorData } from './services/api';
import { exportCsv, formatDateTime } from './utils/format';

const isDangerStatus = (status) => ['bahaya', 'warning'].includes(status);

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const load = async () => {
    setError('');
    try {
      const result = await fetchSensorData();
      setRows(result.records);
      setLastUpdate(new Date());
      if (result.records[0] && isDangerStatus(result.records[0].status)) {
        setAlertMessage(`Perhatian: status terbaru ${result.records[0].status.toUpperCase()}!`);
      } else {
        setAlertMessage('');
      }
    } catch (err) {
      setError(err.message || 'Gagal mengambil data sensor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, AUTO_REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false;
      const t = new Date(row.waktu).getTime();
      if (startDate && t < new Date(`${startDate}T00:00:00`).getTime()) return false;
      if (endDate && t > new Date(`${endDate}T23:59:59`).getTime()) return false;
      return true;
    });
  }, [rows, statusFilter, startDate, endDate]);

  const latest = rows[0];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6">
        <header className="animate-fadeIn rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-slate-900 to-slate-800 p-4 shadow-neon backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">IoT Monitoring</p>
              <h1 className="text-2xl font-bold">Neon Sensor Dashboard</h1>
              <p className="text-sm text-slate-400">Last update: {lastUpdate ? formatDateTime(lastUpdate) : '-'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={load} className="rounded-xl border border-cyan-300/50 bg-cyan-500/20 px-4 py-2 text-sm font-medium transition hover:scale-105 hover:bg-cyan-500/30">Refresh</button>
              <button onClick={() => exportCsv(filtered)} className="rounded-xl border border-purple-300/50 bg-purple-500/20 px-4 py-2 text-sm font-medium transition hover:scale-105 hover:bg-purple-500/30">Export CSV</button>
            </div>
          </div>
        </header>

        {alertMessage && (
          <div className="animate-pulseGlow rounded-xl border border-rose-400/50 bg-rose-500/20 px-4 py-3 text-sm font-semibold text-rose-200">
            {alertMessage}
          </div>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="rounded-2xl border border-rose-400/50 bg-rose-500/15 p-6 text-rose-100">Error API: {error}</div>
        ) : (
          <>
            <section className="grid animate-fadeIn grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SummaryCard title="Total Data" value={rows.length} subtitle="Jumlah histori sensor" />
              <SummaryCard title="ADC Terbaru" value={latest?.adc ?? '-'} subtitle="Sample terakhir" />
              <SummaryCard title="Kelembaban Terbaru" value={latest?.kelembaban != null ? `${latest.kelembaban}%` : '-'} subtitle="Dalam persen" />
              <div className="rounded-2xl border border-cyan-400/20 bg-white/5 p-4 shadow-neon backdrop-blur-sm">
                <p className="text-xs uppercase tracking-wider text-slate-300">Status Terbaru</p>
                <div className="mt-3"><StatusBadge status={latest?.status || 'unknown'} /></div>
                <p className="mt-3 text-xs text-slate-400">Auto refresh {AUTO_REFRESH_MS / 1000}s</p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-700 bg-slate-900/40 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <div>
                  <label className="mb-1 block text-xs text-slate-300">Filter Status</label>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm">
                    <option value="all">Semua</option>
                    <option value="aman">Aman</option>
                    <option value="warning">Warning</option>
                    <option value="bahaya">Bahaya</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-300">Dari Tanggal</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-300">Sampai Tanggal</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm" />
                </div>
              </div>
            </section>

            <ChartsPanel rows={filtered} />
            <DataTable rows={filtered} />
          </>
        )}
      </div>
    </main>
  );
}
