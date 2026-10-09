import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import PokeballIcon from "../components/PokeballIcon";
import TypeBadge from "../components/TypeBadge";
import { TYPES, artworkUrl } from "../utils/pokemon";

const THROW_ANIMATION_MS = 1800; // durée des 3 secousses de la Pokéball

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const primaryButton =
  "rounded-xl bg-[#ba181b] px-8 py-4 font-rajdhani text-lg font-semibold text-white shadow-[0_0_20px_#ef4444] transition-all hover:bg-[#a4161a] hover:shadow-[0_0_35px_#3b82f6] disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButton =
  "rounded-xl border border-slate-600 px-8 py-4 font-rajdhani text-lg text-slate-200 transition hover:border-slate-400 hover:text-white disabled:opacity-50";

export default function ExplorePage() {
  // Réponse de l'API : rencontre en cours + rencontres restantes aujourd'hui
  const [state, setState] = useState(null);
  const [throwing, setThrowing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/encounter")
      .then((response) => setState(response.data))
      .catch(() => setError("Impossible de contacter l'API."));
  }, []);

  const searchPokemon = async () => {
    setMessage("");
    setError("");
    try {
      const response = await api.post("/encounter");
      setState(response.data);
    } catch (err) {
      setError(err.response?.data?.error ?? "Impossible de chercher un Pokémon.");
    }
  };

  const throwBall = async () => {
    setThrowing(true);
    setMessage("");
    try {
      // On attend la fin de l'animation ET la réponse de l'API avant d'afficher le résultat
      const [response] = await Promise.all([api.post("/encounter/throw"), wait(THROW_ANIMATION_MS)]);
      const { caught, encounter } = response.data;
      const name = encounter.pokemon.name;

      if (caught) {
        setMessage(`Gotcha ! ${name} a été capturé !`);
      } else if (encounter.status === "fled") {
        setMessage(`Oh non… ${name} s'est enfui !`);
      } else {
        setMessage(`Raté ! ${name} s'est échappé de la Pokéball.`);
      }
      setState(response.data);
    } catch {
      setError("Le lancer a échoué, réessaie.");
    } finally {
      setThrowing(false);
    }
  };

  const flee = async () => {
    const response = await api.post("/encounter/flee");
    setMessage("Tu as pris la fuite.");
    setState(response.data);
  };

  const encounter = state?.encounter;
  const isActive = encounter?.status === "active";
  const canSearch = state?.encountersLeftToday > 0;

  return (
    <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-10 sm:px-8">
      <div className="flex items-center justify-between font-rajdhani text-slate-400">
        <Link to="/profile" className="hover:text-white">
          ← Profil
        </Link>
        {state && (
          <span>
            Rencontres restantes aujourd'hui :{" "}
            <span className="font-semibold text-white">{state.encountersLeftToday}</span>
          </span>
        )}
      </div>

      <h1 className="mt-6 text-center font-orbitron text-4xl text-white md:text-5xl">
        Hautes herbes
      </h1>

      <section className="mt-8 flex flex-1 flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-center backdrop-blur-xl sm:p-10">
        {!state && !error && <p className="font-rajdhani text-slate-400">Chargement…</p>}

        {/* Un Pokémon sauvage est là (ou vient d'être capturé / de fuir) */}
        {encounter && (
          <WildPokemon encounter={encounter} throwing={throwing} faded={!isActive} />
        )}

        {/* Aucun Pokémon : on invite à chercher */}
        {state && !encounter && (
          <div className="flex flex-col items-center gap-4">
            <PokeballIcon size={96} />
            <p className="max-w-sm font-rajdhani text-lg text-slate-300">
              Des bruissements dans les hautes herbes… Un Pokémon sauvage se cache peut-être ici.
            </p>
          </div>
        )}

        {message && <p className="mt-6 font-orbitron text-xl text-white">{message}</p>}
        {error && <p className="mt-6 font-rajdhani text-lg text-red-400">{error}</p>}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {isActive ? (
            <>
              <button onClick={throwBall} disabled={throwing} className={primaryButton}>
                {throwing ? "La Pokéball bouge…" : "Lancer une Pokéball"}
              </button>
              <button onClick={flee} disabled={throwing} className={secondaryButton}>
                Fuir
              </button>
            </>
          ) : (
            state && (
              <>
                <button onClick={searchPokemon} disabled={!canSearch} className={primaryButton}>
                  {canSearch ? "Chercher un Pokémon" : "Reviens demain !"}
                </button>
                {encounter?.status === "caught" && (
                  <Link to="/collection" className={secondaryButton}>
                    Voir ma collection
                  </Link>
                )}
              </>
            )
          )}
        </div>
      </section>
    </main>
  );
}

function WildPokemon({ encounter, throwing, faded }) {
  const { pokemon, ballsLeft, captureChance, status } = encounter;
  const color = TYPES[pokemon.type1]?.color ?? "#64748b";
  const chancePercent = Math.round(captureChance * 100);

  return (
    <div key={pokemon.id} className="flex animate-appear flex-col items-center">
      <p className="font-rajdhani text-slate-400">
        {status === "caught" ? "Capturé !" : "Un Pokémon sauvage apparaît !"}
      </p>

      <div className="relative my-4 flex h-64 w-64 items-center justify-center">
        <div className="absolute inset-8 rounded-full blur-3xl" style={{ backgroundColor: `${color}55` }} />
        {throwing ? (
          <PokeballIcon size={80} shaking />
        ) : (
          <img
            src={artworkUrl(pokemon.id)}
            alt={pokemon.name}
            className={`relative h-full w-full object-contain ${
              faded ? "opacity-40" : "animate-float"
            } ${status === "caught" ? "opacity-100" : ""}`}
          />
        )}
      </div>

      <h2 className="font-orbitron text-3xl text-white">
        {pokemon.name}
        {pokemon.legendary && <span className="ml-2 text-amber-300">★</span>}
      </h2>

      <div className="mt-3 flex gap-2">
        <TypeBadge type={pokemon.type1} size="lg" />
        {pokemon.type2 && <TypeBadge type={pokemon.type2} size="lg" />}
      </div>

      {status === "active" && (
        <div className="mt-6 w-64 font-rajdhani">
          <div className="flex justify-between text-slate-400">
            <span>Chance de capture</span>
            <span className="font-semibold text-white">{chancePercent} %</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-emerald-400" style={{ width: `${chancePercent}%` }} />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {[1, 2, 3].map((ball) => (
              <PokeballIcon key={ball} size={24} empty={ball > ballsLeft} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
