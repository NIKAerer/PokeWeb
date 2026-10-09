// Session du joueur : le token JWT renvoyé par l'API est gardé dans le navigateur.
const TOKEN_KEY = "pokeweb_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Le token contient sa date d'expiration (champ "exp", en secondes).
// Il est encodé en base64url : on le convertit avant de le lire avec atob().
function isExpired(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).exp * 1000 < Date.now();
  } catch {
    return true; // token illisible : on le considère comme expiré
  }
}

export function isLoggedIn() {
  const token = getToken();
  return token !== null && !isExpired(token);
}
