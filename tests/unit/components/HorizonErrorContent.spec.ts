import { NumberFormat, TimeFormat } from 'custom-card-helpers'

import { HorizonErrorContent } from '../../../src/components/HorizonErrorContent'
import { EHorizonCardErrors } from '../../../src/types'
import { I18N } from '../../../src/utils/I18N'
import { TemplateResultTestHelper } from '../../helpers/TestHelpers'

jest.mock('../../../src/utils/I18N', () => require('../../mocks/I18N'))

describe('HorizonErrorContent', () => {
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

    enum MockErrors {
      MOCK_ERROR = 'MockError'
    }

    it('prints a console error message', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      const i18n = new I18N('en', 'UTC', TimeFormat.language, NumberFormat.language, (key) => key)
      const horizonErrorContent = new HorizonErrorContent(MockErrors.MOCK_ERROR as unknown as EHorizonCardErrors, i18n)
      horizonErrorContent.render()

      expect(consoleErrorSpy).toHaveBeenCalledWith('errors.MockError')
    })

    it('returns a valid error template result', async () => {
      const i18n = new I18N('en', 'UTC', TimeFormat.language, NumberFormat.language, (key) => key)
      const horizonErrorContent = new HorizonErrorContent(MockErrors.MOCK_ERROR as unknown as EHorizonCardErrors, i18n)

      const html = await TemplateResultTestHelper.renderElement(horizonErrorContent)

      expect(html).toMatchSnapshot()
    })
  })
})
