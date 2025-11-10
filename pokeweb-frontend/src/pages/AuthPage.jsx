import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8001/api";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      //const response = await axios.post(`${API_URL}/register`, { email, password });

      const loginResponse = await axios.post(`${API_URL}/login`, {email, password})
      const token = loginResponse.data.token;

      localStorage.setItem("pokeweb_token", token)
      localStorage.setItem("pokeweb_user_email", email)

      navigate("/profile");

    } catch (error) {
      setMessage(error.response?.data?.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <div>
      <h1>Inscription</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div>
        <button onClick={handleRegister}>Créer un compte</button>
        <button onClick={() => navigate("/login")}>Déjà inscrit ? Se connecter</button>
      </div>

      <p>{message}</p>
    </div>
  );
}
