FROM php:8.4-cli-bookworm AS php-base

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libfreetype6-dev \
        libicu-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
        libpq-dev \
        libzip-dev \
        unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" bcmath gd intl opcache pcntl pdo_pgsql zip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

FROM php-base AS build

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY --from=node:22-bookworm /usr/local/ /usr/local/
COPY . .

RUN composer install --prefer-dist --no-interaction --no-progress --optimize-autoloader \
    && php artisan storage:link \
    && npm ci \
    && npm run build \
    && rm -rf node_modules

FROM php-base AS runtime

COPY --from=build --chown=www-data:www-data /var/www/html /var/www/html
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs \
    && chown -R www-data:www-data storage bootstrap/cache

USER www-data

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
