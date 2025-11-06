/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
      backgroundImage: {
        "poke-gradient":
          "radial-gradient(circle at top, #FF1C4D 0, transparent 55%), radial-gradient(circle at bottom, #3B82F6 0, transparent 55%), linear-gradient(135deg, #020617, #050816, #000000)",
      },
    },
  },
  plugins: [],
};
