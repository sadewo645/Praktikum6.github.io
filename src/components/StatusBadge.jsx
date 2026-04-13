import { statusClass } from '../utils/format';

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold uppercase tracking-wide ${statusClass(status)}`}>
      {status}
    </span>
  );
}
