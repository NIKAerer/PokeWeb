.

🌐 Pokeweb

Pokeweb est une application web moderne inspirée de l’univers Pokémon.
Conçu comme un jeu interactif et évolutif, il permet de créer ton dresseur, gérer ton équipe et explorer un Pokédex complet.
L’objectif est de combiner une architecture professionnelle (Symfony + React) avec une expérience fluide, stylisée et immersive — entre application web et mini-jeu en ligne.

🚀 Démarrage rapide
🧱 Prérequis

Assure-toi d’avoir installé :

🐘 PHP 8.3 ou supérieur

⚙️ Composer

⚛️ Node.js + npm

🗃️ SQLite (utilisé en base de développement)

💡 (Optionnel) Symfony CLI pour un serveur local plus pratique

⚙️ Installation
1️⃣ Cloner le projet

git clone https://github.com/NIKAerer/PokeWeb.git

cd PokeWeb/pokeweb-backend

2️⃣ Installer les dépendances PHP

npm install three@0.152.2 @react-three/fiber@8.13.6 @react-three/drei@9.56.5


composer install

Créer la base de données et appliquer les migrations :
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate

3️⃣ Importer le Pokédex

php bin/console app:import-pokemons

4️⃣ Lancer le serveur backend

Méthode recommandée (avec Symfony CLI) :
symfony serve --no-tls

Ou avec le serveur PHP natif :
php -S 127.0.0.1:8001 -t public

👉 Backend accessible sur : http://127.0.0.1:8001/api

5️⃣ Lancer le serveur frontend

cd ../pokeweb-frontend
npm install
npm start

👉 Frontend accessible sur : http://localhost:3000

💡 Structure du projet
Pokeweb/
├── pokeweb-backend/              → API Symfony 7 (backend principal)
│   ├── src/Entity/               → Entités Doctrine : User, Pokemon, PokemonUser
│   ├── src/Command/              → Commande d’import CSV du Pokédex
│   ├── src/Controller/AuthController.php → Auth / JWT
│   ├── public/pokemons.csv       → Données sources Pokémon
│   └── config/packages/          → Configs (Doctrine, JWT, CORS, etc.)
│
├── pokeweb-frontend/             → Application React (interface du jeu)
│   ├── src/pages/                → Pages : Login, Register, Profile, Home
│   ├── src/components/           → Composants : Pokeball3D, UI futuriste, etc.
│   ├── src/App.js                → Routage principal
│   ├── tailwind.config.js        → Configuration du thème et des couleurs
│   └── postcss.config.js         → Config Tailwind / PostCSS
│
└── docs/                         → Documentation, schémas, UML

🔒 Authentification actuelle

Inscription → /api/register → crée un utilisateur et le sauvegarde

Connexion → /api/login → renvoie un token JWT signé

Frontend

Stocke le token (pokeweb_token) et l’email (pokeweb_user_email) dans le localStorage

Redirige automatiquement vers /profile après connexion / inscription

Vérifie la validité du token à chaque chargement

Redirige vers /login si le token est manquant ou expiré

Le bouton Se déconnecter supprime les données locales et retourne sur /login

💻 Stack technique
Technologie	Rôle
🐘 Symfony 7	Backend principal
🔌 API Platform	API REST structurée
🔐 LexikJWTAuthenticationBundle	Authentification sécurisée JWT
🌐 NelmioCORSBundle	Communication Front ↔ Back
🧱 Doctrine ORM	Mapping objet-relationnel
⚛️ React	Frontend dynamique
💅 TailwindCSS	Design moderne Web3 / futuriste
🧩 React Three Fiber + Drei	Rendu 3D (Pokéball, animations, scènes)
🗃️ SQLite	Base de données légère pour le développement
🎨 Identité visuelle & Pokéball 3D

Mise en place complète de TailwindCSS (palette Pokéball : rouge, bleu néon, noir profond).

Création du composant Pokeball3D.jsx (React Three Fiber) :

Demi-sphère rouge (haut) et blanche (bas)

Bande noire encastrée

Bouton central bombé avec cerclage noir

Halo énergétique rouge / bleu subtil

Éclairage studio doux (RectAreaLight + AmbientLight)

Rotation lente et fluide

Rendu HD réaliste et fluide, prêt à être intégré à la page d’accueil immersive.

🗺️ Roadmap
✅ Phase 1 – Base & Authentification

Backend Symfony + Frontend React

Auth JWT complète

Pages : Login / Register / Profile

🎨 Phase 2 – Style & Identité visuelle (en cours)

Setup TailwindCSS

Pokéball 3D terminée

Page Home immersive à venir (fond animé, titre, bouton “Commencer l’aventure”)

🐾 Phase 3 – Pokédex & Gameplay de base

Endpoint /api/pokemons

Page /pokedex : affichage du Pokédex complet

Système de capture → entité PokemonUser

⚔️ Phase 4 – Combat, progression & monde Pokémon

Combat tour par tour (PvE)

Système d’XP, évolutions, badges

Carte du monde (React + Three.js)

📍 Backend : http://127.0.0.1:8001/api

📍 Frontend : http://localhost:3000