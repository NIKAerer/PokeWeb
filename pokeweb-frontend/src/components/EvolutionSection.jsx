import React from "react";

const EvolutionSection = () => {

    return (

<section className="relative flex flex-col md:flex-row items-center justify-center gap-20 min-h-[80vh] px-12">
            {/* Bloc gauche : texte */}
            <div className="flex flex-col items-start text-left w-full md:w-[45%] gap-6 translate-x-[12%]">
                <h2 className="text-4xl md:text-5xl font-orbitron text-white drop-shadow-lg">
                    Entraîne & Evolue.
                </h2>
                <p className="text-slate-300 text-lg font-rajdhani leading-relaxed">
                    Renforce et construis l’équipe qui te mènera au sommet.
                </p>
            </div>

            {/* Bloc droit : image */}
            <div className="flex justify-center w-full md:w-[45%]">
                <div className="w-[120%] md:w-[140%] h-[400px] bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                <p className="text-slate-400 text-sm">[Image Pokémon en attaque ici]</p>
                </div>
            </div>
        </section>

    );
};

export default EvolutionSection;