import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { isLoggedIn } from "../auth/session";

// La Pokéball 3D (three.js) est lourde : on la charge à part pour afficher la page plus vite.
const Pokeball3D = lazy(() => import("./Pokeball3D"));

export default function HeroSection() {
  // Un joueur déjà connecté part directement explorer
  const startPath = isLoggedIn() ? "/explorer" : "/register";

  return (
    <section className="relative mx-auto grid min-h-page max-w-7xl items-center gap-6 px-6 py-10 md:grid-cols-2 md:px-16">
      <div className="z-10 flex flex-col items-center gap-6 text-center md:items-start md:text-left">
        <h1 className="font-orbitron text-5xl text-white drop-shadow-lg sm:text-6xl lg:text-8xl">POKEWEB</h1>
        <p className="max-w-md font-rajdhani text-xl leading-relaxed text-slate-300">
          Pars dans les hautes herbes, affronte des Pokémon sauvages et capture-les pour compléter ton Pokédex.
        </p>
        <div className="flex flex-wrap justify-center gap-4 md:justify-start">
          <Link
            to={startPath}
            className="rounded-xl bg-[#ba181b] px-8 py-4 font-rajdhani text-lg font-semibold text-white shadow-[0_0_20px_#ef4444] transition-all hover:bg-[#a4161a] hover:shadow-[0_0_35px_#3b82f6]"
          >
            Commencer l'aventure
          </Link>
          <Link
            to="/pokedex"
            className="rounded-xl border border-slate-500 px-8 py-4 font-rajdhani text-lg font-semibold text-slate-200 transition-all hover:border-poke-blue hover:text-white hover:shadow-[0_0_25px_#3b82f6]"
          >
            Explorer le Pokédex
          </Link>
        </div>
      </div>

      <Suspense fallback={<div className="h-[340px] md:h-[600px]" />}>
        <Pokeball3D />
      </Suspense>
    </section>
  );
}
