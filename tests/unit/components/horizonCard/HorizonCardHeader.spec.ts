import { NumberFormat, TimeFormat } from 'custom-card-helpers'

import { HorizonCardHeader } from '../../../../src/components/horizonCard'
import { IHorizonCardConfig, THorizonCardData, TSunData, TSunTimes } from '../../../../src/types'
import { I18N } from '../../../../src/utils/I18N'
import { TemplateResultTestHelper } from '../../../helpers/TestHelpers'

jest.mock('../../../../src/utils/I18N', () => require('../../../mocks/I18N'))

describe('HorizonCardHeader', () => {
  const i18n = new I18N('en', 'UTC', TimeFormat.language, NumberFormat.language, (key) => key)

  describe('render', () => {
    it('renders the title if it is present in the configuration', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        title: 'test',
        fields: {}
      }

      const data = {
        sunData: {}
      } as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data, i18n)

      const html = await TemplateResultTestHelper.renderElement(horizonCardHeader)

      expect(html).toMatchSnapshot()
    })

    it('does not render the title if it is not present in the configuration', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        fields: {}
      }

      const data = {
        sunData: {}
      } as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data, i18n)

      const html = await TemplateResultTestHelper.renderElement(horizonCardHeader)

      expect(html).toMatchSnapshot()
    })

    it('renders the sunrise field when it is present in the data and it is activated on the config', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        fields: {
          sunrise: true
        }
      }

      const data = {
        sunData: {
          times: {
            now: new Date(0),
            noon: new Date(0),
            midnight: new Date(0),
            sunrise: new Date(0)
          } as TSunTimes
        } as TSunData
      } as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data, i18n)

      const html = await TemplateResultTestHelper.renderElement(horizonCardHeader)

      expect(html).toMatchSnapshot()
    })

    it('does not render the sunrise field when it is present in the data but it is disabled on the config', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        fields: {
          sunrise: false
        }
      }

      const data = {
        sunData: {
          times: {
            now: new Date(0),
            noon: new Date(0),
            midnight: new Date(0),
            sunrise: new Date(0)
          } as TSunTimes
        } as TSunData
      } as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data, i18n)

      const html = await TemplateResultTestHelper.renderElement(horizonCardHeader)

      expect(html).toMatchSnapshot()
    })

    it('does not render the sunrise field when it is not present in the data but it is activated on the config', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        fields: {
          sunrise: true
        }
      }

      const data = {
        sunData: {
          times: {}
        }
      } as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data, i18n)

      const html = await TemplateResultTestHelper.renderElement(horizonCardHeader)

      expect(html).toMatchSnapshot()
    })

    it('does not render the sunrise field when it is not present in the data and it is disabled on the config', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        fields: {
          sunrise: false
        }
      }

      const data = {
        sunData: {
          times: {}
        }
      } as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data, i18n)

      const html = await TemplateResultTestHelper.renderElement(horizonCardHeader)

      expect(html).toMatchSnapshot()
    })

    it('renders the sunset field when it is present in the data and it is activated on the config', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        fields: {
          sunset: true
        }
      }

      const data = {
        sunData: {
          times: {
            sunset: new Date(0)
          } as TSunTimes
        } as TSunData
      } as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data, i18n)

      const html = await TemplateResultTestHelper.renderElement(horizonCardHeader)

      expect(html).toMatchSnapshot()
    })

    it('does not render the sunset field when it is present in the data but it is disabled on the config', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        fields: {
          sunset: false
        }
      }

      const data = {
        sunData: {
          times: {
            now: new Date(0),
            noon: new Date(0),
            midnight: new Date(0),
            sunrise: new Date(0)
          } as TSunTimes
        } as TSunData
      } as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data, i18n)

      const html = await TemplateResultTestHelper.renderElement(horizonCardHeader)

      expect(html).toMatchSnapshot()
    })

    it('does not render the sunset field when it is not present in the data but it is activated on the config', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        fields: {
          sunset: true
        }
      }

      const data = {
        sunData: {
          times: {}
        }
      } as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data, i18n)

      const html = await TemplateResultTestHelper.renderElement(horizonCardHeader)

      expect(html).toMatchSnapshot()
    })

    it('does not render the sunset field when it is not present in the data and it is disabled on the config', async () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        fields: {
          sunset: false
        }
      }

      const data = {
        sunData: {
          times: {}
        }
      } as THorizonCardData

      const horizonCardHeader = new HorizonCardHeader(config, data, i18n)

      const html = await TemplateResultTestHelper.renderElement(horizonCardHeader)

      expect(html).toMatchSnapshot()
    })
  })
})
