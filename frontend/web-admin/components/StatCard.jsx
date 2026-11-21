export default function StatCard({
  title,
  value,
  icon,
  color,
  description,
}) {
  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200">
      {/* Subtle top indicator line with gradient */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${color} opacity-80 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-2 truncate">
            {value ?? 0}
          </h2>

          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors" />
            <span className="truncate">{description}</span>
          </p>
        </div>

        <div
          className={`${color} w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg shadow-sm shadow-slate-900/10 shrink-0 group-hover:scale-105 transition-transform duration-200`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
