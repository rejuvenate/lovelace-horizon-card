import type { TemplateResult } from 'lit'
import { html, nothing } from 'lit'

import { Constants } from '../constants'
import type { TMoonPhase } from '../types'
import { EHorizonCardI18NKeys } from '../types'
import type { I18N } from './I18N'

type FieldValue = Date | number | string | undefined

export class HelperFunctions {
  public static renderFieldElements (i18n: I18N, translationKey: string, values: FieldValue[],
                                     extraClasses: string[] = []): TemplateResult {
    const mappedValues = values
      .map((value, index) => this.valueToHtml(i18n, translationKey, value, extraClasses[index]))

    return this.renderFieldElement(i18n, translationKey, mappedValues)
  }

  public static renderFieldElement (i18n: I18N, translationKey: string, value: FieldValue | TemplateResult[]): TemplateResult {
    return html`
      <div class="horizon-card-text-container horizon-card-field-${translationKey}">
        <div class="horizon-card-field-name">${ i18n.tr(translationKey) }</div>
        ${value instanceof Array ? value : this.valueToHtml(i18n, translationKey, value) }
      </div>
    `
  }

  public static renderMoonElement (i18n: I18N, phase: TMoonPhase, phaseRotation: number) {
    if (phase === undefined) {
      return nothing
    }

    // The Moon phase name is a card label like any other: the card computes the phase itself and
    // renders the name from its own translations in the card's `language` (English fallback for
    // phrases not yet translated).
    const moon_phase_localized = i18n.tr(phase.state)

    return html`
      <div class="horizon-card-text-container horizon-card-field-moon-phase">
        <div class="horizon-card-field-moon-phase-icon" style="transform: rotate(${phaseRotation}deg)">
          <ha-icon icon="mdi:${phase.icon}"></ha-icon>
        </div>
        <div class="horizon-card-field-value horizon-card-field-value-moon-phase">${moon_phase_localized}</div>
      </div>
    `
  }

  private static valueToHtml (i18n: I18N, translationKey: string, value: FieldValue, klass='') {
    const mappedValue = this.fieldValueToString(i18n, translationKey, value)
    return html`<div class="horizon-card-field-value ${klass}">${mappedValue}</div>`
  }

  private static fieldValueToString (i18n: I18N, translationKey: string, value: FieldValue) {
    let pre = ''
    let post = ''
    if (value === undefined) {
      value = '-'
    } else if (value instanceof Date) {
      value = i18n.formatDateAsTime(value)
      const parts = value.match(/(.*?)(\d{1,2}[:.]\d{2})(.*)/)
      if (parts != null) {
        pre = parts[1]
        value = parts[2]
        post = parts[3]
      }
    } else if (typeof value === 'number') {
      value = i18n.formatDecimal(value)
      if (translationKey === EHorizonCardI18NKeys.Azimuth || translationKey === EHorizonCardI18NKeys.Elevation) {
        value += '°'
      }
    }
    const preHtml = pre ? html`<span class="horizon-card-field-value-secondary">${pre}</span>` : nothing
    const postHtml = post ? html`<span class="horizon-card-field-value-secondary">${post}</span>` : nothing

    return html`${preHtml}${value}${postHtml}`
  }

  public static isValidLanguage (language: string): boolean {
    return Object.keys(Constants.LOCALIZATION_LANGUAGES).includes(language)
  }

  public static clamp (min: number, max: number, value: number): number {
    if (min === max) {
      return min
    }

    if (min > max) {
      throw new RangeError('Min value can not be bigger than the max value')
    }

    return Math.min(Math.max(value, min), max)
  }

  public static rangeScale (minRange: number, maxRange: number, range: number, value: number) {
    const clamped = HelperFunctions.clamp(minRange, maxRange, range) - minRange
    const rangeSize = maxRange - minRange
    return (1 - clamped / rangeSize) * value
  }

  public static noonAtTimeZone (date: Date, timeZone: string): Date {
    let tzDate
    try {
      tzDate = this.getTimeInTimeZone(date, '12:00:00', timeZone)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      tzDate = new Date(date)
      tzDate.setHours(12)
      tzDate.setMinutes(0)
      tzDate.setSeconds(0)
      tzDate.setMilliseconds(0)
    }
    return tzDate
  }

  public static midnightAtTimeZone (date: Date, timeZone: string): Date {
    let tzDate
    try {
      tzDate = this.getTimeInTimeZone(date, '00:00:00', timeZone)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      tzDate = new Date(date)
      tzDate.setHours(0)
      tzDate.setMinutes(0)
      tzDate.setSeconds(0)
      tzDate.setMilliseconds(0)
    }
    return tzDate
  }

  public static noonAtLongitude (date: Date, longitude: number): Date {
    return HelperFunctions.solarTimeAtLongitude(date, 12, longitude)
  }

  public static midnightAtLongitude (date: Date, longitude: number): Date {
    return HelperFunctions.solarTimeAtLongitude(date, 0, longitude)
  }

  // Mean-solar-time reference (DST-free; 15°/h, east positive). Returns "hour:00 mean-solar-time
  // of the local solar day that `date` falls on", mirroring noonAtTimeZone's semantics so the
  // day-selection logic in readSunTimes keeps working. Only the solar day matters, so no rounding.
  private static solarTimeAtLongitude (date: Date, hour: number, longitude: number): Date {
    const offsetMs = (longitude / 15) * 3600000
    const local = new Date(date.getTime() + offsetMs)
    return new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), hour) - offsetMs)
  }

  private static getTimeInTimeZone (date: Date, time: string, timeZone: string) {
    const formatter = new Intl.DateTimeFormat('fr-CA',
      { timeZone: timeZone, timeZoneName: 'longOffset' })
    // 'fr-CA' locale formats like '2023-04-11 UTC+03:00' or '2023-04-11 UTC-10:00' or '2023-04-11 UTC'
    const formatted = formatter.format(date)
    const parts = formatted
      .replace('\u2212', '-') // minuses might be U+2212 instead of plain old ASCII hyphen-minus
      .split(' ')
    let tz = parts[1].replace('UTC', '')
    if (tz === '') {
      tz = 'Z'
    }
    const dateToParse = `${parts[0]}T${time}${tz}`
    const result = new Date(dateToParse)
    if (isNaN(result.getTime())) {
      // Something went fishy with using the above method - generally should not happen
      throw new Error(`Could not convert time to time zone: ${formatted} -> ${dateToParse}`)
    }
    return result
  }
}
