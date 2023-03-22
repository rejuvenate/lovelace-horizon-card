import { html,TemplateResult } from 'lit'

import { Constants } from '../../constants'
import { EHorizonCardI18NKeys,IConfigChangedEvent, IHorizonCardConfig } from '../../types'
import { EventUtils } from '../../utils/EventUtils'

export type THorizonCardEditorContentEvents = {
  configChanged: IConfigChangedEvent<{ value: unknown }>
}

export class HorizonCardEditorContent extends EventUtils<THorizonCardEditorContentEvents> {
  config: IHorizonCardConfig

  constructor (config: IHorizonCardConfig) {
    super()
    this.config = config
  }

  public render (): TemplateResult {
    return html`
      <div class="card-config">
        <div>
          ${this.renderTitleEditor()}
        </div>
        <div>
          ${this.renderLanguageEditor()}
        </div>
        <div>
          ${this.renderDarkModeEditor()}
        </div>
        <div>
          ${this.render12HourClockEditor()}
        </div>
        <div>
          ${this.renderFieldsEditor()}
        </div>
      </div>
    `
  }

  private onConfigChanged (event: THorizonCardEditorContentEvents['configChanged']) {
    this.emit('configChanged', event)
  }

  private renderTitleEditor (): TemplateResult {
    return html`
      <paper-input
        label="Title (Optional)"
        .configValue=${'title'}
        .value=${this.config?.title ?? ''}
        @value-changed=${(event) => this.onConfigChanged(event)}
      >
      </paper-input>
    `
  }

  private renderLanguageEditor (): TemplateResult {
    // TODO: Add language full name
    const selectedLanguage = Object.keys(Constants.LOCALIZATION_LANGUAGES).indexOf(this.config?.language ?? '') + 1

    return html`
      <paper-dropdown-menu
        label="Language"
        .configValue=${'language'}
        @value-changed=${(event) => this.onConfigChanged(event)}
      >
        <paper-listbox slot="dropdown-content" selected="${selectedLanguage}">
          <paper-item label="default">Default</paper-item>
          ${Object.keys(Constants.LOCALIZATION_LANGUAGES).map((language) => html`
            <paper-item label="${language}">${language}</paper-item>
          `)}
        </paper-listbox>
      </paper-dropdown-menu>
    `
  }

  private renderDarkModeEditor (): TemplateResult {
    const selectedDarkMode = this.config?.darkMode ?? 'default'
    return html`
      <label id="theme">Theme:</label>
      <paper-radio-group
        aria-labelledby="theme"
        .configValue=${'darkMode'}
        .selected=${selectedDarkMode.toString()}
        @paper-radio-group-changed=${(event) => this.onConfigChanged(event)}
      >
        <paper-radio-button name="default">Default</paper-radio-button>
        <paper-radio-button name="true">Dark</paper-radio-button>
        <paper-radio-button name="false">Light</paper-radio-button>
      </paper-radio-group>
    `
  }

  private render12HourClockEditor (): TemplateResult {
    const selectedClockMode = this.config?.use12hourClock ?? 'default'

    return html`
      <label id="clock">Clock mode:</label>
      <paper-radio-group
        aria-labelledby="clock"
        .configValue=${'use12hourClock'}
        .selected=${selectedClockMode.toString()}
        @paper-radio-group-changed=${(event) => this.onConfigChanged(event)}
      >
        <paper-radio-button name="default">Default</paper-radio-button>
        <paper-radio-button name="true">12 hours</paper-radio-button>
        <paper-radio-button name="false">24 hourse</paper-radio-button>
      </paper-radio-group>
    `
  }

  private renderFieldsEditor (): TemplateResult {
    return html`
      <label>Card fields:</label>
      <ul>
        ${Object.entries(EHorizonCardI18NKeys).map(([name, configValue]) => {
    return html`
            <li><ha-switch .configValue=${configValue} .checked=${this.config.fields?.[configValue] ?? Constants.DEFAULT_CONFIG.fields![configValue]} @change=${(event) => this.onConfigChanged(event)}></ha-switch> ${name}</li>
          `
  })}
      </ul>
    `
  }
}
