import { formatNumber, FrontendLocaleData, LocalizeFunc, NumberFormat, TimeFormat } from 'custom-card-helpers'

import { Constants } from '../constants'
import { THorizonCardI18NKeys } from '../types'

export class I18N {
  private readonly localization: THorizonCardI18NKeys
  private readonly dateFormatter: Intl.DateTimeFormat
  private readonly locale: FrontendLocaleData
  private readonly localizeFunc: LocalizeFunc

  constructor (language: string, timeZone: string, timeFormat: TimeFormat, numberFormat: NumberFormat,
               localizeFunc: LocalizeFunc) {
    this.localization = I18N.matchLanguageToLocalization(language)

    this.dateFormatter = I18N.createDateFormatter(language, timeZone, timeFormat)

    this.locale = {
      language,
      time_format: timeFormat,
      number_format: numberFormat
    }

    this.localizeFunc = localizeFunc
  }

  public formatDateAsTime (date: Date): string {
    let time = this.dateFormatter.format(date)
    if (this.locale.language === 'bg') {
      // Strips " ч." from times in Bulgarian - some major browsers insist on putting it there:
      // https://unicode-org.atlassian.net/browse/CLDR-11545
      // https://unicode-org.atlassian.net/browse/CLDR-15802
      time = time.replace(' ч.', '')
    }
    return time
  }

  public formatDecimal (decimal: number): string {
    return formatNumber(decimal, this.locale)
  }

  /**
   * TR -> TRanslation
   * @param translationKey The key to lookup a translation for
   * @returns The string specified in the translation files
   */
  public tr (translationKey: string): string {
    // if the translation isn't completed in the target language, fall back to english
    // give ugly string for developers who misstype
    return this.localization[translationKey] ?? Constants.FALLBACK_LOCALIZATION[translationKey]
      ?? `Translation key '${translationKey}' doesn't have a valid translation`
  }

  public localize (key: string): string {
    return this.localizeFunc(key)
  }

  private static matchLanguageToLocalization (language: string) {
    let data = Constants.LOCALIZATION_LANGUAGES[language]
    if (data === undefined) {
      // Matches things like en-GB to en, es-419 to es, etc.
      data = Constants.LOCALIZATION_LANGUAGES[language.split('-', 2)[0]]
    }
    if (data === undefined) {
      data = Constants.FALLBACK_LOCALIZATION
    }

    return data
  }

  private static createDateFormatter (language: string, timeZone: string, timeFormat: TimeFormat): Intl.DateTimeFormat {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: timeZone
    }

    // mimics home assistant's logic
    if (timeFormat === 'language' || timeFormat === 'system') {
      const testLanguage = timeFormat === 'language' ? language : undefined
      const test = new Date().toLocaleString(testLanguage)
      dateTimeFormatOptions.hour12 = test.includes('AM') || test.includes('PM')
    } else {
      // Casting to string allows both "time_format: 12" and "time_format: '12'" in YAML
      dateTimeFormatOptions.hour12 = String(timeFormat) === '12'
    }

    let timeLocale = language
    if (!dateTimeFormatOptions.hour12) {
      // Prevents times like 24:00, 24:15, etc. with the 24h clock in some locales.
      // Home Assistant does this only for 'en' but zh-Hant for example suffers from the same problem.
      timeLocale += '-u-hc-h23'
    }
    return new Intl.DateTimeFormat(timeLocale, dateTimeFormatOptions)
  }
}
