import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import PokedexPage from "./pages/PokedexPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import GalaxyBackground from "./components/GalaxyBackground";


function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GalaxyBackground/>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/pokedex" element={<PokedexPage />} />
          <Route path="/pokedex/:id" element={<PokemonDetailPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
