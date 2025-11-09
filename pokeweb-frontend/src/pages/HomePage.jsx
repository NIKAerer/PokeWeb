import React from "react";
import Pokeball3D from "../components/Pokeball3D";

function HomePage() {
    return (
      <div>
        <Pokeball3D />
        <h1 className="text-4xl font-orbitron text-poke-red tracking-widest mt-8">
          POKEWEB
        </h1>
      </div>
    )
}

export default HomePage;