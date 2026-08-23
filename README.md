🌐 Pokeweb — Jeu d’aventure, capture, survie et exploration

Pokeweb est une application web qui combine gestion de dresseur, exploration, capture de créatures, survie légère et construction progressive d’une ville.
Le joueur commence dans un petit campement vide entouré d’arbres, puis développe sa base, découvre des zones via téléportation et progresse à travers un système d’arènes et de créatures capturables.

L’objectif du projet est de créer une expérience fluide, immersive et moderne, soutenue par une architecture professionnelle (Symfony + React) et un rendu 3D soigné.

🚀 Démarrage rapide
🧱 Prérequis

Avoir installé :

PHP 8.3

Composer

Node.js + npm

SQLite

(Optionnel) Symfony CLI

⚙️ Installation
1️⃣ Cloner le projet

git clone https://github.com/NIKAerer/PokeWeb.git

cd PokeWeb/pokeweb-backend

2️⃣ Installer les dépendances

npm install three@0.152.2 @react-three/fiber@8.13.6 @react-three/drei@9.56.5
composer install

Créer la base de données :
php bin/console doctrine:database:create

Lancer les migrations :
php bin/console doctrine:migrations:migrate

3️⃣ Importer le Pokédex

php bin/console app:import-pokemons

4️⃣ Lancer le backend

symfony serve --no-tls
ou
php -S 127.0.0.1:8001 -t public

Backend disponible sur : http://127.0.0.1:8001/api

5️⃣ Lancer le frontend

cd ../pokeweb-frontend
npm install
npm start

Frontend accessible sur : http://localhost:3000

💡 Structure du projet

Pokeweb/
├── pokeweb-backend/
│ ├── src/Entity/
│ ├── src/Command/
│ ├── src/Controller/
│ ├── public/pokemons.csv
│ └── config/packages/
│
├── pokeweb-frontend/
│ ├── src/pages/
│ ├── src/components/
│ ├── src/game/
│ ├── src/App.js
│ ├── tailwind.config.js
│ └── postcss.config.js
│
└── docs/

🔒 Authentification
Backend

Inscription : /api/register

Connexion : /api/login (JWT)

Frontend

Token stocké dans localStorage

Redirections automatiques selon l’état du token

Déconnexion : suppression du token + retour login

💻 Stack technique

Symfony 7 : backend et API
API Platform : endpoints structurés
JWT : authentification
Doctrine ORM : gestion des entités
React : interface
TailwindCSS : design moderne
React Three Fiber : rendu 3D
SQLite : base de développement

🎨 Identité visuelle & Pokéball 3D

Palette rouge / bleu néon / noir

Pokeball 3D réaliste

Halo subtil

Rotation lente

Éclairage studio

Intégrée à la page d’accueil immersive

🌲 Gameplay et nouveaux systèmes
Ville principale — Version 0

Le joueur commence dans une zone simple et naturelle :

Feu de camp éteint

Abri rudimentaire

Caisses vides

Terrain herbeux entouré d’arbres

Chemin naturel menant vers l’extérieur

Panneau de téléportation cassé (à réparer)

Cette zone évoluera progressivement en une véritable base puis une ville complète.

Construction et progression

Évolution prévue du camp vers une ville :

Niveau 1 :

Feu utilisable

Petit atelier

Coffre

Réparation du panneau de téléportation

Niveau 2 :

Maison

Atelier avancé

Jardin

Enclos pour créatures

Niveau 3 :

Centre de soins

Boutique

Quartiers des dresseurs

Portail de téléportation amélioré

Zone d’entraînement

Zones téléportées

Le panneau permet d’accéder à plusieurs cartes distinctes :

Zones de collecte :

Forêt

Prairie

Rivière

Montagne

Marais

Zones d’aventure :

Biomes à thème

Donjons

Boss de zone

Arènes :

Maps indépendantes dédiées au combat

Progression par badges

Cette structure rend le développement plus simple et permet d’ajouter du contenu progressivement.

📚 Roadmap
Phase 1 — Base

Backend, frontend, auth, pages Login/Register/Profile

Phase 2 — Identité visuelle (en cours)

UI, Pokeball 3D, page d’accueil

Phase 3 — Pokédex et capture

Listing des créatures, stockage joueur

Phase 4 — Combat et progression

Système de combat tour par tour, XP, évolutions, badges

Phase 5 — Monde et survie

Ville vide, construction, collecte, panneaux de téléportation, maps séparées

📍 Backend : http://127.0.0.1:8001/api

📍 Frontend : http://localhost:3000