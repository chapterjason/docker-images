ARG PHP_BASE_IMAGE_TAG=8.1-fpm
ARG PHP_BASE_IMAGE=php:${PHP_BASE_IMAGE_TAG}

FROM ${PHP_BASE_IMAGE}

# see https://pecl.php.net/package/APCU
ARG APCU_VERSION=5.1.21

# persistent / runtime deps
RUN apk add --no-cache \
        acl \
        fcgi \
        freetype \
        libpng \
        libjpeg-turbo \
        file \
        gnu-libiconv \
        gettext \
        git \
        jq \
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
	    freetype-dev \
	    libpng-dev \
	    libjpeg-turbo-dev \
	    postgresql-dev \
	; \
    docker-php-ext-configure zip; \
	docker-php-ext-install -j$(nproc) \
	    intl \
	    zip \
	    sockets \
	    gd \
	    pdo \
	    pdo_mysql \
	    pdo_pgsql \
	; \
	pecl install \
	    apcu-${APCU_VERSION} \
	    redis \
	    timezonedb \
	    xdebug \
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

COPY php-fpm-docker-healthcheck.sh /usr/local/bin/docker-healthcheck
RUN chmod +x /usr/local/bin/docker-healthcheck

HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD ["docker-healthcheck"]

COPY php-fpm.d/zz-docker.conf /usr/local/etc/php-fpm.d/zz-docker.conf

VOLUME /var/run/php

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# see https://getcomposer.org/doc/03-cli.md#composer-allow-superuser
ENV COMPOSER_ALLOW_SUPERUSER=1

ENV PATH="${PATH}:/root/.composer/vendor/bin"