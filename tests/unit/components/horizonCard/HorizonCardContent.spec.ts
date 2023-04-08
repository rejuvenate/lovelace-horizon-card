import { NumberFormat, TimeFormat } from 'custom-card-helpers'

import { HorizonCardContent } from '../../../../src/components/horizonCard'
import { IHorizonCardConfig, THorizonCardData } from '../../../../src/types'
import { I18N } from '../../../../src/utils/I18N'
import { TemplateResultTestHelper } from '../../../helpers/TestHelpers'

jest.mock('../../../../src/components/horizonCard/HorizonCardHeader', () => require('../../../mocks/HorizonCardHeader'))
jest.mock('../../../../src/components/horizonCard/HorizonCardGraph', () => require('../../../mocks/HorizonCardGraph'))
jest.mock('../../../../src/components/horizonCard/HorizonCardFooter', () => require('../../../mocks/HorizonCardFooter'))

describe('HorizonCardContent', () => {
  describe('render', () => {
    it('renders the card content', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        language: 'en'
      }

      const i18n = new I18N('en', 'UTC', TimeFormat.language, NumberFormat.language, (key) => key)
      const horizonCardContent = new HorizonCardContent(config, {} as THorizonCardData, i18n)

      const html = await TemplateResultTestHelper.renderElement(horizonCardContent)

      expect(html).toMatchSnapshot()
    })
  })
})
