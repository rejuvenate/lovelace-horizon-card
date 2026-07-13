import type { HomeAssistant} from 'custom-card-helpers'
import { NumberFormat, TimeFormat } from 'custom-card-helpers'
import { css, CSSResult } from 'lit'

import { HorizonCard } from '../../../../src/components/horizonCard'
import { Constants } from '../../../../src/constants'
import type { EHorizonCardErrors, IHorizonCardConfig, THorizonCardData, TMoonData, TSunTimes } from '../../../../src/types'
import { HelperFunctions } from '../../../../src/utils/HelperFunctions'
import { I18N } from '../../../../src/utils/I18N'
import { SaneHomeAssistant, TemplateResultTestHelper } from '../../../helpers/TestHelpers'
import { default as SunCalcMock } from '../../../mocks/SunCalc'

jest.mock('../../../../src/components/HorizonErrorContent', () => require('../../../mocks/HorizonErrorContent'))
jest.mock('../../../../src/components/horizonCard/HorizonCardContent', () => require('../../../mocks/HorizonCardContent'))
jest.mock('../../../../src/utils/I18N')
jest.mock('../../../../src/cardStyles', () => css``)
jest.mock('suncalc3', () => require('../../../mocks/SunCalc'))

// JSDom doesn't include SVGPathElement
class SVGPathElement {
  x: number
  y: number

  constructor (x=0, y=0) {
    this.x = x
    this.y = y
  }

  getPointAtLength () {
    return {
      x: this.x,
      y: this.y
    }
  }

  getTotalLength () {
    return 500
  }
}

Object.defineProperty(window, 'SVGPathElement', { value: SVGPathElement })

describe('HorizonCard', () => {
  let horizonCard: HorizonCard

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    horizonCard = new HorizonCard()
    horizonCard.attachShadow({ mode: 'open' })
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.restoreAllMocks()
  })

  describe('set hass', () => {
    it('updates lastHass property', () => {
      expect(horizonCard['lastHass']).toBeUndefined()

      const expectedLastHass = {} as HomeAssistant
      horizonCard.hass = expectedLastHass
      expect(horizonCard['lastHass']).toEqual(expectedLastHass)
    })
  })

  describe('setConfig', () => {
    it('overrides old config with new values', () => {
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

    it('throws an error if the provided language is not supported', () => {
      const config = {
        type: HorizonCard.cardType,
        language: 'notSupportedLanguage'
      } as IHorizonCardConfig

      expect(() => horizonCard.setConfig(config))
        .toThrow(`${config.language} is not a supported language. Supported languages: ${Object.keys(Constants.LOCALIZATION_LANGUAGES)}`)
    })

    it('throws an error if only latitude or longitude is provided', () => {
      const config1 = {
        type: HorizonCard.cardType,
        latitude: 10
      } as IHorizonCardConfig

      const config2 = {
        type: HorizonCard.cardType,
        longitude: 10
      } as IHorizonCardConfig

      expect(() => horizonCard.setConfig(config1))
        .toThrow('Latitude and longitude must be both set or unset')
      expect(() => horizonCard.setConfig(config2))
        .toThrow('Latitude and longitude must be both set or unset')
    })

    const fields = ['sunrise', 'sunset', 'dawn', 'noon', 'dusk', 'azimuth', 'elevation', 'moonrise', 'moonset', 'moon_phase']
    for (const field of fields) {
      it(`uses the provided value for ${field}`, () => {
        const config = {
          type: HorizonCard.cardType,
          fields: {
            [field]: true
          }
        } as IHorizonCardConfig

        horizonCard.setConfig(config)
        expect(horizonCard['config'].fields?.[field]).toEqual(true)
      })

      it(`uses the default value for ${field} when not provided`, () => {
        const config = {
          type: HorizonCard.cardType
        } as IHorizonCardConfig

        horizonCard.setConfig(config)
        horizonCard.hass = SaneHomeAssistant
        const expandedConfig = horizonCard['expandedConfig']()
        expect(expandedConfig.fields?.[field]).toEqual(Constants.DEFAULT_CONFIG.fields?.[field])
      })
    }

    const sharedFields = ['azimuth', 'elevation']
    const individualPrefixes = ['sun', 'moon']
    for (const field of sharedFields) {
      for (const prefix of individualPrefixes) {
        const prefixedField = `${prefix}_${field}`
        it(`uses the provided value for ${prefixedField} over provided value for ${field}`, () => {
          const config = {
            type: HorizonCard.cardType,
            fields: {
              [field]: false,
              [prefixedField]: true
            }
          } as IHorizonCardConfig

          horizonCard.setConfig(config)
          horizonCard.hass = SaneHomeAssistant
          expect(horizonCard['config'].fields?.[prefixedField]).toEqual(true)
        })

        it(`uses the default value for ${field} when ${prefixedField} not provided`, () => {
          const config = {
            type: HorizonCard.cardType
          } as IHorizonCardConfig

          horizonCard.setConfig(config)
          horizonCard.hass = SaneHomeAssistant
          const expandedConfig = horizonCard['expandedConfig']()
          expect(expandedConfig.fields?.[prefixedField]).toEqual(Constants.DEFAULT_CONFIG.fields?.[field])
        })
      }
    }
  })

  describe('render', () => {
    it('renders nothing if hass has not been set', async () => {
      const html = await TemplateResultTestHelper.renderElement(horizonCard)

      expect(html).toMatchSnapshot()
    })

    it('renders an error if error is present on data', async () => {
      enum MockErrors {
        MOCK_ERROR = 'MockError'
      }
      horizonCard.setConfig({} as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant
      horizonCard['error'] = MockErrors.MOCK_ERROR as unknown as EHorizonCardErrors

      const html = await TemplateResultTestHelper.renderElement(horizonCard)

      expect(html).toMatchSnapshot()
    })

    it('renders the horizon card if no error is present on data', async () => {
      const config = {
        language: 'en'
      } as IHorizonCardConfig
      horizonCard.setConfig(config)
      horizonCard.hass = SaneHomeAssistant

      const html = await TemplateResultTestHelper.renderElement(horizonCard)

      expect(html).toMatchSnapshot()
    })

    it('sets dark mode when it is set to true on the config', () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        dark_mode: true
      }
      horizonCard.setConfig(config)
      horizonCard.hass = SaneHomeAssistant

      horizonCard.render()

      expect(horizonCard.classList).toContainEqual('horizon-card-dark')
    })

    it('does not set dark mode when it is set to false on the config', () => {
      const config: IHorizonCardConfig = {
        type: 'horizon-card',
        dark_mode: false
      }
      horizonCard.setConfig(config)
      horizonCard.hass = SaneHomeAssistant

      horizonCard.render()

      expect(horizonCard.classList).not.toContainEqual('horizon-card-dark')
    })
  })

  describe('updated', () => {
    it('triggers calculation', async () => {
      const path = new SVGPathElement()
      jest.spyOn((horizonCard as any).shadowRoot, 'querySelector').mockReturnValue(path)

      horizonCard.setConfig({} as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant

      const calculateStatePartialSpy = jest.spyOn(horizonCard as any, 'calculateStatePartial')
      const calculateStateFinalSpy = jest.spyOn(horizonCard as any, 'calculateStateFinal')

      const setTimeoutSpy = jest.spyOn(window, 'setTimeout')

      horizonCard['updated'](new Map())
      expect(horizonCard['hasCalculated']).toEqual(true)
      expect(calculateStatePartialSpy).toHaveBeenCalledTimes(1)
      expect(calculateStateFinalSpy).not.toHaveBeenCalled()
      expect(setTimeoutSpy).not.toHaveBeenCalled()
      expect(horizonCard['data'].partial).toEqual(true)

      jest.clearAllMocks()

      // Triggered again because of state change during the partial calculation
      horizonCard['updated'](new Map())
      expect(horizonCard['hasCalculated']).toEqual(true)
      expect(calculateStatePartialSpy).not.toHaveBeenCalled()
      expect(calculateStateFinalSpy).toHaveBeenCalledTimes(1)
      expect(setTimeoutSpy).toHaveBeenCalledTimes(1)
      expect(horizonCard['data'].partial).toEqual(false)

      jest.clearAllMocks()

      // Refresh from timer triggers partial calculation
      jest.runAllTimers()
      expect(calculateStatePartialSpy).toHaveBeenCalledTimes(1)
      expect(calculateStateFinalSpy).not.toHaveBeenCalled()
      expect(setTimeoutSpy).not.toHaveBeenCalled()
    })

    it('does nothing if not configured yet', () => {
      expect(horizonCard['hasCalculated']).toEqual(false)
      horizonCard['updated'](new Map())
      expect(horizonCard['hasCalculated']).toEqual(false)
    })
  })

  describe('connectedCallback', () => {
    it('re-arms the calculation loop after a disconnect', () => {
      // No config is set so the follow-up Lit update short-circuits and leaks
      // no timers; connectedCallback must still reset the calculation flag.
      horizonCard.disconnectedCallback()
      horizonCard['hasCalculated'] = true

      const requestUpdateSpy = jest.spyOn(horizonCard, 'requestUpdate')
      horizonCard.connectedCallback()

      expect(horizonCard['hasCalculated']).toEqual(false)
      expect(requestUpdateSpy).toHaveBeenCalled()
    })

    it('registers the visibility change listener', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener')

      horizonCard.connectedCallback()

      expect(addEventListenerSpy).toHaveBeenCalledWith('visibilitychange', horizonCard['onVisibilityChange'])
    })
  })

  describe('disconnectedCallback', () => {
    it('clears the refresh timer and removes the visibility change listener', () => {
      const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout')
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener')

      horizonCard.disconnectedCallback()

      expect(clearTimeoutSpy).toHaveBeenCalled()
      expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', horizonCard['onVisibilityChange'])
    })
  })

  describe('scheduleRefresh', () => {
    it('schedules a refresh timer when the refresh period is positive', () => {
      horizonCard.setConfig({} as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant

      horizonCard['scheduleRefresh']()

      expect(horizonCard['refreshTimer']).toBeDefined()
    })

    it('does not schedule a refresh timer when the refresh period is 0', () => {
      horizonCard.setConfig({ refresh_period: 0 } as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant

      horizonCard['scheduleRefresh']()

      expect(horizonCard['refreshTimer']).toBeUndefined()
    })
  })

  describe('set hass self-heal', () => {
    it('recomputes when the refresh period has elapsed', () => {
      horizonCard.setConfig({} as IHorizonCardConfig)
      horizonCard['hasCalculated'] = true
      horizonCard['lastComputeTimestamp'] = 0

      const requestUpdateSpy = jest.spyOn(horizonCard, 'requestUpdate')
      horizonCard.hass = SaneHomeAssistant

      expect(horizonCard['hasCalculated']).toEqual(false)
      expect(requestUpdateSpy).toHaveBeenCalled()
    })

    it('does not recompute when the data is still fresh', () => {
      horizonCard.setConfig({} as IHorizonCardConfig)
      horizonCard['hasCalculated'] = true
      horizonCard['lastComputeTimestamp'] = Date.now()

      const requestUpdateSpy = jest.spyOn(horizonCard, 'requestUpdate')
      horizonCard.hass = SaneHomeAssistant

      expect(horizonCard['hasCalculated']).toEqual(true)
      expect(requestUpdateSpy).not.toHaveBeenCalled()
    })

    it('does not recompute when refresh_period is 0', () => {
      horizonCard.setConfig({ refresh_period: 0 } as IHorizonCardConfig)
      horizonCard['hasCalculated'] = true
      horizonCard['lastComputeTimestamp'] = 0

      const requestUpdateSpy = jest.spyOn(horizonCard, 'requestUpdate')
      horizonCard.hass = SaneHomeAssistant

      expect(horizonCard['hasCalculated']).toEqual(true)
      expect(requestUpdateSpy).not.toHaveBeenCalled()
    })

    it('does not recompute when no config has been set', () => {
      horizonCard['hasCalculated'] = true
      horizonCard['lastComputeTimestamp'] = 0

      const requestUpdateSpy = jest.spyOn(horizonCard, 'requestUpdate')
      horizonCard.hass = SaneHomeAssistant

      expect(horizonCard['hasCalculated']).toEqual(true)
      expect(requestUpdateSpy).not.toHaveBeenCalled()
    })
  })

  describe('onVisibilityChange', () => {
    const setVisibilityState = (value: string) => {
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => value })
    }

    it('recomputes when becoming visible and the data is stale', () => {
      setVisibilityState('visible')
      horizonCard.setConfig({} as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant
      horizonCard['hasCalculated'] = true
      horizonCard['lastComputeTimestamp'] = 0

      const requestUpdateSpy = jest.spyOn(horizonCard, 'requestUpdate')
      horizonCard['onVisibilityChange']()

      expect(horizonCard['hasCalculated']).toEqual(false)
      expect(requestUpdateSpy).toHaveBeenCalled()
    })

    it('does not recompute when the document is hidden', () => {
      setVisibilityState('hidden')
      horizonCard.setConfig({} as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant
      horizonCard['hasCalculated'] = true
      horizonCard['lastComputeTimestamp'] = 0

      const requestUpdateSpy = jest.spyOn(horizonCard, 'requestUpdate')
      horizonCard['onVisibilityChange']()

      expect(horizonCard['hasCalculated']).toEqual(true)
      expect(requestUpdateSpy).not.toHaveBeenCalled()
    })

    it('does not recompute when visible but the data is still fresh', () => {
      setVisibilityState('visible')
      horizonCard.setConfig({} as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant
      horizonCard['hasCalculated'] = true
      horizonCard['lastComputeTimestamp'] = Date.now()

      const requestUpdateSpy = jest.spyOn(horizonCard, 'requestUpdate')
      horizonCard['onVisibilityChange']()

      expect(horizonCard['hasCalculated']).toEqual(true)
      expect(requestUpdateSpy).not.toHaveBeenCalled()
    })
  })

  describe('expandedConfig', () => {
    it('keeps values from config when present', () => {
      const config = {
        type: HorizonCard.cardType,
        dark_mode: true,
        language: 'es',
        latitude: 10,
        longitude: 20,
        elevation: 100,
        time_zone: 'Europe/Sofia'
      } as IHorizonCardConfig

      horizonCard.setConfig(config)
      horizonCard.hass = {
        themes: {
          darkMode: false
        },
        locale: {
          language: 'en'
        },
        config: {
          latitude: 30,
          longitude: 40,
          elevation: 200,
          time_zone: 'Europe/Berlin'
        }
      } as any

      const expandedCongfig = horizonCard['expandedConfig']()
      expect(expandedCongfig.dark_mode).toEqual(config.dark_mode)
      expect(expandedCongfig.language).toEqual(config.language)
      expect(expandedCongfig.latitude).toEqual(config.latitude)
      expect(expandedCongfig.longitude).toEqual(config.longitude)
      expect(expandedCongfig.elevation).toEqual(config.elevation)
      expect(expandedCongfig.time_zone).toEqual(config.time_zone)
      expect(horizonCard['latitude']()).toEqual(config.latitude)
      expect(horizonCard['longitude']()).toEqual(config.longitude)
      expect(horizonCard['elevation']()).toEqual(config.elevation)
      expect(horizonCard['timeZone']()).toEqual(config.time_zone)
    })

    it('sets values from hass when not present in config', () => {
      horizonCard.setConfig({} as IHorizonCardConfig)
      horizonCard.hass = {
        themes: {
          darkMode: false
        },
        locale: {
          language: 'it'
        },
        config: {
          latitude: 30,
          longitude: 40,
          elevation: 200,
          time_zone: 'Europe/Berlin'
        }
      } as any

      const expandedCongfig = horizonCard['expandedConfig']()
      expect(expandedCongfig.dark_mode).toEqual(false)
      expect(expandedCongfig.language).toEqual('it')
      expect(expandedCongfig.latitude).toEqual(30)
      expect(expandedCongfig.longitude).toEqual(40)
      expect(expandedCongfig.elevation).toEqual(200)
      expect(expandedCongfig.time_zone).toEqual('Europe/Berlin')
      expect(horizonCard['latitude']()).toEqual(30)
      expect(horizonCard['longitude']()).toEqual(40)
      expect(horizonCard['elevation']()).toEqual(200)
      expect(horizonCard['timeZone']()).toEqual('Europe/Berlin')
    })

    it('uses default values for fields when no user fields are configured', () => {
      horizonCard.setConfig({} as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant

      const expandedCongfig = horizonCard['expandedConfig']()
      expect(expandedCongfig.fields?.sunrise).toEqual(true)
      expect(expandedCongfig.fields?.sunset).toEqual(true)
      expect(expandedCongfig.fields?.dawn).toEqual(true)
      expect(expandedCongfig.fields?.noon).toEqual(true)
      expect(expandedCongfig.fields?.dusk).toEqual(true)
      expect(expandedCongfig.fields?.azimuth).toEqual(false)
      expect(expandedCongfig.fields?.elevation).toEqual(false)
      expect(expandedCongfig.fields?.moonrise).toEqual(false)
      expect(expandedCongfig.fields?.moon_phase).toEqual(false)
      expect(expandedCongfig.fields?.moonset).toEqual(false)
    })

    it('uses default values for fields and user fields config', () => {
      horizonCard.setConfig({
        fields: {
          azimuth: true
        }
      } as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant

      const expandedCongfig = horizonCard['expandedConfig']()
      expect(expandedCongfig.fields?.sunrise).toEqual(true)
      expect(expandedCongfig.fields?.sunset).toEqual(true)
      expect(expandedCongfig.fields?.dawn).toEqual(true)
      expect(expandedCongfig.fields?.noon).toEqual(true)
      expect(expandedCongfig.fields?.dusk).toEqual(true)
      expect(expandedCongfig.fields?.azimuth).toEqual(true)
      expect(expandedCongfig.fields?.elevation).toEqual(false)
      expect(expandedCongfig.fields?.moonrise).toEqual(false)
      expect(expandedCongfig.fields?.moon_phase).toEqual(false)
      expect(expandedCongfig.fields?.moonset).toEqual(false)
    })

    it('uses default values for non-field config', () => {
      horizonCard.setConfig({} as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant

      const expandedCongfig = horizonCard['expandedConfig']()
      expect(expandedCongfig['moon']).toEqual(true)
    })

    it('uses user provided values for non-field config', () => {
      horizonCard.setConfig({
        moon: false
      } as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant

      const expandedCongfig = horizonCard['expandedConfig']()
      expect(expandedCongfig['moon']).toEqual(false)
    })
  })

  describe('i18n', () => {
    const config = {
      type: HorizonCard.cardType,
      language: 'es',
      time_zone: 'Europe/Sofia',
      time_format: TimeFormat.language,
      number_format: NumberFormat.language
    } as IHorizonCardConfig

    it('uses the explicit config time zone over the local browser time zone', () => {
      horizonCard.setConfig({ type: HorizonCard.cardType, time_zone: 'Europe/Sofia' } as IHorizonCardConfig)
      const hass = {
        ...SaneHomeAssistant,
        locale: { ...SaneHomeAssistant.locale }
      }
      hass.locale['time_zone'] = 'local'
      horizonCard.hass = hass

      horizonCard['i18n'](config)
      expect(I18N).toBeCalledWith('es', 'Europe/Sofia', TimeFormat.language, NumberFormat.language, SaneHomeAssistant.localize)
    })

    it('uses the explicit config time zone over the server time zone', () => {
      // Distinct from the argument's 'Europe/Sofia' to prove the branch reads the raw config.
      horizonCard.setConfig({ type: HorizonCard.cardType, time_zone: 'Asia/Tokyo' } as IHorizonCardConfig)
      const hass = {
        ...SaneHomeAssistant,
        locale: { ...SaneHomeAssistant.locale }
      }
      hass.locale['time_zone'] = 'server'
      horizonCard.hass = hass

      horizonCard['i18n'](config)
      expect(I18N).toBeCalledWith('es', 'Asia/Tokyo', TimeFormat.language, NumberFormat.language, SaneHomeAssistant.localize)
    })

    it('uses the local browser time zone when config has no time zone', () => {
      horizonCard.setConfig({ type: HorizonCard.cardType } as IHorizonCardConfig)
      const hass = {
        ...SaneHomeAssistant,
        locale: { ...SaneHomeAssistant.locale }
      }
      hass.locale['time_zone'] = 'local'
      horizonCard.hass = hass

      horizonCard['i18n'](config)
      expect(I18N).toBeCalledWith('es', 'UTC', TimeFormat.language, NumberFormat.language, SaneHomeAssistant.localize)
    })

    it('uses the server time zone when config has no time zone', () => {
      horizonCard.setConfig({ type: HorizonCard.cardType } as IHorizonCardConfig)
      const hass = {
        ...SaneHomeAssistant,
        locale: { ...SaneHomeAssistant.locale }
      }
      // 'server' or a missing value (older HA version) both take this branch.
      hass.locale['time_zone'] = 'server'
      horizonCard.hass = hass

      horizonCard['i18n'](config)
      expect(I18N).toBeCalledWith('es', 'Europe/Sofia', TimeFormat.language, NumberFormat.language, SaneHomeAssistant.localize)
    })
  })

  describe('getCardSize', () => {
    // Note: don't set hass for these tests, getCardSize() is called after setConfig() but before hass is set
    it('compute size for default fields', () => {
      horizonCard.setConfig({} as IHorizonCardConfig)

      expect(horizonCard.getCardSize()).toEqual(6)
    })

    const azimuthElevationFields = ['azimuth', 'sun_azimuth', 'moon_azimuth', 'elevation', 'sun_elevation', 'moon_elevation']
    for (const field of azimuthElevationFields) {
      it(`compute size when field ${field} is added`, () => {
        const fields = {}
        fields[field] = true
        horizonCard.setConfig({fields} as IHorizonCardConfig)

        expect(horizonCard.getCardSize()).toEqual(7)
      })
    }

    it(`compute size when all azimuth/elevation fields are added`, () => {
      const fields = {}
      for (const field of azimuthElevationFields) {
        fields[field] = true
      }
      horizonCard.setConfig({fields} as IHorizonCardConfig)

      expect(horizonCard.getCardSize()).toEqual(7)
    })

    const moonriseMoonsetFields = ['moonrise', 'moon_phase', 'moonset']
    for (const field of moonriseMoonsetFields) {
      it(`compute size when field ${field} is added`, () => {
        const fields = {}
        fields[field] = true
        horizonCard.setConfig({fields} as IHorizonCardConfig)

        expect(horizonCard.getCardSize()).toEqual(7)
      })
    }

    it(`compute size when all moonrise/moon_phase/moonset fields are added`, () => {
      const fields = {}
      for (const field of moonriseMoonsetFields) {
        fields[field] = true
      }
      horizonCard.setConfig({fields} as IHorizonCardConfig)

      expect(horizonCard.getCardSize()).toEqual(7)
    })

    it(`compute size when all fields are added`, () => {
      const fields = {}
      for (const field of azimuthElevationFields) {
        fields[field] = true
      }
      for (const field of moonriseMoonsetFields) {
        fields[field] = true
      }
      horizonCard.setConfig({fields} as IHorizonCardConfig)

      expect(horizonCard.getCardSize()).toEqual(8)
    })

    it(`compute size when sunrise and sunset fields are removed`, () => {
      horizonCard.setConfig({
        fields: {
          sunrise: false,
          sunset: false
        }
      } as IHorizonCardConfig)

      expect(horizonCard.getCardSize()).toEqual(5)
    })

    it(`compute size when sunrise field is removed`, () => {
      horizonCard.setConfig({
        fields: {
          sunrise: false
        }
      } as IHorizonCardConfig)

      expect(horizonCard.getCardSize()).toEqual(6)
    })

    it(`compute size when sunset field is removed`, () => {
      horizonCard.setConfig({
        fields: {
          sunset: false
        }
      } as IHorizonCardConfig)

      expect(horizonCard.getCardSize()).toEqual(6)
    })

    it(`compute size when dusk, noon and dawn fields are removed`, () => {
      horizonCard.setConfig({
        fields: {
          dusk: false,
          noon: false,
          dawn: false
        }
      } as IHorizonCardConfig)

      expect(horizonCard.getCardSize()).toEqual(5)
    })

    it(`compute size when dusk field is removed`, () => {
      horizonCard.setConfig({
        fields: {
          dusk: false
        }
      } as IHorizonCardConfig)

      expect(horizonCard.getCardSize()).toEqual(6)
    })

    it(`compute size when noon field is removed`, () => {
      horizonCard.setConfig({
        fields: {
          noon: false
        }
      } as IHorizonCardConfig)

      expect(horizonCard.getCardSize()).toEqual(6)
    })

    it(`compute size when dawn field is removed`, () => {
      horizonCard.setConfig({
        fields: {
          dawn: false
        }
      } as IHorizonCardConfig)

      expect(horizonCard.getCardSize()).toEqual(6)
    })

    it(`compute size when all default fields are removed`, () => {
      horizonCard.setConfig({
        fields: {
          sunrise: false,
          sunset: false,
          dusk: false,
          noon: false,
          dawn: false
        }
      } as IHorizonCardConfig)

      expect(horizonCard.getCardSize()).toEqual(4)
    })

    it(`compute size when a title is set`, () => {
      horizonCard.setConfig({
        title: 'Fancy Card'
      } as IHorizonCardConfig)

      expect(horizonCard.getCardSize()).toEqual(7)
    })
  })

  describe('getGridOptions', () => {
    // The card must size to its rendered content in the Sections view. Reporting a fixed
    // `rows` count quantizes the card to whole grid rows and leaves an empty gap below it
    // (issue #192), so getGridOptions() intentionally omits `rows`/`min_rows` and only pins
    // the columns (12 by default, narrowable to half width via min_columns).
    it('reports a 12-column default that can be narrowed to half width', () => {
      horizonCard.setConfig({} as IHorizonCardConfig)

      expect(horizonCard.getGridOptions()).toEqual({ columns: 12, min_columns: 6 })
    })

    it('stays config-independent: even the heaviest config never pins a row count', () => {
      // Regression guard against re-introducing a config-dependent `rows`: this config used
      // to produce the tallest fixed row estimate, and it must now still omit rows/min_rows.
      horizonCard.setConfig({
        title: 'Fancy Card',
        fields: { azimuth: true, elevation: true, moonrise: true, moonset: true, moon_phase: true }
      } as IHorizonCardConfig)

      const gridOptions = horizonCard.getGridOptions() as Record<string, unknown>
      expect(gridOptions.rows).toBeUndefined()
      expect(gridOptions.min_rows).toBeUndefined()
    })
  })

  describe('refreshPeriodMs', () => {
    it('uses default refresh period in milliseconds when not present in config', () => {
      horizonCard.setConfig({} as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant
      expect(horizonCard['refreshPeriodMs']()).toEqual(Constants.DEFAULT_REFRESH_PERIOD * 1000)
    })

    it('converts the refresh period from config seconds to milliseconds', () => {
      horizonCard.setConfig({
        refresh_period: 77
      } as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant
      expect(horizonCard['refreshPeriodMs']()).toEqual(77000)
    })
  })

  describe('now', () => {
    it('uses true now when not present in config', () => {
      jest.setSystemTime(new Date('2023-04-04T00:00:01Z'))
      horizonCard.setConfig({} as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant
      expect(horizonCard['now']()).toEqual(new Date('2023-04-04T00:00:01Z'))
    })

    it('uses now from config', () => {
      horizonCard.setConfig({
        now: new Date('2023-04-04T00:00:02Z')
      } as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant
      expect(horizonCard['now']()).toEqual(new Date('2023-04-04T00:00:02Z'))
    })
  })

  describe('debugLevel', () => {
    it('uses zero debug level when not present in config', () => {
      horizonCard.setConfig({} as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant
      expect(horizonCard['debugLevel']()).toEqual(0)
    })

    it('uses debug level from config', () => {
      horizonCard.setConfig({
        debug_level: 1
      } as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant
      expect(horizonCard['debugLevel']()).toEqual(1)
    })

    it('uses debug level from config', () => {
      horizonCard.setConfig({
        debug_level: 1
      } as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant
      expect(horizonCard['debugLevel']()).toEqual(1)
    })

    it('does not print a console debug message when debug level is not configured', () => {
      const consoleErrorSpy = jest.spyOn(console, 'debug').mockImplementation()
      horizonCard.setConfig({} as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant

      horizonCard['debug']('test1', 1)
      horizonCard['debug'](() => 'test2', 2)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('prints a console debug message when debug level corresponds to message level', () => {
      const consoleErrorSpy = jest.spyOn(console, 'debug').mockImplementation()
      horizonCard.setConfig({
        debug_level: 2
      } as IHorizonCardConfig)
      horizonCard.hass = SaneHomeAssistant

      consoleErrorSpy.mockClear()
      horizonCard['debug']('test1', 1)
      expect(consoleErrorSpy).toHaveBeenCalledWith('custom:horizon-card :: test1')

      consoleErrorSpy.mockClear()
      horizonCard['debug'](() => 'test2', 2)
      expect(consoleErrorSpy).toHaveBeenCalledWith('custom:horizon-card :: test2')

      consoleErrorSpy.mockClear()
      horizonCard['debug']('test3', 3)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })
  })

  describe('readSunTimes', () => {
    beforeEach(() => {
      horizonCard.hass = SaneHomeAssistant
      horizonCard.setConfig({} as IHorizonCardConfig)
    })

    it('returns dates for each time field when now is the same day', () => {
      const now = new Date('2023-04-05T13:00:00Z')
      jest.spyOn(horizonCard as any, 'now').mockReturnValue(now)

      const result = horizonCard['readSunTimes'](now, 0, 0, 0)

      expect(result).toEqual({
        now: now,
        dawn: new Date('2023-04-05T06:00:00Z'),
        dusk: new Date('2023-04-05T19:00:00Z'),
        midnight: new Date('2023-04-06T00:30:00Z'),
        noon: new Date('2023-04-05T12:30:00Z'),
        sunrise: new Date('2023-04-05T06:30:00Z'),
        sunset: new Date('2023-04-05T18:30:00Z')
      })
    })

    it('returns dates for each time field when now is the next day but within 12 hours of the past noon', () => {
      const now = new Date('2023-04-06T00:20:00Z')
      jest.spyOn(horizonCard as any, 'now').mockReturnValue(now)

      const result = horizonCard['readSunTimes'](now, 0, 0, 0)

      expect(result).toEqual({
        now: now,
        dawn: new Date('2023-04-05T06:00:00Z'),
        dusk: new Date('2023-04-05T19:00:00Z'),
        midnight: new Date('2023-04-06T00:30:00Z'),
        noon: new Date('2023-04-05T12:30:00Z'),
        sunrise: new Date('2023-04-05T06:30:00Z'),
        sunset: new Date('2023-04-05T18:30:00Z')
      })
    })
  })

  describe('elevation clamping (issue #101)', () => {
    // The mock SunCalc ignores the elevation argument entirely, so it can't reproduce the NaN
    // path suncalc3 hits for a negative elevation. Delegate to the real (patched) suncalc, as
    // done above for the longitude-derived computation reference tests.
    beforeEach(() => {
      const actual = jest.requireActual('suncalc3')
      const realSunCalc = actual.default ?? actual
      jest.spyOn(SunCalcMock, 'getSunTimes')
        .mockImplementation((...args: unknown[]) => realSunCalc.getSunTimes(...args))
    })

    it('returns valid sun times for a below-sea-level elevation instead of NaN/blank', () => {
      const now = new Date('2023-04-05T13:00:00Z')
      horizonCard.hass = SaneHomeAssistant
      horizonCard.setConfig({
        type: HorizonCard.cardType, latitude: 52.1, longitude: 5.1, elevation: -2
      } as IHorizonCardConfig)
      jest.spyOn(horizonCard as any, 'now').mockReturnValue(now)

      expect(horizonCard['elevation']()).toEqual(0)

      const result = horizonCard['readSunTimes'](now, 52.1, 5.1, horizonCard['elevation']())

      expect(result.dawn).toBeDefined()
      expect(result.sunrise).toBeDefined()
      expect(result.sunset).toBeDefined()
      expect(result.dusk).toBeDefined()
    })

    it('still returns valid sun times for a normal positive elevation (no regression)', () => {
      const now = new Date('2023-04-05T13:00:00Z')
      horizonCard.hass = SaneHomeAssistant
      horizonCard.setConfig({
        type: HorizonCard.cardType, latitude: 52.1, longitude: 5.1, elevation: 10
      } as IHorizonCardConfig)
      jest.spyOn(horizonCard as any, 'now').mockReturnValue(now)

      expect(horizonCard['elevation']()).toEqual(10)

      const result = horizonCard['readSunTimes'](now, 52.1, 5.1, horizonCard['elevation']())

      expect(result.dawn).toBeDefined()
      expect(result.sunrise).toBeDefined()
      expect(result.sunset).toBeDefined()
      expect(result.dusk).toBeDefined()
    })
  })

  describe('longitude-derived computation reference', () => {
    const now = new Date('2023-04-05T13:00:00Z')

    describe('scoped (explicit longitude, no time_zone)', () => {
      beforeEach(() => {
        horizonCard.hass = SaneHomeAssistant
        horizonCard.setConfig({ type: HorizonCard.cardType, latitude: 40, longitude: 175 } as IHorizonCardConfig)
        jest.spyOn(horizonCard as any, 'now').mockReturnValue(now)
      })

      it('reads sun times from noonAtLongitude, not noonAtTimeZone', () => {
        const noonAtLongitudeSpy = jest.spyOn(HelperFunctions, 'noonAtLongitude')
        const noonAtTimeZoneSpy = jest.spyOn(HelperFunctions, 'noonAtTimeZone')

        horizonCard['readSunTimes'](now, 40, 175, 0)

        expect(noonAtLongitudeSpy).toHaveBeenCalled()
        expect(noonAtTimeZoneSpy).not.toHaveBeenCalled()
      })

      it('reads moon times from midnightAtLongitude, not midnightAtTimeZone', () => {
        const midnightAtLongitudeSpy = jest.spyOn(HelperFunctions, 'midnightAtLongitude')
        const midnightAtTimeZoneSpy = jest.spyOn(HelperFunctions, 'midnightAtTimeZone')

        horizonCard['computeMoonData'](now, 40, 175)

        expect(midnightAtLongitudeSpy).toHaveBeenCalled()
        expect(midnightAtTimeZoneSpy).not.toHaveBeenCalled()
      })
    })

    describe('non-scoped (unchanged behaviour)', () => {
      it('uses noonAtTimeZone for the HA default location (no config longitude)', () => {
        horizonCard.hass = SaneHomeAssistant
        horizonCard.setConfig({} as IHorizonCardConfig)
        jest.spyOn(horizonCard as any, 'now').mockReturnValue(now)

        const noonAtLongitudeSpy = jest.spyOn(HelperFunctions, 'noonAtLongitude')
        const noonAtTimeZoneSpy = jest.spyOn(HelperFunctions, 'noonAtTimeZone')

        horizonCard['readSunTimes'](now, 0, 0, 0)

        expect(noonAtTimeZoneSpy).toHaveBeenCalled()
        expect(noonAtLongitudeSpy).not.toHaveBeenCalled()
      })

      it('uses noonAtTimeZone when both longitude and time_zone are set', () => {
        horizonCard.hass = SaneHomeAssistant
        horizonCard.setConfig({
          type: HorizonCard.cardType, latitude: 40, longitude: 175, time_zone: 'UTC'
        } as IHorizonCardConfig)
        jest.spyOn(horizonCard as any, 'now').mockReturnValue(now)

        const noonAtLongitudeSpy = jest.spyOn(HelperFunctions, 'noonAtLongitude')
        const noonAtTimeZoneSpy = jest.spyOn(HelperFunctions, 'noonAtTimeZone')

        horizonCard['readSunTimes'](now, 40, 175, 0)

        expect(noonAtTimeZoneSpy).toHaveBeenCalled()
        expect(noonAtLongitudeSpy).not.toHaveBeenCalled()
      })

      it('uses midnightAtTimeZone for the moon when both longitude and time_zone are set', () => {
        horizonCard.hass = SaneHomeAssistant
        horizonCard.setConfig({
          type: HorizonCard.cardType, latitude: 40, longitude: 175, time_zone: 'UTC'
        } as IHorizonCardConfig)
        jest.spyOn(horizonCard as any, 'now').mockReturnValue(now)

        const midnightAtLongitudeSpy = jest.spyOn(HelperFunctions, 'midnightAtLongitude')
        const midnightAtTimeZoneSpy = jest.spyOn(HelperFunctions, 'midnightAtTimeZone')

        horizonCard['computeMoonData'](now, 40, 175)

        expect(midnightAtTimeZoneSpy).toHaveBeenCalled()
        expect(midnightAtLongitudeSpy).not.toHaveBeenCalled()
      })
    })

    it('selects a different solar day than the time zone path for a far-mismatched longitude', () => {
      // End-to-end discrimination with the real (patched) suncalc, no helper spy. A far-east
      // longitude paired with a UTC time zone puts `now` (~solar midnight) on the opposite side
      // of the solar-day boundary, so the longitude path and the time-zone path return sun times
      // for different solar days. A mild longitude would show no difference.
      const actual = jest.requireActual('suncalc3')
      const realSunCalc = actual.default ?? actual
      jest.spyOn(SunCalcMock, 'getSunTimes')
        .mockImplementation((...args: unknown[]) => realSunCalc.getSunTimes(...args))

      const solarMidnight = new Date('2023-04-05T13:00:00Z')
      const hass = {
        ...SaneHomeAssistant,
        config: { ...SaneHomeAssistant.config, time_zone: 'UTC' }
      } as any

      // Longitude path: explicit longitude, no time_zone.
      horizonCard.hass = hass
      horizonCard.setConfig({ type: HorizonCard.cardType, latitude: 40, longitude: 175 } as IHorizonCardConfig)
      jest.spyOn(horizonCard as any, 'now').mockReturnValue(solarMidnight)
      const longitudePath = horizonCard['readSunTimes'](solarMidnight, 40, 175, 0)

      // Time-zone path: same location, but an explicit UTC time_zone.
      const tzCard = new HorizonCard()
      tzCard.attachShadow({ mode: 'open' })
      tzCard.hass = hass
      tzCard.setConfig({
        type: HorizonCard.cardType, latitude: 40, longitude: 175, time_zone: 'UTC'
      } as IHorizonCardConfig)
      jest.spyOn(tzCard as any, 'now').mockReturnValue(solarMidnight)
      const tzPath = tzCard['readSunTimes'](solarMidnight, 40, 175, 0)

      expect(longitudePath.sunrise).toBeDefined()
      expect(longitudePath.sunset).toBeDefined()
      expect(tzPath.sunrise).toBeDefined()
      expect(tzPath.sunset).toBeDefined()
      expect(longitudePath.sunrise!.getTime()).not.toEqual(tzPath.sunrise!.getTime())
      expect(longitudePath.sunset!.getTime()).not.toEqual(tzPath.sunset!.getTime())
    })
  })

  describe('convertSunCalcTimes', () => {
    const sunCalcTimes = ['civilDawn', 'civilDusk', 'nadir', 'solarNoon', 'sunriseStart', 'sunsetEnd']
    const times = ['dawn', 'dusk', 'midnight', 'noon', 'sunrise', 'sunset']
    const rawSunTimes = {}
    sunCalcTimes.forEach((name) => {
      rawSunTimes[name] = {
        value: new Date(0),
        valid: true
      }
    })
    for (let i = 0; i < sunCalcTimes.length; i++) {
      const sunCalcTime = sunCalcTimes[i]
      const time = times[i]
      it(`converts SunCalc '${sunCalcTime}' time to '${time} if valid`, () => {
        jest.spyOn(horizonCard as any, 'now').mockReturnValue(new Date(1))
        const result = horizonCard['convertSunCalcTimes'](rawSunTimes)
        expect(result[time]).toEqual(new Date(0))
        expect(result['now']).toEqual(new Date(1))
      })
      it(`converts SunCalc '${sunCalcTime}' time to '${time} if invalid`, () => {
        jest.spyOn(horizonCard as any, 'now').mockReturnValue(new Date(1))
        const data = {
          ...rawSunTimes,
          [sunCalcTime]: {
            ...rawSunTimes[sunCalcTime],
            valid: false
          }
        }
        const result = horizonCard['convertSunCalcTimes'](data)
        expect(result[time]).toBeUndefined()
        expect(result['now']).toEqual(new Date(1))
      })
    }
  })

  describe('sunriseForComputation', () => {
    it('returns actual time when usable', () => {
      const noon = new Date('2023-03-18T12:20:00Z')
      const sunrise = new Date('2023-03-18T06:30:00Z')

      const result = horizonCard['sunriseForComputation'](sunrise, noon, false)

      expect(result).toEqual(new Date('2023-03-18T06:30:00Z'))
    })

    it('returns 12 hours before noon when undefined above horizon', () => {
      const noon = new Date('2023-03-18T12:20:00Z')
      const sunrise = undefined

      const result = horizonCard['sunriseForComputation'](sunrise, noon, false)

      expect(result).toEqual(new Date('2023-03-18T00:20:00Z'))
    })

    it('returns noon when undefined below horizon', () => {
      const noon = new Date('2023-03-18T12:20:00Z')
      const sunrise = undefined

      const result = horizonCard['sunriseForComputation'](sunrise, noon, true)

      expect(result).toEqual(new Date('2023-03-18T12:20:00Z'))
    })
  })

  describe('calculateStatePartial and calculateStateFinal', () => {
    const expectedPartial: THorizonCardData = {
      partial: true,
      latitude: 33,
      longitude: 20,
      sunData: {
        azimuth: 180,
        elevation: 45,
        times: {
          dawn: new Date('2023-04-05T06:00:00.000Z'),
          dusk: new Date('2023-04-05T19:00:00.000Z'),
          midnight: new Date('2023-04-06T00:30:00.000Z'),
          noon: new Date('2023-04-05T12:30:00.000Z'),
          now: new Date('2023-04-05T13:00:00.000Z'),
          sunrise: new Date('2023-04-05T06:30:00.000Z'),
          sunset: new Date('2023-04-05T18:30:00.000Z'),
        },
        hueReduce: 0,
        saturationReduce: 0,
        lightnessReduce: 0
      },
      sunPosition: {
        x: 80,
        y: 100,
        horizonY: 100,
        offsetY: 0,
        scaleY: 0.7875,
        sunriseX: 80,
        sunsetX: 80
      },
      moonData: {
        zenithAngle: -90,
        parallacticAngle: 10,
        azimuth: 270,
        elevation: 90,
        fraction: 1,
        phase: Constants.MOON_PHASES.fullMoon,
        phaseRotation: -45,
        times: {
          moonrise: new Date('2023-04-05T13:00:00.000Z'),
          moonset: new Date('2023-04-05T22:00:00.000Z'),
          now: new Date('2023-04-05T13:00:00.000Z'),
        },
        saturationReduce: 0,
        lightnessReduce: 0
      },
      moonPosition: {
        x: 403,
        y: 28.875
      }
    }

    beforeEach(() => {
      const path = new SVGPathElement(80, 100)
      jest.spyOn((horizonCard as any).shadowRoot, 'querySelector').mockReturnValue(path)

      jest.spyOn(horizonCard as any, 'now').mockReturnValue(new Date('2023-04-05T13:00:00Z'))
      jest.spyOn(horizonCard as any, 'latitude').mockReturnValue(33)
      jest.spyOn(horizonCard as any, 'longitude').mockReturnValue(20)
      jest.spyOn(horizonCard as any, 'elevation').mockReturnValue(500)

      horizonCard.hass = SaneHomeAssistant
    })

    it('calculateStatePartial', () => {
      horizonCard.setConfig({
        southern_flip: false
      } as IHorizonCardConfig)
      horizonCard['calculateStatePartial']()
      const result = horizonCard['data']

      expect(result).toEqual(expectedPartial)
    })

    it('calculateStateFinal', () => {
      horizonCard['data'] = expectedPartial
      horizonCard['calculateStateFinal']()
      const result = horizonCard['data']

      const expectedFinal = {
        ...expectedPartial,
        partial: false,
        sunPosition: {
          ...expectedPartial['sunPosition'],
          offsetY: -16
        }
      }
      expect(result).toEqual(expectedFinal)
    })
  })

  describe('computeSunPosition', () => {
    const mockPointOnCurve = (times) => {
      // Very rough approximation of findPointOnCurve without the real curve inside a real SVGPathElement
      return (time, noon) => {
        if (time === noon) {
          return {x: 275, y: 20}
        } else if (time === times.sunrise) {
          return {x: 135, y: 84}
        } else if (time === times.sunset) {
          return {x: 405, y: 84}
        } else if (time === times.now) {
          return {x: 300, y: 30}
        } else if (time.getTime() === noon.getTime() - 12 * 60 * 60 * 1000) {
          // mock sunrise for computation in white nights, 12 hours before solar noon
          return {x: 5, y: 146}
        } else {
          throw new Error()
        }
      }
    }

    it('computes the sun position when all times are available', () => {
      const sunTimes = {
        dawn: new Date('2023-04-05T06:00:00.000Z'),
        dusk: new Date('2023-04-05T19:00:00.000Z'),
        midnight: new Date('2023-04-06T00:30:00.000Z'),
        noon: new Date('2023-04-05T12:30:00.000Z'),
        now: new Date('2023-04-05T13:00:00.000Z'),
        sunrise: new Date('2023-04-05T06:30:00.000Z'),
        sunset: new Date('2023-04-05T18:30:00.000Z'),
      } as TSunTimes

      jest.spyOn(horizonCard as any, 'findPointOnCurve').mockImplementation(mockPointOnCurve(sunTimes))

      const expected = {
        horizonY: 84,
        offsetY: 0,
        scaleY: 0.984375,
        sunriseX: 135,
        sunsetX: 405,
        x: 300,
        y: 30
      }

      const sunPosition = horizonCard['computeSunPosition'](sunTimes, false)
      expect(sunPosition).toEqual(expected)

      const expectedWithScale = expected
      const sunPositionWithScale = horizonCard['computeSunPosition'](sunTimes, false, expected.scaleY)
      expect(sunPositionWithScale).toEqual(expectedWithScale)
    })

    it('computes the sun position in white nights season and returns hidden sunset/sunrise', () => {
      const sunTimes = {
        midnight: new Date('2023-07-06T00:30:00.000Z'),
        noon: new Date('2023-07-05T12:30:00.000Z'),
        now: new Date('2023-07-05T13:00:00.000Z'),
      } as TSunTimes

      jest.spyOn(horizonCard as any, 'findPointOnCurve').mockImplementation(mockPointOnCurve(sunTimes))

      const expected = {
        horizonY: 146,
        offsetY: 0,
        scaleY: 0.5,
        sunriseX: -10,
        sunsetX: -10,
        x: 300,
        y: 30
      }

      const sunPosition = horizonCard['computeSunPosition'](sunTimes, false)
      expect(sunPosition).toEqual(expected)

      const expectedWithScale = {
        ...expected,
        offsetY: -62
      }
      const sunPositionWithScale = horizonCard['computeSunPosition'](sunTimes, false, expected.scaleY)
      expect(sunPositionWithScale).toEqual(expectedWithScale)
    })

    it('computes the sun position in winter darkness season and returns hidden sunset/sunrise', () => {
      const path = new SVGPathElement(80, 100)
      jest.spyOn((horizonCard as any).shadowRoot, 'querySelector').mockReturnValue(path)

      const sunTimes = {
        midnight: new Date('2023-12-06T00:30:00.000Z'),
        noon: new Date('2023-12-05T12:30:00.000Z'),
        now: new Date('2023-12-05T13:00:00.000Z'),
      } as TSunTimes

      jest.spyOn(horizonCard as any, 'findPointOnCurve').mockImplementation(mockPointOnCurve(sunTimes))

      const expected = {
        horizonY: 20,
        offsetY: 0,
        scaleY: 0.5,
        sunriseX: -10,
        sunsetX: -10,
        x: 300,
        y: 30
      }

      const sunPosition = horizonCard['computeSunPosition'](sunTimes, true)
      expect(sunPosition).toEqual(expected)

      const expectedWithScale = {
        ...expected,
        offsetY: 64
      }
      const sunPositionWithScale = horizonCard['computeSunPosition'](sunTimes, true, expected.scaleY)
      expect(sunPositionWithScale).toEqual(expectedWithScale)
    })
  })

  describe('isWinterDarkness', () => {
    it('returns true if north of the equator and month is between October and February', () => {
      expect(horizonCard['isWinterDarkness'](1, new Date('2022-10-15T00:00:00Z'))).toEqual(true)
      expect(horizonCard['isWinterDarkness'](1, new Date('2022-11-15T00:00:00Z'))).toEqual(true)
      expect(horizonCard['isWinterDarkness'](1, new Date('2022-12-15T00:00:00Z'))).toEqual(true)
      expect(horizonCard['isWinterDarkness'](1, new Date('2023-01-15T00:00:00Z'))).toEqual(true)
      expect(horizonCard['isWinterDarkness'](1, new Date('2023-02-15T00:00:00Z'))).toEqual(true)
    })

    it('returns false if north of the equator and month is between March and September', () => {
      expect(horizonCard['isWinterDarkness'](1, new Date('2023-03-15T00:00:00Z'))).toEqual(false)
      expect(horizonCard['isWinterDarkness'](1, new Date('2023-04-15T00:00:00Z'))).toEqual(false)
      expect(horizonCard['isWinterDarkness'](1, new Date('2023-05-15T00:00:00Z'))).toEqual(false)
      expect(horizonCard['isWinterDarkness'](1, new Date('2023-06-15T00:00:00Z'))).toEqual(false)
      expect(horizonCard['isWinterDarkness'](1, new Date('2023-07-15T00:00:00Z'))).toEqual(false)
      expect(horizonCard['isWinterDarkness'](1, new Date('2023-08-15T00:00:00Z'))).toEqual(false)
      expect(horizonCard['isWinterDarkness'](1, new Date('2023-09-15T00:00:00Z'))).toEqual(false)
    })

    it('returns false if south of the equator and month is between October and February', () => {
      expect(horizonCard['isWinterDarkness'](-1, new Date('2022-10-15T00:00:00Z'))).toEqual(false)
      expect(horizonCard['isWinterDarkness'](-1, new Date('2022-11-15T00:00:00Z'))).toEqual(false)
      expect(horizonCard['isWinterDarkness'](-1, new Date('2022-12-15T00:00:00Z'))).toEqual(false)
      expect(horizonCard['isWinterDarkness'](-1, new Date('2023-01-15T00:00:00Z'))).toEqual(false)
      expect(horizonCard['isWinterDarkness'](-1, new Date('2023-02-15T00:00:00Z'))).toEqual(false)
    })

    it('returns true if south of the equator and month is between March and September', () => {
      expect(horizonCard['isWinterDarkness'](-1, new Date('2023-03-15T00:00:00Z'))).toEqual(true)
      expect(horizonCard['isWinterDarkness'](-1, new Date('2023-04-15T00:00:00Z'))).toEqual(true)
      expect(horizonCard['isWinterDarkness'](-1, new Date('2023-05-15T00:00:00Z'))).toEqual(true)
      expect(horizonCard['isWinterDarkness'](-1, new Date('2023-06-15T00:00:00Z'))).toEqual(true)
      expect(horizonCard['isWinterDarkness'](-1, new Date('2023-07-15T00:00:00Z'))).toEqual(true)
      expect(horizonCard['isWinterDarkness'](-1, new Date('2023-08-15T00:00:00Z'))).toEqual(true)
      expect(horizonCard['isWinterDarkness'](-1, new Date('2023-09-15T00:00:00Z'))).toEqual(true)
    })
  })

  describe('computeMoonData', () => {
    beforeEach(() => {
      horizonCard.hass = SaneHomeAssistant
      horizonCard.setConfig({} as IHorizonCardConfig)
    })

    it('returns moonrise and moonset times when available', () => {
      const moonData = horizonCard['computeMoonData'](new Date('2023-04-05T14:00:00Z'), 40, 20)
      expect(moonData.times.moonrise).toEqual(new Date('2023-04-05T13:00:00.000Z'))
      expect(moonData.times.moonset).toEqual(new Date('2023-04-05T22:00:00.000Z'))
    })

    it('returns undefined moonrise and moonset when not available', () => {
      SunCalcMock.setUndefinedMoonTimes(true)
      try {
        const moonData = horizonCard['computeMoonData'](new Date('2023-04-05T14:00:00Z'), 40, 20)
        expect(moonData.times.moonrise).toBeUndefined()
        expect(moonData.times.moonset).toBeUndefined()
      } finally {
        SunCalcMock.setUndefinedMoonTimes(false)
      }
    })

    it('uses moon_phase_rotation from config', () => {
      horizonCard.setConfig({
        moon_phase_rotation: 0
      } as IHorizonCardConfig)
      const moonData = horizonCard['computeMoonData'](new Date('2023-04-05T14:00:00Z'), 40, 20)
      expect(moonData.phaseRotation).toEqual(0)
    })
  })

  describe('computeMoonPosition', () => {
    beforeEach(() => {
      horizonCard.setConfig({
        southern_flip: false
      } as IHorizonCardConfig)
    })

    it('moon at 0 azimuth and 0 elevation', () => {
      const moonData = {
        azimuth: 0,
        elevation: 0
      } as TMoonData
      const result = horizonCard['computeMoonPosition'](moonData)
      expect(result).toEqual({x: 19, y: 84})
    })

    it('moon at 0 azimuth and 0.1 elevation', () => {
      const moonData = {
        azimuth: 0,
        elevation: 0.1
      } as TMoonData
      const result = horizonCard['computeMoonPosition'](moonData)
      expect(result.x).toEqual(19)
      expect(result.y).toBeCloseTo(83.107, 2)
    })

    it('moon at 30 azimuth and 1 elevation', () => {
      const moonData = {
        azimuth: 30,
        elevation: 1
      } as TMoonData
      const result = horizonCard['computeMoonPosition'](moonData)
      expect(result.x).toBeCloseTo(61.667)
      expect(result.y).toBeCloseTo(76.586, 2)
    })

    it('moon at 120 azimuth and -1 elevation', () => {
      const moonData = {
        azimuth: 120,
        elevation: -1
      } as TMoonData
      const result = horizonCard['computeMoonPosition'](moonData)
      expect(result.x).toBeCloseTo(189.667)
      expect(result.y).toBeCloseTo(91.413, 2)
    })

    it('moon at 90 azimuth and 90 elevation', () => {
      const moonData = {
        azimuth: 90,
        elevation: 90
      } as TMoonData
      const result = horizonCard['computeMoonPosition'](moonData)
      expect(result).toEqual({x: 147, y: 14})
    })

    it('moon at 180 azimuth and 60 elevation', () => {
      const moonData = {
        azimuth: 180,
        elevation: 60
      } as TMoonData
      const result = horizonCard['computeMoonPosition'](moonData)
      expect(result.x).toEqual(275)
      expect(result.y).toBeCloseTo(21.215, 2)
    })

    it('moon at 270 azimuth and -60 elevation', () => {
      const moonData = {
        azimuth: 270,
        elevation: -60
      } as TMoonData
      const result = horizonCard['computeMoonPosition'](moonData)
      expect(result.x).toEqual(403)
      expect(result.y).toBeCloseTo(146.784, 2)
    })

    it('moon at nearly 360 azimuth and -90 elevation', () => {
      const moonData = {
        azimuth: 359.999,
        elevation: -90
      } as TMoonData
      const result = horizonCard['computeMoonPosition'](moonData)
      expect(result.x).toBeCloseTo(531, 2)
      expect(result.y).toEqual(154)
    })

    it('moon at 180 azimuth and 60 elevation with southern flip', () => {
      horizonCard.setConfig({
        southern_flip: true
      } as IHorizonCardConfig)
      const moonData = {
        azimuth: 180,
        elevation: 60
      } as TMoonData
      const result = horizonCard['computeMoonPosition'](moonData)
      expect(result.x).toEqual(275)
      expect(result.y).toBeCloseTo(21.215, 2)
    })

    it('moon at 45 azimuth and 90 elevation with southern flip', () => {
      horizonCard.setConfig({
        southern_flip: true
      } as IHorizonCardConfig)
      const moonData = {
        azimuth: 45,
        elevation: 90
      } as TMoonData
      const result = horizonCard['computeMoonPosition'](moonData)
      expect(result.x).toEqual(467)
      expect(result.y).toEqual(14)
    })

    it('moon at 270 azimuth and 90 elevation with winter scaleY compression', () => {
      const moonData = {
        azimuth: 270,
        elevation: 90
      } as TMoonData
      const result = horizonCard['computeMoonPosition'](moonData, 0.5)
      expect(result.x).toEqual(403)
      expect(result.y).toEqual(49)
    })
  })

  describe('get styles', () => {
    it('returns a CSSResult', () => {
      expect(HorizonCard.styles).toBeInstanceOf(CSSResult)
    })
  })
})
