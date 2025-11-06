import React from "react";
import Pokeball3D from "../components/Pokeball3D";

function HomePage() {
    return (
       <div className="relative min-h-screen bg-poke-dark flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-poke-gradient opacity-50 blur-3xl" />
      <Pokeball3D />
      <h1 className="text-4xl font-orbitron text-poke-red tracking-widest mt-8">
        POKEWEB
      </h1>
    </div>
    )
}

export default HomePage;