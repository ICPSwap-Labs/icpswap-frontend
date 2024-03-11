#!/bin/bash
network=${1:-"local"}

chmod 777 ./scripts/canister-ids.sh
./scripts/canister-ids.sh all local

pnpm run start
