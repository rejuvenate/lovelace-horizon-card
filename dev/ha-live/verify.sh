#!/usr/bin/env bash
# dev/ha-live/verify.sh - bring up a real Home Assistant, load a Lovelace artifact of this card
# (a dashboard, a single card, or the visual editor), and screenshot it headless. Docker only, so
# nothing (Home Assistant, node, browsers) is installed on the host. Not part of CI. See README.md.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"

MODE="dashboard"
TARGET="$ROOT/tests/manual/styling-and-embedding.yaml"
EDITOR_TYPE="horizon-card"
OUT="$HERE/out"
HA_VERSION=""
KEEP=0
HA_USER="dev"
HA_PASS="ha-live-dev"
RESOURCES=()

die () { echo "error: $*" >&2; exit 1; }

usage () {
  cat >&2 <<'USAGE'
Usage: dev/ha-live/verify.sh [options]
  --dashboard <path>    Render a Lovelace dashboard YAML
                        (default: tests/manual/styling-and-embedding.yaml)
  --card <path>         Render a single card config (YAML), wrapped in a one-card dashboard
  --editor [<type>]     Screenshot the card's visual editor (default type: horizon-card;
                        needs a bundle that ships getConfigElement)
  --resource url[,type] Extra Lovelace resource, e.g. Uix (repeatable; default type: module)
  --ha-version <tag>    Home Assistant image tag to use (default: the pinned one)
  --out <dir>           Screenshot output directory (default: dev/ha-live/out)
  --keep                Leave HA running and publish http://localhost:8123 for manual inspection
USAGE
  exit 1
}

while [ $# -gt 0 ]; do
  case "$1" in
    --dashboard) [ $# -ge 2 ] || usage; MODE="dashboard"; TARGET="$2"; shift 2 ;;
    --card) [ $# -ge 2 ] || usage; MODE="card"; TARGET="$2"; shift 2 ;;
    --editor)
      MODE="editor"; shift
      # An optional type argument follows only if it is not another flag.
      case "${1:-}" in ''|-*) : ;; *) EDITOR_TYPE="$1"; shift ;; esac ;;
    --resource) [ $# -ge 2 ] || usage; RESOURCES+=("$2"); shift 2 ;;
    --ha-version) [ $# -ge 2 ] || usage; HA_VERSION="$2"; shift 2 ;;
    --out) [ $# -ge 2 ] || usage; OUT="$2"; shift 2 ;;
    --keep) KEEP=1; shift ;;
    -h|--help) usage ;;
    *) echo "unknown argument: $1" >&2; usage ;;
  esac
done

command -v docker >/dev/null 2>&1 || die "docker not found"
docker info >/dev/null 2>&1 || die "docker daemon not running"

# Resolve the output dir to an absolute path: docker treats a relative -v source as a NAMED VOLUME,
# which would silently swallow the screenshots instead of writing them to the host.
mkdir -p "$OUT" || die "cannot create output dir: $OUT"
OUT="$(cd "$OUT" && pwd)"

IMAGE="horizon-card-visual"
NETWORK="ha-live_default"
# -p pins the project name (so it wins over any exported COMPOSE_PROJECT_NAME), keeping the network
# name that the driver joins deterministic.
COMPOSE=(docker compose -p ha-live -f "$HERE/docker-compose.yml")
[ "$KEEP" = 1 ] && COMPOSE+=(-f "$HERE/docker-compose.keep.yml")
[ -z "$HA_VERSION" ] || export HA_IMAGE="ghcr.io/home-assistant/home-assistant:$HA_VERSION"

cleanup () {
  code=$?
  # Only leave HA running on a clean run; on a failed start, tear the partial stack down instead of
  # printing a misleading "it's running" banner.
  if [ "$KEEP" = 1 ] && [ "$code" -eq 0 ]; then
    echo ""
    echo "[ha-live] left running (--keep):  http://localhost:8123   user '$HA_USER'   pass '$HA_PASS'"
    echo "[ha-live] stop it with:  ${COMPOSE[*]} down"
  else
    "${COMPOSE[@]}" down >/dev/null 2>&1 || true
    [ "$KEEP" = 1 ] && echo "[ha-live] startup failed; nothing left running." >&2
  fi
  exit $code
}
trap cleanup EXIT

CFG="$HERE/config"

echo "[ha-live] building image (card bundle + Playwright)..."
docker build -q -f "$ROOT/docker/Dockerfile.visual" -t "$IMAGE" "$ROOT" >/dev/null

# A clean config each run: onboarding is one-shot, so a persisted .storage would make the next run
# unable to create the dev user. verify.sh regenerates everything here from scratch.
echo "[ha-live] preparing a clean Home Assistant config..."
rm -rf "$CFG"
mkdir -p "$CFG/www" "$OUT"
docker run --rm -v "$CFG/www:/copyout" "$IMAGE" sh -lc "cp dist/lovelace-horizon-card.js /copyout/"

{
  echo "default_config:"
  echo "lovelace:"
  echo "  mode: yaml"
  echo "  resources:"
  echo "    - url: /local/lovelace-horizon-card.js"
  echo "      type: module"
} > "$CFG/configuration.yaml"
if [ ${#RESOURCES[@]} -gt 0 ]; then
  for res in "${RESOURCES[@]}"; do
    url="${res%%,*}"
    rtype="module"
    case "$res" in *,*) rtype="${res#*,}" ;; esac
    [ -n "$rtype" ] || rtype="module"
    printf '    - url: %s\n      type: %s\n' "$url" "$rtype" >> "$CFG/configuration.yaml"
  done
fi

# The target dashboard for YAML-mode Lovelace: fresh login lands directly on it (Overview).
case "$MODE" in
  dashboard)
    [ -f "$TARGET" ] || die "dashboard file not found: $TARGET"
    cp "$TARGET" "$CFG/ui-lovelace.yaml"
    ;;
  card)
    [ -f "$TARGET" ] || die "card file not found: $TARGET"
    {
      echo "title: HA Live"
      echo "views:"
      echo "  - title: Card"
      echo "    cards:"
      echo "      -"
      sed 's/^/        /' "$TARGET"
    } > "$CFG/ui-lovelace.yaml"
    ;;
  editor)
    # A card of this type makes the frontend load the resource so getConfigElement is defined; the
    # driver mounts the editor itself.
    {
      echo "title: HA Live"
      echo "views:"
      echo "  - title: Editor"
      echo "    cards:"
      echo "      - type: custom:$EDITOR_TYPE"
    } > "$CFG/ui-lovelace.yaml"
    ;;
esac

echo "[ha-live] starting Home Assistant..."
"${COMPOSE[@]}" up -d

echo "[ha-live] running the Playwright driver..."
if docker run --rm --network "$NETWORK" \
  -v "$HERE/driver.mjs:/app/driver.mjs:ro" \
  -v "$OUT:/out" \
  -e HA_URL="http://homeassistant:8123" \
  -e HA_USER="$HA_USER" -e HA_PASS="$HA_PASS" \
  -e MODE="$MODE" -e EDITOR_TYPE="$EDITOR_TYPE" -e OUT="/out" \
  "$IMAGE" node /app/driver.mjs
then
  echo "[ha-live] done. Screenshots in: $OUT"
else
  echo "[ha-live] driver failed. Recent Home Assistant logs:" >&2
  "${COMPOSE[@]}" logs --tail 40 homeassistant >&2 || true
  exit 1
fi
