import { HomeAssistant } from 'custom-card-helpers'
import { CSSResult, LitElement, TemplateResult } from 'lit'
import { customElement,  state } from 'lit/decorators.js'

import cardStyles from '../../cardStyles'
import { Constants } from '../../constants'
import { ESunCardErrors, ISunCardConfig, TSunCardData, TSunCardTimes, TSunInfo } from '../../types'
import { HelperFunctions } from '../../utils/HelperFunctions'
import { I18N } from '../../utils/I18N'
import { SunCardEditor } from '../sunCardEditor'
import { SunErrorContent } from '../SunErrorContent'
import { SunCardContent } from './SunCardContent'

@customElement('sun-card')
export class SunCard extends LitElement {
  static readonly cardType = 'sun-card'
  static readonly cardName = 'Sun Card'
  static readonly cardDescription = 'Custom card that display a graph to track the sun position and related events'

  @state()
  private config: ISunCardConfig = { type: SunCard.cardType }

  @state()
  private data!: TSunCardData

  private hasRendered = false
  private lastHass!: HomeAssistant

  static get styles (): CSSResult {
    return cardStyles
  }

  set hass (hass: HomeAssistant) {
    this.lastHass = hass

    if (!this.hasRendered) {
      this.populateConfigFromHass()
      return
    }

    this.processLastHass()
  }

  static getConfigElement (): HTMLElement {
    return document.createElement(SunCardEditor.cardType)
  }

  // called by HASS whenever config changes
  public setConfig (config: ISunCardConfig): void {
    const newConfig = { ...this.config }
    newConfig.title = config.title
    newConfig.darkMode = config.darkMode
    newConfig.language = config.language
    newConfig.use12hourClock = config.use12hourClock
    newConfig.component = config.component ?? Constants.DEFAULT_CONFIG.component

    if (newConfig.language && !HelperFunctions.isValidLanguage(newConfig.language)) {
      throw Error(`${config.language} is not a supported language. Supported languages: ${Object.keys(Constants.LOCALIZATION_LANGUAGES)}`)
    }

    const defaultFields = Constants.DEFAULT_CONFIG.fields!

    newConfig.fields = {
      sunrise: config.fields?.sunrise ?? defaultFields.sunrise,
      sunset: config.fields?.sunset ?? defaultFields.sunset,

      dawn: config.fields?.dawn ?? defaultFields.dawn,
      noon: config.fields?.noon ?? defaultFields.noon,
      dusk: config.fields?.dusk ?? defaultFields.dusk,

      azimuth: config.fields?.azimuth ?? defaultFields.azimuth,
      elevation: config.fields?.elevation ?? defaultFields.elevation
    }

    this.config = newConfig
    if (this.lastHass) {
      this.populateConfigFromHass()
    }
  }

  public render (): TemplateResult {
    if (this.data?.error) {
      return new SunErrorContent(this.config, this.data.error).render()
    }

    // TODO: Move
    // init i18n component (assume set config has run at least once)
    this.config.i18n = new I18N(this.config.language!, this.config.use12hourClock)

    // render components
    return new SunCardContent(this.config, this.data).render()
  }

  protected updated (changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties)

    if (!this.hasRendered) {
      this.hasRendered = true
      this.processLastHass()
    }
  }

  private populateConfigFromHass () {
    // respect setting in hass
    // NOTE: custom-card-helpers types are not up to date with home assistant
    // NOTE: Old releases from Home Assistant doesn't provide the locale property
    this.config.darkMode = this.config.darkMode ?? (this.lastHass.themes as unknown as { darkMode: boolean })?.darkMode
    this.config.language = this.config.language ?? (this.lastHass as unknown as { locale?: { language: string }}).locale?.language ?? this.lastHass.language
  }

  private processLastHass () {
    if (!this.lastHass) {
      return
    }

    this.populateConfigFromHass()

    const sunComponent = this.config.component!

    if (this.lastHass.states[sunComponent]) {
      const sunAttrs = this.lastHass.states[sunComponent].attributes
      const times = this.readTimes(sunAttrs)

      const sunInfo = this.calculateSunInfo(times.sunrise, times.sunset)

      this.data = {
        azimuth: sunAttrs.azimuth,
        elevation: sunAttrs.elevation,
        sunInfo,
        times
      }

    } else {
      this.data = {
        azimuth: 0,
        elevation: 0,
        sunInfo: Constants.DEFAULT_SUN_INFO,
        times: Constants.DEFAULT_TIMES,
        error: ESunCardErrors.SunIntegrationNotFound
      }
    }
  }

  /* For the math to work in #calculateSunInfo(sunrise, sunset), we need the
   * date part of the given 'date-time' to be equal. This will not be the
   * case whenever we pass one of the 'times', ie: when we pass dawn, hass
   * will update that variable with tomorrows dawn.
   *
   * This function safe-guards that through standardizing the 'date'-part on
   * the last 'time'; sunset. This means that all dates will have the date of the
   * sunset, thus ensuring equal date across all times of day.
   */
  private readTimes (sunAttributes): TSunCardTimes {
    const sunset = new Date(sunAttributes.next_setting)
    const year = sunset.getUTCFullYear()
    const month = sunset.getUTCMonth()
    const date = sunset.getUTCDate()

    return {
      dawn: this.readTime(sunAttributes.next_dawn, year, month, date),
      dusk: this.readTime(sunAttributes.next_dusk, year, month, date),
      noon: this.readTime(sunAttributes.next_noon, year, month, date),
      sunrise: this.readTime(sunAttributes.next_rising, year, month, date),
      sunset
    }
  }

  private readTime (attributeToParse: string, year: number, month: number, date: number) {
    const read = new Date(attributeToParse)
    read.setUTCFullYear(year)
    read.setUTCMonth(month)
    read.setUTCDate(date)

    return read
  }

  private calculateSunInfo (sunrise: Date, sunset: Date): TSunInfo {
    const sunLine = this.shadowRoot?.querySelector('path') as SVGPathElement

    // find the instances of time for today
    const dayStart = HelperFunctions.todayAtStartOfDay().valueOf()
    const sunriseMs = sunrise.valueOf()
    const sunsetMs = sunset.valueOf()
    const dayEnd = HelperFunctions.todayAtEndOfDay().valueOf()

    // calculate relevant moments in time
    const now = Date.now()
    const msSinceStartOfDay = Math.max(now - dayStart, 0)
    const msSinceDawn = Math.max(now - sunriseMs, 0)
    const msSinceDusk = Math.max(now - sunsetMs, 0)

    const msUntillDawn = sunriseMs - dayStart
    const msOfDaylight = sunsetMs - sunriseMs
    const msUntillEnd = dayEnd - sunsetMs

    // find section positions
    const dawnSectionPosition = HelperFunctions.findSectionPosition(msSinceStartOfDay, msUntillDawn, Constants.SUN_SECTIONS.dawn)
    const daySectionPosition = HelperFunctions.findSectionPosition(msSinceDawn, msOfDaylight, Constants.SUN_SECTIONS.day)
    const duskSectionPosition = HelperFunctions.findSectionPosition(msSinceDusk, msUntillEnd, Constants.SUN_SECTIONS.dusk)

    // find the sun position
    const position = dawnSectionPosition + daySectionPosition + duskSectionPosition
    const sunPosition = sunLine.getPointAtLength(position)

    // calculate section progress, in percentage
    const dawnProgressPercent = HelperFunctions.findSunProgress(
      sunPosition.x, Constants.EVENT_X_POSITIONS.dayStart, Constants.EVENT_X_POSITIONS.sunrise
    )

    const dayProgressPercent = HelperFunctions.findSunProgress(
      sunPosition.x, Constants.EVENT_X_POSITIONS.sunrise, Constants.EVENT_X_POSITIONS.sunset
    )

    const duskProgressPercent = HelperFunctions.findSunProgress(
      sunPosition.x, Constants.EVENT_X_POSITIONS.sunset, Constants.EVENT_X_POSITIONS.dayEnd
    )

    // calculate sun position in regards to the horizon
    const sunCenterY = sunPosition.y - Constants.SUN_RADIUS
    const sunCenterYAboveHorizon = Constants.HORIZON_Y - sunCenterY
    const sunAboveHorizon = sunCenterYAboveHorizon > 0

    let sunPercentOverHorizon = (100 * sunCenterYAboveHorizon) / (2 * Constants.SUN_RADIUS)
    sunPercentOverHorizon = HelperFunctions.clamp(0, 100, sunPercentOverHorizon)

    return {
      sunrise: sunriseMs,
      sunset: sunsetMs,
      dawnProgressPercent,
      dayProgressPercent,
      duskProgressPercent,
      sunAboveHorizon,
      sunPercentOverHorizon,
      sunPosition: { x: sunPosition.x, y: sunPosition.y }
    }
  }
}

window.customCards = window.customCards || []
window.customCards.push({
  type: SunCard.cardType,
  name: SunCard.cardName,
  preview: true,
  description: SunCard.cardDescription
})
