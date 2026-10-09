import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import PokemonCard from "../components/PokemonCard";
import { GENERATIONS, TYPES, normalize } from "../utils/pokemon";
import Loading from "../components/Loading";

const selectStyle =
  "rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 font-rajdhani text-slate-200 outline-none transition focus:border-poke-red focus:ring-2 focus:ring-poke-red/60";

export default function PokedexPage() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtres choisis par le joueur
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [generation, setGeneration] = useState("");
  const [legendaryOnly, setLegendaryOnly] = useState(false);

  // On charge les 721 Pokémon une seule fois, au premier affichage
  useEffect(() => {
    api
      .get("/pokemon")
      .then((response) => setPokemons(response.data))
      .catch(() => setError("Impossible de charger le Pokédex. L'API est-elle lancée ?"))
      .finally(() => setLoading(false));
  }, []);

  // La liste filtrée est recalculée seulement quand un filtre change
  const filtered = useMemo(() => {
    const query = normalize(search.trim());

    return pokemons.filter(
      (pokemon) =>
        (query === "" ||
          normalize(pokemon.name).includes(query) ||
          String(pokemon.id) === query) &&
        (type === "" || pokemon.type1 === type || pokemon.type2 === type) &&
        (generation === "" || pokemon.generation === Number(generation)) &&
        (!legendaryOnly || pokemon.legendary)
    );
  }, [pokemons, search, type, generation, legendaryOnly]);

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <header className="mb-8">
        <h1 className="font-orbitron text-4xl text-white md:text-5xl">Pokédex</h1>
        <p className="mt-2 font-rajdhani text-lg text-slate-400">
          Les 721 Pokémon des générations 1 à 6.
        </p>
      </header>

      {/* Filtres */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto]">
        <input
          type="search"
          placeholder="Rechercher un nom ou un numéro…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={selectStyle}
        />

        <select value={type} onChange={(e) => setType(e.target.value)} className={selectStyle}>
          <option value="">Tous les types</option>
          {Object.entries(TYPES).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={generation}
          onChange={(e) => setGeneration(e.target.value)}
          className={selectStyle}
        >
          <option value="">Toutes les générations</option>
          {GENERATIONS.map((gen) => (
            <option key={gen} value={gen}>
              Génération {gen}
            </option>
          ))}
        </select>

        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 font-rajdhani text-slate-200">
          <input
            type="checkbox"
            checked={legendaryOnly}
            onChange={(e) => setLegendaryOnly(e.target.checked)}
            className="h-4 w-4 accent-poke-red"
          />
          Légendaires
        </label>
      </div>

      {loading && <Loading text="Chargement du Pokédex…" />}

      {error && <p className="text-center font-rajdhani text-red-400">{error}</p>}

      {!loading && !error && (
        <>
          <p className="mb-4 font-rajdhani text-slate-400">
            {filtered.length} Pokémon {filtered.length > 1 ? "trouvés" : "trouvé"}
          </p>

          {filtered.length === 0 ? (
            <p className="py-20 text-center font-rajdhani text-lg text-slate-400">
              Aucun Pokémon ne correspond à ta recherche.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {filtered.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
