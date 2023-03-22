import { html, TemplateResult } from 'lit'

import { EHorizonCardErrors, IHorizonCardConfig } from '../types'
import { I18N } from '../utils/I18N'

export class HorizonErrorContent {
  private i18n: I18N
  private error: EHorizonCardErrors

  constructor (config: IHorizonCardConfig, error: EHorizonCardErrors) {
    this.i18n = config.i18n!
    this.error = error
  }

  public render (): TemplateResult {
    const errorMessage = this.i18n.tr(`errors.${this.error}`)
    // eslint-disable-next-line no-console
    console.error(errorMessage)

    return html`
      <div class="horizon-card-error">
        ${ errorMessage }
      </div>
    `
  }
}
