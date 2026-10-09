// 255 est la valeur maximale possible d'une statistique de base
const MAX_STAT = 255;

export default function StatBar({ label, value, color }) {
  const percent = Math.round((value / MAX_STAT) * 100);

  return (
    <div className="flex items-center gap-3 font-rajdhani">
      <span className="w-24 shrink-0 text-slate-400">{label}</span>
      <span className="w-10 shrink-0 text-right font-semibold text-white">{value}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
