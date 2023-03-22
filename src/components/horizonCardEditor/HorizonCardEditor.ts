import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers'
import { CSSResult, LitElement, TemplateResult } from 'lit'
import { customElement, property } from 'lit-element'

import cardStyles from '../../cardStyles'
import { EHorizonCardI18NKeys, IHorizonCardConfig } from '../../types'
import { HorizonCardEditorContent, THorizonCardEditorContentEvents } from './HorizonCardEditorContent'

@customElement('horizon-card-editor')
export class HorizonCardEditor extends LitElement implements LovelaceCardEditor {
  static readonly cardType = 'horizon-card-editor'
  private static readonly CONFIG_CHANGED_EVENT = 'config-changed'

  @property({ type: Object }) hass!: HomeAssistant
  @property() private config!: IHorizonCardConfig

  static get styles (): CSSResult {
    return cardStyles
  }

  public setConfig (config: IHorizonCardConfig): void {
    this.config = config
  }

  public configChanged (event: THorizonCardEditorContentEvents['configChanged']): void {
    const property = event.target?.configValue
    const value = event.detail?.value ?? event.target?.selected ?? event.target?.checked

    const newConfig = { ...this.config, [property]: value }

    // Handles default or empty values by deleting the config property
    if (value === 'default' || value === undefined || value === '') {
      delete newConfig[property]
    }

    // Handles boolean values
    if (value === 'true' || value === 'false') {
      newConfig[property] = value === 'true'
    }

    // Handles fields config
    if (Object.values(EHorizonCardI18NKeys).includes(property as EHorizonCardI18NKeys)) {
      delete newConfig[property]
      newConfig.fields = {
        ...newConfig.fields,
        [property]: value
      }
    }

    const customEvent = new CustomEvent(HorizonCardEditor.CONFIG_CHANGED_EVENT, {
      bubbles: true,
      composed: true,
      detail: { config: newConfig }
    })

    this.dispatchEvent(customEvent)
  }

  protected render (): TemplateResult {
    const content = new HorizonCardEditorContent(this.config!)
    content.on('configChanged', (event) => this.configChanged(event))
    return content.render()
  }
}
