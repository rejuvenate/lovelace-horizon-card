import { html, nothing, TemplateResult } from 'lit'

import {
  EHorizonCardI18NKeys,
  IHorizonCardConfig,
  THorizonCardData,
  THorizonCardFields,
  TMoonTimes,
  TSunTimes
} from '../../types'
import { HelperFunctions } from '../../utils/HelperFunctions'
import { I18N } from '../../utils/I18N'

export class HorizonCardFooter {
  private readonly data: THorizonCardData
  private readonly i18n: I18N
  private readonly sunTimes: TSunTimes
  private readonly moonTimes: TMoonTimes
  private readonly fields: THorizonCardFields
  private readonly azimuths
  private readonly azimuthExtraClasses: string[]
  private readonly elevations
  private readonly elevationExtraClasses: string[]
  private readonly southern_flip: boolean

  constructor (config: IHorizonCardConfig, data: THorizonCardData, i18n: I18N) {
    this.data = data

    this.i18n = i18n
    this.sunTimes = data.sunData.times
    this.moonTimes = data.moonData.times
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.fields = config.fields!

    this.azimuths = []
    if (this.fields.sun_azimuth) {
      this.azimuths.push(this.data.sunData.azimuth)
    }
    if (this.fields.moon_azimuth) {
      this.azimuths.push(this.data.moonData.azimuth)
    }
    if (this.fields.sun_azimuth && this.fields.moon_azimuth) {
      this.azimuthExtraClasses = ['horizon-card-sun-value', 'horizon-card-moon-value']
    } else {
      this.azimuthExtraClasses = []
    }

    this.elevations = []
    if (this.fields.sun_elevation) {
      this.elevations.push(this.data.sunData.elevation)
    }
    if (this.fields.moon_elevation) {
      this.elevations.push(this.data.moonData.elevation)
    }
    if (this.fields.sun_elevation && this.fields.moon_elevation) {
      this.elevationExtraClasses = ['horizon-card-sun-value', 'horizon-card-moon-value']
    } else {
      this.elevationExtraClasses = []
    }

    this.southern_flip = config.southern_flip!
  }

  public render (): TemplateResult {
    const dawn = this.fields.dawn
      ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Dawn, this.sunTimes.dawn)
      : nothing
    const dusk = this.fields.dusk
      ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Dusk, this.sunTimes.dusk)
      : nothing
    const left = this.southern_flip ? dusk : dawn
    const right = this.southern_flip ? dawn : dusk
    return html`
      <div class="horizon-card-footer">
        ${
          this.renderRow(
            left,
            this.fields.noon
              ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Noon, this.sunTimes.noon)
              : nothing,
            right
          )
        }
        ${
          this.renderRow(
            this.fields.sun_azimuth || this.fields.moon_azimuth
              ? HelperFunctions.renderFieldElements(this.i18n, EHorizonCardI18NKeys.Azimuth, this.azimuths,
                this.azimuthExtraClasses)
              : nothing,
            this.fields.sun_elevation || this.fields.moon_elevation
              ? HelperFunctions.renderFieldElements(this.i18n, EHorizonCardI18NKeys.Elevation, this.elevations,
                this.elevationExtraClasses)
              : nothing
          )
        }
        ${
          this.renderRow(
            this.fields.moonrise
              ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Moonrise, this.moonTimes.moonrise)
              : nothing,
            this.fields.moon_phase
              ? HelperFunctions.renderMoonElement(this.i18n, this.data.moonData.phase, this.data.moonData.phaseRotation)
              : nothing,
            this.fields.moonset
              ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Moonset, this.moonTimes.moonset)
              : nothing
          )
        }
      </div>
    `
  }

  private renderRow (...args: (typeof nothing | TemplateResult)[]) {
    const nonEmpty = args.filter((tr) => tr !== nothing)
    return nonEmpty.length > 0
      ? html`
        <div class="horizon-card-field-row">
          ${nonEmpty}
        </div>`
      : nothing
  }
}
