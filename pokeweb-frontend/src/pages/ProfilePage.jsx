import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import TypeBadge from "../components/TypeBadge";
import { artworkUrl } from "../utils/pokemon";
import Loading from "../components/Loading";

// Une case de statistique du profil
function StatTile({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 backdrop-blur">
      <p className="font-rajdhani text-sm font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 font-rajdhani text-4xl font-bold text-white">{value}</p>
      {hint && <p className="mt-1 font-rajdhani text-slate-500">{hint}</p>}
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/me")
      .then((response) => setProfile(response.data))
      .catch(() => setError("Impossible de charger ton profil."));
  }, []);

  if (error) {
    return (
      <main className="relative z-10 flex min-h-page items-center justify-center px-4">
        <p className="font-rajdhani text-xl text-red-400">{error}</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="relative z-10 flex min-h-page items-center justify-center">
        <Loading />
      </main>
    );
  }

  const { stats } = profile;
  const progress = (stats.discovered / stats.pokedexSize) * 100;
  // "octobre 2026" : la date d'inscription en français
  const memberSince = new Date(profile.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  return (
    <main className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-8">
      {/* En-tête : avatar (initiale du pseudo), pseudo, ancienneté */}
      <header className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-poke-red to-poke-blue font-orbitron text-4xl text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]">
          {profile.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="font-orbitron text-4xl text-white md:text-5xl">{profile.username}</h1>
          <p className="mt-1 font-rajdhani text-lg text-slate-400">
            Dresseur depuis {memberSince} · {profile.email}
          </p>
        </div>
      </header>

      {/* Progression du Pokédex */}
      <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 backdrop-blur">
        <div className="flex items-baseline justify-between font-rajdhani">
          <h2 className="text-lg font-semibold uppercase tracking-wider text-slate-300">Pokédex</h2>
          <p className="text-slate-300">
            <span className="text-2xl font-bold text-white">{stats.discovered}</span> / {stats.pokedexSize} espèces découvertes
          </p>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-gradient-to-r from-poke-red to-poke-blue" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile label="Captures" value={stats.captures} />
        <StatTile label="Légendaires" value={stats.legendaries} />
        <StatTile label="Rencontres" value={stats.encountersLeftToday} hint="restantes aujourd'hui" />
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 backdrop-blur">
          <p className="font-rajdhani text-sm font-semibold uppercase tracking-wider text-slate-400">Type préféré</p>
          <div className="mt-3">
            {stats.favoriteType ? <TypeBadge type={stats.favoriteType} size="lg" /> : <p className="font-rajdhani text-slate-500">Aucun pour l'instant</p>}
          </div>
        </div>
      </section>

      {/* Dernières captures */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="font-orbitron text-2xl text-white">Dernières captures</h2>
          {stats.captures > 0 && (
            <Link to="/collection" className="font-rajdhani text-slate-400 hover:text-white">
              Toute la collection →
            </Link>
          )}
        </div>

        {profile.recentCaptures.length > 0 ? (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {profile.recentCaptures.map((capture) => (
              <Link
                key={capture.id}
                to={`/pokedex/${capture.pokemon.id}`}
                className="flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-center transition hover:-translate-y-1 hover:border-slate-600"
              >
                <img src={artworkUrl(capture.pokemon.id)} alt={capture.pokemon.name} loading="lazy" className="h-20 w-20 object-contain" />
                <span className="mt-1 w-full truncate font-rajdhani font-semibold text-white">
                  {capture.nickname ?? capture.pokemon.name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 font-rajdhani text-lg text-slate-400">Aucune capture pour l'instant.</p>
        )}
      </section>

      <div className="mt-10 flex justify-center">
        <Link
          to="/explorer"
          className="rounded-xl bg-[#ba181b] px-8 py-4 font-rajdhani text-lg font-semibold text-white shadow-[0_0_20px_#ef4444] transition-all hover:bg-[#a4161a] hover:shadow-[0_0_35px_#3b82f6]"
        >
          Explorer les hautes herbes
        </Link>
      </div>
    </main>
  );
}
