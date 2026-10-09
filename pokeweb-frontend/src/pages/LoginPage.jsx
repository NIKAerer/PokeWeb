import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/client";
import { isLoggedIn, saveToken } from "../auth/session";
import AuthCard from "../components/AuthCard";
import TextInput from "../components/TextInput";
import Loading from "../components/Loading";

// Compte public pour tester le jeu sans s'inscrire (recréé par "php bin/console app:demo")
const DEMO_ACCOUNT = { email: "demo@pokeweb.fr", password: "pokeweb-demo" };

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

  const login = async (credentials) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/login", credentials);
      saveToken(response.data.token);
      navigate("/profile");
    } catch {
      setErrorMessage("Email ou mot de passe incorrect.");
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // le formulaire ne recharge pas la page
    login({ email, password });
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
        {loading && (
          <div className="mt-3">
            <Loading text="" />
          </div>
        )}
      </form>

      {/* Accès rapide pour les recruteurs */}
      <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-center font-rajdhani">
        <p className="text-slate-300">
          Envie de tester sans t'inscrire ? Compte de démo : <span className="text-white">{DEMO_ACCOUNT.email}</span> /{" "}
          <span className="text-white">{DEMO_ACCOUNT.password}</span>
        </p>
        <button
          type="button"
          onClick={() => login(DEMO_ACCOUNT)}
          disabled={loading}
          className="mt-3 rounded-lg border border-poke-blue/60 px-4 py-2 font-semibold text-blue-200 transition hover:bg-poke-blue/10 disabled:opacity-50"
        >
          Essayer avec le compte de démo
        </button>
      </div>

      <p className="mt-6 text-center font-rajdhani text-slate-300">
        Pas encore de compte ?{" "}
        <Link to="/register" className="text-poke-red hover:underline">
          S'inscrire
        </Link>
      </p>
    </AuthCard>
  );
}
