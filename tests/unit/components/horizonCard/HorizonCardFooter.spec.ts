import { NumberFormat, TimeFormat } from 'custom-card-helpers'

import { HorizonCardFooter } from '../../../../src/components/horizonCard'
import { Constants } from '../../../../src/constants'
import { IHorizonCardConfig, THorizonCardData } from '../../../../src/types'
import { I18N } from '../../../../src/utils/I18N'
import { TemplateResultTestHelper } from '../../../helpers/TestHelpers'

jest.mock('../../../../src/utils/I18N', () => require('../../../mocks/I18N'))

describe('HorizonCardFooter', () => {
  const dateFieldsSun = ['dawn', 'noon', 'dusk']
  const dateFieldsMoon = ['moonrise', 'moonset']
  const numberFields = [
    'sun_azimuth', 'moon_azimuth', 'sun_elevation', 'moon_elevation',
    ['sun_azimuth', 'moon_azimuth'],
    ['sun_elevation', 'moon_elevation']
  ]
  const allFields = [...dateFieldsSun, ...dateFieldsMoon, ...numberFields, 'moon_phase']

  const falseFields = {}
  allFields.forEach((field) => {
    if (!(field instanceof Array)) {
      falseFields[field as string] = false
    }
  })

  const getConfigForValue = (field, config?) => {
    config = config || { fields: { ...falseFields } }
    config.fields[field] = true
    return config
  }
  const getConfigForValues = (fields) => {
    const config = { fields: { ...falseFields } }
    fields.forEach((f) => getConfigForValue(f, config))
    return config
  }

  const emptyData = () => ({
    sunData: {
      times: {},
    },
    moonData: {
      times: {}
    }
  })
  const getDataForValue = (field, data?) => {
    data = data || emptyData()

    if (dateFieldsSun.includes(field)) {
      data.sunData.times[field] = new Date(0)
    }

    if (dateFieldsMoon.includes(field)) {
      data.moonData.times[field] = new Date(0)
    }

    if (field.startsWith('sun_')) {
      data.sunData[field.substring('sun_'.length)] = 0
    }

    if (field.startsWith('moon_')) {
      const name = field.substring('moon_'.length)
      if (name === 'phase') {
        data.moonData[name] = Constants.MOON_PHASES.fullMoon
        data.moonData['phaseRotation'] = 0
      } else {
        data.moonData[name] = 0
      }
    }

    return data
  }
  const getDataForValues = (fields) => {
    const data = emptyData()
    fields.forEach((f) => getDataForValue(f, data))
    return data
  }

  const i18n = new I18N('en', 'UTC', TimeFormat.language, NumberFormat.language, (key) => key)

  describe('render', () => {
    for (const field of allFields) {
      it(`should render the ${field} field when it is present in the config and data for it is provided`, async () => {
        const config = field instanceof Array ? getConfigForValues(field) : getConfigForValue(field)
        const data = field instanceof Array ? getDataForValues(field) : getDataForValue(field)

        const horizonCardFooter = new HorizonCardFooter(config, data, i18n)

        const html = await TemplateResultTestHelper.renderElement(horizonCardFooter)

        expect(html).toMatchSnapshot()
      })

      it(`should render the ${field} field as '-' when it is present in the config but no data for it is provided`, async () => {
        const config = field instanceof Array ? getConfigForValues(field) : getConfigForValue(field)
        const data = {
          sunData: {
            times: {}
          },
          moonData: {
            times: {}
          }
        } as THorizonCardData

        const horizonCardFooter = new HorizonCardFooter(config, data, i18n)

        const html = await TemplateResultTestHelper.renderElement(horizonCardFooter)

        expect(html).toMatchSnapshot()
      })

      it(`should not render the ${field} field when it is not present in the config but data for it is provided`, async () => {
        const config = { fields: falseFields } as IHorizonCardConfig
        const data = field instanceof Array ? getDataForValues(field) : getDataForValue(field)

        const horizonCardFooter = new HorizonCardFooter(config, data, i18n)

        const html = await TemplateResultTestHelper.renderElement(horizonCardFooter)

        expect(html).toMatchSnapshot()
      })
    }
  })
})
