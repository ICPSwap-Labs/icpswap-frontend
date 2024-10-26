#!/bin/bash

network=${1:-"local"}

chmod 777 ./scripts/env.sh
./scripts/env.sh $network

pnpm run start
