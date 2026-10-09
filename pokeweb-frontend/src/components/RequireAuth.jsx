import { Navigate } from "react-router-dom";
import { getToken, isLoggedIn } from "../auth/session";

// Protège une page : sans token valide, le joueur est renvoyé vers la connexion.
export default function RequireAuth({ children }) {
  if (isLoggedIn()) {
    return children;
  }

  // Un token est présent mais périmé : la page de connexion affiche "session expirée"
  return <Navigate to={getToken() ? "/login?expired=1" : "/login"} replace />;
}
