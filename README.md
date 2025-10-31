🌐 Pokeweb

Pokeweb est une application web inspirée de l’univers Pokémon.
Elle combine apprentissage, collection et progression à travers une aventure interactive :
crée ton profil, capture des Pokémon, combats, échange et deviens le meilleur dresseur !



🚀 Pour commencer

🧱 Pré-requis

PHP 8.3

Composer

Node.js + npm (pour le futur frontend)

SQLite (environnement de développement)



⚙️ Installation


➜Cloner le projet

git clone https://github.com/<ton-user>/Pokeweb.git
cd Pokeweb/pokeweb-backend


➜Installer les dépendances

composer install

php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate


➜Importer le Pokédex

php bin/console app:import-pokemons


➜Lancer le serveur

symfony server:start


➜ Rendez-vous sur http://localhost:8000/api


💻 Fabriqué avec


🐘 Symfony 7    -   Backend principal
🔌 API Platform	-   Création de l’API REST
⚛️ React (à venir)  -   Frontend du jeu
🧱 Doctrine ORM -   Gestion de la base de données
🗃️ SQLite   -  Base de données de développement