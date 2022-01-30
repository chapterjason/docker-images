#!/usr/bin/env sh
set -e

TOKEN_FILE=./token.txt
ENDPOINT_FILE=./endpoint.txt
LAST_STATUS_FILE=./mpc_last_status.txt

CURL_PARAMS=""

TOKEN=$(cat $TOKEN_FILE)
ENDPOINT=$(cat $ENDPOINT_FILE)

if [ ! -z "$(grep "host.docker.internal" $ENDPOINT_FILE)" ]; then
  CURL_PARAMS="--insecure"
fi

echo "" >$LAST_STATUS_FILE

loop() {
  LAST_STATUS=$(cat $LAST_STATUS_FILE)
  CURRENT_STATUS=$(mpc status)

  if [ "$CURRENT_STATUS" != "$LAST_STATUS" ]; then
    DATA=$(jq -c -n --arg status "$CURRENT_STATUS" '{status: $status}')
    ID=$(curl $CURL_PARAMS --data-urlencode 'topic=/api/station/state' --data-urlencode "data=$DATA" -H "Authorization: Bearer $TOKEN" -X POST $ENDPOINT)
    echo "$CURRENT_STATUS" >$LAST_STATUS_FILE
  fi
}

while [ 1 ]; do
  loop
  test $? -gt 128 && break
done
