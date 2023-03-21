import { HelperFunctions } from '../../../src/utils/HelperFunctions'
import { I18N } from '../../../src/utils/I18N'
import { CustomSnapshotSerializer, TemplateResultTestHelper } from '../../helpers/TestHelpers'

jest.mock('../../../src/utils/I18N', () => require('../../mocks/I18N'))

expect.addSnapshotSerializer(new CustomSnapshotSerializer())

describe('HelperFunctions', () => {
  describe('nothing', () => {
    it('returns an empty template result', async () => {
      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof HelperFunctions.nothing>
      element.templateResultFunction = HelperFunctions.nothing
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })
  })

  describe('renderFieldElement', () => {
    it('returns a field element template when the provided value is undefined', async () => {
      const i18 = new I18N('es', false)

      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof HelperFunctions.renderFieldElement>
      element.templateResultFunction = HelperFunctions.renderFieldElement
      element.templateResultFunctionData = [i18, 'sunrise', undefined]
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it('returns a field element template when the provided value is a date', async () => {
      const i18 = new I18N('es', false)
      const date = new Date('2021-06-07T01:37:17.812Z')

      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof HelperFunctions.renderFieldElement>
      element.templateResultFunction = HelperFunctions.renderFieldElement
      element.templateResultFunctionData = [i18, 'sunrise', date]
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it('returns a field element template when the provided value is a string', async () => {
      const i18 = new I18N('es', false)

      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof HelperFunctions.renderFieldElement>
      element.templateResultFunction = HelperFunctions.renderFieldElement
      element.templateResultFunctionData = [i18, 'sunrise', 'test']
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
    })

    it('returns a field element template when the provided value is a number', async () => {
      const i18 = new I18N('es', false)

      const element = window.document.createElement('test-element') as TemplateResultTestHelper<typeof HelperFunctions.renderFieldElement>
      element.templateResultFunction = HelperFunctions.renderFieldElement
      element.templateResultFunctionData = [i18, 'sunrise', 9]
      window.document.body.appendChild(element)
      await element.updateComplete

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot()
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

  describe('startOfDay', () => {
    it('returns the beginning of the day for the provided now', () => {
      const result = HelperFunctions.startOfDay(new Date(0))
      expect(result.getHours()).toBe(0)
      expect(result.getMinutes()).toBe(0)
      expect(result.getSeconds()).toBe(0)
      expect(result.getMilliseconds()).toBe(0)
    })
  })

  describe('endOfDay', () => {
    it('returns the end of the day for the provided now', () => {
      const result = HelperFunctions.endOfDay(new Date(0))
      expect(result.getHours()).toBe(23)
      expect(result.getMinutes()).toBe(59)
      expect(result.getSeconds()).toBe(59)
      expect(result.getMilliseconds()).toBe(999)
    })
  })

  describe('findSectionPosition', () => {
    it('returns the correct section position when it has just started', () => {
      const timeSinceSectionStarted = 0
      const timeWhenSectionFinishes = 400
      const sectionSize = 150
      const result = HelperFunctions.findSectionPosition(timeSinceSectionStarted, timeWhenSectionFinishes, sectionSize)
      expect(result).toBe(0)
    })

    it('returns the correct section position when it has just finished', () => {
      const timeSinceSectionStarted = 400
      const timeWhenSectionFinishes = 400
      const sectionSize = 150
      const result = HelperFunctions.findSectionPosition(timeSinceSectionStarted, timeWhenSectionFinishes, sectionSize)
      expect(result).toBe(150)
    })

    it('returns the correct section position when it has finished', () => {
      const timeSinceSectionStarted = 600
      const timeWhenSectionFinishes = 400
      const sectionSize = 150
      const result = HelperFunctions.findSectionPosition(timeSinceSectionStarted, timeWhenSectionFinishes, sectionSize)
      expect(result).toBe(150)
    })
  })

  describe('findSunProgress', () => {
    it('returns the correct sun progress when the sun position is lower than the start position', () => {
      const sunPosition = 0
      const startPosition = 50
      const endPosition = 100
      const result = HelperFunctions.findSunProgress(sunPosition, startPosition, endPosition)
      expect(result).toBe(0)
    })

    it('returns the correct sun progress when the sun position is higher than the end position', () => {
      const sunPosition = 200
      const startPosition = 0
      const endPosition = 50
      const result = HelperFunctions.findSunProgress(sunPosition, startPosition, endPosition)
      expect(result).toBe(100)
    })

    it('returns the correct sun progress when the sun position is between the start and the end position', () => {
      const sunPosition = 20
      const startPosition = 0
      const endPosition = 100
      const result = HelperFunctions.findSunProgress(sunPosition, startPosition, endPosition)
      expect(result).toBe(20)
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
})
