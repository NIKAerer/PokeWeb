import { Navigate } from "react-router-dom";

// Protège une page : sans token, le joueur est renvoyé vers la connexion.
export default function RequireAuth({ children }) {
  const token = localStorage.getItem("pokeweb_token");

  return token ? children : <Navigate to="/login" replace />;
}
