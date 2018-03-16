#!/bin/bash

#To run script: 'bash run.bash'
#If unable to run: 'chmod u+x run.bash' to allow permissions

cd "$(dirname "$0")"

( sleep 1 ; echo "Running Client in...$(pwd)..." ; open http://localhost:8082 ) &

echo "Running Server in...$(pwd)..."
node ./bundle-server.js
#node --experimental-modules --loader ./js-loader.mjs ./src/server.js
