# dev/ha-live - verify artifacts in a real Home Assistant

Spin up a real, pinned Home Assistant in Docker, install the built card, load a Lovelace artifact
(a dashboard, a single card, or the visual editor), and screenshot it headless. This is the
faithful counterpart to the automated `tests/visual/` suite, which renders against a stubbed
frontend: some things (real theming, `ha-form`, Uix / card-mod styling, embedding, the visual
editor) only render truthfully inside an actual Home Assistant.

It replaces the hand ritual documented in [`tests/manual/README.md`](../../tests/manual/README.md)
(build, add the resource, paste the 755-line dashboard into the Raw configuration editor) with one
command. Everything runs in Docker, so nothing (Home Assistant, node, browsers) is installed on the
host. It is **not** part of CI - run it on demand.

## Requirements

Docker with the Compose plugin. That's it.

## Usage

```bash
# The manual test dashboard (default target): every option, styling hook and embedding case.
dev/ha-live/verify.sh

# Any dashboard YAML (a full Lovelace config with title + views).
dev/ha-live/verify.sh --dashboard path/to/dashboard.yaml

# A single card config, wrapped in a one-card dashboard.
dev/ha-live/verify.sh --card path/to/card.yaml

# The card's visual editor (needs a bundle that ships getConfigElement).
dev/ha-live/verify.sh --editor

# Include an extra Lovelace resource (e.g. Uix, so the styling-example cards apply their mods).
dev/ha-live/verify.sh --resource /local/uix.js

# Leave HA running and open http://localhost:8123 to click around (user "dev", pass "ha-live-dev").
dev/ha-live/verify.sh --keep
```

Options: `--dashboard <path>` (default `tests/manual/styling-and-embedding.yaml`), `--card <path>`,
`--editor [<type>]` (default `horizon-card`), `--resource url[,type]` (repeatable, default type
`module`), `--ha-version <tag>`, `--out <dir>` (default `dev/ha-live/out`), `--keep`.

Screenshots and a `report.json` (mode, screenshots, any uncaught page errors, recorded console
errors) land in `dev/ha-live/out/`.

## What it does

1. Builds `dist/lovelace-horizon-card.js` in the project's Docker image and copies it where HA serves
   it (`/local/...`).
2. Generates a clean HA config: `default_config` plus YAML-mode Lovelace whose `resources:` load the
   card (and any `--resource`), with the target as the `ui-lovelace.yaml` dashboard.
3. Starts the pinned HA (`docker compose`), on a private network - the host port is **not** published
   unless you pass `--keep`, so it never collides with a Home Assistant you already run on 8123.
4. A Playwright driver container (on the same network) waits for HA, finishes onboarding over the API,
   logs in, and screenshots the target. It fails the run on an uncaught page error, a failed login,
   or no card rendering; benign HA console warnings are only recorded.
5. Tears everything down (unless `--keep`).

## Notes

- The Home Assistant version is pinned in `docker-compose.yml` (never `latest`/`stable`); bump it
  deliberately or pass `--ha-version`.
- Styling-example cards that use [Uix](https://github.com/Lint-Free-Technology/uix) (or card-mod)
  render **unstyled** unless you load that resource with `--resource`; the card itself renders
  regardless.
- `--editor` only produces a screenshot when the built bundle ships a visual editor
  (`getConfigElement`). On `main` it is a documented mode; it works once PR #235 (the visual editor)
  is in the build.
- `driver.mjs` is bind-mounted into the image, so you can iterate on the driver without rebuilding.
- `config/` is regenerated from scratch on every run (HA writes its runtime state there); it is
  git-ignored.
