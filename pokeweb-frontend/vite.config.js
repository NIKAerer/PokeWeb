import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Le seul gros fichier est la Pokéball 3D (three.js), déjà chargée à part.
    chunkSizeWarningLimit: 1200,
  },
  server: {
    port: 3000, // même port qu'avant : l'API autorise déjà localhost:3000 (CORS)
  },
  // Tests (Vitest) : un faux navigateur (jsdom) pour afficher les composants
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
  },
});
