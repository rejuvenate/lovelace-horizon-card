import { html, TemplateResult } from 'lit'

import { EHorizonCardI18NKeys, IHorizonCardConfig, THorizonCardData, THorizonCardFields, THorizonCardTimes } from '../../types'
import { HelperFunctions } from '../../utils/HelperFunctions'
import { I18N } from '../../utils/I18N'

export class HorizonCardHeader {
  private title?: string
  private times: THorizonCardTimes
  private fields: THorizonCardFields
  private i18n: I18N

  constructor (config: IHorizonCardConfig, data: THorizonCardData) {
    this.title = config.title
    this.fields = config.fields!
    this.times = data?.times

    this.i18n = config.i18n!
  }

  public render (): TemplateResult {
    return html`
      ${ this.showTitle() ? this.renderTitle() : HelperFunctions.nothing() }
      ${ this.renderHeader() }
    `
  }

  private renderTitle (): TemplateResult {
    return html`<div class="horizon-card-title">${ this.title }</div>`
  }

  private renderHeader (): TemplateResult {
    return html`
      <div class="horizon-card-header">
        ${
  this.fields?.sunrise && this.times?.sunrise
    ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Sunrise, this.times.sunrise)
    : HelperFunctions.nothing()
}
        ${
  this.fields?.sunset && this.times?.sunset
    ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Sunset, this.times.sunset)
    : HelperFunctions.nothing()
}
      </div>
    `
  }

  private showTitle (): boolean {
    return this.title !== undefined
  }
}
