ARG SYMFONY_PHP_BASE_IMAGE_TAG=8.1-cli
ARG SYMFONY_PHP_BASE_IMAGE=chapterjason/php:${SYMFONY_PHP_BASE_IMAGE_TAG}

FROM ${SYMFONY_PHP_BASE_IMAGE}

COPY docker/php/conf.d/symfony.ini-production $PHP_INI_DIR/conf.d/symfony.ini-production
COPY docker/php/conf.d/symfony.ini-development $PHP_INI_DIR/conf.d/symfony.ini-development

COPY symfony-docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]