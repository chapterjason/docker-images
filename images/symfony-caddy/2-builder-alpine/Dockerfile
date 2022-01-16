ARG SYMFONY-CADDY_BASE_IMAGE_TAG=2-builder-alpine
ARG SYMFONY-CADDY_BASE_IMAGE=caddy:${SYMFONY-CADDY_BASE_IMAGE_TAG}

FROM ${SYMFONY-CADDY_BASE_IMAGE}

RUN xcaddy build \
	--with github.com/dunglas/mercure \
	--with github.com/dunglas/mercure/caddy \
	--with github.com/dunglas/vulcain \
	--with github.com/dunglas/vulcain/caddy \
    --with github.com/caddy-dns/cloudflare;