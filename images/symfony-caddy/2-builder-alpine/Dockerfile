ARG SYMFONY_CADDY_BASE_IMAGE_TAG=2-builder-alpine
ARG SYMFONY_CADDY_BASE_IMAGE=caddy:${SYMFONY_CADDY_BASE_IMAGE_TAG}

FROM ${SYMFONY_CADDY_BASE_IMAGE}

RUN xcaddy build \
	--with github.com/dunglas/mercure \
	--with github.com/dunglas/mercure/caddy \
	--with github.com/dunglas/vulcain \
	--with github.com/dunglas/vulcain/caddy \
    --with github.com/caddy-dns/cloudflare;