import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8001/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => { console.log("tentative de connexion :", email, password) };
  const handleRegister = async () => { navigate("/register"); };

  return (
    <div>
      <h1>Connexion à PokeWeb</h1>

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

      <button onClick={() => handleLogin()}>
        Se connecter
      </button>

      <button onClick={() => handleRegister()}>
        S’inscrire
      </button>
    </div>
  );
}
