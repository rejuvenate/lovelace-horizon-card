import { HomeAssistant } from 'custom-card-helpers'
import { css, CSSResult } from 'lit'

import { HorizonCard } from '../../../../src/components/horizonCard'
import { HorizonCardEditor } from '../../../../src/components/horizonCardEditor'
import { Constants } from '../../../../src/constants'
import { EHorizonCardErrors, IHorizonCardConfig, THorizonCardData } from '../../../../src/types'
import { CustomSnapshotSerializer, TemplateResultTestHelper } from '../../../helpers/TestHelpers'

jest.mock('../../../../src/components/HorizonErrorContent', () => require('../../../mocks/HorizonErrorContent'))
jest.mock('../../../../src/components/horizonCard/HorizonCardContent', () => require('../../../mocks/HorizonCardContent'))
jest.mock('../../../../src/utils/I18N', () => require('../../../mocks/I18N'))
jest.mock('../../../../src/cardStyles', () => css``)

expect.addSnapshotSerializer(new CustomSnapshotSerializer())

// JSDom doesn't include SVGPathElement
class SVGPathElement {
  getPointAtLength () {
    return {
      x: 0,
      y: 0
    }
  }
}

Object.defineProperty(window, 'SVGPathElement', { value: SVGPathElement })

describe('HorizonCard', () => {
  let horizonCard: HorizonCard

  beforeEach(() => {
    horizonCard = new HorizonCard()
    horizonCard.attachShadow({ mode: 'open' })
  })

  describe('set hass', () => {
    it('updates lastHass property', () => {
      jest.spyOn(horizonCard as any, 'populateConfigFromHass').mockReturnValue(undefined)
      jest.spyOn(horizonCard as any, 'processLastHass').mockReturnValue(undefined)
      expect(horizonCard['lastHass']).toBeUndefined()

      const expectedLastHass = {} as HomeAssistant
      horizonCard.hass = expectedLastHass
      expect(horizonCard['lastHass']).toEqual(expectedLastHass)
    })

    it('calls populateConfigFromHass if it has not been rendered yet', () => {
      const populateConfigFromHassSpy = jest.spyOn(horizonCard as any, 'populateConfigFromHass').mockReturnValue(undefined)
      jest.spyOn(horizonCard as any, 'processLastHass').mockReturnValue(undefined)
      horizonCard['hasRendered'] = false

      horizonCard.hass = {} as HomeAssistant
      expect(populateConfigFromHassSpy).toHaveBeenCalledTimes(1)
    })

    it('does not call populateConfigFromHass if it has been rendered', () => {
      const populateConfigFromHassSpy = jest.spyOn(horizonCard as any, 'populateConfigFromHass').mockReturnValue(undefined)
      jest.spyOn(horizonCard as any, 'processLastHass').mockReturnValue(undefined)
      horizonCard['hasRendered'] = true

      horizonCard.hass = {} as HomeAssistant
      expect(populateConfigFromHassSpy).not.toHaveBeenCalled()
    })

    it('calls processLastHass if it has been rendered', () => {
      jest.spyOn(horizonCard as any, 'populateConfigFromHass').mockReturnValue(undefined)
      const processLastHassSpy = jest.spyOn(horizonCard as any, 'processLastHass').mockReturnValue(undefined)
      horizonCard['hasRendered'] = true

      horizonCard.hass = {} as HomeAssistant
      expect(processLastHassSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('getConfigElement', () => {
    it('creates and return a horizon card config element', () => {
      const expectedElement = document.createElement('div')
      const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValueOnce(expectedElement)
      const result = HorizonCard.getConfigElement()

      expect(result).toEqual(expectedElement)
      expect(createElementSpy).toHaveBeenCalledTimes(1)
      expect(createElementSpy).toHaveBeenCalledWith(HorizonCardEditor.cardType)
    })
  })

  describe('setConfig', () => {
    it('overrides old config with new values', () => {
      jest.spyOn(horizonCard as any, 'populateConfigFromHass').mockReturnValue(undefined)
      expect(horizonCard['config']).toEqual({ type: HorizonCard.cardType })
      const config = {
        type: HorizonCard.cardType,
        title: 'Test'
      } as IHorizonCardConfig

      horizonCard.setConfig(config)
      expect(horizonCard['config'].title).toEqual(config.title)

      const newConfig = {
        type: HorizonCard.cardType,
        title: 'Test2'
      } as IHorizonCardConfig

      horizonCard.setConfig(newConfig)
      expect(horizonCard['config'].title).toEqual(newConfig.title)
    })

    it('uses the provided component', () => {
      const config = {
        type: HorizonCard.cardType,
        component: 'test'
      } as IHorizonCardConfig

      horizonCard.setConfig(config)
      expect(horizonCard['config'].component).toEqual(config.component)
    })

    it('uses the default component when not provided', () => {
      const config = {
        type: HorizonCard.cardType
      } as IHorizonCardConfig

      horizonCard.setConfig(config)
      expect(horizonCard['config'].component).toEqual(Constants.DEFAULT_CONFIG.component)
    })

    it('throws an error if the provided language is not supported', () => {
      const config = {
        type: HorizonCard.cardType,
        language: 'notSupportedLanguage'
      } as IHorizonCardConfig

      let thrownError
      try {
        horizonCard.setConfig(config)
      } catch (error) {
        thrownError = (error as Error).message
      }

      expect(thrownError).toEqual(`${config.language} is not a supported language. Supported languages: ${Object.keys(Constants.LOCALIZATION_LANGUAGES)}`)
    })

    const fields = ['sunrise', 'sunset', 'dawn', 'noon', 'dusk', 'azimuth', 'elevation']
    for (const field of fields) {
      it(`uses the provided value for ${field}`, () => {
        const config = {
          type: HorizonCard.cardType,
          fields: {
            [field]: 'test'
          }
        } as IHorizonCardConfig

        horizonCard.setConfig(config)
        expect(horizonCard['config'].fields?.[field]).toEqual('test')
      })

      it(`uses the default value for ${field} when not provided`, () => {
        const config = {
          type: HorizonCard.cardType
        } as IHorizonCardConfig

        horizonCard.setConfig(config)
        expect(horizonCard['config'].fields?.[field]).toEqual(Constants.DEFAULT_CONFIG.fields?.[field])
      })
    }

    it('calls populateConfigFromHass if lastHass has a value', () => {
      const populateConfigFromHassSpy = jest.spyOn(horizonCard as any, 'populateConfigFromHass').mockReturnValue(undefined)
      horizonCard['lastHass'] = {} as HomeAssistant

      const config = {
        type: HorizonCard.cardType
      } as IHorizonCardConfig

      horizonCard.setConfig(config)
      expect(populateConfigFromHassSpy).toHaveBeenCalledTimes(1)
    })

    it('does not call populateConfigFromHass if lastHass has not a value', () => {
      const populateConfigFromHassSpy = jest.spyOn(horizonCard as any, 'populateConfigFromHass').mockReturnValue(undefined)
      delete (horizonCard as any)['lastHass']

      const config = {
        type: HorizonCard.cardType
      } as IHorizonCardConfig

      horizonCard.setConfig(config)
      expect(populateConfigFromHassSpy).not.toHaveBeenCalled()
    })
  })

  describe('render', () => {
    it('renders an error if error is present on data', async () => {
      if (!horizonCard['data']) {
        horizonCard['data'] = {} as THorizonCardData
      }

      horizonCard['data'].error = EHorizonCardErrors.SunIntegrationNotFound
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCard.render>
      element.templateResultFunction = () => horizonCard.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it('renders the horizon card if no error is present on data', async () => {
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof horizonCard.render>
      element.templateResultFunction = () => horizonCard.render()
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })
  })

  describe('updated', () => {
    it('sets to true hasRendered if has not been rendered yet', () => {
      jest.spyOn(horizonCard as any, 'processLastHass').mockReturnValue(undefined)
      horizonCard['hasRendered'] = false
      horizonCard['updated'](new Map())
      expect(horizonCard['hasRendered']).toEqual(true)
    })

    it('calls processLastHass if has not been rendered yet', () => {
      const processLastHassSpy = jest.spyOn(horizonCard as any, 'processLastHass').mockReturnValue(undefined)
      horizonCard['hasRendered'] = false
      horizonCard['updated'](new Map())
      expect(processLastHassSpy).toHaveBeenCalledTimes(1)
    })

    it('does nothing more than call super.updated if has been already rendered', () => {
      const processLastHassSpy = jest.spyOn(horizonCard as any, 'processLastHass').mockReturnValue(undefined)
      horizonCard['hasRendered'] = true
      horizonCard['updated'](new Map())
      expect(processLastHassSpy).not.toHaveBeenCalledWith()
    })
  })

  describe('populateConfigFromHass', () => {
    it('keeps values from config when present', () => {
      const config = {
        type: HorizonCard.cardType,
        darkMode: true,
        language: 'es'
      } as IHorizonCardConfig

      horizonCard['lastHass'] = {
        themes: {
          darkMode: false
        },
        locale: {
          language: 'en'
        }
      } as any

      horizonCard['config'] = config
      horizonCard['populateConfigFromHass']()
      expect(horizonCard['config'].darkMode).toEqual(config.darkMode)
      expect(horizonCard['config'].language).toEqual(config.language)
    })

    it('sets values from hass when not present in config', () => {
      horizonCard['lastHass'] = {
        themes: {
          darkMode: false
        },
        locale: {
          language: 'it'
        }
      } as any

      horizonCard['populateConfigFromHass']()
      expect(horizonCard['config'].darkMode).toEqual(false)
      expect(horizonCard['config'].language).toEqual('it')
    })

    it('supports old versions of home assistant', () => {
      horizonCard['lastHass'] = {
        themes: {
          darkMode: false
        },
        language: 'it'
      } as any

      horizonCard['populateConfigFromHass']()
      expect(horizonCard['config'].darkMode).toEqual(false)
      expect(horizonCard['config'].language).toEqual('it')
    })
  })

  describe('processLastHass', () => {
    it('does an early return if lastHass has no value', () => {
      delete (horizonCard as any)['lastHass']
      const populateConfigFromHassSpy = jest.spyOn(horizonCard as any, 'populateConfigFromHass').mockReturnValue(undefined)
      horizonCard['processLastHass']()

      expect(populateConfigFromHassSpy).not.toHaveBeenCalled()
    })

    it('calls populateConfigFromHass', () => {
      (horizonCard as any)['lastHass'] = { states: {} }
      const populateConfigFromHassSpy = jest.spyOn(horizonCard as any, 'populateConfigFromHass').mockReturnValue(undefined)
      horizonCard['processLastHass']()

      expect(populateConfigFromHassSpy).toHaveBeenCalledTimes(1)
    })

    it('process the data from the component when found', () => {
      (horizonCard as any)['lastHass'] = {
        states: {
          component: {
            attributes: {
              azimuth: 3,
              elevation: 7
            }
          }
        }
      }

      const config = {
        type: HorizonCard.cardType,
        component: 'component'
      } as IHorizonCardConfig

      horizonCard['config'] = config

      jest.spyOn(horizonCard as any, 'populateConfigFromHass').mockReturnValue(undefined)

      const times = {
        dawn: new Date(0),
        dusk: new Date(0),
        noon: new Date(0),
        sunrise: new Date(0),
        sunset: new Date(0)
      }

      const sunInfo = {
        sunrise: 0,
        sunset: 0,
        dawnProgressPercent: 0,
        dayProgressPercent: 0,
        duskProgressPercent: 0,
        sunAboveHorizon: 0,
        sunPercentOverHorizon: 100,
        sunPosition: { x: 0, y: 0 }
      }

      const readTimesSpy = jest.spyOn(horizonCard as any, 'readTimes').mockReturnValue(times)
      const calculateSunInfoSpy = jest.spyOn(horizonCard as any, 'calculateSunInfo').mockReturnValue(sunInfo)

      horizonCard['processLastHass']()

      expect(readTimesSpy).toHaveBeenCalledTimes(1)
      expect(calculateSunInfoSpy).toHaveBeenCalledTimes(1)
      expect(horizonCard['data'].times).toEqual(times)
      expect(horizonCard['data'].sunInfo).toEqual(sunInfo)
    })

    it('sets an error if the component is not found', () => {
      (horizonCard as any)['lastHass'] = { states: {} }
      jest.spyOn(horizonCard as any, 'populateConfigFromHass').mockReturnValue(undefined)
      horizonCard['processLastHass']()

      expect(horizonCard['data'].error).toEqual(EHorizonCardErrors.SunIntegrationNotFound)
    })
  })

  describe('readTimes', () => {
    it('returns dates for each time field', () => {
      const normalizeSunEventTimeSpy = jest.spyOn(horizonCard as any, 'normalizeSunEventTime')
        .mockReturnValue(new Date(0))
      const combineDateTimeSpy = jest.spyOn(horizonCard as any, 'combineDateTime')
        .mockReturnValue(new Date(0))

      const result = horizonCard['readTimes']({
        next_setting: 0,
        next_dawn: 0,
        next_dusk: 0,
        next_noon: 0,
        next_rising: 0
      }, new Date())

      expect(result).toEqual({
        dawn: new Date(0),
        dusk: new Date(0),
        noon: new Date(0),
        sunrise: new Date(0),
        sunset: new Date(0)
      })

      expect(normalizeSunEventTimeSpy).toHaveBeenCalledTimes(4)
      expect(combineDateTimeSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('normalizeSunEventTime', () => {
    it('normalizes the moment of a specific event according to next noon if within 24h', () => {
      const eventTime = '2021-06-13T12:34:56.007'
      const now = new Date('2021-06-13T13:40:23')
      const noon = new Date('2021-06-12T23:45:56')

      const result = horizonCard['normalizeSunEventTime'](eventTime, now, noon)

      if (typeof result === 'object') {
        expect(result.getFullYear()).toEqual(2021)
        expect(result.getMonth()).toEqual(5)
        expect(result.getDate()).toEqual(13)
        expect(result.getHours()).toEqual(12)
        expect(result.getMinutes()).toEqual(34)
        expect(result.getSeconds()).toEqual(56)
        expect(result.getMilliseconds()).toEqual(7)
      }
    })
    it('normalizes the moment of a specific event and returns undefined if not within 24h of next noon', () => {
      const eventTime = '2021-06-14T12:34:56.007'
      const now = new Date('2021-06-13T13:40:23')
      const noon = new Date('2021-06-12T23:45:56')

      const result = horizonCard['normalizeSunEventTime'](eventTime, now, noon)

      expect(result).toBeUndefined()
    })
  })

  describe('combineDateTime', () => {
    it('combines the date of one Date with the time of another Date', () => {
      const date = new Date('2021-06-12T23:45:56')
      const time = new Date('2023-03-18T12:34:56.007')

      const result = horizonCard['combineDateTime'](date, time)

      expect(result.getFullYear()).toEqual(2021)
      expect(result.getMonth()).toEqual(5)
      expect(result.getDate()).toEqual(12)
      expect(result.getHours()).toEqual(12)
      expect(result.getMinutes()).toEqual(34)
      expect(result.getSeconds()).toEqual(56)
      expect(result.getMilliseconds()).toEqual(7)
    })
  })

  describe('now and fixed now', () => {
    beforeAll(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date(2023, 2, 20, 12, 34, 56))
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it('uses actual time when no fixed offset', () => {
      const result = horizonCard['now']()

      expect(result).toEqual(new Date())
    })

    it('uses date of noon plus set fixed offset from midnight', () => {
      horizonCard['setFixedNow'](new Date('2023-03-18T07:35:15'))

      const result = horizonCard['now']()

      expect(result).toEqual(new Date('2023-03-18T07:35:15'))
    })
  })

  describe('calculateUsableSunrise', () => {
    it('returns actual time when usable', () => {
      const dayStartMs = new Date('2023-03-18T00:00:00').getTime()
      const elevation = -10
      const noon = new Date('2023-03-18T12:20:00')
      const sunset = new Date('2023-03-18T06:30:00')
      const sunrise = new Date('2023-03-18T19:40:00')

      const result = horizonCard['calculateUsableSunrise'](dayStartMs, elevation, noon, sunset, sunrise)

      expect(result).toEqual(new Date('2023-03-18T06:30:00').getTime())
    })

    it('returns day start when undefined above horizon', () => {
      const dayStartMs = new Date('2023-03-18T00:00:00').getTime()
      const elevation = 1
      const noon = new Date('2023-03-18T12:20:00')
      const sunset = undefined
      const sunrise = new Date('2023-03-18T19:40:00')

      const result = horizonCard['calculateUsableSunrise'](dayStartMs, elevation, noon, sunset, sunrise)

      expect(result).toEqual(new Date('2023-03-18T00:00:00').getTime())
    })

    it('returns noon minus 1ms when undefined below horizon', () => {
      const dayStartMs = new Date('2023-03-18T00:00:00').getTime()
      const elevation = -1
      const noon = new Date('2023-03-18T12:20:00')
      const sunset = undefined
      const sunrise = new Date('2023-03-18T19:40:00')

      const result = horizonCard['calculateUsableSunrise'](dayStartMs, elevation, noon, sunset, sunrise)

      expect(result).toEqual(new Date('2023-03-18T12:20:00').getTime() - 1)
    })

    it('returns day start when sunset is before midnight', () => {
      const dayStartMs = new Date('2023-03-18T00:00:00').getTime()
      const elevation = -10
      const noon = new Date('2023-03-18T12:20:00')
      const sunset = new Date('2023-03-18T23:30:00')
      const sunrise = new Date('2023-03-18T22:45:00')

      const result = horizonCard['calculateUsableSunrise'](dayStartMs, elevation, noon, sunset, sunrise)

      expect(result).toEqual(new Date('2023-03-18T00:00:00').getTime())
    })
  })

  describe('calculateUsableSunset', () => {
    it('returns actual time when usable', () => {
      const dayEndMs = new Date('2023-03-18T23:59:59.999').getTime()
      const elevation = -10
      const noon = new Date('2023-03-18T12:20:00')
      const sunset = new Date('2023-03-18T19:30:00')

      const result = horizonCard['calculateUsableSunset'](dayEndMs, elevation, noon, sunset)

      expect(result).toEqual(new Date('2023-03-18T19:30:00').getTime())
    })

    it('returns day start when undefined above horizon', () => {
      const dayEndMs = new Date('2023-03-18T23:59:59.999').getTime()
      const elevation = 1
      const noon = new Date('2023-03-18T12:20:00')
      const sunset = undefined

      const result = horizonCard['calculateUsableSunset'](dayEndMs, elevation, noon, sunset)

      expect(result).toEqual(new Date('2023-03-18T23:59:59.999').getTime())
    })

    it('returns noon plus 1ms when undefined below horizon', () => {
      const dayEndMs = new Date('2023-03-18T23:59:59.999').getTime()
      const elevation = -1
      const noon = new Date('2023-03-18T12:20:00')
      const sunset = undefined

      const result = horizonCard['calculateUsableSunset'](dayEndMs, elevation, noon, sunset)

      expect(result).toEqual(new Date('2023-03-18T12:20:00').getTime() + 1)
    })
  })

  describe('calculateSunInfo', () => {
    it('returns all sun info', () => {
      const path = new SVGPathElement()
      jest.spyOn((horizonCard as any).shadowRoot, 'querySelector').mockReturnValue(path)

      const result = horizonCard['calculateSunInfo'](45, new Date(), {
        dusk: new Date(0),
        dawn: new Date(0),
        noon: new Date(0),
        sunrise: new Date(0),
        sunset: new Date(0)
      })

      expect(result).toEqual({
        dawnProgressPercent: 0,
        dayProgressPercent: 0,
        duskProgressPercent: 0,
        sunAboveHorizon: true,
        sunPercentOverHorizon: 100,
        sunPosition: {
          x: 0,
          y: 0
        },
        sunrise: 0,
        sunset: 0
      })
    })
  })

  describe('get styles', () => {
    it('returns a CSSResult', () => {
      expect(HorizonCard.styles).toBeInstanceOf(CSSResult)
    })
  })
})
