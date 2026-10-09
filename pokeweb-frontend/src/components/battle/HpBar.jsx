// Barre de points de vie : verte, puis jaune sous 50 %, puis rouge sous 20 %
export default function HpBar({ hp, maxHp }) {
  const percent = Math.round((hp / maxHp) * 100);
  const color = percent > 50 ? "bg-emerald-400" : percent > 20 ? "bg-amber-400" : "bg-red-500";

  return (
    <div className="w-full font-rajdhani">
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-1 text-right text-sm text-slate-400">
        {hp} / {maxHp} PV
      </p>
    </div>
  );
}
