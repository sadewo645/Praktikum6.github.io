export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 rounded-xl bg-white/10" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-white/10" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="h-80 rounded-2xl bg-white/10 lg:col-span-2" />
        <div className="h-80 rounded-2xl bg-white/10" />
      </div>
      <div className="h-72 rounded-2xl bg-white/10" />
    </div>
  );
}
