import type { TemplateResult } from 'lit'
import { html, nothing } from 'lit'

import type { IHorizonCardConfig, THorizonCardData } from '../../types'
import type { I18N } from '../../utils/I18N'
import { HorizonCardFooter } from './HorizonCardFooter'
import { HorizonCardGraph } from './HorizonCardGraph'
import { HorizonCardHeader } from './HorizonCardHeader'

export class HorizonCardContent {
  private config: IHorizonCardConfig
  private data: THorizonCardData
  private i18n: I18N

  constructor (config: IHorizonCardConfig, data: THorizonCardData, i18n: I18N) {
    this.config = config
    this.data = data
    this.i18n = i18n
  }

  render (): TemplateResult {
    return html`
      <ha-card>
        <div class="horizon-card">
          ${ this.renderHeader() }
          ${ this.config.graph !== false ? this.renderGraph() : nothing }
          ${ this.renderFooter() }
        </div>
      </ha-card>
    `
  }

  private renderHeader (): TemplateResult {
    return new HorizonCardHeader(this.config, this.data, this.i18n).render()
  }

  private renderGraph (): TemplateResult {
    return new HorizonCardGraph(this.config, this.data).render()
  }

  private renderFooter (): TemplateResult {
    return new HorizonCardFooter(this.config, this.data, this.i18n).render()
  }
}
