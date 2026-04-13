import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const baseOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#cbd5e1' },
    },
  },
  scales: {
    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,.12)' } },
    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,.12)' } },
  },
};

export default function ChartsPanel({ rows }) {
  const ordered = [...rows].reverse();
  const labels = ordered.map((r) => new Date(r.waktu).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));

  const adcData = {
    labels,
    datasets: [
      {
        label: 'ADC',
        data: ordered.map((r) => r.adc),
        borderColor: '#00f7ff',
        backgroundColor: 'rgba(0,247,255,.2)',
        tension: 0.35,
      },
    ],
  };

  const humData = {
    labels,
    datasets: [
      {
        label: 'Kelembaban (%)',
        data: ordered.map((r) => r.kelembaban),
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168,85,247,.18)',
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const counts = rows.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = {
    labels: Object.keys(counts),
    datasets: [
      {
        data: Object.values(counts),
        backgroundColor: ['#10b981', '#f59e0b', '#f43f5e', '#64748b'],
        borderColor: '#020617',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border border-cyan-400/20 bg-white/5 p-4 backdrop-blur-sm lg:col-span-2">
        <h4 className="mb-2 text-sm font-semibold text-cyan-300">Tren ADC</h4>
        <div className="h-64"><Line data={adcData} options={baseOpts} /></div>
      </div>
      <div className="rounded-2xl border border-purple-400/20 bg-white/5 p-4 backdrop-blur-sm">
        <h4 className="mb-2 text-sm font-semibold text-purple-300">Distribusi Status</h4>
        <div className="h-64"><Doughnut data={statusData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#cbd5e1' } } } }} /></div>
      </div>
      <div className="rounded-2xl border border-purple-400/20 bg-white/5 p-4 backdrop-blur-sm lg:col-span-3">
        <h4 className="mb-2 text-sm font-semibold text-purple-300">Tren Kelembaban</h4>
        <div className="h-64"><Line data={humData} options={baseOpts} /></div>
      </div>
    </div>
  );
}
