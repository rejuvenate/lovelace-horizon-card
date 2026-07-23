# Stufe 2 — verify the visual editor in a real Home Assistant

The Playwright suite (`tests/visual/editor.spec.ts`) pins the editor's structure and its
`config-changed` round-trip against a stubbed `ha-form`. This folder is the complementary,
pixel-faithful check: it runs the card inside a **real** Home Assistant so you can open the actual
visual editor and screenshot it. It is a best-effort developer artifact and is **not** part of CI.

## Why a real instance

`ha-form` and the `ha-selector-*` elements only exist inside the Home Assistant frontend, and the
visual "Edit card" dialog is only offered for **storage-mode** (UI-managed) dashboards. So the only
faithful way to see the editor is a running HA with the card installed.

## Steps

1. **Build the bundle and copy it in** (nothing is installed on your host):

   ```bash
   dev/ha-editor-verify/build-and-copy.sh
   ```

   This builds `dist/lovelace-horizon-card.js` in the CI image and copies it to
   `dev/ha-editor-verify/config/www/`, which HA serves at `/local/lovelace-horizon-card.js`. The
   card resource is already registered in `config/.storage/lovelace_resources`.

2. **Start Home Assistant:**

   ```bash
   cd dev/ha-editor-verify && docker compose up
   ```

   Open http://localhost:8123 and complete the one-time onboarding (create a user). Onboarding auth
   is intentionally **not** seeded — its `.storage` schema changes between HA versions and would rot.

3. **Open the editor and screenshot it:**
   - Go to a dashboard → top-right pencil (Edit dashboard) → **Add card**.
   - Search for **Horizon Card** and select it. The visual editor opens with the card preview.
   - Confirm the grouped form renders: the basic toggles, and the **Fields**, **Advanced**,
     **Location and format** and **Debug** expandable sections.
   - Save a screenshot as `editor-real-ha.png` in this folder.

## Notes

- The HA image is pinned to an exact version in `docker-compose.yml` (never `latest`/`stable`).
  If you bump it and HA rejects `config/.storage/lovelace_resources`, delete that file and add the
  resource manually via Settings → Dashboards → ⋮ → Resources (`/local/lovelace-horizon-card.js`,
  type *JavaScript Module*), then re-seed from the running instance if you want it reproducible.
- To reset the instance, stop compose and delete the HA-generated files under `config/` (everything
  except the tracked seed files — see `config/.gitignore`).
