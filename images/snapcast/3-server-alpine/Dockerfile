################################################################################
#### Begin stage
#### snapcast
#### {"server":true}
################################################################################
ARG ALPINE_TAG=3
ARG ALPINE_IMAGE=alpine:${ALPINE_TAG}

FROM ${ALPINE_IMAGE}

### template begin: snapcast
WORKDIR /app


EXPOSE 1704
EXPOSE 1780
EXPOSE 1705

RUN set -eux; \
    mkdir -p /app/files; \
    apk add --no-cache snapcast-server mpg123; sync

COPY snapcast-server-entrypoint.sh /usr/local/bin/docker-entrypoint
COPY snapcast-server.conf /etc/conf.d/snapcast-server
COPY asound.conf /etc/asound.conf

RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["/usr/local/bin/docker-entrypoint"]
### template end: snapcast