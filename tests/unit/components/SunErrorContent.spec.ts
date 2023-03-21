import { SunErrorContent } from '../../../src/components/SunErrorContent'
import { ESunCardErrors } from '../../../src/types'
import { I18N } from '../../../src/utils/I18N'
import { CustomSnapshotSerializer, TemplateResultTestHelper } from '../../helpers/TestHelpers'

jest.mock('../../../src/utils/I18N', () => require('../../mocks/I18N'))

expect.addSnapshotSerializer(new CustomSnapshotSerializer())

describe('SunErrorContent', () => {
  describe('render', () => {
    let consoleErrorSpy: jest.SpyInstance
    beforeAll(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    })

    afterEach(() => {
      consoleErrorSpy.mockClear()
    })

    afterAll(() => {
      consoleErrorSpy.mockRestore()
    })

    it('prints a console error message', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const config = {
        type: 'sun-card',
        i18n: new I18N('es', undefined)
      }

      const sunErrorContent = new SunErrorContent(config, ESunCardErrors.SunIntegrationNotFound)
      sunErrorContent.render()
      expect(consoleErrorSpy).toHaveBeenCalledWith('errors.SunIntegrationNotFound')
    })

    it('returns a valid error template result', async () => {
      // jest.spyOn(console, 'error').mockImplementation()
      const config = {
        type: 'sun-card',
        i18n: new I18N('es', undefined)
      }

      const sunErrorContent = new SunErrorContent(config, ESunCardErrors.SunIntegrationNotFound)
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof sunErrorContent.render>
      element.templateResultFunction = () => sunErrorContent.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })
  })
})
