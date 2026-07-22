import { css } from 'lit'

export default css`
  /* Theming note: the public --hc-*-color variables are intentionally NOT declared on :host.
     A declaration on :host wins over a value inherited from an ancestor, which would mask a
     Home Assistant theme (set on the document root) — only a card-mod/Uix override on ha-card,
     a descendant, would then work. Instead each colour is consumed at its point of use as
     var(--hc-…-color, <default>), so a theme (ancestor), card-mod (ha-card), an element-level
     override AND the default all resolve. Only internal, non-themeable seeds live on :host:
     the dark-mode-aware --hc-accent and the computed --_hc-* defaults. */
  :host {
    --hc-primary: var(--primary-text-color);
    --hc-secondary: var(--secondary-text-color);

    --hc-accent: #d7d7d7;

    /* Vertical crop of the graph. By default (auto) it fits the Sun and Moon so no empty margins
       are left; set a number (viewBox units, 84 above / 66 below = the classic frame) to pin the
       height above and/or below the horizon instead. */
    --hc-graph-above-horizon: auto;
    --hc-graph-below-horizon: auto;

    --hc-sun-hue: 44;
    --hc-sun-saturation: 93%;
    --hc-sun-lightness: 67%;
    --hc-sun-hue-reduce: 0;
    --hc-sun-saturation-reduce: 0%;
    --hc-sun-lightness-reduce: 0%;
    --_hc-sun-color: hsl(
      calc(var(--hc-sun-hue) - var(--hc-sun-hue-reduce)),
      calc(var(--hc-sun-saturation) - var(--hc-sun-saturation-reduce)),
      calc(var(--hc-sun-lightness) - var(--hc-sun-lightness-reduce))
    );

    --hc-moon-hue: 42;
    --hc-moon-saturation: 47%;
    --hc-moon-lightness: 82%;
    --hc-moon-saturation-reduce: 0%;
    --hc-moon-lightness-reduce: 0%;
    --_hc-moon-color: hsl(
      var(--hc-moon-hue),
      calc(var(--hc-moon-saturation) - var(--hc-moon-saturation-reduce)),
      calc(var(--hc-moon-lightness) - var(--hc-moon-lightness-reduce))
    );
    --_hc-moon-shadow-color: #5f6b7a;
    --_hc-moon-outline-color: #5f6b7a;
  }

  :host(.horizon-card-dark) {
    --hc-accent: #464646;
    --_hc-moon-shadow-color: #3b4653;
    --_hc-moon-outline-color: #6b7789;
  }

  .horizon-card {
    padding: 0.5em;
    font-family: var(--primary-font-family);
  }

  .card-header .name {
    display: flex;
    align-items: center;
    gap: 0.4em;
  }

  .horizon-card-field-row {
    display: flex;
    justify-content: space-around;
    margin-top: 1em;
    margin-bottom: -0.3em;
  }

  .horizon-card-text-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .horizon-card-field-name {
    color: var(--hc-field-name-color, var(--hc-secondary));
  }

  .horizon-card-field-value {
    color: var(--hc-field-value-color, var(--hc-primary));
    font-size: 1.2em;
    line-height: 1.1em;
    text-align: center;
  }

  .horizon-card-field-value-moon-phase {
    font-size: inherit;
  }

  .horizon-card-field-moon-phase-icon {
    --mdc-icon-size: 2em;
    color: var(--hc-moon-phase-icon-color, var(--primary-color));
  }

  .horizon-card-field-value-secondary {
    color: var(--hc-field-value-secondary-color, var(--hc-field-value-color, var(--hc-primary)));
    font-size: 0.7em;
  }

  .horizon-card-sun-value:before {
    content: "☉";
    padding-right: 0.5em;
  }

  .horizon-card-moon-value:before {
    content: "☽";
    padding-right: 0.5em;
  }

  .horizon-card-header {
    display: flex;
    justify-content: space-around;
    margin-top: 1em;
    margin-bottom: -0.3em;
  }

  .horizon-card-header .horizon-card-text-container {
    font-size: 1.2em;
  }

  .horizon-card-footer {
    margin-bottom: 1em;
  }

  .horizon-card-graph {
    margin: 1em 0;
  }

  /* The SVG scales to the container width; its height follows the viewBox aspect ratio, so the
     balanced-frame crop (which changes the viewBox height) changes the rendered card height. */
  .horizon-card-graph svg {
    display: block;
    width: 100%;
    height: auto;
  }

  /* Optional golden/blue-hour bands (#172) and user markers (#160). Colours are set inline via
     --hc-golden-hour-color / --hc-blue-hour-color / --hc-marker-color; only the label text, which
     stays upright, needs styling here. */
  .horizon-card-marker-label {
    font-size: 8px;
    dominant-baseline: hanging;
  }

  /* The 1em only separates the graph from the field rows above and below it.
     When the graph is the first or last child (e.g. a graph-only card) that
     margin is a pure edge gap, so drop it there: the graph then sits flush
     against the card padding and a single padding override makes it reach the
     edges, no separate graph-margin override needed (#220). */
  .horizon-card-graph:first-child {
    margin-top: 0;
  }

  .horizon-card-graph:last-child {
    margin-bottom: 0;
  }

  .horizon-card-graph .horizon-card-daytime-past {
    fill: var(--hc-daytime-past-color, #8ebeeb);
    stroke: var(--hc-daytime-past-color, #8ebeeb);
  }

  .horizon-card-graph .horizon-card-daytime-upcoming {
    fill: var(--hc-daytime-upcoming-color, transparent);
    stroke: var(--hc-daytime-upcoming-color, transparent);
  }

  .horizon-card-graph .horizon-card-nighttime-past {
    fill: var(--hc-nighttime-past-color, #393b78);
    stroke: var(--hc-nighttime-past-color, #393b78);
  }

  .horizon-card-graph .horizon-card-nighttime-upcoming {
    fill: var(--hc-nighttime-upcoming-color, transparent);
    stroke: var(--hc-nighttime-upcoming-color, transparent);
  }
`
