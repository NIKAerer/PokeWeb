import { Link } from "react-router-dom";
import TypeBadge from "./TypeBadge";
import { TYPES, artworkUrl, formatNumber } from "../utils/pokemon";

export default function PokemonCard({ pokemon }) {
  const color = TYPES[pokemon.type1]?.color ?? "#64748b";

  return (
    <Link
      to={`/pokedex/${pokemon.id}`}
      className="group relative flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-950/70 p-4 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[var(--type-color)] hover:shadow-[0_0_25px_var(--type-glow)]"
      style={{ "--type-color": color, "--type-glow": `${color}55` }}
    >
      <span className="self-start font-rajdhani text-sm text-slate-500">
        {formatNumber(pokemon.id)}
      </span>

      {pokemon.legendary && (
        <span className="absolute right-3 top-3 text-amber-300" title="Légendaire">
          ★
        </span>
      )}

      <img
        src={artworkUrl(pokemon.id)}
        alt={pokemon.name}
        loading="lazy"
        className="h-28 w-28 object-contain transition duration-300 group-hover:scale-110"
      />

      <h2 className="mt-2 font-orbitron text-base text-white">{pokemon.name}</h2>

      <div className="mt-2 flex gap-1.5">
        <TypeBadge type={pokemon.type1} />
        {pokemon.type2 && <TypeBadge type={pokemon.type2} />}
      </div>
    </Link>
  );
}
