import React from "react";

const CombatSection = () => {

    return (
        <section className="relative flex flex-col md:flex-row items-center justify-center gap-20 min-h-[80vh] px-12">

        {/* Bloc gauche : image */}
        <div className="flex justify-center w-full md:w-[45%]">
            <img
                src="/images/badge.png"
                alt="Combat Pokémon"
                className="w-[50%] md:w-[70%] object-contain drop-shadow-[0_0_35px_rgba(255,180,50,0.40)]
"
            />

        </div>

        {/* Bloc droit : texte */}
        <div className="flex flex-col items-start text-left w-full md:w-[45%] gap-6">
            <h2 className="text-4xl md:text-5xl font-orbitron text-white drop-shadow-lg">
                Collectionne les badges
            </h2>
            <p className="text-slate-300 text-lg font-rajdhani leading-relaxed">
                Défie des dresseurs, enchaîne les combats, bats les maîtres d'arènes 
                et collectionne les badges pour avancer dans ton aventure.
            </p>
        </div>

        </section>

    );

};

export default CombatSection;