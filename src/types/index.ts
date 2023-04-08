import { LovelaceCardConfig, NumberFormat, TimeFormat } from 'custom-card-helpers'

export type THorizonCardFields = {
  sunrise?: boolean
  sunset?: boolean

  dawn?: boolean
  noon?: boolean
  dusk?: boolean

  azimuth?: boolean
  sun_azimuth?: boolean
  moon_azimuth?: boolean
  elevation?: boolean
  sun_elevation?: boolean
  moon_elevation?: boolean

  moonrise?: boolean,
  moonset?: boolean,
  moon_phase?: boolean
}

export interface IHorizonCardConfig extends LovelaceCardConfig {
  dark_mode?: boolean
  language?: string

  title?: string,
  moon?: boolean,
  time_format?: TimeFormat
  number_format?: NumberFormat

  latitude?: number
  longitude?: number
  elevation?: number
  southern_flip?: boolean
  moon_phase_rotation?: number
  now?: Date
  time_zone?: string
  refresh_period?: number
  debug_level?: number

  fields?: THorizonCardFields
}

export type TSunTimes = {
  now: Date
  dawn?: Date
  dusk?: Date
  midnight: Date
  noon: Date
  sunrise?: Date
  sunset?: Date
}

export type TSunData = {
  readonly azimuth: number
  readonly elevation: number
  readonly times: TSunTimes
  readonly hueReduce: number
  readonly saturationReduce: number
  readonly lightnessReduce: number
}

export type TSunPosition = {
  readonly x: number
  readonly y: number
  readonly horizonY: number
  readonly sunriseX: number
  readonly sunsetX: number
  readonly scaleY: number
  readonly offsetY: number
}

export type TMoonTimes = {
  readonly now: Date,
  readonly moonrise: Date,
  readonly moonset: Date
}

export type TMoonPhase = {
  state: string
  icon: string
}

export type SunCalcMoonPhase =
  'newMoon'
  | 'waxingCrescentMoon'
  | 'firstQuarterMoon'
  | 'waxingGibbousMoon'
  | 'fullMoon'
  | 'waningGibbousMoon'
  | 'thirdQuarterMoon'
  | 'waningCrescentMoon'

export type TMoonData = {
  readonly azimuth: number
  readonly elevation: number
  readonly fraction: number
  readonly phase: TMoonPhase
  readonly phaseRotation: number,
  readonly zenithAngle: number
  readonly parallacticAngle: number
  readonly times: TMoonTimes,
  readonly saturationReduce: number,
  readonly lightnessReduce: number
}

export type TMoonPosition = {
  readonly x: number
  readonly y: number
}

export enum EHorizonCardErrors {
}

export type THorizonCardData = {
  readonly partial: boolean
  readonly latitude: number
  readonly longitude: number
  readonly sunPosition: TSunPosition
  readonly sunData: TSunData
  readonly moonPosition: TMoonPosition
  readonly moonData: TMoonData
}

export enum EHorizonCardI18NKeys {
  Azimuth = 'azimuth',
  Dawn = 'dawn',
  Dusk = 'dusk',
  Elevation = 'elevation',
  Noon = 'noon',
  Sunrise = 'sunrise',
  Sunset = 'sunset',
  Moonrise = 'moonrise',
  Moonset = 'moonset'
}

export type THorizonCardI18NErrorKeys = {
  [key in EHorizonCardErrors]: string
}

export type THorizonCardI18NKeys = { [key in EHorizonCardI18NKeys ]?: string } | { errors: THorizonCardI18NErrorKeys }
