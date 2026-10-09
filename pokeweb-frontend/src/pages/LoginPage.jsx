import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Si utilisateur déjà connecté → redirect vers /profile
  useEffect(() => {
    const token = localStorage.getItem("pokeweb_token");
    if (token) navigate("/profile");
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const token = response.data.token;

      localStorage.setItem("pokeweb_token", token);
      localStorage.setItem("pokeweb_user_email", email);

      navigate("/profile");
    } catch (error) {
      setErrorMessage("Email ou mot de passe incorrect.");
      console.log("Erreur de connexion :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Contenu */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="
          bg-slate-950/70 
          border border-poke-red/40 
          backdrop-blur-xl 
          shadow-[0_0_30px_rgba(239,68,68,0.6)] 
          rounded-3xl 
          p-10 
          w-full max-w-md
        ">
          
          {/* Titre */}
          <h1 className="text-center text-3xl font-orbitron tracking-wide text-white mb-8">
            Connexion à PokeWeb
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
              className="
                w-full px-4 py-3 rounded-xl 
                bg-slate-900/80 
                border border-slate-700 
                text-slate-200 
                focus:border-poke-red 
                focus:ring-2 focus:ring-poke-red/60 
                outline-none transition 
                font-rajdhani
              "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-8">
            <input
              type="password"
              placeholder="Mot de passe"
              className="
                w-full px-4 py-3 rounded-xl 
                bg-slate-900/80 
                border border-slate-700 
                text-slate-200 
                focus:border-poke-red 
                focus:ring-2 focus:ring-poke-red/60 
                outline-none transition 
                font-rajdhani
              "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Bouton Connexion */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`
              w-full py-3 rounded-xl 
              font-orbitron uppercase tracking-wide
              transition
              ${loading 
                ? "bg-slate-700 text-slate-300 cursor-not-allowed"
                : "px-8 py-4 rounded-xl bg-[#ba181b] text-white shadow-[0_0_20px_#ef4444] hover:bg-[#a4161a] hover:shadow-[0_0_35px_#3b82f6] transition-all"}
            `}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          {/* Redirection vers Register */}
          <p className="mt-6 text-center text-slate-300 font-rajdhani">
            Pas encore de compte ?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-poke-red cursor-pointer hover:underline"
            >
              S’inscrire
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
