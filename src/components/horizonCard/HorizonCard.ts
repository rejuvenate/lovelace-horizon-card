import { HomeAssistant, round } from 'custom-card-helpers'
import { CSSResult, html, LitElement, TemplateResult } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { default as SunCalc } from 'suncalc3'

import cardStyles from '../../cardStyles'
import { Constants } from '../../constants'
import {
  EHorizonCardErrors,
  IHorizonCardConfig,
  THorizonCardFields,
  TMoonData,
  TMoonPosition,
  TSunPosition,
  TSunTimes
} from '../../types'
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
  private config!: IHorizonCardConfig

  @state()
  private data = Constants.DEFAULT_CARD_DATA

  @state()
  private error: EHorizonCardErrors | undefined

  private lastHass!: HomeAssistant

  private hasCalculated = false

  private wasDisconnected = false

  static get styles (): CSSResult {
    return cardStyles
  }

  set hass (hass: HomeAssistant) {
    this.debug(() => `set hass :: ${hass.locale.language} :: ${hass.locale.time_format}`, 2)
    this.lastHass = hass
  }

  /**
   * called by HASS to properly distribute card in lovelace view. It should return height
   * of the card as a number where 1 is equivalent of 50 pixels.
   * @see https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/#api
   */
  public getCardSize (): number {
		let height = 4 // Smallest possible card (only graph) is roughly 200px

    const fieldConfig = this.expandedFieldConfig()

    // Each element of card (title, header, content, footer) adds roughly 50px to the height
    if (this.config.title && this.config.title.length > 0) {
      height += 1
    }

    if (fieldConfig.sunrise || fieldConfig.sunset) {
      height += 1
    }

    if (fieldConfig.dawn || fieldConfig.noon || fieldConfig.dusk) {
      height += 1
    }

    if (fieldConfig.sun_azimuth || fieldConfig.moon_azimuth || fieldConfig.sun_elevation || fieldConfig.moon_elevation) {
      height += 1
    }

    if (fieldConfig.moonrise || fieldConfig.moon_phase || fieldConfig.moonset) {
      height += 1
    }

    this.debug(() => `getCardSize() => ${height}`, 2)

    return height
	}

  public getLayoutOptions () {
    // Measuring different card elements with DevTools, these are the height of each section in pixels, when the card has a width of 480px.
    const height = {
      graph: 187.08,
      title: 41,
      sunrise_sunset: 42.17,
      dawn_noon_dusk: 48.3,
      single_azimuth_elevation: 48.3,
      both_azimuth_elevation: 66.78,
      moonrise_moonrise_moonphase: 48.3
    }

    // Per the documentation in https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/#sizing-in-sections-view, each row
    // has a height of 56px and the gap between rows is 8px. So we compute the card height based on the elements being displayed, and then
    // convert it to rows using the formula `size = 56*num_rows + 8*(num_rows-1)`, which can be expressed as `num_rows = (size + 8)/64`

    let size = height.graph
    const fieldConfig = this.expandedFieldConfig()

    if (this.config.title && this.config.title.length > 0) {
      size += height.title
    }

    if (fieldConfig.sunrise || fieldConfig.sunset) {
      size += height.sunrise_sunset
    }

    if (fieldConfig.dawn || fieldConfig.noon || fieldConfig.dusk) {
      size += height.dawn_noon_dusk
    }

    if ((fieldConfig.sun_azimuth && fieldConfig.moon_azimuth) || (fieldConfig.sun_elevation || fieldConfig.moon_elevation)) {
      size += height.both_azimuth_elevation
    } else if (fieldConfig.sun_azimuth || fieldConfig.moon_azimuth || fieldConfig.sun_elevation || fieldConfig.moon_elevation) {
      size += height.single_azimuth_elevation
    }

    if (fieldConfig.moonrise || fieldConfig.moon_phase || fieldConfig.moonset) {
      size += height.moonrise_moonrise_moonphase
    }

    const rows = Math.ceil((8+size)/64)
    return {
      grid_rows: rows,
      grid_columns: 4,
      grid_min_columns: 4,
      grid_min_rows: rows,
    }
  }

  // called by HASS whenever config changes
  public setConfig (config: IHorizonCardConfig): void {
    if (config.language && !HelperFunctions.isValidLanguage(config.language)) {
      throw Error(`${config.language} is not a supported language. Supported languages: ${Object.keys(Constants.LOCALIZATION_LANGUAGES)}`)
    }

    if (config.latitude === undefined && config.longitude !== undefined
      || config.latitude !== undefined && config.longitude == undefined) {
      throw Error('Latitude and longitude must be both set or unset')
    }

    this.config = config
    this.hasCalculated = false

    this.debug('setConfig()', 2)
  }

  public override render (): TemplateResult {
    if (!this.lastHass) {
      this.debug('render() [no hass]', 2)
      return html``
    }

    this.debug('render()', 2)

    const expandedConfig = this.expandedConfig()
    this.classList.toggle('horizon-card-dark', expandedConfig.dark_mode)

    if (this.error) {
      return new HorizonErrorContent(this.error, this.i18n(expandedConfig)).render()
    }

    const moonLightnessReduceSign = expandedConfig.dark_mode ? 1 : -1

    this.style.setProperty('--hc-sun-hue-reduce', `${this.data.sunData.hueReduce}`)
    this.style.setProperty('--hc-sun-saturation-reduce', `${this.data.sunData.saturationReduce}%`)
    this.style.setProperty('--hc-sun-lightness-reduce', `${this.data.sunData.lightnessReduce}%`)

    this.style.setProperty('--hc-moon-saturation-reduce', `${this.data.moonData.saturationReduce}%`)
    this.style.setProperty('--hc-moon-lightness-reduce',
      `${this.data.moonData.lightnessReduce * moonLightnessReduceSign}%`)

    // render components
    return new HorizonCardContent(expandedConfig, this.data, this.i18n(expandedConfig)).render()
  }

  protected override updated (changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties)

    this.debug(() => `updated() - ${JSON.stringify(Array.from(changedProperties.keys()))}`, 2)

    if (!this.config) {
      // This happens only in dev mode, hass will call setConfig() before first update
      return
    }

    if (!this.hasCalculated) {
      this.hasCalculated = true
      this.calculateStatePartial()
    } else if (this.data.partial) {
      this.calculateStateFinal()
      const refreshPeriod = this.refreshPeriod()
      if (refreshPeriod > 0) {
        window.setTimeout(() => {
          if (!this.wasDisconnected) {
            this.debug('refresh via setTimeout()', 2)
            if (this.hasCalculated) {
              this.calculateStatePartial()
            }
          }
        }, refreshPeriod)
      }
    }
  }

  override disconnectedCallback () {
    this.wasDisconnected = true
    this.debug('disconnectedCallback()', 2)
  }

  private calculateStateFinal () {
    this.debug('calculateStateFinal()')

    const sunInfo = this.computeSunPosition(this.data.sunData.times,
      this.isWinterDarkness(this.data.latitude, this.data.sunData.times.now), this.data.sunPosition.scaleY)

    this.data = { ...this.data, partial: false, sunPosition: sunInfo }
  }

  private calculateStatePartial () {
    const now = this.now()
    const latitude = this.latitude()
    const longitude = this.longitude()

    this.debug(() => `calculateStatePartial() :: ${now?.toISOString()} ${this.timeZone()} :: ${latitude}, ${longitude}`)

    const times = this.readSunTimes(now, latitude, longitude, this.elevation())

    const sunCalcPosition = SunCalc.getPosition(times.now, latitude, longitude)
    const azimuth = this.roundDegree(sunCalcPosition['azimuthDegrees'])
    const elevation = this.roundDegree(sunCalcPosition['altitudeDegrees'])

    const sunPosition = this.computeSunPosition(times, this.isWinterDarkness(latitude, times.now))

    const moonData = this.computeMoonData(times.now, latitude, longitude)
    const moonPosition = this.computeMoonPosition(moonData)

    const hueReduce = HelperFunctions.rangeScale(-10, 10, elevation, 15)
    const saturationReduce = HelperFunctions.rangeScale(-23, 10, elevation, 50)
    const lightnessReduce = HelperFunctions.rangeScale(-10, 10, elevation, 12)

    this.data = {
      partial: true,
      latitude,
      longitude,
      sunPosition,
      sunData: {
        azimuth,
        elevation,
        times,
        hueReduce,
        saturationReduce,
        lightnessReduce
      },
      moonPosition,
      moonData
    }
  }

  private readSunTimes (now: Date, latitude: number, longitude: number, elevation: number): TSunTimes {
    const nowDayBefore = new Date(now.getTime() - Constants.MS_24_HOURS)
    const sunTimesNow = SunCalc.getSunTimes(HelperFunctions.noonAtTimeZone(now, this.timeZone()),
      latitude, longitude, elevation, false, false, true)
    const sunTimesDayBefore = SunCalc.getSunTimes(HelperFunctions.noonAtTimeZone(nowDayBefore, this.timeZone()),
      latitude, longitude, elevation, false, false, true)

    const noonDelta = now.getTime() - sunTimesDayBefore.solarNoon.value.getTime()
    if (noonDelta < Constants.MS_12_HOURS) {
      // We are past local standard midnight but previous solar noon was sooner than 12 hours, use previous day's data
      return this.convertSunCalcTimes(sunTimesDayBefore)
    }

    return this.convertSunCalcTimes(sunTimesNow)
  }

  private convertSunCalcTimes (data): TSunTimes {
    return {
      now: this.now(),
      dawn: this.validOrUndefined(data['civilDawn']),
      dusk: this.validOrUndefined(data['civilDusk']),
      midnight: this.validOrUndefined(data['nadir']),
      noon: this.validOrUndefined(data['solarNoon']),
      sunrise: this.validOrUndefined(data['sunriseStart']),
      sunset: this.validOrUndefined(data['sunsetEnd']),
    }
  }

  private validOrUndefined (event) {
    return event.valid ? event.value : undefined
  }

  private findPointOnCurve (time: Date, noon: Date, useUnscaledPath?: boolean | false) {
    const sunPath = this.shadowRoot?.querySelector('#sun-path' + (useUnscaledPath ? '-unscaled' : '')) as SVGPathElement
    const delta = noon.getTime() - time.getTime()
    const len = sunPath.getTotalLength()
    const position = len / 2 - len * (delta / Constants.MS_24_HOURS)
    return sunPath.getPointAtLength(position)
  }

  private isWinterDarkness (latitude: number, now: Date) {
    const month = now.getMonth() // months are zero-based, UTC or local TZ doesn't matter here
    const northernWinter = month < 2 || month > 8
    // winter darkness when winter in the northern hemisphere and north of the equator
    //   or
    // winter darkness when summer in the northern hemisphere and south of the equator
    return northernWinter && latitude > 0 || !northernWinter && latitude < 0
  }

  private computeScale (sunrise: Date | undefined, noon: Date, canBeWinterDarkness: boolean) {
    const sunrisePoint = this.findPointOnCurve(this.sunriseForComputation(sunrise, noon, canBeWinterDarkness),
      noon, true)
    // Sun path curve top is at 20
    const horizonPosInCurve = sunrisePoint.y - 20
    // Sun path curve midpoint, from 20 (top) to 146 (bottom), halved
    const curveHalfSpan = 63

    const diff = Math.abs(horizonPosInCurve - curveHalfSpan)
    const scaleY = curveHalfSpan / (diff + curveHalfSpan)

    this.debug(() => `scale factor ${scaleY}`)
    return scaleY
  }

  private sunriseForComputation (sunrise: Date | undefined, noon: Date, canBeWinterDarkness: boolean) {
    return sunrise ?? (canBeWinterDarkness ? noon : new Date(noon.getTime() - Constants.MS_12_HOURS))
  }

  private computeSunPosition (times: TSunTimes, canBeWinterDarkness: boolean,
                              previousScaleY?: number | undefined): TSunPosition {
    // Sun position along the curve
    const sunPosition = this.findPointOnCurve(times.now, times.noon)

    let sunsetX = -10
    let sunriseX = -10

    const sunriseForComputation = this.sunriseForComputation(times.sunrise, times.noon, canBeWinterDarkness)
    const sunrisePosition = this.findPointOnCurve(sunriseForComputation, times.noon)

    if (times.sunrise !== undefined && times.sunset !== undefined) {
      // Sunset and sunrise both occur and will be drawn as vertical bars
      sunriseX = sunrisePosition.x
      const sunsetPosition = this.findPointOnCurve(times.sunset, times.noon)
      sunsetX = sunsetPosition.x
    }

    const horizonY = sunrisePosition.y

    let offsetY
    let scaleY
    if (previousScaleY === undefined) {
      // First (partial) run: computes the scale factor
      offsetY = 0
      scaleY = this.computeScale(times.sunrise, times.noon, canBeWinterDarkness)
    } else {
      // Second (final) run: uses the scaled curve (from the partial run) to offset the horizon
      offsetY = Constants.HORIZON_Y - horizonY
      this.debug(() => `scaled horizonY = ${horizonY}, offset ${offsetY}`)
      scaleY = previousScaleY
    }

    return {
      scaleY,
      offsetY,
      horizonY,
      sunsetX,
      sunriseX,
      x: sunPosition.x,
      y: sunPosition.y
    }
  }

  private computeMoonData (now: Date, lat: number, lon: number): TMoonData {
    const moonRawData = SunCalc.getMoonData(now, lat, lon)

    const azimuth = this.roundDegree(moonRawData.azimuthDegrees)
    const elevation = this.roundDegree(moonRawData.altitudeDegrees)

    const moonRawTimes = SunCalc.getMoonTimes(HelperFunctions.midnightAtTimeZone(now, this.timeZone()),
      lat, lon, false, true)

    const moonPhase = Constants.MOON_PHASES[moonRawData.illumination.phase.id]

    const clampedLat = HelperFunctions.clamp(-66, 66, lat)
    const phaseRotation = this.config.moon_phase_rotation ?? 90 * clampedLat/66 - 90

    const saturationReduce = HelperFunctions.rangeScale(-33, 10, elevation, 60)
    const lightnessReduce = HelperFunctions.rangeScale(-10, 0, elevation, 15)

    return {
      azimuth,
      elevation,
      fraction: moonRawData.illumination.fraction,
      phase: moonPhase,
      phaseRotation,
      zenithAngle: -moonRawData.zenithAngle * 180/Math.PI,
      parallacticAngle: moonRawData.parallacticAngleDegrees,
      times: {
        now,
        moonrise: isNaN(moonRawTimes.rise) ? undefined : moonRawTimes.rise,
        moonset: isNaN(moonRawTimes.set) ? undefined : moonRawTimes.set
      },
      saturationReduce,
      lightnessReduce
    }
  }

  private computeMoonPosition (moonData: TMoonData): TMoonPosition {
    // East to West goes left to right (or right to left, if southern-flipped!), like the Sun.
    // The canvas is 550 units wide, minus 5 units (padding)
    // and minus Constants.MOON_RADIUS on either side to keep the moon inside.
    // Left is 0 degrees, 180 degrees is in the middle.
    const availableSpanX = 550 - 2 * (Constants.MOON_RADIUS + 5)
    const calcAzimuth = this.southernFlip() ? (moonData.azimuth + 180) % 360 : moonData.azimuth
    const x = 5 + Constants.MOON_RADIUS + availableSpanX * calcAzimuth/360

    const yLimit = Constants.HORIZON_Y - Constants.MOON_RADIUS
    const calcElevation = Math.abs(moonData.elevation) / 2 + 1
    const maxLog = 90 / 2 + 1

    // The Moon's elevation scaled logarithmically to appear higher/lower from the drawn horizon
    const offset = yLimit * Math.log(calcElevation) / Math.log(maxLog) * Math.sign(moonData.elevation)
    const y = Constants.HORIZON_Y - offset

    return {
      x,
      y,
    }
  }

  private latitude (): number {
    return this.config.latitude ?? this.lastHass.config.latitude
  }

  private longitude (): number {
    return this.config.longitude ?? this.lastHass.config.longitude
  }

  private elevation (): number {
    return this.config.elevation ?? this.lastHass.config.elevation
  }

  private southernFlip (): boolean {
    return this.config.southern_flip ?? this.latitude() < 0
  }

  private timeZone (): string {
    return this.config.time_zone ?? this.lastHass.config.time_zone
  }

  private now (): Date {
    return this.config.now !== undefined ? new Date(this.config.now) : new Date()
  }

  private refreshPeriod (): number {
    return this.config.refresh_period ?? Constants.DEFAULT_REFRESH_PERIOD
  }

  private debugLevel (): number {
    return this.config?.debug_level ?? 0
  }

  private expandedFieldConfig (): THorizonCardFields {
    const fieldConfig = {
      ...Constants.DEFAULT_CONFIG.fields,
      ...this.config.fields
    }

    // Elevation and azimuth have a shared property and a per sun/moon dedicated property too
    fieldConfig.sun_elevation = fieldConfig.sun_elevation ?? fieldConfig.elevation
    fieldConfig.moon_elevation = fieldConfig.moon_elevation ?? fieldConfig.elevation
    fieldConfig.sun_azimuth = fieldConfig.sun_azimuth ?? fieldConfig.azimuth
    fieldConfig.moon_azimuth = fieldConfig.moon_azimuth ?? fieldConfig.azimuth

    return fieldConfig
  }

  private expandedConfig (): IHorizonCardConfig {
    const config = {
      ...Constants.DEFAULT_CONFIG,
      ...this.config,
      fields: this.expandedFieldConfig()
    }

    // Default values for these come from Home Assistant
    config.language = this.config.language ?? this.lastHass.locale.language
    config.time_format = this.config.time_format ?? this.lastHass.locale.time_format
    config.number_format = this.config.number_format ?? this.lastHass.locale.number_format
    config.dark_mode = this.config.dark_mode ?? (this.lastHass.themes as unknown as { darkMode: boolean })?.darkMode
    config.latitude = this.latitude()
    config.longitude = this.longitude()
    config.elevation = this.elevation()
    config.southern_flip = this.southernFlip() // default is via latitude
    config.time_zone = this.timeZone()

    // The default value is the current time
    config.now = this.now()

    return config
  }

  private i18n (config: IHorizonCardConfig) {
    let display_time_zone

    // Since 2023.7, HA can show times in the local (for the browser) TZ or the server TZ.
    if (this.lastHass.locale['time_zone'] === 'local') {
      display_time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    } else {
      // 'server' or missing value (older HA version)
      display_time_zone = config.time_zone
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return new I18N(config.language!, display_time_zone, config.time_format!, config.number_format!, this.lastHass.localize)
  }

  private roundDegree (value: number) {
    return round(value, 1)
  }

  private debug (message, level = 1) {
    if (this.debugLevel() >= level) {
      if (typeof message === 'function') {
        message = message()
      }
      // eslint-disable-next-line no-console
      console.debug(`custom:${HorizonCard.cardType} :: ${message}`)
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
