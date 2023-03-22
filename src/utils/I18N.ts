import { Constants } from '../constants'
import { THorizonCardI18N, THorizonCardI18NKeys } from '../types'

export class I18N {
  private localization: THorizonCardI18NKeys
  private dateFormatter: Intl.DateTimeFormat

  constructor (language: string, use12HourClock: boolean | undefined) {
    this.localization = Constants.LOCALIZATION_LANGUAGES[language]

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
      timeStyle: 'short'
    }

    // if user hasn't defined this specifically in config
    // let the formatter figure it out based on language
    if (use12HourClock !== undefined) {
      dateTimeFormatOptions.hour12 = use12HourClock
    }

    this.dateFormatter = new Intl.DateTimeFormat(language, dateTimeFormatOptions)
  }

  public formatDateAsTime (date: Date): string {
    return this.dateFormatter
      .formatToParts(date)
      .map(({ type, value }) => {
        switch (type) {
        // intentional fallthrough
        case 'hour':
        case 'minute':
        case 'dayPeriod':
        case 'literal':
          return value

          /* istanbul ignore next */
        default:
          return ''
        }
      })
      .join('')
  }

  /**
   * TR -> TRanslation
   * @param translationKey The key to lookup a translation for
   * @returns The string specified in the translation files
   */
  public tr (translationKey: string): string {
    return this.getLocalizationElement(this.localization, translationKey).toString()
  }

  // Janky recursive logic to handle nested values in i18n json sources
  private getLocalizationElement (localization: THorizonCardI18N, translationKey: string): string | THorizonCardI18N {
    if (translationKey.includes('.')) {
      const parts = translationKey.split('.', 2)
      // TODO: maybe add typecheck
      const localization = this.getLocalizationElement(this.localization, parts[0]) as THorizonCardI18N
      return this.getLocalizationElement(localization, parts[1])
    } else {
      // if the translation isn't completed in the target language, fall back to english
      // give ugly string for developers who misstype
      return (localization ? localization[translationKey] : undefined)
        ?? Constants.FALLBACK_LOCALIZATION[translationKey]
        ?? `Translation key '${translationKey}' doesn't have a valid translation`
    }
  }
}
