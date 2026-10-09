import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import { isLoggedIn } from "../auth/session";

// Ce que le joueur peut vraiment faire dans PokeWeb
const FEATURES = [
  {
    title: "Explore et capture",
    text: "Chaque jour, 15 rencontres avec des Pokémon sauvages t'attendent dans les hautes herbes. Tu as 3 Pokéballs par rencontre : les légendaires sont rares et difficiles à attraper.",
    image: "/images/pokemon.png",
    alt: "Lucario, Amphinobi et Méga-Jungko",
    glow: "rgba(168,85,247,0.4)",
  },
  {
    title: "Combats au tour par tour",
    text: "Envoie un Pokémon de ta collection contre le Pokémon sauvage. Les types comptent : affaiblis-le sans le mettre K.O. pour augmenter tes chances de capture.",
    image: "/images/evoli.png",
    alt: "Évoli et Voltali",
    glow: "rgba(255,125,0,0.45)",
    reverse: true,
  },
  {
    title: "Complète ton Pokédex",
    text: "721 Pokémon des six premières générations, avec leurs statistiques et leur description en français. Donne un surnom à tes captures et suis ta progression sur ton profil.",
    image: "/images/badge.png",
    alt: "Un badge doré",
    glow: "rgba(255,180,50,0.4)",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />
      {FEATURES.map((feature) => (
        <FeatureSection key={feature.title} {...feature} />
      ))}
      <div className="flex justify-center pb-24 pt-8">
        <Link
          to={isLoggedIn() ? "/explorer" : "/register"}
          className="rounded-xl bg-[#ba181b] px-8 py-4 font-rajdhani text-lg font-semibold text-white shadow-[0_0_20px_#ef4444] transition-all hover:bg-[#a4161a] hover:shadow-[0_0_35px_#3b82f6]"
        >
          Commencer l'aventure
        </Link>
      </div>
    </>
  );
}
