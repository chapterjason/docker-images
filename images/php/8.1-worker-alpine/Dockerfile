################################################################################
#### Begin stage
#### php
#### {"symfony":true,"runtime_dependencies":[],"build_dependencies":["postgresql-dev"],"php_extension_install":["pdo","pdo_pgsql"],"php_pecl_install":["redis","timezonedb"],"php_extension_enable":["redis","timezonedb"]}
################################################################################
ARG PHP_TAG=8.1-cli-alpine
ARG PHP_IMAGE=php:${PHP_TAG}

FROM ${PHP_IMAGE}

### template begin: php
# see https://pecl.php.net/package/APCU
ARG APCU_VERSION=5.1.21

# persistent / runtime deps
RUN apk add --no-cache \
        acl \
        fcgi \
        file \
        gettext \
        git \
        gnu-libiconv \
                    ; sync

# install gnu-libiconv and set LD_PRELOAD env to make iconv work fully on Alpine image.
# see https://github.com/docker-library/php/issues/240#issuecomment-763112749
ENV LD_PRELOAD /usr/lib/preloadable_libiconv.so

RUN set -eux; \
    apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        icu-dev \
        libzip-dev \
        zlib-dev \
                postgresql-dev \
            ; \
    docker-php-ext-configure zip; \
    docker-php-ext-install -j$(nproc) \
        intl \
        zip \
                pdo \
                pdo_pgsql \
            ; \
    pecl install \
        apcu-${APCU_VERSION} \
                redis \
                timezonedb \
            ; \
    pecl clear-cache; \
    docker-php-ext-enable \
        apcu \
        opcache \
                redis \
                timezonedb \
            ; \
    runDeps="$( \
        scanelf --needed --nobanner --format '%n#p' --recursive /usr/local/lib/php/extensions \
            | tr ',' '\n' \
            | sort -u \
            | awk 'system("[ -e /usr/local/lib/" $1 " ]") == 0 { next } { print "so:" $1 }' \
    )"; \
    apk add --no-cache --virtual .phpexts-rundeps $runDeps; \
    apk del .build-deps; sync

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# see https://getcomposer.org/doc/03-cli.md#composer-allow-superuser
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV PATH="${PATH}:/root/.composer/vendor/bin"


COPY conf.d/symfony.ini-production $PHP_INI_DIR/conf.d/symfony.ini-production
COPY conf.d/symfony.ini-development $PHP_INI_DIR/conf.d/symfony.ini-development

COPY symfony-docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]
### template end: php