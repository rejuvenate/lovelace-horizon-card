import { html, TemplateResult } from 'lit'

export class HorizonCardEditorContent {
  static onMock: jest.Mock

  public on (eventName: string, listener: () => void) {
    HorizonCardEditorContent.onMock(eventName, listener)
  }

  public render (): TemplateResult {
    return html`
      <div class="card-config">
        HORIZON CARD EDITOR CONTENT
      </div>
    `
  }
}
