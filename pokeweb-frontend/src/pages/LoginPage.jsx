import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8001/api";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

   useEffect(() => {
    const token = localStorage.getItem("pokeweb_token");
    if (token) {
    
      navigate("/profile");
    }
  }, [navigate]);

  const handleLogin = async () => {
     try{
      const reponse = await axios.post(`${API_URL}/login`, {email, password});

      const token = reponse.data.token;

      localStorage.setItem("pokeweb_token", token)
      localStorage.setItem("pokeweb_user_email", email)

      navigate("/profile")
      
     } catch(error) {
      console.log("erreur de connexion", error)
     }

  };
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
