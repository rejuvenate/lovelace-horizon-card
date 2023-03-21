import { html, TemplateResult } from 'lit'

import { EHorizonCardI18NKeys, IHorizonCardConfig, THorizonCardData, THorizonCardFields, THorizonCardTimes } from '../../types'
import { HelperFunctions } from '../../utils/HelperFunctions'
import { I18N } from '../../utils/I18N'

export class HorizonCardFooter {
  private data: THorizonCardData
  private i18n: I18N
  private times: THorizonCardTimes
  private fields: THorizonCardFields

  constructor (config: IHorizonCardConfig, data: THorizonCardData) {
    this.data = data

    this.i18n = config.i18n!
    this.times = data?.times
    this.fields = config.fields!
  }

  public render (): TemplateResult {
    return html`
      <div class="horizon-card-footer">
        <div class="horizon-card-field-row">
          ${
  this.fields?.dawn !== undefined
    ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Dawn, this.times?.dawn)
    : HelperFunctions.nothing()
}
          ${
  this.fields?.noon !== undefined
    ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Noon, this.times?.noon)
    : HelperFunctions.nothing()
}
          ${
  this.fields?.dusk !== undefined
    ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Dusk, this.times?.dusk)
    : HelperFunctions.nothing()
}
        </div>

        <div class="horizon-card-field-row">
          ${
  this.fields?.azimuth !== undefined
    ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Azimuth, this.data?.azimuth)
    : HelperFunctions.nothing()
}
          ${
  this.fields?.elevation !== undefined
    ? HelperFunctions.renderFieldElement(this.i18n, EHorizonCardI18NKeys.Elevation, this.data?.elevation)
    : HelperFunctions.nothing()
}
        </div>
      </div>
    `
  }
}
