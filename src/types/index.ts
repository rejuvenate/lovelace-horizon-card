import { LovelaceCardConfig } from "custom-card-helpers";

import { I18N } from "../utils/I18N";

export type TSunCardFields = {
  sunrise?: boolean
  sunset?: boolean

  dawn?: boolean
  noon?: boolean
  dusk?: boolean

  azimuth?: boolean
  elevation?: boolean
}

export interface ISunCardConfig extends LovelaceCardConfig {
  i18n?: I18N
  darkMode?: boolean
  language?: string

  title?: string,
  component?: string
  use12hourClock?: boolean

  fields?: TSunCardFields
}

export interface IConfigChangedEvent<T> extends CustomEvent<T> {
  target: CustomEvent["target"] & {
    configValue: string
    selected?: string
    checked?: boolean
  };
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

export enum ESunCardErrors {
  SunIntegrationNotFound = "SunIntegrationNotFound"
}

export enum ESunCardI18NKeys {
  Azimuth = "azimuth",
  Dawn = "dawn",
  Dusk = "dusk",
  Elevation = "elevation",
  Noon = "noon",
  Sunrise = "sunrise",
  Sunset = "sunset"
}

export type TSunCardI18NErrorKeys = {
  [key in ESunCardErrors]: string
}

export type TSunCardI18NKeys = { [key in ESunCardI18NKeys]: string } | { errors: TSunCardI18NErrorKeys }

export type TSunCardI18N = Record<string, unknown>

export type TSunCardTimes = {
  dawn: Date
  dusk: Date
  noon: Date
  sunrise: Date
  sunset: Date
}

export type TSunCardData = {
  azimuth: number
  elevation: number

  sunInfo: TSunInfo

  times: TSunCardTimes

  error?: ESunCardErrors
}
