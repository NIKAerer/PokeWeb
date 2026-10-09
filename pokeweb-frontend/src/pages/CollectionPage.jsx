import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import CollectionCard from "../components/CollectionCard";

export default function CollectionPage() {
  const [collection, setCollection] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/collection")
      .then((response) => setCollection(response.data))
      .catch(() => setError("Impossible de charger ta collection."));
  }, []);

  const rename = async (id, nickname) => {
    const response = await api.patch(`/collection/${id}`, { nickname });
    // On remplace la capture modifiée dans la liste
    setCollection((current) => ({
      ...current,
      pokemons: current.pokemons.map((capture) => (capture.id === id ? response.data : capture)),
    }));
  };

  const release = async (id) => {
    await api.delete(`/collection/${id}`);
    // Le compteur d'espèces peut changer : on recharge la collection
    const response = await api.get("/collection");
    setCollection(response.data);
  };

  const progress = collection ? (collection.discovered / collection.pokedexSize) * 100 : 0;

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <header className="mb-8">
        <h1 className="font-orbitron text-4xl text-white md:text-5xl">Ma collection</h1>

        {collection && (
          <div className="mt-4 max-w-md font-rajdhani">
            <p className="text-lg text-slate-300">
              <span className="font-semibold text-white">{collection.discovered}</span> /{" "}
              {collection.pokedexSize} espèces découvertes
            </p>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-poke-red to-poke-blue"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {error && <p className="font-rajdhani text-red-400">{error}</p>}
      {!collection && !error && <p className="font-rajdhani text-slate-400">Chargement…</p>}

      {collection?.pokemons.length === 0 && (
        <div className="flex flex-col items-center gap-6 py-20 text-center">
          <p className="font-rajdhani text-lg text-slate-300">
            Ta collection est vide pour l'instant. Pars à la recherche de ton premier Pokémon !
          </p>
          <Link
            to="/explorer"
            className="rounded-xl bg-[#ba181b] px-8 py-4 font-rajdhani text-lg font-semibold text-white shadow-[0_0_20px_#ef4444] transition-all hover:bg-[#a4161a]"
          >
            Explorer les hautes herbes
          </Link>
        </div>
      )}

      {collection?.pokemons.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {collection.pokemons.map((capture) => (
            <CollectionCard key={capture.id} capture={capture} onRename={rename} onRelease={release} />
          ))}
        </div>
      )}
    </main>
  );
}
