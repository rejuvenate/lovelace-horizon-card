import { html,TemplateResult } from 'lit'

import { IHorizonCardConfig,THorizonCardData } from '../../types'
import { HelperFunctions } from '../../utils/HelperFunctions'
import { HorizonCardFooter } from './HorizonCardFooter'
import { HorizonCardGraph } from './HorizonCardGraph'
import { HorizonCardHeader } from './HorizonCardHeader'

export class HorizonCardContent {
  private config: IHorizonCardConfig
  private data: THorizonCardData

  constructor (config: IHorizonCardConfig, data: THorizonCardData) {
    this.config = config
    this.data = data
  }

  render (): TemplateResult {
    return html`
      <ha-card>
        <div class="horizon-card ${this.config.darkMode ? 'horizon-card-dark' : ''}">
          ${ this.showHeader() ? this.renderHeader() : HelperFunctions.nothing() }
          ${ this.renderGraph() }
          ${ this.showFooter() ? this.renderFooter() : HelperFunctions.nothing() }
        </div>
      </ha-card>
    `
  }

  private renderHeader (): TemplateResult {
    return new HorizonCardHeader(this.config, this.data).render()
  }

  private renderGraph (): TemplateResult {
    return new HorizonCardGraph(this.data).render()
  }

  private renderFooter (): TemplateResult {
    return new HorizonCardFooter(this.config, this.data).render()
  }

  private showHeader (): boolean {
    // logic based on config
    return true
  }

  private showFooter (): boolean {
    // logic based on config
    return true
  }
}
