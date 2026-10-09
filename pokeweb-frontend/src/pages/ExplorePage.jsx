import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import PokeballIcon from "../components/PokeballIcon";
import TypeBadge from "../components/TypeBadge";
import FighterPicker from "../components/battle/FighterPicker";
import HpBar from "../components/battle/HpBar";
import { describeRound } from "../components/battle/battleMessages";
import { TYPES, artworkUrl } from "../utils/pokemon";
import Loading from "../components/Loading";

const THROW_ANIMATION_MS = 1800; // durée des 3 secousses de la Pokéball

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const primaryButton =
  "rounded-xl bg-[#ba181b] px-6 py-3 font-rajdhani text-lg font-semibold text-white shadow-[0_0_20px_#ef4444] transition-all hover:bg-[#a4161a] hover:shadow-[0_0_35px_#3b82f6] disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButton =
  "rounded-xl border border-slate-600 px-6 py-3 font-rajdhani text-lg text-slate-200 transition hover:border-slate-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-50";

export default function ExplorePage() {
  // Réponse de l'API : rencontre en cours + rencontres restantes aujourd'hui
  const [state, setState] = useState(null);
  const [captures, setCaptures] = useState([]); // la collection, pour choisir un combattant
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false); // une action est en cours
  const [throwing, setThrowing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/encounter")
      .then((response) => setState(response.data))
      .catch(() => setError("Impossible de contacter l'API."));
    api.get("/collection").then((response) => setCaptures(response.data.pokemons));
  }, []);

  // Enveloppe commune : bloque les boutons pendant l'appel et affiche les erreurs
  const run = async (action) => {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (err) {
      setError(err.response?.data?.error ?? "Une erreur est survenue, réessaie.");
    } finally {
      setBusy(false);
    }
  };

  const searchPokemon = () =>
    run(async () => {
      setMessages([]);
      const response = await api.post("/encounter");
      setState(response.data);
      // La collection a pu grandir depuis la dernière rencontre
      api.get("/collection").then((res) => setCaptures(res.data.pokemons));
    });

  const chooseFighter = (captureId) =>
    run(async () => {
      const response = await api.post("/encounter/fighter", { captureId });
      setPicking(false);
      setState(response.data);
      setMessages([`Vas-y, ${response.data.encounter.fighter.name} !`]);
    });

  const attack = () =>
    run(async () => {
      const response = await api.post("/encounter/attack");
      const { log, encounter } = response.data;
      const lines = describeRound(log, encounter.fighter.name, encounter.pokemon.name);

      if (encounter.status === "defeated") {
        lines.push(`${encounter.pokemon.name} est K.O. ! Il ne peut plus être capturé.`);
      } else if (encounter.fighter.hp === 0) {
        lines.push(`${encounter.fighter.name} est K.O. ! Il te reste tes Pokéballs.`);
      }
      setMessages(lines);
      setState(response.data);
    });

  const throwBall = () =>
    run(async () => {
      setThrowing(true);
      setMessages([]);
      try {
        // On attend la fin de l'animation ET la réponse de l'API avant d'afficher le résultat
        const [response] = await Promise.all([api.post("/encounter/throw"), wait(THROW_ANIMATION_MS)]);
        const { caught, encounter } = response.data;
        const name = encounter.pokemon.name;

        if (caught) {
          setMessages([`Gotcha ! ${name} a été capturé !`]);
        } else if (encounter.status === "fled") {
          setMessages([`Oh non… ${name} s'est enfui !`]);
        } else {
          setMessages([`Raté ! ${name} s'est échappé de la Pokéball.`]);
        }
        setState(response.data);
      } finally {
        setThrowing(false);
      }
    });

  const flee = () =>
    run(async () => {
      const response = await api.post("/encounter/flee");
      setMessages(["Tu as pris la fuite."]);
      setState(response.data);
    });

  const encounter = state?.encounter;
  const isActive = encounter?.status === "active";
  const canAttack = isActive && encounter.fighter && encounter.fighter.hp > 0;
  const canSearch = state?.encountersLeftToday > 0;

  return (
    <main className="relative z-10 mx-auto flex min-h-page max-w-3xl flex-col px-4 py-10 sm:px-8">
      <div className="flex min-h-6 items-center justify-end font-rajdhani text-slate-400">
        {state && (
          <span>
            Rencontres restantes aujourd'hui :{" "}
            <span className="font-semibold text-white">{state.encountersLeftToday}</span>
          </span>
        )}
      </div>

      <h1 className="mt-6 text-center font-orbitron text-4xl text-white md:text-5xl">Hautes herbes</h1>

      <section className="mt-8 flex flex-1 flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-center backdrop-blur-xl sm:p-10">
        {!state && !error && <Loading />}

        {encounter && <WildPokemon encounter={encounter} throwing={throwing} />}

        {/* Aucun Pokémon : on invite à chercher */}
        {state && !encounter && (
          <div className="flex flex-col items-center gap-4">
            <PokeballIcon size={96} />
            <p className="max-w-sm font-rajdhani text-lg text-slate-300">
              Des bruissements dans les hautes herbes… Un Pokémon sauvage se cache peut-être ici.
            </p>
          </div>
        )}

        {/* Notre Pokémon au combat */}
        {isActive && encounter.fighter && <Fighter fighter={encounter.fighter} />}

        {isActive && !encounter.fighter && !picking && (
          <p className="mt-6 font-rajdhani text-slate-400">
            {captures.length > 0
              ? "Affaiblis-le en combat pour augmenter tes chances de capture."
              : "Capture ton premier Pokémon pour pouvoir combattre."}
          </p>
        )}

        {picking && (
          <div className="mt-6 w-full">
            <FighterPicker captures={captures} onPick={chooseFighter} onClose={() => setPicking(false)} />
          </div>
        )}

        {/* Ce qui vient de se passer */}
        {messages.length > 0 && (
          <div className="mt-6 w-full space-y-1 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-left font-rajdhani text-lg text-slate-100">
            {messages.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )}
        {error && <p className="mt-6 font-rajdhani text-lg text-red-400">{error}</p>}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {isActive ? (
            <>
              {encounter.fighter ? (
                <button onClick={attack} disabled={busy || !canAttack} className={primaryButton}>
                  Attaquer
                </button>
              ) : (
                captures.length > 0 && (
                  <button onClick={() => setPicking(true)} disabled={busy} className={secondaryButton}>
                    Combattre
                  </button>
                )
              )}
              <button onClick={throwBall} disabled={busy} className={primaryButton}>
                {throwing ? "La Pokéball bouge…" : "Lancer une Pokéball"}
              </button>
              <button onClick={flee} disabled={busy} className={secondaryButton}>
                Fuir
              </button>
            </>
          ) : (
            state && (
              <>
                <button onClick={searchPokemon} disabled={busy || !canSearch} className={primaryButton}>
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

function WildPokemon({ encounter, throwing }) {
  const { pokemon, ballsLeft, captureChance, status } = encounter;
  const color = TYPES[pokemon.type1]?.color ?? "#64748b";
  const chancePercent = Math.round(captureChance * 100);
  const isActive = status === "active";

  const subtitle = {
    active: "Un Pokémon sauvage apparaît !",
    caught: "Capturé !",
    fled: "Il s'est enfui…",
    defeated: "K.O.",
  }[status];

  return (
    <div key={pokemon.id} className="flex w-full animate-appear flex-col items-center">
      <p className="font-rajdhani text-slate-400">{subtitle}</p>

      <div className="relative my-2 flex h-56 w-56 items-center justify-center">
        <div className="absolute inset-8 rounded-full blur-3xl" style={{ backgroundColor: `${color}55` }} />
        {throwing ? (
          <PokeballIcon size={80} shaking />
        ) : (
          <img
            src={artworkUrl(pokemon.id)}
            alt={pokemon.name}
            className={`relative h-full w-full object-contain ${
              isActive ? "animate-float" : status === "caught" ? "" : "opacity-40 grayscale"
            }`}
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

      {isActive && (
        <div className="mt-4 w-64">
          <HpBar hp={pokemon.hp} maxHp={pokemon.maxHp} />

          <div className="mt-3 flex justify-between font-rajdhani text-slate-400">
            <span>Chance de capture</span>
            <span className="font-semibold text-white">{chancePercent} %</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-poke-blue transition-all duration-500"
              style={{ width: `${chancePercent}%` }}
            />
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

function Fighter({ fighter }) {
  const knockedOut = fighter.hp === 0;

  return (
    <div className="mt-6 flex w-full max-w-sm items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
      {/* Image retournée : notre Pokémon regarde vers le Pokémon sauvage */}
      <img
        src={artworkUrl(fighter.id)}
        alt={fighter.name}
        className={`h-20 w-20 -scale-x-100 object-contain ${knockedOut ? "opacity-40 grayscale" : ""}`}
      />
      <div className="flex-1 text-left">
        <p className="font-orbitron text-white">{fighter.name}</p>
        <HpBar hp={fighter.hp} maxHp={fighter.maxHp} />
      </div>
    </div>
  );
}
