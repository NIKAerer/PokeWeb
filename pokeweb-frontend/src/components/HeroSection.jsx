import React from "react";
import Pokeball3D from "./Pokeball3D";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {

      return (
    <section className="relative flex flex-col md:flex-row items-center justify-between min-h-screen px-8 md:px-16">
      <div className="flex flex-col items-center justify-center text-center gap-8 z-10">
  <h1 className="text-5xl md:text-7xl font-orbitron text-white drop-shadow-lg">
    POKEWEB
  </h1>
  <button className="px-8 py-4 rounded-xl bg-[#ff1c4d] text-white shadow-[0_0_20px_#ef4444] hover:bg-[#d91c1c] hover:shadow-[0_0_35px_#3b82f6] transition-all translate-x-[-4%]">
    Commencer l’aventure
  </button>
</div>


      {/* Bloc droit : Pokéball */}
      <div className="w-full md:w-1/2 flex justify-center mt-12 md:mt-0">
        <Pokeball3D />
      </div>
    </section>
  );

}

export default HeroSection;