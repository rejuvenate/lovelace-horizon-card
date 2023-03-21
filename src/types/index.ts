import { LovelaceCardConfig } from 'custom-card-helpers'

import { I18N } from '../utils/I18N'

export type THorizonCardFields = {
  sunrise?: boolean
  sunset?: boolean

  dawn?: boolean
  noon?: boolean
  dusk?: boolean

  azimuth?: boolean
  elevation?: boolean
}

export interface IHorizonCardConfig extends LovelaceCardConfig {
  i18n?: I18N
  darkMode?: boolean
  language?: string

  title?: string,
  component?: string
  use12hourClock?: boolean

  fields?: THorizonCardFields
}

export interface IConfigChangedEvent <T> extends CustomEvent<T> {
  target: CustomEvent['target'] & {
    configValue: string
    selected?: string
    checked?: boolean
  }
}

export type TSunInfo = {
  sunrise: number,
  sunset: number

  dawnProgressPercent: number
  dayProgressPercent: number
  duskProgressPercent: number

  sunAboveHorizon: boolean
  sunPercentOverHorizon: number
  sunPosition: {
    x: number
    y: number
  }
}

export enum EHorizonCardErrors {
  SunIntegrationNotFound = 'SunIntegrationNotFound'
}

export type THorizonCardTimes = {
  dawn?: Date
  dusk?: Date
  noon: Date
  sunrise?: Date
  sunset?: Date
}

export type THorizonCardData = {
  azimuth: number
  elevation: number

  sunInfo: TSunInfo

  times: THorizonCardTimes

  error?: EHorizonCardErrors
}

export enum EHorizonCardI18NKeys {
  Azimuth = 'azimuth',
  Dawn = 'dawn',
  Dusk = 'dusk',
  Elevation = 'elevation',
  Noon = 'noon',
  Sunrise = 'sunrise',
  Sunset = 'sunset'
}

export type THorizonCardI18N = Record<string, unknown>

export type THorizonCardI18NErrorKeys = {
  [key in EHorizonCardErrors]: string
}

export type THorizonCardI18NKeys = { [key in EHorizonCardI18NKeys ]: string } | { errors: THorizonCardI18NErrorKeys }
