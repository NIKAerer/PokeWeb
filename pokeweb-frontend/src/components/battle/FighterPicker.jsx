import { artworkUrl } from "../../utils/pokemon";

// Liste des Pokémon de la collection, pour choisir celui qui va combattre
export default function FighterPicker({ captures, onPick, onClose }) {
  return (
    <div className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 p-4">
      <div className="mb-3 flex items-center justify-between font-rajdhani">
        <p className="text-slate-200">Qui envoies-tu au combat ?</p>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          Fermer
        </button>
      </div>

      <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
        {captures.map((capture) => (
          <button
            key={capture.id}
            onClick={() => onPick(capture.id)}
            className="flex flex-col items-center rounded-xl border border-slate-800 p-2 transition hover:border-poke-blue hover:bg-slate-800"
          >
            <img src={artworkUrl(capture.pokemon.id)} alt="" className="h-14 w-14 object-contain" />
            <span className="truncate font-rajdhani text-sm text-white">
              {capture.nickname ?? capture.pokemon.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
