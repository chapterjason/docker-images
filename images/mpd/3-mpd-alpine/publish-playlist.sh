#!/usr/bin/env sh
set -e

TOKEN_FILE=./token.txt
ENDPOINT_FILE=./endpoint.txt
LAST_PLAYLIST_FILE=./mpc_last_playlist.txt

CURL_PARAMS=""

TOKEN=$(cat $TOKEN_FILE)
ENDPOINT=$(cat $ENDPOINT_FILE)

if [ ! -z "$(grep "host.docker.internal" $ENDPOINT_FILE)" ]; then
  CURL_PARAMS="--insecure"
fi

echo "" >$LAST_PLAYLIST_FILE

loop() {
  LAST_PLAYLIST=$(cat $LAST_PLAYLIST_FILE)
  CURRENT_PLAYLIST=$(mpc playlist --format "[%position%\f%artist%\f%title%\f%file%]")

  if [ "$CURRENT_PLAYLIST" != "$LAST_PLAYLIST" ]; then
    DATA=$(jq -c -n --arg playlist "$CURRENT_PLAYLIST" '{playlist: $playlist}')
    ID=$(curl $CURL_PARAMS --data-urlencode 'topic=/api/station/playlist' --data-urlencode "data=$DATA" -H "Authorization: Bearer $TOKEN" -X POST $ENDPOINT)
    echo "$CURRENT_PLAYLIST" >$LAST_PLAYLIST_FILE
  fi
}

while [ 1 ]; do
  loop
  test $? -gt 128 && break
done
