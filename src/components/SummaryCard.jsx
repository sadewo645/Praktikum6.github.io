export default function SummaryCard({ title, value, subtitle }) {
  return (
    <div className="group rounded-2xl border border-cyan-400/20 bg-white/5 p-4 shadow-neon backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-glow">
      <p className="text-xs uppercase tracking-wider text-slate-300">{title}</p>
      <h3 className="mt-2 text-2xl font-bold text-white">{value}</h3>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}
