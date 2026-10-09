// Outils partagés pour afficher les Pokémon.

// Les types arrivent de l'API en anglais ("fire") : on les traduit et on leur donne une couleur.
export const TYPES = {
  normal: { label: "Normal", color: "#A8A77A" },
  fire: { label: "Feu", color: "#EE8130" },
  water: { label: "Eau", color: "#6390F0" },
  electric: { label: "Électrik", color: "#F7D02C" },
  grass: { label: "Plante", color: "#7AC74C" },
  ice: { label: "Glace", color: "#96D9D6" },
  fighting: { label: "Combat", color: "#C22E28" },
  poison: { label: "Poison", color: "#A33EA1" },
  ground: { label: "Sol", color: "#E2BF65" },
  flying: { label: "Vol", color: "#A98FF3" },
  psychic: { label: "Psy", color: "#F95587" },
  bug: { label: "Insecte", color: "#A6B91A" },
  rock: { label: "Roche", color: "#B6A136" },
  ghost: { label: "Spectre", color: "#735797" },
  dragon: { label: "Dragon", color: "#6F35FC" },
  dark: { label: "Ténèbres", color: "#705746" },
  steel: { label: "Acier", color: "#B7B7CE" },
  fairy: { label: "Fée", color: "#D685AD" },
};

export const GENERATIONS = [1, 2, 3, 4, 5, 6];

// Les 6 statistiques, dans l'ordre d'affichage
export const STATS = [
  { key: "hp", label: "PV" },
  { key: "attack", label: "Attaque" },
  { key: "defense", label: "Défense" },
  { key: "specialAttack", label: "Atq. Spé." },
  { key: "specialDefense", label: "Déf. Spé." },
  { key: "speed", label: "Vitesse" },
];

// Illustrations officielles hébergées par le projet open source PokeAPI
export function artworkUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

// 25 → "#025"
export function formatNumber(id) {
  return `#${String(id).padStart(3, "0")}`;
}

// Retire les accents et les majuscules pour que "evoli" trouve "Évoli"
export function normalize(text) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
