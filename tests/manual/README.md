# Manual test dashboards

Lovelace dashboards for checking the card visually in a real Home Assistant,
covering cases the automated `unit/` and `visual/` suites cannot: Uix / card-mod
styling, embedding, stacks and theme interaction.

## `styling-and-embedding.yaml`

A single dashboard view that shows the card's styling, embedding and options:

- **Baselines** the five rendering modes (sun + moon + graph, graph only, values
  only, moon only, and with a title).
- **Transparent / frameless card** drop the background, border and shadow through
  the standard `--ha-card-*` variables so the card blends into the dashboard.
- **Edge-to-edge graph** a graph-only card whose graph fills the card with no
  surrounding whitespace.
- **Zero-gap vertical stack** two graph-only cards stacked flush so they read as
  one element.
- **Sunrise / sunset lines** recolour or hide the two day/night boundary lines.
- **Title / card-header** the title renders as a standard `.card-header`, so theme
  styling and the `icon:` option apply like any stock card.
- **Moon phases** the moon disc at several fixed dates.
- **Per-field targeting** style a single value through its per-field class.
- **Config options** one card per option so each can be checked on its own: the
  fields, azimuth/elevation, the display toggles, orientation, time/number/language
  formatting, location overrides and the advanced options.
- **Colour palette** the `--hc-*` variables that repaint the graph, the Sun and
  Moon, and the text.

Load it through a dashboard's **Raw configuration editor** (setup notes, including
the card resource and Uix, are in the file header). Each card is preceded by
a markdown note describing what to look for.

You can also render this whole dashboard (or a single card, or the visual editor) in a real Home
Assistant automatically with [`dev/ha-live/verify.sh`](../../dev/ha-live/README.md), which brings up
a throwaway Home Assistant in Docker and screenshots it.

## `editor-in-real-ha.png`

The card's visual editor (`getConfigElement`) rendered in a real Home Assistant, kept as a reference
for what the grouped form looks like. Reproduce it with `dev/ha-live/verify.sh --editor`.
