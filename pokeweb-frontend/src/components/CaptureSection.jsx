import React from "react";

const CaptureSection = () => {

    return (
        
        <section className="relative flex flex-col md:flex-row items-center justify-between min-h-[80vh] px-8 md:px-16">
           {/* Bloc gauche : images Pokémon */}
            <div className="w-full md:w-1/2 flex justify-center mt-12 md:mt-0">
                <div className="w-full md:w-1/2 flex justify-center mt-12 md:mt-0">
                    <img src="/images/pokemon.png" alt="Équipe Pokémon - Lucario, Scizor et Greninja" className="w-[110%] md:w-[130%] object-contain drop-shadow-[0_0_35px_rgba(168,85,247,0.4)] scale-125 md:scale-150 transition-transform duration-700"/>
                </div>
            </div>

            {/* Bloc droit : texte descriptif */}
            <div className="flex flex-col items-start text-left w-full md:w-1/2 gap-6 mt-12 md:mt-0 md:pl-24">
                <h2 className="text-4xl md:text-5xl font-orbitron text-white drop-shadow-lg">
                    Explore et Capture
                </h2>
                <p className="text-slate-300 text-lg font-rajdhani leading-relaxed">
                    Explore les régions, découvre des Pokémon uniques, attrape tes preferés parmi des centaines et commence ton aventure.
                </p>
            </div>

        </section>
    );
};


export default CaptureSection;