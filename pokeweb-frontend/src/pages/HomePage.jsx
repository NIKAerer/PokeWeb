import React from "react";
import HeroSection from "../components/HeroSection";
import CaptureSection from "../components/CaptureSection";
import EvolutionSection from "../components/EvolutionSection";
import CombatSection from "../components/CombatSection";


function HomePage() {
    return (
      <div>
        <HeroSection/>
        <CaptureSection/>
        <EvolutionSection/>
        <CombatSection/>
      </div>
    )
}

export default HomePage;