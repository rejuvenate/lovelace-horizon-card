import type { TemplateResult } from 'lit'
import { html, nothing, svg } from 'lit'

import { Constants } from '../../constants'
import type {
  IHorizonCardConfig,
  TGraphFrame,
  THorizonCardData,
  TMoonData,
  TMoonPosition,
  TSunData,
  TSunPosition
} from '../../types'

export class HorizonCardGraph {
  private readonly config: IHorizonCardConfig
  private readonly sunData: TSunData
  private readonly sunPosition: TSunPosition
  private readonly moonData: TMoonData
  private readonly moonPosition: TMoonPosition
  private readonly graphFrame: TGraphFrame
  private readonly southernFlip: boolean
  private readonly debugLevel: number

  constructor (config: IHorizonCardConfig, data: THorizonCardData) {
    this.config = config
    this.sunData = data.sunData
    this.sunPosition = data.sunPosition
    this.moonData = data.moonData
    this.moonPosition = data.moonPosition
    this.graphFrame = data.graphFrame ?? { top: 0, height: Constants.GRAPH_CLASSIC_HEIGHT }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.southernFlip = this.config.southern_flip!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.debugLevel = this.config.debug_level!
  }

  public render (): TemplateResult {
    // Width stays 550; the frame only crops the height/top offset so the Sun and Moon extremes
    // touch the edges. The SVG scales to the container width, so a shorter frame = a shorter card.
    const viewBox = `0 ${this.graphFrame.top} ${Constants.GRAPH_WIDTH} ${this.graphFrame.height}`
    return html`
      <div class="horizon-card-graph">
        <svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          ${this.renderSvg()}
        </svg>
      </div>
    `
  }

  private renderSvg () {
    const curve = this.sunCurve(this.sunPosition.scaleY)
    const showSun = this.config.sun !== false
    // The sunrise/sunset lines can be hidden on their own, but only ever show when the Sun does.
    const showSunriseSunsetLines = showSun && this.config.sunrise_sunset_lines !== false
    // The sunrise/sunset lines hang from the top of the (cropped) frame down towards the horizon,
    // so their top tracks the frame edge instead of a fixed y.
    const lineTop = this.graphFrame.top + Constants.GRAPH_LINE_INSET_TOP

    return svg`
      <defs>
        <!-- Sun defs -->
        <path id="sun-path-unscaled" d="${this.sunCurve(1)}"/>
        <path id="sun-path" d="${curve}"/>

        <clipPath id="upper-path-mask">
          <use href="#sun-path">
        </clipPath>

        <clipPath id="lower-path-mask">
          <path d="${curve} V0 H0"/>
        </clipPath>

        <!-- Moon defs -->
        <filter id="moon-blur">
          <feGaussianBlur in="SourceGraphic"
                          stdDeviation="${0.5 - Math.abs(0.5 - this.moonData.fraction)}"/>
        </filter>

        <circle id="moon"
                cx="${this.moonPosition.x}" cy="${this.moonPosition.y}"
                r="${Constants.MOON_RADIUS}" stroke="none"/>

        <path id="shade"
              d="M${this.moonPosition.x - Constants.MOON_RADIUS},${this.moonPosition.y}
                a ${Constants.MOON_RADIUS},${Constants.MOON_RADIUS}
                0
                1,1
                ${Constants.MOON_RADIUS * 2},0
                a ${Constants.MOON_RADIUS},${Math.abs(0.5 - this.moonData.fraction) * 2 * Constants.MOON_RADIUS}
                0
                1,${this.moonData.fraction > 0.5 ? 1 : 0}
                ${-Constants.MOON_RADIUS * 2},0
                Z"
              stroke-width="0"/>

        <mask id="moon-shadow-mask">
          <use href="#shade"
               stroke="white" fill="white"
               filter="url(#moon-blur)" stroke-width="0"/>
        </mask>

        <mask id="moon-shadow-mask-inverted">
          <circle cx="${this.moonPosition.x}" cy="${this.moonPosition.y}"
                  r="${Constants.MOON_RADIUS}"
                  fill="white" stroke="white" stroke-width="0"/>

          <use href="#shade"
               stroke="black" fill="black"
               filter="url(#moon-blur)" stroke-width="0"/>
        </mask>
      </defs>

      ${this.debugRect()}

      ${showSunriseSunsetLines ? svg`
      <!-- Draw the sunrise and sunset lines (the vertical day/night boundaries) -->
      <g class="horizon-card-sun-lines" transform="scale(${this.southernFlip ? -1 : 1} 1)" transform-origin="center">
        <line class="horizon-card-sunrise-line"
              x1="${this.sunPosition.sunriseX}" y1="${lineTop}"
              x2="${this.sunPosition.sunriseX}" y2="72"
              stroke="var(--hc-sunrise-line-color, var(--hc-lines, var(--hc-accent)))"/>
        <line class="horizon-card-sunset-line"
              x1="${this.sunPosition.sunsetX}"
              y1="${lineTop}" x2="${this.sunPosition.sunsetX}" y2="72"
              stroke="var(--hc-sunset-line-color, var(--hc-lines, var(--hc-accent)))"/>
      </g>` : nothing}

      <!-- Main group that shifts up or down to center the horizon vertically -->
      <g transform="translate(0 ${this.sunPosition.offsetY}) scale(${this.southernFlip ? -1 : 1} 1)" transform-origin="center">
        ${showSun ? svg`
        <!-- Draw path of the sun across the sky -->
        <use class="horizon-card-sun-path"
             href="#sun-path"
             fill="none"
             stroke="var(--hc-sun-path-color, var(--hc-lines, var(--hc-accent)))"/>

        <!-- Night, already passed: below the horizon, behind the sun (left of it) -->
        <path
          d="M5,${this.sunPosition.horizonY} H${this.sunPosition.x} V150 H5"
          clip-path="url(#lower-path-mask)"
          class="horizon-card-nighttime horizon-card-nighttime-past"/>

        <!-- Night, upcoming: below the horizon, ahead of the sun (right of it) -->
        <path
          d="M${this.sunPosition.x},${this.sunPosition.horizonY} H545 V150 H${this.sunPosition.x}"
          clip-path="url(#lower-path-mask)"
          class="horizon-card-nighttime horizon-card-nighttime-upcoming"/>

        <!-- Day, already passed: above the horizon, behind the sun (left of it) -->
        <path
          d="M${this.sunPosition.sunriseX},0 H${this.sunPosition.x}
            V${this.sunPosition.horizonY} H${this.sunPosition.sunriseX}"
          clip-path="url(#upper-path-mask)"
          class="horizon-card-daytime horizon-card-daytime-past"/>

        <!-- Day, upcoming: above the horizon, ahead of the sun (right of it) -->
        <path
          d="M${this.sunPosition.x},0 H${this.sunPosition.sunsetX}
            V${this.sunPosition.horizonY} H${this.sunPosition.x}"
          clip-path="url(#upper-path-mask)"
          class="horizon-card-daytime horizon-card-daytime-upcoming"/>` : nothing}

        <!-- Draw the horizon (the gray horizontal lines) -->
        <line class="horizon-card-horizon-line"
              x1="5" y1="${this.sunPosition.horizonY}"
              x2="545" y2="${this.sunPosition.horizonY}"
              stroke="var(--hc-horizon-line-color, var(--hc-lines, var(--hc-accent)))"/>

        <!-- Time arrow: the direction the sun and moon travel across the sky -->
        <path class="horizon-card-time-arrow"
              d="M535 ${this.sunPosition.horizonY - 5} L545 ${this.sunPosition.horizonY} L535 ${this.sunPosition.horizonY + 5}"
              stroke="var(--hc-time-arrow-color, var(--hc-horizon-line-color, var(--hc-lines, var(--hc-accent))))" fill="none"/>

        ${showSun ? svg`
        <!-- Draw the sun -->
        <circle class="horizon-card-sun"
          cx="${this.sunPosition.x}"
          cy="${this.sunPosition.y}"
          r="${Constants.SUN_RADIUS}"
          stroke="none"
          fill="var(--hc-sun-color, var(--_hc-sun-color))"/>` : nothing}

        ${this.debugSun()}
      </g>

      ${this.moon()}

      ${this.debugHorizon()}

      ${this.debugCurve()}
    `
  }

  private sunCurve (scale): string {
    // M5,146 C103.334,146 176.666,20 275,20 S446.666,146 545,146
    // The 146 (base) and 20 (peak) anchors are SUN_CURVE_BOTTOM/TOP; the frame calc reuses them.
    const sy = (y) => y * scale
    const bottom = Constants.SUN_CURVE_BOTTOM
    const top = Constants.SUN_CURVE_TOP

    return `M 5,${sy(bottom)}
            C 103.334,${sy(bottom)} 176.666,${sy(top)} 275,${sy(top)}
            S 446.666,${sy(bottom)} 545,${sy(bottom)}`
  }

  private moon () {
    const smallSpotR = Constants.MOON_RADIUS / 5
    const bigSpotR = Constants.MOON_RADIUS / 4
    const hugeSpotR = Constants.MOON_RADIUS / 3
    const spotFill = 'var(--hc-moon-spot-color, rgba(170, 170, 170, 0.1))'
    return this.config.moon ?
      svg`<!-- Moon -->
          <g class="horizon-card-moon">
          <g transform="rotate(${this.moonData.zenithAngle} ${this.moonPosition.x} ${this.moonPosition.y})">
            <!-- Moon shadow -->
            <use class="horizon-card-moon-shadow" href="#moon" fill="var(--hc-moon-shadow-color, var(--_hc-moon-shadow-color))"/>
            <!-- Moon proper -->
            <use class="horizon-card-moon-body" href="#moon" fill="var(--hc-moon-color, var(--_hc-moon-color))" mask="url(#moon-shadow-mask)"/>
          </g>
          <!-- Moon spots to approximate the darker parts -->
          <g class="horizon-card-moon-spots" transform="rotate(${this.moonData.parallacticAngle} ${this.moonPosition.x} ${this.moonPosition.y})">
            <circle cx="${this.moonPosition.x - bigSpotR}" cy="${this.moonPosition.y - 1.5 * bigSpotR}" r="${hugeSpotR}"
                    stroke="none" fill="${spotFill}"/>
            <circle cx="${this.moonPosition.x + 1.5 * bigSpotR}" cy="${this.moonPosition.y - 2 * bigSpotR}" r="${bigSpotR}"
                    stroke="none" fill="${spotFill}"/>
            <circle cx="${this.moonPosition.x - bigSpotR}" cy="${this.moonPosition.y + bigSpotR}" r="${bigSpotR}"
                    stroke="none" fill="${spotFill}"/>
            <circle cx="${this.moonPosition.x + bigSpotR * 2}" cy="${this.moonPosition.y}" r="${smallSpotR}"
                    stroke="none" fill="${spotFill}"/>
          </g>
          <!-- Thin outline so the disc stays defined at any phase or background -->
          <circle class="horizon-card-moon-outline"
                  cx="${this.moonPosition.x}" cy="${this.moonPosition.y}"
                  r="${Constants.MOON_RADIUS}" fill="none"
                  stroke="var(--hc-moon-outline-color, var(--_hc-moon-outline-color))" stroke-width="0.7"/>
          </g>
        ` : nothing
  }

  private debugCurve () {
    return this.debugLevel >= 1 ?
      svg`<use href="#sun-path-unscaled" stroke="red" fill="none" transform="translate(0, 0)">` : nothing
  }

  private debugRect () {
    return this.debugLevel >= 1 ?
      svg`<rect x="0" y="${this.graphFrame.top}" width="${Constants.GRAPH_WIDTH}" height="${this.graphFrame.height}"
               fill="none" stroke="red"/>` : nothing
  }

  private debugHorizon () {
    return this.debugLevel >= 1 ?
      svg`<line x1="5" y1="84" x2="545" y2="84" stroke="red" stroke-dasharray="4 4"/>` : nothing
  }

  private debugSun () {
    return this.debugLevel >= 1 ?
      svg`<path d="M${this.sunPosition.x - Constants.SUN_RADIUS} ${this.sunPosition.y}
                h${Constants.SUN_RADIUS * 2}" stroke="red"/>
          <path d="M${this.sunPosition.x} ${this.sunPosition.y - Constants.SUN_RADIUS}
                v${Constants.SUN_RADIUS * 2}" stroke="red"/>
          <circle cx="${this.sunPosition.x}" cy="${this.sunPosition.y}"
                  r="${Constants.SUN_RADIUS}" stroke="red" fill="none"/>
        ` : nothing
  }
}
