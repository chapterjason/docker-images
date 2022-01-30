#!/usr/bin/env sh
set -e

TOKEN_FILE=./token.txt
ENDPOINT_FILE=./endpoint.txt
LAST_STATUS_FILE=./mpc_last_status.txt

TOKEN=$(cat $TOKEN_FILE)
ENDPOINT=$(cat $ENDPOINT_FILE)

echo "" >$LAST_STATUS_FILE

loop() {
  LAST_STATUS=$(cat $LAST_STATUS_FILE)
  CURRENT_STATUS=$(mpc status)

  if [ "$CURRENT_STATUS" != "$LAST_STATUS" ]; then
    DATA=$(jq -c -n --arg status "$CURRENT_STATUS" '{status: $status}')
    curl -d 'topic=/api/station/state' -d "data=$DATA" -H "Authorization: Bearer $TOKEN" -X POST $ENDPOINT
    echo "$CURRENT_STATUS" >$LAST_STATUS_FILE
  fi
}

while [ 1 ]; do
  loop
  test $? -gt 128 && break
done
