import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import PokedexPage from "./pages/PokedexPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import ExplorePage from "./pages/ExplorePage";
import CollectionPage from "./pages/CollectionPage";
import NotFoundPage from "./pages/NotFoundPage";
import RequireAuth from "./components/RequireAuth";
import GalaxyBackground from "./components/GalaxyBackground";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GalaxyBackground />
      {/* "future" active déjà le comportement de React Router v7 (et évite ses avertissements) */}
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Navbar />
        {/* pt-16 : on laisse la place de la barre de navigation fixe */}
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pokedex" element={<PokedexPage />} />
            <Route path="/pokedex/:id" element={<PokemonDetailPage />} />
            <Route path="/explorer" element={<RequireAuth><ExplorePage /></RequireAuth>} />
            <Route path="/collection" element={<RequireAuth><CollectionPage /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
