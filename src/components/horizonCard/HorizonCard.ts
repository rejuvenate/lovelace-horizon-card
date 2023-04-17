import { HomeAssistant } from 'custom-card-helpers'
import { CSSResult, LitElement, TemplateResult } from 'lit'
import { customElement, state } from 'lit-element'

import cardStyles from '../../cardStyles'
import { Constants } from '../../constants'
import { EHorizonCardErrors, IHorizonCardConfig, THorizonCardData, THorizonCardTimes, TSunInfo } from '../../types'
import { HelperFunctions } from '../../utils/HelperFunctions'
import { I18N } from '../../utils/I18N'
import { HorizonErrorContent } from '../HorizonErrorContent'
import { HorizonCardContent } from './HorizonCardContent'

@customElement('horizon-card')
export class HorizonCard extends LitElement {
  static readonly cardType = 'horizon-card'
  static readonly cardName = 'Horizon Card'
  static readonly cardDescription = 'Custom card that display a graph to track the sun position and related events'

  @state()
  private config: IHorizonCardConfig = { type: HorizonCard.cardType }

  @state()
  private data!: THorizonCardData

  private hasRendered = false
  private lastHass!: HomeAssistant
  private fixedNow!: Date

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

  /**
   * called by HASS to properly distribute card in lovelace view. It should return height
   * of the card as a number where 1 is equivalent of 50 pixels.
   * @see https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/#api
   */
  public getCardSize (): number {
		let height = 4 // Smallest possible card (only graph) is roughly 200px

    // Each element of card (header, content, footer) adds roughly 50px to the height
    if(this.config.fields?.sunrise || this.config.fields?.sunset) {
      height += 1
    }
    if(this.config.fields?.dawn || this.config.fields?.noon || this.config.fields?.dusk) {
      height += 1
    }
    if(this.config.fields?.azimuth || this.config.fields?.elevation) {
      height += 1
    }

    return height
	}

  // Visual editor disabled because it's broken, see https://developers.home-assistant.io/blog/2022/02/18/paper-elements/
  // static getConfigElement (): HTMLElement {
  //   return document.createElement(HorizonCardEditor.cardType)
  // }

  // called by HASS whenever config changes
  public setConfig (config: IHorizonCardConfig): void {
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
      return new HorizonErrorContent(this.config, this.data.error).render()
    }

    // TODO: Move
    // init i18n component (assume set config has run at least once)
    this.config.i18n = new I18N(this.config.language!, this.config.use12hourClock)

    // render components
    return new HorizonCardContent(this.config, this.data).render()
  }

  protected updated (changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties)

    if (!this.hasRendered) {
      this.hasRendered = true
      this.processLastHass()
    }
  }

  /**
   * Sets a fixed now value to use instead of the actual time.
   * Used for development only. Called from js code in the dev directory.
   * @param fixedNow a Date
   * @protected
   */
  private setFixedNow (fixedNow: Date) {
    this.fixedNow = fixedNow
  }

  private populateConfigFromHass () {
    // respect setting in hass
    // NOTE: custom-card-helpers types are not up to date with home assistant
    // NOTE: Old releases from Home Assistant doesn't provide the locale property
    this.config.darkMode = this.config.darkMode ?? (this.lastHass.themes as unknown as { darkMode: boolean })?.darkMode
    this.config.language = this.config.language ?? (this.lastHass as unknown as { locale?: { language: string } }).locale?.language ?? this.lastHass.language
  }

  private processLastHass () {
    if (!this.lastHass) {
      return
    }

    this.populateConfigFromHass()

    const sunComponent = this.config.component!

    if (this.lastHass.states[sunComponent]) {
      const sunAttrs = this.lastHass.states[sunComponent].attributes
      const now = this.now()
      const times = this.readTimes(sunAttrs, now)

      const sunInfo = this.calculateSunInfo(sunAttrs.elevation, now, times)

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
        error: EHorizonCardErrors.SunIntegrationNotFound
      }
    }
  }

  /* For the math to work in #calculateSunInfo(sunrise, sunset, noon, elevation, now), we need the
   * date part of the given 'date-time' to be equal. This will not be the
   * case whenever we pass one of the 'times', ie: when we pass dawn, hass
   * will update that variable with tomorrows dawn.
   *
   * This function safe-guards that through standardizing the 'date'-part on
   * the last 'time' to now. This means that all dates will have the date of the
   * current moment, thus ensuring equal date across all times of day.
   */
  private readTimes (sunAttributes, now: Date): THorizonCardTimes {
    const noon = new Date(sunAttributes.next_noon)
    return {
      dawn: this.normalizeSunEventTime(sunAttributes.next_dawn, now, noon),
      dusk: this.normalizeSunEventTime(sunAttributes.next_dusk, now, noon),
      noon: this.combineDateTime(now, noon),
      sunrise: this.normalizeSunEventTime(sunAttributes.next_rising, now, noon),
      sunset: this.normalizeSunEventTime(sunAttributes.next_setting, now, noon),
    }
  }

  /**
   * Normalizes a sun event time and returns it as a Date whose date part is set to the provided now Date,
   * or undefined if the event does not occur within 24h of the provided noon moment.
   * Dawn, dusk, sunset and sunrise events may not occur for certain times of the year at high latitudes.
   * @param eventTime event time as string
   * @param now the current time
   * @param noon the time of next noon
   * @private
   */
  private normalizeSunEventTime (eventTime: string, now: Date, noon: Date) {
    const event = new Date(eventTime)

    if (Math.abs(event.getTime() - noon.getTime()) > 24 * 60 * 60 * 1000) {
      // No such event within 24h, happens at higher latitudes for certain times of the year.
      // This can happen for dusk, dawn, sunset, sunrise but not noon since solar noon is defined as the highest
      // elevation of the sun, even if it's below the horizon.
      return undefined
    }

    return this.combineDateTime(now, event)
  }

  /**
   * Takes the date from dateSource and the time from timeSource and returns a Date combining both
   * @param dateSource a Date
   * @param timeSource a Date
   * @private
   */
  private combineDateTime (dateSource: Date, timeSource: Date) {
    // Note: these need to be the non-UTC versions of the methods!
    return new Date(dateSource.getFullYear(), dateSource.getMonth(), dateSource.getDate(),
      timeSource.getHours(), timeSource.getMinutes(), timeSource.getSeconds(), timeSource.getMilliseconds())
  }

  /**
   * Returns the current moment in time, used to normalize the event times and calculate the position of the sun.
   * @private
   */
  private now () {
    if (this.fixedNow == null) {
      // normal operation
      return new Date()
    } else {
      // for development: pretend the current moment is the fixed value
      return this.fixedNow
    }
  }

  /**
   * Calculates a usable sunrise value even if the true sunrise doesn't occur (sun is above/below the horizon)
   * on a given day.
   * @param dayStartMs day start time as ms since epoch
   * @param elevation sun elevation
   * @param noon normalized noon time
   * @param sunrise normalized sunrise time
   * @param sunset normalized sunset time
   * @private
   */
  private calculateUsableSunrise (dayStartMs: number, elevation: number, noon: Date, sunrise: Date | undefined,
                                  sunset: Date | undefined) {
    if (sunrise === undefined) {
      // No sunrise
      if (elevation < Constants.BELOW_HORIZON_ELEVATION) {
        // Sun is below horizon, fake sunrise 1 ms before noon
        return noon.getTime() - 1
      } else {
        // Sun is above horizon, fake sunrise at 00:00:00
        return dayStartMs
      }
    } else if (sunset !== undefined && sunrise > sunset) {
      // Quirk - happens when the sun rises shortly after it sets on the same day before midnight,
      // fake sunrise at 00:00:00
      return dayStartMs
    }

    return sunrise.getTime()
  }

  /**
   * Calculates a usable sunset value even if the true sunset doesn't occur (sun is above/below the horizon)
   * on a given day.
   * @param dayEndMs day end time as ms since epoch
   * @param elevation sun elevation
   * @param noon normalized noon time
   * @param sunset normalized sunset time
   * @private
   */
  private calculateUsableSunset (dayEndMs: number, elevation: number, noon: Date, sunset: Date | undefined) {
    if (sunset === undefined) {
      if (elevation < Constants.BELOW_HORIZON_ELEVATION) {
        // Sun is below horizon, fake sunset 1 ms after noon
        return noon.getTime() + 1
      } else {
        // Sun is above horizon, fake sunset at 23:59:59
        return dayEndMs
      }
    }

    return sunset.getTime()
  }

  private calculateSunInfo (elevation: number, now: Date, times: THorizonCardTimes): TSunInfo {
    const sunLine = this.shadowRoot?.querySelector('path') as SVGPathElement

    // find the instances of time for today
    const nowMs = now.getTime()
    const dayStartMs = HelperFunctions.startOfDay(now).getTime()
    const dayEndMs = HelperFunctions.endOfDay(now).getTime()

    // Here it gets fuzzy for higher latitudes - the sun may not rise or set within 24h
    const sunriseMs = this.calculateUsableSunrise(dayStartMs, elevation, times.noon, times.sunrise, times.sunset)
    const sunsetMs = this.calculateUsableSunset(dayEndMs, elevation, times.noon, times.sunset)

    // calculate relevant moments in time
    const msSinceStartOfDay = Math.max(nowMs - dayStartMs, 0)
    const msSinceSunrise = Math.max(nowMs - sunriseMs, 0)
    const msSinceSunset = Math.max(nowMs - sunsetMs, 0)

    const msOfDaylight = sunsetMs - sunriseMs
    // We need at least 1ms to avoid division by zero
    const msUntilSunrise = Math.max(sunriseMs - dayStartMs, 1)
    const msUntilEndOfDay = Math.max(dayEndMs - sunsetMs, 1)

    // find section positions
    const dawnSectionPosition = HelperFunctions.findSectionPosition(msSinceStartOfDay, msUntilSunrise, Constants.SUN_SECTIONS.dawn)
    const daySectionPosition = HelperFunctions.findSectionPosition(msSinceSunrise, msOfDaylight, Constants.SUN_SECTIONS.day)
    const duskSectionPosition = HelperFunctions.findSectionPosition(msSinceSunset, msUntilEndOfDay, Constants.SUN_SECTIONS.dusk)

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
  type: HorizonCard.cardType,
  name: HorizonCard.cardName,
  preview: true,
  description: HorizonCard.cardDescription
})
