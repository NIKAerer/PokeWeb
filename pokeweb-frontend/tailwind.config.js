/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "poke-red": "#FF1C4D",      // Rouge Pokéball
        "poke-blue": "#3B82F6",     // Bleu néon
        "poke-dark": "#050816",     // Fond principal
        "poke-card": "rgba(15,23,42,0.85)", // Cartes / panneaux
      },
      fontFamily: {
        orbitron: ['"Orbitron"', "system-ui", "sans-serif"],
        rajdhani: ['"Rajdhani"', "system-ui", "sans-serif"],
      },
      keyframes: {
        // La Pokéball tremble avant de révéler le résultat de la capture
        shake: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "20%": { transform: "rotate(-20deg)" },
          "40%": { transform: "rotate(15deg)" },
          "60%": { transform: "rotate(-10deg)" },
          "80%": { transform: "rotate(5deg)" },
        },
        // Apparition du Pokémon sauvage
        appear: {
          "0%": { opacity: "0", transform: "scale(0.6) translateY(20px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        shake: "shake 0.6s ease-in-out 3",
        appear: "appear 0.5s ease-out both",
        float: "float 3s ease-in-out infinite",
      },
      backgroundImage: {
        "poke-gradient":
          "radial-gradient(circle at top, #FF1C4D 0, transparent 55%), radial-gradient(circle at bottom, #3B82F6 0, transparent 55%), linear-gradient(135deg, #020617, #050816, #000000)",
      },
    },
  },
  plugins: [],
};
