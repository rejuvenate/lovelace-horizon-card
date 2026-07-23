#!/usr/bin/env bash
# Build the card bundle (inside the CI image — nothing is installed on the host) and drop it where
# the Home Assistant container serves it (config/www -> /local). Run this before `docker compose up`.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
OUT="$HERE/config/www"

mkdir -p "$OUT"
docker build -f "$ROOT/docker/Dockerfile" -t horizon-card-ci "$ROOT"
docker run --rm -v "$OUT:/out" horizon-card-ci sh -lc "yarn build && cp dist/lovelace-horizon-card.js /out/"
echo "Copied bundle to $OUT/lovelace-horizon-card.js"
