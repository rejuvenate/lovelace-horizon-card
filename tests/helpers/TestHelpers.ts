import { HomeAssistant } from 'custom-card-helpers'
import { html, LitElement, TemplateResult } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('test-element')
export class TemplateResultTestHelper extends LitElement {
  public static async renderFunction (fun) {
    const element = window.document.createElement('test-element') as TemplateResultTestHelper
    element.templateResultFunction = fun
    window.document.body.appendChild(element)
    await element.updateComplete
    return element.shadowRoot!.innerHTML
  }

  public static async renderElement (elementObject) {
    return TemplateResultTestHelper.renderFunction(() => elementObject.render())
  }

  @state()
  templateResultFunction?: () => TemplateResult

  render (): TemplateResult {
    return this.templateResultFunction?.() ?? html`<span>No function assigned</span>`
  }
}

export const SaneHomeAssistant = {
  config: {
    latitude: 0,
    longitude: 0,
    elevation: 0,
    time_zone: 'UTC'
  },
  language: 'en',
  locale: {
    language: 'en',
    time_format: 'language'
  },
  themes: {
    darkMode: true
  },
  localize: (key) => key
} as unknown as HomeAssistant
