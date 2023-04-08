import { html, nothing, svg, TemplateResult } from 'lit'

import { Constants } from '../../constants'
import { IHorizonCardConfig, THorizonCardData, TMoonData, TMoonPosition, TSunData, TSunPosition } from '../../types'

export class HorizonCardGraph {
  private readonly config: IHorizonCardConfig
  private readonly sunData: TSunData
  private readonly sunPosition: TSunPosition
  private readonly moonData: TMoonData
  private readonly moonPosition: TMoonPosition
  private readonly southernFlip: boolean
  private readonly debugLevel: number

  constructor (config: IHorizonCardConfig, data: THorizonCardData) {
    this.config = config
    this.sunData = data.sunData
    this.sunPosition = data.sunPosition
    this.moonData = data.moonData
    this.moonPosition = data.moonPosition
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.southernFlip = this.config.southern_flip!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.debugLevel = this.config.debug_level!
  }

  public render (): TemplateResult {
    return html`
      <div class="horizon-card-graph">
        <svg viewBox="0 0 550 150" xmlns="http://www.w3.org/2000/svg">
          ${this.renderSvg()}
        </svg>
      </div>
    `
  }

  private renderSvg () {
    const curve = this.sunCurve(this.sunPosition.scaleY)

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

      <!-- Draw the sunrise and sunset markers (the gray vertical lines) -->
      <g transform="scale(${this.southernFlip ? -1 : 1} 1)" transform-origin="center">
        <line x1="${this.sunPosition.sunriseX}" y1="3"
              x2="${this.sunPosition.sunriseX}" y2="72"
              stroke="var(--hc-lines)"/>
        <line x1="${this.sunPosition.sunsetX}"
              y1="3" x2="${this.sunPosition.sunsetX}" y2="72"
              stroke="var(--hc-lines)"/>
      </g>

      <!-- Main group that shifts up or down to center the horizon vertically -->
      <g transform="translate(0 ${this.sunPosition.offsetY}) scale(${this.southernFlip ? -1 : 1} 1)" transform-origin="center">
        <!-- Draw path of the sun across the sky -->
        <use href="#sun-path"
             fill="none"
             stroke="var(--hc-lines)"/>

        <!-- Draw the below horizon passed area, i.e., the dark blue/night part on either side -->
        <path
          d="M5,${this.sunPosition.horizonY} H${this.sunPosition.x} V150 H5"
          clip-path="url(#lower-path-mask)"
          class="dawn"/>

        <!-- Draw the above horizon passed area, i.e., the light blue/day part in the middle -->
        <path
          d="M${this.sunPosition.sunriseX},0 H${this.sunPosition.x}
            V${this.sunPosition.horizonY} H${this.sunPosition.sunriseX}"
          clip-path="url(#upper-path-mask)"
          class="day"/>

        <!-- Draw the horizon (the gray horizontal lines) -->
        <line x1="5" y1="${this.sunPosition.horizonY}"
              x2="545" y2="${this.sunPosition.horizonY}"
              stroke="var(--hc-lines)"/>

        <!-- Arrow showing direction of travel -->
        <path d="M535 ${this.sunPosition.horizonY - 5} L545 ${this.sunPosition.horizonY} L535 ${this.sunPosition.horizonY + 5}"
              stroke="var(--hc-lines)" fill="none"/>

        <!-- Draw the sun -->
        <circle
          cx="${this.sunPosition.x}"
          cy="${this.sunPosition.y}"
          r="${Constants.SUN_RADIUS}"
          stroke="none"
          fill="var(--hc-sun-color)"/>

        ${this.debugSun()}
      </g>

      ${this.moon()}

      ${this.debugHorizon()}

      ${this.debugCurve()}
    `
  }

  private sunCurve (scale): string {
    // M5,146 C103.334,146 176.666,20 275,20 S446.666,146 545,146
    const sy = (y) => y * scale

    return `M 5,${sy(146)}
            C 103.334,${sy(146)} 176.666,${sy(20)} 275,${sy(20)}
            S 446.666,${sy(146)} 545,${sy(146)}`
  }

  private moon () {
    const smallSpotR = Constants.MOON_RADIUS / 5
    const bigSpotR = Constants.MOON_RADIUS / 4
    const hugeSpotR = Constants.MOON_RADIUS / 3
    const spotFill = 'var(--hc-moon-spot-color)'
    return this.config.moon ?
      svg`<!-- Moon -->
          <g transform="rotate(${this.moonData.zenithAngle} ${this.moonPosition.x} ${this.moonPosition.y})">
            <!-- Moon shadow -->
            <use href="#moon" fill="var(--hc-moon-shadow-color)"/>
            <!-- Moon proper -->
            <use href="#moon" fill="var(--hc-moon-color)" mask="url(#moon-shadow-mask)"/>
          </g>
          <!-- Moon spots to approximate the darker parts -->
          <g transform="rotate(${this.moonData.parallacticAngle} ${this.moonPosition.x} ${this.moonPosition.y})">
            <circle cx="${this.moonPosition.x - bigSpotR}" cy="${this.moonPosition.y - 1.5 * bigSpotR}" r="${hugeSpotR}"
                    stroke="none" fill="${spotFill}"/>
            <circle cx="${this.moonPosition.x + 1.5 * bigSpotR}" cy="${this.moonPosition.y - 2 * bigSpotR}" r="${bigSpotR}"
                    stroke="none" fill="${spotFill}"/>
            <circle cx="${this.moonPosition.x - bigSpotR}" cy="${this.moonPosition.y + bigSpotR}" r="${bigSpotR}"
                    stroke="none" fill="${spotFill}"/>
            <circle cx="${this.moonPosition.x + bigSpotR * 2}" cy="${this.moonPosition.y}" r="${smallSpotR}"
                    stroke="none" fill="${spotFill}"/>
          </g>
        ` : nothing
  }

  private debugCurve () {
    return this.debugLevel >= 1 ?
      svg`<use href="#sun-path-unscaled" stroke="red" fill="none" transform="translate(0, 0)">` : nothing
  }

  private debugRect () {
    return this.debugLevel >= 1 ?
      svg`<rect x="0" y="0" width="550" height="150" fill="none" stroke="red"/>` : nothing
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
