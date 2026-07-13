import { localizationLanguages } from './assets/localization/languages.generated'
import en from './assets/localization/languages/en.json'
import type {
  IHorizonCardConfig,
  SunCalcMoonPhase,
  THorizonCardData,
  THorizonCardI18NKeys,
  TMoonPhase
} from './types'

export class Constants {
  static readonly FALLBACK_LOCALIZATION = en

  // Refresh period in seconds
  static readonly DEFAULT_REFRESH_PERIOD = 20

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

  // Generated from the JSON files in assets/localization/languages (see languages.generated.ts
  // and scripts/generate-i18n-index.mjs). To add a language, just add a <code>.json (with a
  // "languageName") to that folder — the index and README are regenerated automatically as
  // part of the pull request, so there is nothing to run and no manual edit here.
  static readonly LOCALIZATION_LANGUAGES: Record<string, THorizonCardI18NKeys> = localizationLanguages
}
