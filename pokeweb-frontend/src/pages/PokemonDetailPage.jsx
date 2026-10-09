import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import StatBar from "../components/StatBar";
import TypeBadge from "../components/TypeBadge";
import { STATS, TYPES, artworkUrl, formatNumber } from "../utils/pokemon";

const FIRST_ID = 1;
const LAST_ID = 721;

export default function PokemonDetailPage() {
  const { id } = useParams();
  // On garde l'id avec le résultat : si l'id de l'URL change, l'ancien résultat
  // n'est plus affiché et on montre "Chargement…" en attendant le nouveau.
  const [result, setResult] = useState({ id: null, pokemon: null, error: "" });

  useEffect(() => {
    let ignore = false; // évite d'afficher une réponse arrivée trop tard

    api
      .get(`/pokemon/${id}`)
      .then((response) => !ignore && setResult({ id, pokemon: response.data, error: "" }))
      .catch(() => !ignore && setResult({ id, pokemon: null, error: "Ce Pokémon est introuvable." }));

    return () => {
      ignore = true;
    };
  }, [id]);

  const isCurrent = result.id === id;
  const pokemon = isCurrent ? result.pokemon : null;
  const error = isCurrent ? result.error : "";

  if (error) {
    return (
      <main className="relative z-10 flex min-h-page flex-col items-center justify-center gap-6 px-4">
        <p className="font-rajdhani text-xl text-red-400">{error}</p>
        <Link to="/pokedex" className="font-rajdhani text-slate-300 hover:text-white">
          ← Retour au Pokédex
        </Link>
      </main>
    );
  }

  if (!pokemon) {
    return (
      <main className="relative z-10 flex min-h-page items-center justify-center">
        <p className="font-rajdhani text-slate-400">Chargement…</p>
      </main>
    );
  }

  const color = TYPES[pokemon.type1]?.color ?? "#64748b";
  const previousId = pokemon.id > FIRST_ID ? pokemon.id - 1 : null;
  const nextId = pokemon.id < LAST_ID ? pokemon.id + 1 : null;

  return (
    <main className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-8">
      <div className="flex items-center justify-between font-rajdhani text-slate-400">
        <Link to="/pokedex" className="hover:text-white">
          ← Tout le Pokédex
        </Link>
        <div className="flex gap-6">
          {previousId && (
            <Link to={`/pokedex/${previousId}`} className="hover:text-white">
              ‹ {formatNumber(previousId)}
            </Link>
          )}
          {nextId && (
            <Link to={`/pokedex/${nextId}`} className="hover:text-white">
              {formatNumber(nextId)} ›
            </Link>
          )}
        </div>
      </div>

      <section className="mt-6 grid items-center gap-10 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 backdrop-blur-xl sm:p-10 md:grid-cols-2">
        {/* Illustration avec un halo de la couleur du type */}
        <div className="relative flex justify-center">
          <div
            className="absolute inset-10 rounded-full blur-3xl"
            style={{ backgroundColor: `${color}40` }}
          />
          <img
            src={artworkUrl(pokemon.id)}
            alt={pokemon.name}
            className="relative w-64 object-contain drop-shadow-2xl sm:w-80"
          />
        </div>

        <div>
          <p className="font-rajdhani text-lg text-slate-500">{formatNumber(pokemon.id)}</p>
          <h1 className="font-orbitron text-4xl text-white md:text-5xl">{pokemon.name}</h1>
          <p className="mt-1 font-rajdhani text-lg text-slate-400">{pokemon.category}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <TypeBadge type={pokemon.type1} size="lg" />
            {pokemon.type2 && <TypeBadge type={pokemon.type2} size="lg" />}
            {pokemon.legendary && (
              <span className="rounded-full border border-amber-300/60 px-4 py-1.5 font-rajdhani font-semibold uppercase tracking-wider text-amber-300">
                ★ Légendaire
              </span>
            )}
          </div>

          <p className="mt-6 font-rajdhani text-lg leading-relaxed text-slate-300">
            {pokemon.description}
          </p>

          <p className="mt-2 font-rajdhani text-slate-500">Génération {pokemon.generation}</p>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 backdrop-blur-xl sm:p-10">
        <h2 className="mb-6 font-orbitron text-2xl text-white">Statistiques</h2>
        <div className="space-y-3">
          {STATS.map((stat) => (
            <StatBar key={stat.key} label={stat.label} value={pokemon[stat.key]} color={color} />
          ))}
        </div>
        <p className="mt-6 text-right font-rajdhani text-lg text-slate-300">
          Total : <span className="font-semibold text-white">{pokemon.total}</span>
        </p>
      </section>
    </main>
  );
}
