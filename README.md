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

🗃️ SQLite (base de développement)

⚙️ Installation
1️⃣ Cloner le projet

git clone https://github.com/NIKAerer/PokeWeb.git

cd PokeWeb/pokeweb-backend

2️⃣ Installer les dépendances PHP

composer install

Créer la base de données et appliquer les migrations :
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate

3️⃣ Importer le Pokédex

php bin/console app:import-pokemons

4️⃣ Lancer le serveur backend

Méthode recommandée (si Symfony CLI est installée) :
symfony serve --no-tls

ou, si tu préfères utiliser le serveur PHP natif :
php -S 127.0.0.1:8001 -t public

👉 Le backend sera accessible sur : http://127.0.0.1:8001/api

5️⃣ Lancer le serveur frontend

cd ../pokeweb-frontend
npm install
npm start

👉 L’application React sera accessible sur : http://localhost:3000

💡 Structure du projet

Pokeweb/
├── pokeweb-backend/ → API Symfony 7 (Backend principal)
│ ├── src/Entity/ → Entités Doctrine : User, Pokemon, PokemonUser
│ ├── src/Command/ → Import CSV du Pokédex
│ ├── public/pokemons.csv → Source des données Pokémon
│ └── config/packages/ → Configs (Doctrine, JWT, CORS, etc.)
│
├── pokeweb-frontend/ → Application React (interface du jeu)
│ ├── src/pages/ → Pages : Login, Profile, etc.
│ ├── src/App.js → Routage principal
│ └── src/AuthPage.jsx → Prototype d’inscription / test
│
└── docs/ → Ressources, schémas UML et documentation à venir

💻 Stack technique
Technologie	Rôle
🐘 Symfony 7	Backend principal
🔌 API Platform	API REST structurée
🔐 LexikJWTAuthenticationBundle	Authentification par token JWT
🌐 NelmioCORSBundle	Communication Front ↔ Back
🧱 Doctrine ORM	Mapping objet-relationnel
⚛️ React	Frontend dynamique
🗃️ SQLite	Base de données légère pour le développement