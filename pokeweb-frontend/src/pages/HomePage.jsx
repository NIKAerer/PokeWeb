import HeroSection from "../components/HeroSection";
import CaptureSection from "../components/CaptureSection";
import EvolutionSection from "../components/EvolutionSection";
import CombatSection from "../components/CombatSection";


function HomePage() {
    return (
      <section>
        <div>
          <HeroSection/>
          <CaptureSection/>
          <EvolutionSection/>
          <CombatSection/>
        </div>
        <div className="flex justify-center mt-20 mb-20">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-8 py-4 rounded-xl bg-[#ba181b] text-white shadow-[0_0_20px_#ef4444] hover:bg-[#a4161a] hover:shadow-[0_0_35px_#3b82f6] transition-all translate-x-[-4%]">
              Commencer l’aventure
          </button>
        </div>
      </section>
    )
}

export default HomePage;