import bg from './assets/localization/languages/bg.json'
import ca from './assets/localization/languages/ca.json'
import cs from './assets/localization/languages/cs.json'
import da from './assets/localization/languages/da.json'
import de from './assets/localization/languages/de.json'
import el from './assets/localization/languages/el.json'
import en from './assets/localization/languages/en.json'
import es from './assets/localization/languages/es.json'
import et from './assets/localization/languages/et.json'
import fa from './assets/localization/languages/fa.json'
import fi from './assets/localization/languages/fi.json'
import fr from './assets/localization/languages/fr.json'
import gl from './assets/localization/languages/gl.json'
import he from './assets/localization/languages/he.json'
import hr from './assets/localization/languages/hr.json'
import hu from './assets/localization/languages/hu.json'
import is from './assets/localization/languages/is.json'
import it from './assets/localization/languages/it.json'
import ja from './assets/localization/languages/ja.json'
import ko from './assets/localization/languages/ko.json'
import lt from './assets/localization/languages/lt.json'
import ms from './assets/localization/languages/ms.json'
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
import {
  IHorizonCardConfig,
  SunCalcMoonPhase,
  THorizonCardData,
  THorizonCardI18NKeys,
  TMoonPhase
} from './types'

export class Constants {
  static readonly FALLBACK_LOCALIZATION = en

  static readonly DEFAULT_REFRESH_PERIOD = 20 * 1000

  // 24 hours in milliseconds
  static readonly MS_24_HOURS = 24 * 60 * 60 * 1000

  // 12 hours in milliseconds
  static readonly MS_12_HOURS = 12 * 60 * 60 * 1000

  // Mapping of SunCalc moon phases to Home Assistant moon phase state and icon
  static readonly MOON_PHASES: Record<SunCalcMoonPhase, TMoonPhase> = {
    newMoon: {state: 'new_moon', icon: 'moon-new'},
    waxingCrescentMoon: {state: 'waxing_crescent', icon: 'moon-waxing-crescent'},
    firstQuarterMoon: {state: 'first_quarter', icon: 'moon-first-quarter'},
    waxingGibbousMoon: {state: 'waxing_gibbous', icon: 'moon-waxing-gibbous'},
    fullMoon: {state: 'full_moon', icon: 'moon-full'},
    waningGibbousMoon: {state: 'waning_gibbous', icon: 'moon-waning-gibbous'},
    thirdQuarterMoon: {state: 'last_quarter', icon: 'moon-last-quarter'},
    waningCrescentMoon: {state: 'waning_crescent', icon: 'moon-waning-crescent'}
  }

  // Default config values, they will be used if the user hasn't provided a value in the card config
  static readonly DEFAULT_CONFIG: IHorizonCardConfig = {
    type: 'horizon-card',
    moon: true,
    debug_level: 0,
    refresh_period: Constants.DEFAULT_REFRESH_PERIOD,
    fields: {
      sunrise: true,
      sunset: true,
      dawn: true,
      noon: true,
      dusk: true,
      azimuth: false,
      elevation: false,
      moonrise: false,
      moonset: false,
      moon_phase: false
    }
    // These keys must not be in the default config as they are provided by Home Assistant:
    // language, dark_mode, latitude, longitude, elevation, time_zone.
    // The default for 'now' is the current time and must not be specified here either.
  }

  static readonly DEFAULT_CARD_DATA: THorizonCardData = {
    partial: false,
    latitude: 0,
    longitude: 0,
    sunData: {
      azimuth: 0,
      elevation: 0,
      times: {
        now: new Date(),
        dawn: new Date(),
        dusk: new Date(),
        midnight: new Date(),
        noon: new Date(),
        sunrise: new Date(),
        sunset: new Date()
      },
      hueReduce: 0,
      saturationReduce: 0,
      lightnessReduce: 0
    },
    sunPosition: {
      x: 0,
      y: 0,
      scaleY: 1,
      offsetY: 0,
      horizonY: 0,
      sunriseX: 0,
      sunsetX: 0,
    },
    moonData: {
      azimuth: 0,
      elevation: 0,
      fraction: 0,
      phase: Constants.MOON_PHASES.fullMoon,
      phaseRotation: 0,
      zenithAngle: 0,
      parallacticAngle: 0,
      times: {
        now: new Date(),
        moonrise: new Date(),
        moonset: new Date()
      },
      saturationReduce: 0,
      lightnessReduce: 0
    },
    moonPosition: {
      x: 0,
      y: 0
    }
  }

  static readonly HORIZON_Y = 84

  static readonly SUN_RADIUS = 17

  static readonly MOON_RADIUS = 14

  static readonly LOCALIZATION_LANGUAGES: Record<string, THorizonCardI18NKeys> = {
    bg, ca, cs, da, de, el, en, es, et, fa, fi, fr, gl, he, hr, hu, is, it, ja, ko, lt, ms, nb, nl, nn, pl, 'pt-BR': ptBR, ro, ru, sk, sl, sv, tr, uk, 'zh-Hans': zh_Hans, 'zh-Hant': zh_Hant
  }
}
