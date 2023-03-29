import bg from './assets/localization/languages/bg.json'
import ca from './assets/localization/languages/ca.json'
import cs from './assets/localization/languages/cs.json'
import da from './assets/localization/languages/da.json'
import de from './assets/localization/languages/de.json'
import en from './assets/localization/languages/en.json'
import es from './assets/localization/languages/es.json'
import et from './assets/localization/languages/et.json'
import fi from './assets/localization/languages/fi.json'
import fr from './assets/localization/languages/fr.json'
import he from './assets/localization/languages/he.json'
import hr from './assets/localization/languages/hr.json'
import hu from './assets/localization/languages/hu.json'
import is from './assets/localization/languages/is.json'
import it from './assets/localization/languages/it.json'
import ja from './assets/localization/languages/ja.json'
import lt from './assets/localization/languages/lt.json'
import nb from './assets/localization/languages/nb.json'
import nl from './assets/localization/languages/nl.json'
import nn from './assets/localization/languages/nn.json'
import pl from './assets/localization/languages/pl.json'
import ptBR from './assets/localization/languages/pt-BR.json'
import ro from './assets/localization/languages/ro.json'
import ru from './assets/localization/languages/ru.json'
import sk from './assets/localization/languages/sk.json'
import sl from './assets/localization/languages/sl.json'
import sv from './assets/localization/languages/sv.json'
import tr from './assets/localization/languages/tr.json'
import uk from './assets/localization/languages/uk.json'
import zh_Hans from './assets/localization/languages/zh-Hans.json'
import zh_Hant from './assets/localization/languages/zh-Hant.json'
import { IHorizonCardConfig, THorizonCardI18NKeys, THorizonCardTimes, TSunInfo } from './types'

export class Constants {
  static readonly DEFAULT_CONFIG: IHorizonCardConfig = {
    type: 'horizon-card',
    darkMode: true,
    language: 'en',
    use12hourClock: false,
    component: 'sun.sun',
    fields: {
      sunrise: true,
      sunset: true,
      dawn: true,
      noon: true,
      dusk: true,
      azimuth: false,
      elevation: false
    }
  }

  static readonly EVENT_X_POSITIONS = {
    dayStart: 5,
    sunrise: 101,
    sunset: 449,
    dayEnd: 545
  }

  static readonly HORIZON_Y = 108
  static readonly SUN_RADIUS = 17
  static readonly SUN_SECTIONS = {
    dawn: 105,
    day: 499 - 106,
    dusk: 605 - 500
  }

  static readonly DEFAULT_SUN_INFO: TSunInfo = {
    dawnProgressPercent: 0,
    dayProgressPercent: 0,
    duskProgressPercent: 0,
    sunAboveHorizon: false,
    sunPercentOverHorizon: 0,
    sunPosition: {
      x: 0,
      y: 0
    },
    sunrise: 0,
    sunset: 0
  }

  static readonly DEFAULT_TIMES: THorizonCardTimes = {
    dawn: new Date(),
    dusk: new Date(),
    noon: new Date(),
    sunrise: new Date(),
    sunset: new Date()
  }

  static readonly LOCALIZATION_LANGUAGES: Record<string, THorizonCardI18NKeys> = {
    bg, ca, cs, da, de, en, es, et, fi, fr, he, hr, hu, is, it, ja, lt, nb, nl, nn, pl, 'pt-BR': ptBR, ro, ru, sk, sl, sv, tr, uk, 'zh-Hans': zh_Hans, 'zh-Hant': zh_Hant
  }

  static readonly FALLBACK_LOCALIZATION = en

  // Magic number - used by Home Assistant and the library (astral) it uses to calculate the sun events
  static readonly BELOW_HORIZON_ELEVATION = 0.83
}
