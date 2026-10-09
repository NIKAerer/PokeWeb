import axios from "axios";
import { clearToken, getToken } from "../auth/session";

// Client HTTP partagé par toutes les pages.
// L'URL de l'API vient de VITE_API_URL (voir .env.example) pour pouvoir
// pointer vers l'API en ligne sans modifier le code.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8001/api",
  headers: { Accept: "application/json" },
});

// Ajoute automatiquement le token JWT à chaque requête si le joueur est connecté.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si l'API répond 401 alors qu'on envoyait un token, c'est qu'il a expiré :
// on déconnecte le joueur et on le renvoie vers la page de connexion.
// (Sur /login, un 401 veut seulement dire "mauvais mot de passe".)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken() && error.config.url !== "/login") {
      clearToken();
      window.location.assign("/login?expired=1");
    }
    return Promise.reject(error);
  }
);

export default api;
