import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/client";
import { isLoggedIn, saveToken } from "../auth/session";
import AuthCard from "../components/AuthCard";
import TextInput from "../components/TextInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Déjà connecté : pas besoin de se reconnecter
  if (isLoggedIn()) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault(); // le formulaire ne recharge pas la page
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/login", { email, password });
      saveToken(response.data.token);
      navigate("/profile");
    } catch {
      setErrorMessage("Email ou mot de passe incorrect.");
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Connexion"
      subtitle="Content de te revoir, dresseur !"
      error={errorMessage}
      info={searchParams.has("expired") && !errorMessage ? "Ta session a expiré, reconnecte-toi pour continuer." : null}
    >
      <form onSubmit={handleSubmit}>
        <TextInput label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextInput
          label="Mot de passe"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full rounded-xl bg-[#ba181b] py-4 font-orbitron uppercase tracking-wide text-white shadow-[0_0_20px_#ef4444] transition-all hover:bg-[#a4161a] hover:shadow-[0_0_35px_#3b82f6] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:shadow-none"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <p className="mt-6 text-center font-rajdhani text-slate-300">
        Pas encore de compte ?{" "}
        <Link to="/register" className="text-poke-red hover:underline">
          S'inscrire
        </Link>
      </p>
    </AuthCard>
  );
}
