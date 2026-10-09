import { useState } from "react";
import { Link } from "react-router-dom";
import TypeBadge from "./TypeBadge";
import { artworkUrl, formatNumber } from "../utils/pokemon";

// Une carte de la collection : le joueur peut donner un surnom ou relâcher le Pokémon.
export default function CollectionCard({ capture, onRename, onRelease }) {
  const { pokemon } = capture;
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(capture.nickname ?? "");

  const save = async (event) => {
    event.preventDefault();
    await onRename(capture.id, nickname);
    setEditing(false);
  };

  const release = () => {
    if (window.confirm(`Relâcher ${capture.nickname ?? pokemon.name} ? Il quittera ta collection.`)) {
      onRelease(capture.id);
    }
  };

  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-center backdrop-blur">
      <Link to={`/pokedex/${pokemon.id}`} className="flex w-full flex-col items-center">
        <span className="self-start font-rajdhani text-sm text-slate-500">{formatNumber(pokemon.id)}</span>
        <img src={artworkUrl(pokemon.id)} alt={pokemon.name} loading="lazy" className="h-28 w-28 object-contain" />
      </Link>

      {editing ? (
        <form onSubmit={save} className="mt-2 flex w-full gap-1">
          <input
            autoFocus
            value={nickname}
            maxLength={30}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={pokemon.name}
            className="w-full min-w-0 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 font-rajdhani text-white outline-none focus:border-poke-red"
          />
          <button type="submit" className="rounded-lg bg-poke-red px-2 font-rajdhani text-white">
            OK
          </button>
        </form>
      ) : (
        <>
          <h2 className="mt-2 font-orbitron text-base text-white">{capture.nickname ?? pokemon.name}</h2>
          {capture.nickname && <p className="font-rajdhani text-sm text-slate-400">{pokemon.name}</p>}
        </>
      )}

      <div className="mt-2 flex gap-1.5">
        <TypeBadge type={pokemon.type1} />
        {pokemon.type2 && <TypeBadge type={pokemon.type2} />}
      </div>

      <p className="mt-3 font-rajdhani text-xs text-slate-500">
        Capturé le {new Date(capture.capturedAt).toLocaleDateString("fr-FR")}
      </p>

      <div className="mt-3 flex gap-3 font-rajdhani text-sm">
        <button onClick={() => setEditing(!editing)} className="text-slate-400 hover:text-white">
          {editing ? "Annuler" : "Surnom"}
        </button>
        <button onClick={release} className="text-slate-400 hover:text-red-400">
          Relâcher
        </button>
      </div>
    </div>
  );
}
