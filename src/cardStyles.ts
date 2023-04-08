import { css } from 'lit'

export default css`
  :host {
    --hc-primary: var(--primary-text-color);
    --hc-secondary: var(--secondary-text-color);

    --hc-field-name-color: var(--hc-secondary);
    --hc-field-value-color: var(--hc-primary);

    --hc-day-color: #8ebeeb;
    --hc-night-color: #393b78;

    --hc-accent: #d7d7d7;
    --hc-lines: var(--hc-accent);

    --hc-sun-hue: 44;
    --hc-sun-saturation: 93%;
    --hc-sun-lightness: 67%;
    --hc-sun-hue-reduce: 0;
    --hc-sun-saturation-reduce: 0%;
    --hc-sun-lightness-reduce: 0%;
    --hc-sun-color: hsl(
      calc(var(--hc-sun-hue) - var(--hc-sun-hue-reduce)),
      calc(var(--hc-sun-saturation) - var(--hc-sun-saturation-reduce)),
      calc(var(--hc-sun-lightness) - var(--hc-sun-lightness-reduce))
    );

    --hc-moon-hue: 52;
    --hc-moon-saturation: 77%;
    --hc-moon-lightness: 57%;
    --hc-moon-saturation-reduce: 0%;
    --hc-moon-lightness-reduce: 0%;
    --hc-moon-color: hsl(
      var(--hc-moon-hue),
      calc(var(--hc-moon-saturation) - var(--hc-moon-saturation-reduce)),
      calc(var(--hc-moon-lightness) - var(--hc-moon-lightness-reduce))
    );
    --hc-moon-shadow-color: #eeeeee;
    --hc-moon-spot-color: rgba(170, 170, 170, 0.1);
  }

  :host(.horizon-card-dark) {
    --hc-accent: #464646;
    --hc-moon-saturation: 80%;
    --hc-moon-lightness: 74%;
    --hc-moon-shadow-color: #272727;
  }

  .horizon-card {
    padding: 0.5em;
    font-family: var(--primary-font-family);
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
    color: var(--hc-field-name-color);
  }

  .horizon-card-field-value {
    color: var(--hc-field-value-color);
    font-size: 1.2em;
    line-height: 1.1em;
    text-align: center;
  }

  .horizon-card-field-value-moon-phase {
    font-size: inherit;
  }

  .horizon-card-field-moon-phase {
    --mdc-icon-size: 2em;
    color: var(--primary-color);
  }

  .horizon-card-field-value-secondary {
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

  .horizon-card-title {
    margin: 1em 1em 1em 1em;
    font-size: 1.5em;
    color: var(--hc-primary);
  }

  .horizon-card-graph {
    margin: 1em 0.5em 1em 0.5em;
  }

  .horizon-card-graph .dawn {
    fill: var(--hc-night-color);
    stroke: var(--hc-night-color);
  }

  .horizon-card-graph .day {
    fill: var(--hc-day-color);
    stroke: var(--hc-day-color);
  }
`
