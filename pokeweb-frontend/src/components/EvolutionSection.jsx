
const EvolutionSection = () => {

    return (

<section className="relative flex flex-col md:flex-row items-center justify-center gap-20 min-h-[80vh] px-12">
            {/* Bloc gauche : texte */}
            <div className="flex flex-col items-start text-left w-full md:w-[45%] gap-6 translate-x-[12%]">
                <h2 className="text-4xl md:text-5xl font-orbitron text-white drop-shadow-lg">
                    Entraîne & Evolue.
                </h2>
                <p className="text-slate-300 text-lg font-rajdhani leading-relaxed">
                    Entraîne tes Pokémon, fais-les évoluer et construis une équipe prête pour les combats.
                </p>
            </div>

            {/* Bloc droit : image */}
            <div className="flex justify-center w-full md:w-[45%]">
                <img
                    src="/images/evoli.png" 
                    alt="Pokémon en attaque"
                    className="w-[120%] md:w-[140%] object-contain drop-shadow-[0_0_40px_rgba(255,125,0,0.45)]"
                />

            </div>
        </section>

    );
};

export default EvolutionSection;