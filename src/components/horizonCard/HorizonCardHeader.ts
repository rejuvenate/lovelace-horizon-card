import { html, nothing, TemplateResult } from 'lit'

import { EHorizonCardI18NKeys, IHorizonCardConfig, THorizonCardData, THorizonCardFields, TSunTimes } from '../../types'
import { HelperFunctions } from '../../utils/HelperFunctions'
import { I18N } from '../../utils/I18N'

export class HorizonCardHeader {
  private readonly title?: string
  private readonly times: TSunTimes
  private readonly fields: THorizonCardFields
  private readonly i18n: I18N
  private readonly southern_flip: boolean;

  constructor (config: IHorizonCardConfig, data: THorizonCardData, i18n: I18N) {
    this.title = config.title
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.fields = config.fields!
    this.times = data.sunData.times
    this.i18n = i18n
    this.southern_flip = config.southern_flip!
  }

  public render (): TemplateResult {
    return html`
      ${ this.showTitle() ? this.renderTitle() : nothing }
      ${ this.renderHeader() }
    `
  }

  private renderTitle (): TemplateResult {
    return html`<div class="horizon-card-title">${ this.title }</div>`
  }

  private renderHeader(): TemplateResult {
    const sunrise = this.fields.sunrise
      ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Sunrise, this.times.sunrise)
      : nothing
    const sunset = this.fields.sunset
      ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Sunset, this.times.sunset)
      : nothing
    const left = this.southern_flip ? sunset : sunrise
    const right = this.southern_flip ? sunrise : sunset
    return html`<div class="horizon-card-header">${left}${right}</div>`
  }

  private showTitle (): boolean {
    return this.title !== undefined
  }
}
