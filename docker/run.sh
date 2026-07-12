#!/usr/bin/env bash
# Build the CI image and run a command inside it (default: lint + test + build).
# Nothing is installed on the host; deps live only in the image.
#
#   docker/run.sh                      # lint + test + build
#   docker/run.sh yarn test            # just the test suite
#   docker/run.sh yarn build           # just the build
#   docker/run.sh sh                   # interactive shell
set -euo pipefail

IMAGE="horizon-card-ci"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

docker build -f "$ROOT/docker/Dockerfile" -t "$IMAGE" "$ROOT"

if [ "$#" -eq 0 ]; then
  docker run --rm "$IMAGE"
else
  docker run --rm "$IMAGE" sh -lc "$*"
fi
