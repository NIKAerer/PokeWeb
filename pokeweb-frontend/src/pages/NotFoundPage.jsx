import { Link } from "react-router-dom";
import { artworkUrl } from "../utils/pokemon";

// Page affichée pour toute adresse inconnue. Psykokwak (n°54) est perdu, lui aussi.
export default function NotFoundPage() {
  return (
    <main className="relative z-10 flex min-h-page flex-col items-center justify-center gap-6 px-4 py-10 text-center">
      <img src={artworkUrl(54)} alt="Psykokwak, l'air perdu" className="w-48 animate-float drop-shadow-[0_0_30px_rgba(247,208,44,0.35)] sm:w-60" />
      <p className="font-rajdhani text-7xl font-bold text-white sm:text-8xl">404</p>
      <h1 className="font-rajdhani text-2xl font-semibold text-slate-200">Psykokwak ne trouve pas cette page… et toi non plus.</h1>
      <div className="mt-2 flex flex-wrap justify-center gap-3 font-rajdhani text-lg">
        <Link
          to="/home"
          className="rounded-xl bg-[#ba181b] px-6 py-3 text-white shadow-[0_0_20px_#ef4444] transition hover:bg-[#a4161a]"
        >
          Retour à l'accueil
        </Link>
        <Link to="/pokedex" className="rounded-xl border border-slate-600 px-6 py-3 text-slate-200 transition hover:border-slate-400">
          Ouvrir le Pokédex
        </Link>
      </div>
    </main>
  );
}
