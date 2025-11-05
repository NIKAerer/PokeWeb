import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
       {/* <Route path="/" element={<Navigate to="/login" />} />  à mettre quand acceuil sera pret */}

        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage/>}/>


      </Routes>
    </Router>
  );
}

export default App;
