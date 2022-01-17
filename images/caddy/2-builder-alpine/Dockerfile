################################################################################
#### Begin stage
#### caddy
#### {}
################################################################################
ARG CADDY_TAG=2-builder-alpine
ARG CADDY_IMAGE=caddy:${CADDY_TAG}

FROM ${CADDY_IMAGE}

### template begin: caddy
RUN xcaddy build \
    --with github.com/dunglas/mercure \
    --with github.com/dunglas/mercure/caddy \
    --with github.com/dunglas/vulcain \
    --with github.com/dunglas/vulcain/caddy \
    --with github.com/caddy-dns/cloudflare;
### template end: caddy