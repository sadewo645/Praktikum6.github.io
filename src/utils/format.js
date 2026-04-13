export const formatDateTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(date);
};

export const statusClass = (status) => {
  if (status === 'aman') return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60';
  if (status === 'warning') return 'bg-amber-500/20 text-amber-300 border-amber-400/60';
  if (status === 'bahaya') return 'bg-rose-500/20 text-rose-300 border-rose-400/60';
  return 'bg-slate-500/20 text-slate-200 border-slate-400/40';
};

export const exportCsv = (rows) => {
  const header = ['waktu', 'adc', 'kelembaban', 'status'];
  const body = rows.map((r) => [r.waktu, r.adc ?? '', r.kelembaban ?? '', r.status]);
  const csv = [header, ...body].map((line) => line.join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sensor-data-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
