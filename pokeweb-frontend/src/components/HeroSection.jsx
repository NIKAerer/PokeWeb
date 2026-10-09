import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";

// La Pokéball 3D (three.js) est lourde : on la charge à part pour afficher la page plus vite.
const Pokeball3D = lazy(() => import("./Pokeball3D"));

const HeroSection = () => {

    const navigate = useNavigate();

    return (
        
    <section className="relative flex flex-col md:flex-row items-center justify-between min-h-screen px-8 md:px-16">
      <div className="flex flex-col items-center justify-center text-center gap-8 z-10  scale-125 md:scale-150 translate-x-[35%]">
        <h1 className="text-5xl md:text-7xl font-orbitron text-white drop-shadow-lg">
          POKEWEB
        </h1>
        <button
          className="px-8 py-4 rounded-xl bg-[#ba181b] text-white shadow-[0_0_20px_#ef4444] hover:bg-[#a4161a] hover:shadow-[0_0_35px_#3b82f6] transition-all translate-x-[-4%]"
          onClick={() => navigate("/login")}
        >
          Commencer l’aventure
        </button>
        <button
          className="px-8 py-3 rounded-xl border border-slate-500 text-slate-200 hover:border-poke-blue hover:text-white hover:shadow-[0_0_25px_#3b82f6] transition-all translate-x-[-4%] -mt-4"
          onClick={() => navigate("/pokedex")}
        >
          Explorer le Pokédex
        </button>
      </div>


      {/* Bloc droit : Pokéball */}
      <div className="w-full md:w-1/2 flex justify-center mt-12 md:mt-0">
        <Suspense fallback={<div className="h-[600px]" />}>
          <Pokeball3D />
        </Suspense>
      </div>
    </section>
  );

}

export default HeroSection;