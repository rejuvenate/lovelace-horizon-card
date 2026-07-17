# Manual test dashboards

Lovelace dashboards for verifying the card visually in a real Home Assistant,
covering cases the automated `unit/` and `visual/` suites cannot: card_mod / uix
styling, embedding, stacks and theme interaction.

## `styling-and-embedding.yaml`

Reproduces the styling and embedding cases raised in #204, #219 and #220:
edge-to-edge graph, sunrise/sunset line styling, title vs `card-header`,
zero-gap vertical stacks, and a few moon phases.

Load it through a dashboard's **Raw configuration editor** (setup notes, including
the card resource and card_mod, are in the file header). Cards marked `[TARGET]`
are expected to work only once the styling batch lands, so the file doubles as an
acceptance harness for that work.
