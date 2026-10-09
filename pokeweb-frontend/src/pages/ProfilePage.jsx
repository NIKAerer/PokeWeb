import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



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


    return (
        <div>
            <h1>Profil du dresseur:</h1>
            <p>Bienvenue{email ? `, ${email}` : ""} 👋</p>

            <button onClick={handleLogout}>Se deconnecter</button>

        </div>
    )
}