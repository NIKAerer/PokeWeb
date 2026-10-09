// Fabrique un faux token JWT qui expire dans "seconds" secondes (négatif = déjà expiré).
// Seule la partie centrale (le contenu) est lue par le front, la signature n'est pas vérifiée.
export function fakeToken(seconds) {
  const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + seconds }));
  return `header.${payload}.signature`;
}
