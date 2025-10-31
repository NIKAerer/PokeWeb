import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8001/api";



export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_URL}/register`, { email, password });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "Erreur lors de l'inscription");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      setToken(response.data.token);
      
      setMessage("Connexion réussie !");
    } catch (error) {
      setMessage(error.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "10%" }}>
      <h1>🔥 Pokeweb Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ margin: 5, padding: 10 }}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: 5, padding: 10 }}
      />
      <div>
        <button onClick={handleRegister} style={{ margin: 5, padding: 10 }}>
          S'inscrire
        </button>
        <button onClick={handleLogin} style={{ margin: 5, padding: 10 }}>
          Se connecter
        </button>
      </div>
      <p>{message}</p>
      {token && (
        <div style={{ marginTop: 20 }}>
          <h3>Ton token JWT :</h3>
          <code style={{ color: "limegreen" }}>{token}</code>
        </div>
      )}
    </div>
  );
}
