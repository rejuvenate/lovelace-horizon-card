import { html, TemplateResult } from 'lit'

import { EHorizonCardErrors } from '../types'
import { I18N } from '../utils/I18N'

export class HorizonErrorContent {
  private readonly i18n: I18N
  private readonly error: EHorizonCardErrors

  constructor (error: EHorizonCardErrors, i18n: I18N) {
    this.error = error
    this.i18n = i18n
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
