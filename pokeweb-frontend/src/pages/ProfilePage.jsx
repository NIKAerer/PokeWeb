import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";



export default function ProfilePage(){
    
    const navigate = useNavigate();
    const email = localStorage.getItem("pokeweb_user_email");


    useEffect(() => {
    const token = localStorage.getItem("pokeweb_token");
    if (!token) {
        navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("pokeweb_user_email");
        localStorage.removeItem("pokeweb_token");

        navigate("/login");
    }


    // Page d'accueil du joueur connecté (le vrai profil arrive avec la barre de navigation)
    return (
        <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md rounded-3xl border border-poke-red/40 bg-slate-950/70 p-10 text-center shadow-[0_0_30px_rgba(239,68,68,0.4)] backdrop-blur-xl">
                <h1 className="font-orbitron text-3xl text-white">Profil du dresseur</h1>
                <p className="mt-2 font-rajdhani text-slate-300">Bienvenue{email ? `, ${email}` : ""} 👋</p>

                <nav className="mt-8 flex flex-col gap-3 font-rajdhani text-lg">
                    <Link to="/explorer" className="rounded-xl bg-[#ba181b] py-3 text-white shadow-[0_0_20px_#ef4444] transition hover:bg-[#a4161a]">
                        Explorer les hautes herbes
                    </Link>
                    <Link to="/collection" className="rounded-xl border border-slate-600 py-3 text-slate-200 transition hover:border-slate-400">
                        Ma collection
                    </Link>
                    <Link to="/pokedex" className="rounded-xl border border-slate-600 py-3 text-slate-200 transition hover:border-slate-400">
                        Pokédex
                    </Link>
                </nav>

                <button onClick={handleLogout} className="mt-8 font-rajdhani text-slate-400 hover:text-white">
                    Se déconnecter
                </button>
            </div>
        </main>
    )
}
