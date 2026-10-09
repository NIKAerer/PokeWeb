# Image de production de l'API, utilisée par Render.

# Étape 1 : installer les dépendances PHP avec l'image officielle de Composer
FROM composer:2.8.12 AS vendor
WORKDIR /app
# Les dépendances d'abord : Docker les garde en cache tant que composer.lock ne change pas
COPY composer.json composer.lock symfony.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-progress --ignore-platform-reqs
COPY . .
RUN composer dump-autoload --no-dev --classmap-authoritative

# Étape 2 : l'image finale. FrankenPHP = PHP + un serveur web (Caddy), recommandé par Symfony.
FROM dunglas/frankenphp:1.12.6-php8.3-bookworm

# Réglages PHP de production (erreurs masquées, OPcache activé)
RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

ENV APP_ENV=prod \
    APP_DEBUG=0

WORKDIR /app
COPY --from=vendor /app /app

COPY docker/entrypoint.sh /usr/local/bin/pokeweb-entrypoint
RUN chmod +x /usr/local/bin/pokeweb-entrypoint

ENTRYPOINT ["pokeweb-entrypoint"]
CMD ["--config", "/etc/frankenphp/Caddyfile", "--adapter", "caddyfile"]
