import { NumberFormat, TimeFormat } from 'custom-card-helpers'

import { Constants } from '../../../src/constants'
import { I18N } from '../../../src/utils/I18N'

describe('I18N', () => {
  const localize = (key) => key
  describe('constructor', () => {
    it('initializes localization correctly', () => {
      const language = 'es'
      const i18n = new I18N(language, 'UTC', TimeFormat.am_pm, NumberFormat.language, localize)
      expect(i18n['localization']).toEqual(Constants.LOCALIZATION_LANGUAGES[language])
    })

    it('initializes localization correctly for language variant', () => {
      const language = 'es-419'
      const i18n = new I18N(language, 'UTC', TimeFormat.am_pm, NumberFormat.language, localize)
      expect(i18n['localization']).toEqual(Constants.LOCALIZATION_LANGUAGES['es'])
    })

    it('initializes date formatter correctly when time_format is set to language', () => {
      const language = 'es'
      const i18n = new I18N(language, 'UTC', TimeFormat.language, NumberFormat.language, localize)

      const resolvedOptions = i18n['dateFormatter'].resolvedOptions()
      expect(resolvedOptions.hour12).toEqual(false)
      expect(resolvedOptions.locale).toEqual('es-u-hc-h23')
      expect(resolvedOptions.timeZone).toEqual('UTC')
    })

    it('initializes date formatter correctly when time_format is set to 12h', () => {
      const language = 'es'
      const i18n = new I18N(language, 'UTC', TimeFormat.am_pm, NumberFormat.language, localize)

      const resolvedOptions = i18n['dateFormatter'].resolvedOptions()
      expect(resolvedOptions.hour12).toEqual(true)
      expect(resolvedOptions.locale).toEqual('es')
      expect(resolvedOptions.timeZone).toEqual('UTC')
    })

    it('initializes date formatter correctly when time_format is set to 24h', () => {
      const language = 'en'
      const i18n = new I18N(language, 'UTC', TimeFormat.twenty_four, NumberFormat.language, localize)

      const resolvedOptions = i18n['dateFormatter'].resolvedOptions()
      expect(resolvedOptions.hour12).toEqual(false)
      expect(resolvedOptions.locale).toEqual('en-u-hc-h23')
      expect(resolvedOptions.timeZone).toEqual('UTC')
    })
  })

  describe('formatDateAsTime', () => {
    // Tests generated from languages and options available, new languages may require regex tweaking
    const languages = Object.keys(Constants.LOCALIZATION_LANGUAGES)
    for (const language of languages) {
      for (const timeFormat of [TimeFormat.language, TimeFormat.system, TimeFormat.twenty_four, TimeFormat.am_pm]) {
        it(`formats time correctly with different languages and settings [${language}][${timeFormat}]`, () => {
          const i18n = new I18N(language, 'UTC', timeFormat, NumberFormat.language, localize)
          const date = new Date('2023-04-13T00:35:46.789Z')
          const result = i18n.formatDateAsTime(date)
          const timeRegex = /0?0[:.]35|12[:.]35/
          expect(result).toMatch(timeRegex)
        })
      }
      it(`formats time correctly with different languages for 12h vs 24h clock [${language}]`, () => {
        const date = new Date()
        const i18n_12 = new I18N(language, 'UTC', TimeFormat.am_pm, NumberFormat.language, localize)
        const i18n_24 = new I18N(language, 'UTC', TimeFormat.twenty_four, NumberFormat.language, localize)
        const result_12 = i18n_12.formatDateAsTime(date)
        const result_24 = i18n_24.formatDateAsTime(date)
        expect(result_12).not.toEqual(result_24)
        const timeRegex = /^\d{1,2}[:.]\d{2}$/
        expect(result_24).toMatch(timeRegex)
      })
    }
  })

  describe('formatDecimal', () => {
    // Tests generated from languages and options available
    const languages = Object.keys(Constants.LOCALIZATION_LANGUAGES)
    for (const language of languages) {
      for (const numberFormat of [NumberFormat.language, NumberFormat.system, NumberFormat.none,
        NumberFormat.comma_decimal, NumberFormat.decimal_comma, NumberFormat.space_comma]) {
        it(`formats decimals correctly with different languages and settings [${language}][${numberFormat}]`, () => {
          const i18n = new I18N(language, 'UTC', TimeFormat.language, numberFormat, localize)
          const decimal = 123.45
          const result = i18n.formatDecimal(decimal)
          const timeRegex = /123[,.]45/g
          expect(result).toMatch(timeRegex)
        })
      }
      it(`formats decimals correctly with different languages for decimal point vs decimal comma [${language}]`, () => {
        const decimal = 123.45
        const i18n_point = new I18N(language, 'UTC', TimeFormat.language, NumberFormat.comma_decimal, localize)
        const i18n_comma = new I18N(language, 'UTC', TimeFormat.language, NumberFormat.decimal_comma, localize)
        const result_point = i18n_point.formatDecimal(decimal)
        const result_comma = i18n_comma.formatDecimal(decimal)
        expect(result_point).toEqual('123.45')
        expect(result_comma).toEqual('123,45')
      })
    }
  })

  describe('tr', () => {
    const languages = Object.keys(Constants.LOCALIZATION_LANGUAGES)
    for (const language of languages) {
      it(`translates correctly each language with simple translation keys [${language}]`, () => {
        const translationKey = 'sunrise'
        const i18n = new I18N(language, 'UTC', TimeFormat.language, NumberFormat.language, localize)
        const result = i18n.tr(translationKey)
        expect(result).toEqual(Constants.LOCALIZATION_LANGUAGES[language][translationKey])
      })
    }

    // for (const language of languages) {
    //   it(`translates correctly each language with compound translation keys [${language}]`, () => {
    //     const translationKey = 'errors.SunIntegrationNotFound'
    //     const i18n = new I18N(language, 'UTC', TimeFormat.language, NumberFormat.language, localize)
    //     const result = i18n.tr(translationKey)
    //     expect(result).toEqual(Constants.LOCALIZATION_LANGUAGES[language]['errors']['SunIntegrationNotFound'])
    //   })
    // }

    it('returns an error message when a translation key is not found', () => {
      const language = 'es'
      const translationKey = 'notExistingTranslationKey'
      const i18n = new I18N(language, 'UTC', TimeFormat.language, NumberFormat.language, localize)
      const result = i18n.tr(translationKey)
      expect(result).toEqual(`Translation key '${translationKey}' doesn't have a valid translation`)
    })

    it('uses the fallback localization when there is no localization set', () => {
      const language = 'xx'
      const translationKey = 'sunrise'
      const i18n = new I18N(language, 'UTC', TimeFormat.language, NumberFormat.language, localize)

      const result = i18n.tr(translationKey)
      expect(result).toEqual(Constants.FALLBACK_LOCALIZATION[translationKey])
    })
  })

  describe('localize', () => {
    it('calls localize function', () => {
      const localizeFunc = (key) => `${key}.localized`
      const i18n = new I18N('en', 'UTC', TimeFormat.language, NumberFormat.language, localizeFunc)

      expect(i18n.localize('test1')).toEqual('test1.localized')
      expect(i18n.localize('test2')).toEqual('test2.localized')
    })
  })
})
