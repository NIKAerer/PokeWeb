import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api from "../api/client";
import { isLoggedIn, saveToken } from "../auth/session";
import AuthCard from "../components/AuthCard";
import TextInput from "../components/TextInput";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  if (isLoggedIn()) {
    return <Navigate to="/profile" replace />;
  }

  // Un seul gestionnaire pour tous les champs : on met à jour la clé qui porte le "name" du champ
  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      // L'API connecte directement le joueur en renvoyant un token
      saveToken(response.data.token);
      navigate("/explorer");
    } catch (error) {
      // L'API renvoie "error" (email ou pseudo déjà pris) ou "violations" (champ invalide)
      const data = error.response?.data;
      setErrorMessage(data?.error ?? data?.violations?.[0]?.title ?? "Impossible de créer le compte.");
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Créer un compte" subtitle="Ton aventure commence ici." error={errorMessage}>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Pseudo"
          name="username"
          autoComplete="username"
          required
          minLength={3}
          maxLength={20}
          value={form.username}
          onChange={handleChange}
        />
        <TextInput label="Email" name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} />
        <TextInput
          label="Mot de passe (8 caractères minimum)"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={form.password}
          onChange={handleChange}
        />
        <TextInput
          label="Confirmer le mot de passe"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full rounded-xl bg-[#ba181b] py-4 font-orbitron uppercase tracking-wide text-white shadow-[0_0_20px_#ef4444] transition-all hover:bg-[#a4161a] hover:shadow-[0_0_35px_#3b82f6] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:shadow-none"
        >
          {loading ? "Création…" : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-6 text-center font-rajdhani text-slate-300">
        Tu as déjà un compte ?{" "}
        <Link to="/login" className="text-poke-red hover:underline">
          Se connecter
        </Link>
      </p>
    </AuthCard>
  );
}
