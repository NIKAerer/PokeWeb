#!/bin/sh
# Lancé à chaque démarrage du conteneur.
# Sur l'offre gratuite de Render, le disque est effacé à chaque redémarrage :
# on reconstruit donc tout (base SQLite, Pokédex, compte de démo) à partir de zéro.
set -e

# Clés JWT créées au démarrage avec JWT_PASSPHRASE (variable d'environnement de Render)
php bin/console lexik:jwt:generate-keypair --skip-if-exists

php bin/console cache:warmup
php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration
php bin/console app:import-pokemons
php bin/console app:demo

# Render indique le port à écouter dans $PORT ; ":port" = HTTP simple (Render gère le HTTPS)
export SERVER_NAME=":${PORT:-8080}"

exec docker-php-entrypoint frankenphp run "$@"
