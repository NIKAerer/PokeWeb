import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./AuthPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* redirige la racine vers /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* route vers la nouvelle page login */}
        <Route path="/login" element={<LoginPage />} />

        {/* l’ancienne page d’inscription reste*/}
        <Route path="/register" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
