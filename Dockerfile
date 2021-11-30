ARG PHP_VERSION=8.0
ARG NODE_VERSION=16
ARG NGINX_VERSION=1.27.3

######### PHP CONFIG
FROM php:${PHP_VERSION}-fpm-alpine as php

WORKDIR /srv/app
COPY www www/

EXPOSE 9000

COPY ./.docker/php/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]
CMD ["php-fpm"]

######### NODE CONFIG
FROM node:${NODE_VERSION}-alpine as node

WORKDIR /srv/app

RUN apk update; \
    apk add yarn;
RUN apk add --no-cache --virtual .build-deps alpine-sdk python3

# prevent the reinstallation of vendors at every changes in the source code
COPY package.json yarn.lock ./
COPY tsconfig.json tslint.json webpack.config.js ./
COPY src src/
COPY styles styles/
COPY templates templates/
COPY bin bin/
COPY data data/

RUN set -eux; \
	yarn install; \
	yarn cache clean; \
    yarn build

RUN apk del .build-deps

COPY ./.docker/node/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]
CMD ["yarn", "start"]

######### NGINX CONFIG
FROM nginx:${NGINX_VERSION}-alpine as nginx
COPY .docker/nginx/conf.d/domain.conf /etc/nginx/conf.d/default.conf

WORKDIR /srv/app

COPY --from=node /srv/app/www/assets www/assets
COPY --from=php /srv/app/www/index.php www/index.php
