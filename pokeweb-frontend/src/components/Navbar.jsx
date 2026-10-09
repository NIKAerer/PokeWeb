import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { clearToken, isLoggedIn } from "../auth/session";
import PokeballIcon from "./PokeballIcon";

// Liens visibles par tout le monde, puis ceux réservés aux joueurs connectés
const PUBLIC_LINKS = [{ to: "/pokedex", label: "Pokédex" }];
const PLAYER_LINKS = [
  { to: "/explorer", label: "Explorer" },
  { to: "/collection", label: "Collection" },
  { to: "/profile", label: "Profil" },
];

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 transition ${
    isActive ? "bg-white/10 text-white" : "text-slate-300 hover:text-white"
  }`;

export default function Navbar() {
  const location = useLocation(); // relit la page à chaque changement d'URL
  const navigate = useNavigate();
  // On retient la page où le menu mobile a été ouvert : il se referme dès qu'on change de page.
  const [menuOpenedOn, setMenuOpenedOn] = useState(null);
  const menuOpen = menuOpenedOn === location.pathname;

  const loggedIn = isLoggedIn();
  const links = loggedIn ? [...PUBLIC_LINKS, ...PLAYER_LINKS] : PUBLIC_LINKS;

  const logout = () => {
    clearToken();
    navigate("/home");
  };

  const authButtons = loggedIn ? (
    <button onClick={logout} className="rounded-lg px-3 py-2 text-slate-400 transition hover:text-white">
      Déconnexion
    </button>
  ) : (
    <>
      <NavLink to="/login" className={linkClass}>
        Connexion
      </NavLink>
      <Link
        to="/register"
        className="rounded-lg bg-[#ba181b] px-4 py-2 text-white shadow-[0_0_15px_#ef4444] transition hover:bg-[#a4161a]"
      >
        S'inscrire
      </Link>
    </>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 font-rajdhani text-lg font-semibold sm:px-8">
        <Link to="/home" className="flex items-center gap-2 font-orbitron text-xl text-white">
          <PokeballIcon size={26} />
          POKEWEB
        </Link>

        {/* Ordinateur : tous les liens sur une ligne */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          <span className="mx-2 h-6 w-px bg-white/15" />
          {authButtons}
        </div>

        {/* Mobile : bouton "hamburger" */}
        <button
          onClick={() => setMenuOpenedOn(menuOpen ? null : location.pathname)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg md:hidden"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
        >
          <span className={`h-0.5 w-6 bg-white transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-white transition ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-white transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      {menuOpen && (
        <div
          onClick={() => setMenuOpenedOn(null)}
          className="flex flex-col gap-1 border-t border-white/10 bg-slate-950/95 px-4 py-4 font-rajdhani text-lg font-semibold md:hidden"
        >
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          <div className="mt-2 flex items-center gap-2 border-t border-white/10 pt-3">{authButtons}</div>
        </div>
      )}
    </header>
  );
}
