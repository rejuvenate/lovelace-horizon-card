import { HomeAssistant } from 'custom-card-helpers'
import { css, CSSResult } from 'lit'

import { HorizonCardEditor, THorizonCardEditorContentEvents } from '../../../../src/components/horizonCardEditor'
import { IHorizonCardConfig } from '../../../../src/types'
import { CustomSnapshotSerializer, TemplateResultTestHelper } from '../../../helpers/TestHelpers'
import { HorizonCardEditorContent } from '../../../mocks/HorizonCardEditorContent'

jest.mock('../../../../src/components/HorizonErrorContent', () => require('../../../mocks/HorizonErrorContent'))
jest.mock('../../../../src/utils/HelperFunctions', () => require('../../../mocks/HelperFunctions'))
jest.mock('../../../../src/utils/I18N', () => require('../../../mocks/I18N'))
jest.mock('../../../../src/cardStyles', () => css``)
jest.mock('../../../../src/components/horizonCardEditor/HorizonCardEditorContent.ts', () => require('../../../mocks/HorizonCardEditorContent'))

expect.addSnapshotSerializer(new CustomSnapshotSerializer())

describe('HorizonCardEditor', () => {
  let horizonCardEditor: HorizonCardEditor

  beforeEach(() => {
    HorizonCardEditorContent.onMock = jest.fn()
    horizonCardEditor = new HorizonCardEditor()
  })

  describe('hass', () => {
    it('updates hass property with provided value', () => {
      const expectedValue = { language: 'test' } as HomeAssistant
      horizonCardEditor.hass = expectedValue
      expect(horizonCardEditor.hass).toEqual(expectedValue)
    })
  })

  describe('setConfig', () => {
    it('updates config property with provided value', () => {
      const expectedValue = { language: 'test' } as IHorizonCardConfig
      horizonCardEditor.setConfig(expectedValue)
      expect(horizonCardEditor['config']).toEqual(expectedValue)
    })
  })

  describe('configChanged', () => {
    let dispatchEventMock
    beforeEach(() => {
      dispatchEventMock = jest.fn()
      horizonCardEditor.dispatchEvent = dispatchEventMock
    })

    it('retrieves correctly the value from input', () => {
      const config = { target: { configValue: 'test' }, detail: { value: 'test' } } as THorizonCardEditorContentEvents['configChanged']
      horizonCardEditor.configChanged(config)

      const customEvent = dispatchEventMock.mock.calls[0][0] as CustomEvent
      expect(customEvent.detail.config).toEqual(expect.objectContaining({
        test: 'test'
      }))
    })

    it('retrieves correctly the value from select', () => {
      const config = { target: { configValue: 'test', selected: 'true' } } as THorizonCardEditorContentEvents['configChanged']
      horizonCardEditor.configChanged(config)

      const customEvent = dispatchEventMock.mock.calls[0][0] as CustomEvent
      expect(customEvent.detail.config).toEqual(expect.objectContaining({
        test: true
      }))
    })

    it('retrieves correctly the value from checkbox', () => {
      const config = { target: { configValue: 'test', checked: true } } as THorizonCardEditorContentEvents['configChanged']
      horizonCardEditor.configChanged(config)

      const customEvent = dispatchEventMock.mock.calls[0][0] as CustomEvent
      expect(customEvent.detail.config).toEqual(expect.objectContaining({
        test: true
      }))
    })

    it('deletes the config property when it the value is default', () => {
      const config = { target: { configValue: 'test' }, detail: { value: 'default' } } as THorizonCardEditorContentEvents['configChanged']
      horizonCardEditor.configChanged(config)

      const customEvent = dispatchEventMock.mock.calls[0][0] as CustomEvent
      expect(customEvent.detail.config.test).toBeUndefined()
    })

    it('deletes the config property when it the value is undefined', () => {
      const config = { target: { configValue: 'test' } } as THorizonCardEditorContentEvents['configChanged']
      horizonCardEditor.configChanged(config)

      const customEvent = dispatchEventMock.mock.calls[0][0] as CustomEvent
      expect(customEvent.detail.config.test).toBeUndefined()
    })

    it('deletes the config property when it the value is an empty string', () => {
      const config = { target: { configValue: 'test' }, detail: { value: '' } } as THorizonCardEditorContentEvents['configChanged']
      horizonCardEditor.configChanged(config)

      const customEvent = dispatchEventMock.mock.calls[0][0] as CustomEvent
      expect(customEvent.detail.config.test).toBeUndefined()
    })

    it('transform "true"/"false" to boolean', () => {
      const config = { target: { configValue: 'test' }, detail: { value: 'false' } } as THorizonCardEditorContentEvents['configChanged']
      horizonCardEditor.configChanged(config)

      const customEvent = dispatchEventMock.mock.calls[0][0] as CustomEvent
      expect(customEvent.detail.config).toEqual(expect.objectContaining({
        test: false
      }))
    })

    it('handles field configuration correctly', () => {
      const config = { target: { configValue: 'dawn' }, detail: { value: true } } as THorizonCardEditorContentEvents['configChanged']
      horizonCardEditor.configChanged(config)

      const customEvent = dispatchEventMock.mock.calls[0][0] as CustomEvent
      expect(customEvent.detail.config).toEqual(expect.objectContaining({
        fields: {
          dawn: true
        }
      }))
    })

    it('dispatches an event', () => {
      const config = { target: { configValue: 'test' }, detail: { value: 'test' } } as THorizonCardEditorContentEvents['configChanged']
      horizonCardEditor.configChanged(config)

      expect(horizonCardEditor.dispatchEvent).toHaveBeenCalledTimes(1)
    })
  })

  describe('render', () => {
    it('starts to listen then configChanged event from HorizonCardEditorContent', () => {
      horizonCardEditor['render']()
      expect(HorizonCardEditorContent.onMock).toHaveBeenCalledWith('configChanged', expect.any(Function))
    })

    it('renders the horizon card editor content render result', async () => {
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCardEditor['render']>
      element.templateResultFunction = () => horizonCardEditor['render']()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })
  })

  describe('get styles', () => {
    it('returns a CSSResult', () => {
      expect(HorizonCardEditor.styles).toBeInstanceOf(CSSResult)
    })
  })
})
