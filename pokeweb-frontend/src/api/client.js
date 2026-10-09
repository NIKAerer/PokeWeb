import axios from "axios";

// Client HTTP partagé par toutes les pages.
// L'URL de l'API vient de VITE_API_URL (voir .env.example) pour pouvoir
// pointer vers l'API en ligne sans modifier le code.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8001/api",
  headers: { Accept: "application/json" },
});

// Ajoute automatiquement le token JWT à chaque requête si le joueur est connecté.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pokeweb_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
