import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const baseButtonStyle =
    "px-8 py-4 rounded-xl bg-[#ba181b] text-white shadow-[0_0_20px_#ef4444] " +
    "hover:bg-[#a4161a] hover:shadow-[0_0_35px_#3b82f6] transition-all";

  const handleRegister = async () => {
    setErrorMessage("");

    if (!email || !password || !confirmPassword) {
      setErrorMessage("Tous les champs sont obligatoires.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/register", {
        email,
        password,
      });

      // L'API connecte directement le joueur en renvoyant un token
      const token = response.data.token;

      localStorage.setItem("pokeweb_token", token);
      localStorage.setItem("pokeweb_user_email", email);

      navigate("/profile"); // Tu vas créer ton personnage ici
    } catch (error) {
      // L'API renvoie "error" (email déjà pris) ou "violations" (champ invalide)
      const data = error.response?.data;
      setErrorMessage(
        data?.error ?? data?.violations?.[0]?.title ?? "Impossible de créer le compte."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div
          className="
            bg-slate-950/70 backdrop-blur-xl 
            border border-poke-red/40 
            shadow-[0_0_30px_rgba(239,68,68,0.5)]
            rounded-3xl 
            p-10 
            w-full max-w-md 
          "
        >
          <h1 className="text-center text-3xl font-orbitron text-white tracking-wide mb-8">
            Créer un compte
          </h1>

          {/* Erreur */}
          {errorMessage && (
            <p className="text-red-400 text-center mb-4 font-rajdhani">
              {errorMessage}
            </p>
          )}

          {/* Email */}
          <div className="mb-6">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 
                         border border-slate-700 text-slate-200
                         focus:border-poke-red focus:ring-2 focus:ring-poke-red/60
                         outline-none transition font-rajdhani"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 
                         border border-slate-700 text-slate-200
                         focus:border-poke-red focus:ring-2 focus:ring-poke-red/60
                         outline-none transition font-rajdhani"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-8">
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 
                         border border-slate-700 text-slate-200
                         focus:border-poke-red focus:ring-2 focus:ring-poke-red/60
                         outline-none transition font-rajdhani"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Bouton inscription */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className={`${baseButtonStyle} w-full`}
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>

          {/* Déjà un compte ? */}
          <p className="mt-6 text-center text-slate-300 font-rajdhani">
            Tu as déjà un compte ?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-poke-red cursor-pointer hover:underline"
            >
              Se connecter
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
