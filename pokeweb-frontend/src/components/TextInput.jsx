// Champ de formulaire avec son libellé (le libellé est lu par les lecteurs d'écran).
export default function TextInput({ label, ...inputProps }) {
  return (
    <label className="mb-5 block font-rajdhani">
      <span className="mb-1.5 block text-sm font-semibold uppercase tracking-wider text-slate-400">{label}</span>
      <input
        {...inputProps}
        className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-lg text-slate-200 outline-none transition focus:border-poke-red focus:ring-2 focus:ring-poke-red/60"
      />
    </label>
  );
}
