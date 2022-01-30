#!/usr/bin/env sh
set -e

JWT_TOKEN_FILE=./jwt_token.txt
ENDPOINT=./domain.txt
LAST_STATUS_FILE=./mpc_last_status.txt

TOKEN=$(cat $JWT_TOKEN_FILE)

echo "" >$LAST_STATUS_FILE

loop() {
  LAST_STATUS=$(cat $LAST_STATUS_FILE)
  CURRENT_STATUS=$(mpc status)

  if [ "$CURRENT_STATUS" != "$LAST_STATUS" ]; then
    curl -d 'topic=/api/station/state' -d "data=$STATUS" -H "Authorization: Bearer $TOKEN" -X POST $ENDPOINT
    echo "$CURRENT_STATUS" >$LAST_STATUS_FILE
  fi
}

while [ 1 ]; do
  loop
  test $? -gt 128 && break
done
