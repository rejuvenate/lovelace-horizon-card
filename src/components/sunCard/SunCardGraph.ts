import { html, TemplateResult } from 'lit'

import { Constants } from '../../constants'
import { TSunCardData, TSunInfo } from '../../types'

export class SunCardGraph {
  private sunInfo: TSunInfo

  constructor (data: TSunCardData) {
    this.sunInfo = data?.sunInfo ?? Constants.DEFAULT_SUN_INFO
  }

  public render (): TemplateResult {
    const sunID = 'sun-gradient'
    const dawnID = 'dawn-gradient'
    const dayID = 'day-gradient'
    const duskID = 'dusk-gradient'

    const viewBox = "0 0 550 150"
    // TODO: Check sun opacity

    return html`
      <div class="sun-card-graph">
        <svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          
          <!-- Define gradients for use when drawing afterwards -->
          <defs>
            <linearGradient id="${sunID}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" class="sunInitialStop" />
              <stop offset="${this.sunInfo.sunPercentOverHorizon}%" class="sunMiddleStop" />
              <stop offset="${this.sunInfo.sunPercentOverHorizon}%" class="sunEndStop" />
            </linearGradient>
            
            <linearGradient id="${dawnID}" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" class="dawnInitialStop" />
              <stop offset="${this.sunInfo.dawnProgressPercent}%" class="dawnMiddleStop" />
              <stop offset="${this.sunInfo.dawnProgressPercent}%" class="dawnEndStop" />
            </linearGradient>
            
            <linearGradient id="${dayID}" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" class="dayInitialStop" />
              <stop offset="${this.sunInfo.dayProgressPercent}%" class="dayMiddleStop" />
              <stop offset="${this.sunInfo.dayProgressPercent}%" class="dayEndStop" />
            </linearGradient>
            
            <linearGradient id="${duskID}" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" class="duskInitialStop" />
              <stop offset="${this.sunInfo.duskProgressPercent}%" class="duskMiddleStop" />
              <stop offset="${this.sunInfo.duskProgressPercent}%" class="duskEndStop" />
            </linearGradient>
          </defs>

          <!-- Draw path of the sun across the 'sky' -->
          <path 
            class="sun-card-sun-line"
            d="M5,146 C29,153 73,128 101,108 C276,-29 342,23 449,108 C473,123 509,150 545,146"
            fill="none"
            stroke="var(--sun-card-lines)"
          />

          <!-- Draw between the path of the sun and the horizon line for dawn -->
          <!-- IE: First dark blue part -->
          <path
            d="M5,146 C29,153 73,128 101,108 L 5 108"
            fill="url(#${dawnID})"
            stroke="url(#${dawnID})"
            opacity="${this.sunInfo.dawnProgressPercent}"
          />

          <!-- Draw between the path of the sun and the horizon line for day -->
          <!-- IE: Main light blue part in the middle -->
          <path 
            d="M101,108 C276,-29 342,23 449,108 L 104,108"
            fill="url(#${dayID})"
            stroke="url(#${dayID})"
            opacity="${this.sunInfo.dayProgressPercent}"
          />

          <!-- Draw between the path of the sun and the horizon line for dusk -->
          <!-- IE: Last dark blue part -->
          <path 
            d="M449,108 C473,123 509,150 545,146 L 545 108"
            fill="url(#${duskID})"
            stroke="url(#${duskID})"
            opacity="${this.sunInfo.duskProgressPercent}"
          />

          <!-- Draw the horizon, dawn and dusk lines (the gray horizontal/vertical lines) -->
          <line x1="5" y1="108" x2="545" y2="108" stroke="var(--sun-card-lines)" />
          <line x1="101" y1="25" x2="101" y2="100" stroke="var(--sun-card-lines)" />
          <line x1="449" y1="25" x2="449" y2="100" stroke="var(--sun-card-lines)" />

          <!-- Draw a circle representing the sun -->
          <circle
            cx="${this.sunInfo.sunPosition.x}"
            cy="${this.sunInfo.sunPosition.y}"
            r="17"
            opacity="${this.sunInfo.sunPercentOverHorizon}"
            stroke="none" fill="url(#${sunID})"
          />
        </svg>
      </div>
    `
  }
}
