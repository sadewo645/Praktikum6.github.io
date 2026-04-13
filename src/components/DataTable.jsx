import StatusBadge from './StatusBadge';
import { formatDateTime } from '../utils/format';

export default function DataTable({ rows }) {
  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-8 text-center text-slate-400">
        Belum ada data sensor. Kirim data dari perangkat Anda terlebih dahulu.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/40">
      <div className="max-h-96 overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-slate-900/95 text-xs uppercase tracking-wide text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left">Waktu</th>
              <th className="px-4 py-3 text-left">ADC</th>
              <th className="px-4 py-3 text-left">Kelembaban</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.waktu}-${i}`} className="border-t border-slate-800 text-slate-200 hover:bg-cyan-500/5">
                <td className="px-4 py-3">{formatDateTime(r.waktu)}</td>
                <td className="px-4 py-3">{r.adc ?? '-'}</td>
                <td className="px-4 py-3">{r.kelembaban ?? '-'}%</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
