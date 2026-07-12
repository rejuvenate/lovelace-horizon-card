#!/usr/bin/env bash
# Build the Playwright image and run the visual regression suite inside it.
# Nothing (browsers, node, yarn) is installed on the host.
#
#   docker/run-visual.sh                                   # run the visual tests
#   docker/run-visual.sh yarn test:visual --update-snapshots   # (re)generate baselines
#   docker/run-visual.sh sh                                # interactive shell
#
# tests/visual is bind-mounted so generated screenshot baselines and test
# results are written back to the host (the built bundle stays in the image).
set -euo pipefail

IMAGE="horizon-card-visual"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

docker build -f "$ROOT/docker/Dockerfile.visual" -t "$IMAGE" "$ROOT"

if [ "$#" -eq 0 ]; then
  docker run --rm -v "$ROOT/tests/visual:/app/tests/visual" "$IMAGE"
else
  docker run --rm -v "$ROOT/tests/visual:/app/tests/visual" "$IMAGE" sh -lc "$*"
fi
