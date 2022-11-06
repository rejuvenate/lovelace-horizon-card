import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers'
import { CSSResult, LitElement, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import cardStyles from '../../cardStyles'
import { ESunCardI18NKeys,ISunCardConfig } from '../../types'
import { SunCardEditorContent, TSunCardEditorContentEvents } from './SunCardEditorContent'

@customElement('sun-card-editor')
export class SunCardEditor extends LitElement implements LovelaceCardEditor {
  static readonly cardType = 'sun-card-editor'
  private static readonly CONFIG_CHANGED_EVENT = 'config-changed'

  @property({ type: Object }) hass!: HomeAssistant
  @property() private config!: ISunCardConfig

  static get styles (): CSSResult {
    return cardStyles
  }

  public setConfig (config: ISunCardConfig): void {
    this.config = config
  }

  public configChanged (event: TSunCardEditorContentEvents['configChanged']): void {
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
    if (Object.values(ESunCardI18NKeys).includes(property as ESunCardI18NKeys)) {
      delete newConfig[property]
      newConfig.fields = {
        ...newConfig.fields,
        [property]: value
      }
    }

    const customEvent = new CustomEvent(SunCardEditor.CONFIG_CHANGED_EVENT, {
      bubbles: true,
      composed: true,
      detail: { config: newConfig }
    })

    this.dispatchEvent(customEvent)
  }

  protected render (): TemplateResult {
    const content = new SunCardEditorContent(this.config!)
    content.on('configChanged', (event) => this.configChanged(event))
    return content.render()
  }
}
