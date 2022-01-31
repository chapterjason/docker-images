################################################################################
#### Begin stage
#### snapcast
#### {"client":true}
################################################################################
ARG ALPINE_TAG=3
ARG ALPINE_IMAGE=alpine:${ALPINE_TAG}

FROM ${ALPINE_IMAGE}

### template begin: snapcast
WORKDIR /app

RUN set -eux; \
    apk add --no-cache snapcast-client alsa-utils; sync

COPY snapcast-client-entrypoint.sh /usr/local/bin/docker-entrypoint


RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["/usr/local/bin/docker-entrypoint"]
### template end: snapcast