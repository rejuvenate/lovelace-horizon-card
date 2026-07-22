import { NumberFormat, TimeFormat } from 'custom-card-helpers'

import {Constants} from '../../../src/constants'
import { HelperFunctions } from '../../../src/utils/HelperFunctions'
import { I18N } from '../../../src/utils/I18N'
import { TemplateResultTestHelper } from '../../helpers/TestHelpers'

describe('HelperFunctions', () => {
  const i18n = new I18N('en', 'UTC', TimeFormat.language, NumberFormat.language)

  describe('renderFieldElement', () => {
    it('returns a field element template when the provided value is undefined', async () => {
      const renderFun = () => HelperFunctions.renderFieldElement(i18n, 'sunrise', undefined)

      const html = await TemplateResultTestHelper.renderFunction(renderFun)

      expect(html).toMatchSnapshot()
    })

    it('returns a field element template when the provided value is a date for 24h clock', async () => {
      const i18n = new I18N('en', 'UTC', TimeFormat.twenty_four, NumberFormat.language)

      const date = new Date('2021-06-07T21:37:17.812Z')

      const renderFun = () => HelperFunctions.renderFieldElement(i18n, 'sunrise', date)

      const html = await TemplateResultTestHelper.renderFunction(renderFun)

      expect(html).toMatchSnapshot()
    })

    it('returns a field element template when the provided value is a date for 12h clock with post-am/pm', async () => {
      const i18n = new I18N('en', 'UTC', TimeFormat.am_pm, NumberFormat.language)

      const date = new Date('2021-06-07T21:37:17.812Z')

      const renderFun = () => HelperFunctions.renderFieldElement(i18n, 'sunrise', date)

      const html = await TemplateResultTestHelper.renderFunction(renderFun)

      expect(html).toMatchSnapshot()
    })

    it('returns a field element template when the provided value is a date for 12 clock with pre-am/pm', async () => {
      const i18n = new I18N('tr', 'UTC', TimeFormat.am_pm, NumberFormat.language)

      const date = new Date('2021-06-07T21:37:17.812Z')

      const renderFun = () => HelperFunctions.renderFieldElement(i18n, 'sunrise', date)

      const html = await TemplateResultTestHelper.renderFunction(renderFun)

      expect(html).toMatchSnapshot()
    })

    it('returns a field element template when the provided value is a string', async () => {
      const renderFun = () => HelperFunctions.renderFieldElement(i18n, 'sunrise', 'test')

      const html = await TemplateResultTestHelper.renderFunction(renderFun)

      expect(html).toMatchSnapshot()
    })

    it('returns a field element template when the provided value is a number', async () => {
      const renderFun = () => HelperFunctions.renderFieldElement(i18n, 'sunrise', 9)

      const html = await TemplateResultTestHelper.renderFunction(renderFun)

      expect(html).toMatchSnapshot()
    })

    it('renders the moon phase name in the card language (English)', async () => {
      const renderFun = () => HelperFunctions.renderMoonElement(i18n, Constants.MOON_PHASES.fullMoon, 0)

      const html = await TemplateResultTestHelper.renderFunction(renderFun)

      expect(html).toMatchSnapshot()
    })

    it('renders the moon phase name translated in the card language', async () => {
      const deI18n = new I18N('de', 'UTC', TimeFormat.language, NumberFormat.language)
      const renderFun = () => HelperFunctions.renderMoonElement(deI18n, Constants.MOON_PHASES.fullMoon, 0)

      const html = await TemplateResultTestHelper.renderFunction(renderFun)

      expect(html).toMatchSnapshot()
    })
  })

  describe('isValidLanguage', () => {
    it('returns true the provided language is supported', () => {
      const result = HelperFunctions.isValidLanguage('es')
      expect(result).toBe(true)
    })

    it('returns false the provided language is not supported', () => {
      const result = HelperFunctions.isValidLanguage('notSupported')
      expect(result).toBe(false)
    })
  })

  describe('clamp', () => {
    it('returns the correct value when min and max have the same value', () => {
      const result = HelperFunctions.clamp(50, 50, 20)
      expect(result).toBe(50)
    })

    it('throws an error when min is greater than max', () => {
      let resultError
      try {
        HelperFunctions.clamp(50, 0, 20)
      } catch (error) {
        resultError = error
      }

      expect(resultError).toBeDefined()
      expect(resultError.name).toBe('RangeError')
      expect(resultError.message).toBe('Min value can not be bigger than the max value')
    })

    it('returns the correct value when the value is between min and max', () => {
      const result = HelperFunctions.clamp(0, 50, 20)
      expect(result).toBe(20)
    })

    it('returns the correct value when the value is lower than min', () => {
      const result = HelperFunctions.clamp(40, 50, 20)
      expect(result).toBe(40)
    })

    it('returns the correct value when the value is higher than max', () => {
      const result = HelperFunctions.clamp(40, 50, 60)
      expect(result).toBe(50)
    })
  })

  describe('noonAtTimeZone', () => {
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

    it('returns noon in the requested time zone', () => {
      const date = new Date('2023-04-13T23:10:45.532Z')
      const result = HelperFunctions.noonAtTimeZone(date, 'Europe/Sofia')

      expect(result).toEqual(new Date('2023-04-14T12:00:00+03:00'))
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('returns noon in local timezone if an error occurs', () => {
      const date = new Date('2023-04-13T23:10:45.532Z')
      const result = HelperFunctions.noonAtTimeZone(date, 'Europe/XXX')

      // We can only verify the time - the date will be +/- 1 according to the actual time zone
      expect(result.getHours()).toEqual(12)
      expect(result.getMinutes()).toEqual(0)
      expect(result.getSeconds()).toEqual(0)
      expect(result.getMilliseconds()).toEqual(0)
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('midnightAtTimeZone', () => {
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

    it('returns midnight in the requested time zone', () => {
      const date = new Date('2023-04-13T23:10:45.532Z')
      const result = HelperFunctions.midnightAtTimeZone(date, 'Europe/Sofia')

      expect(result).toEqual(new Date('2023-04-14T00:00:00+03:00'))
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('returns midnight in local timezone if an error occurs', () => {
      const date = new Date('2023-04-13T23:10:45.532Z')
      const result = HelperFunctions.midnightAtTimeZone(date, 'Europe/XXX')

      // We can only verify the time - the date will be +/- 1 according to the actual time zone
      expect(result.getHours()).toEqual(0)
      expect(result.getMinutes()).toEqual(0)
      expect(result.getSeconds()).toEqual(0)
      expect(result.getMilliseconds()).toEqual(0)
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('noonAtLongitude', () => {
    // Mean-solar-time reference: 15°/h, east positive, DST-free. Reference chosen at UTC noon so
    // the solar day for 0/±90 does not shift, while ±180 lands on the adjacent solar day.
    const date = new Date('2023-04-14T12:00:00.000Z')

    it('returns solar noon at the prime meridian equal to UTC noon', () => {
      const result = HelperFunctions.noonAtLongitude(date, 0)
      expect(result).toEqual(new Date('2023-04-14T12:00:00.000Z'))
      expect(result).toEqual(HelperFunctions.noonAtTimeZone(date, 'UTC'))
    })

    it('returns solar noon shifted 6 hours earlier at 90° east', () => {
      const result = HelperFunctions.noonAtLongitude(date, 90)
      expect(result).toEqual(new Date('2023-04-14T06:00:00.000Z'))
    })

    it('returns solar noon shifted 6 hours later at 90° west', () => {
      const result = HelperFunctions.noonAtLongitude(date, -90)
      expect(result).toEqual(new Date('2023-04-14T18:00:00.000Z'))
    })

    it('returns solar noon on the adjacent solar day at the antimeridian', () => {
      const east = HelperFunctions.noonAtLongitude(date, 180)
      const west = HelperFunctions.noonAtLongitude(date, -180)
      expect(east).toEqual(new Date('2023-04-15T00:00:00.000Z'))
      expect(west).toEqual(new Date('2023-04-15T00:00:00.000Z'))
    })
  })

  describe('midnightAtLongitude', () => {
    const date = new Date('2023-04-14T12:00:00.000Z')

    it('returns solar midnight at the prime meridian equal to UTC midnight', () => {
      const result = HelperFunctions.midnightAtLongitude(date, 0)
      expect(result).toEqual(new Date('2023-04-14T00:00:00.000Z'))
      expect(result).toEqual(HelperFunctions.midnightAtTimeZone(date, 'UTC'))
    })

    it('returns solar midnight shifted 6 hours earlier at 90° east', () => {
      const result = HelperFunctions.midnightAtLongitude(date, 90)
      expect(result).toEqual(new Date('2023-04-13T18:00:00.000Z'))
    })

    it('returns solar midnight shifted 6 hours later at 90° west', () => {
      const result = HelperFunctions.midnightAtLongitude(date, -90)
      expect(result).toEqual(new Date('2023-04-14T06:00:00.000Z'))
    })

    it('returns solar midnight on the adjacent solar day at the antimeridian', () => {
      const east = HelperFunctions.midnightAtLongitude(date, 180)
      const west = HelperFunctions.midnightAtLongitude(date, -180)
      expect(east).toEqual(new Date('2023-04-14T12:00:00.000Z'))
      expect(west).toEqual(new Date('2023-04-14T12:00:00.000Z'))
    })
  })

  describe('parseMarkerTime', () => {
    const reference = new Date('2023-04-13T12:00:00Z')

    it('parses a local HH:MM time onto the reference day', () => {
      const result = HelperFunctions.parseMarkerTime('06:30', reference)
      expect(result?.getHours()).toBe(6)
      expect(result?.getMinutes()).toBe(30)
      expect(result?.getFullYear()).toBe(reference.getFullYear())
      expect(result?.getDate()).toBe(reference.getDate())
    })

    it('parses a full ISO timestamp', () => {
      const result = HelperFunctions.parseMarkerTime('2023-04-13T09:30:00Z', reference)
      expect(result).toEqual(new Date('2023-04-13T09:30:00Z'))
    })

    it('returns undefined for values it cannot parse', () => {
      expect(HelperFunctions.parseMarkerTime('nonsense', reference)).toBeUndefined()
      expect(HelperFunctions.parseMarkerTime('25:00', reference)).toBeUndefined()
      expect(HelperFunctions.parseMarkerTime('12:60', reference)).toBeUndefined()
    })
  })
})
