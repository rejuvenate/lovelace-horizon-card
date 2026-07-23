import type { HomeAssistant } from 'custom-card-helpers'
import { NumberFormat, TimeFormat } from 'custom-card-helpers'
import type { TemplateResult } from 'lit'
import { html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

import { Constants } from '../../constants'
import type { IHaFormSchemaNode, IHaFormSelectOption, IHorizonCardConfig, THorizonCardEditorData } from '../../types'
import { I18N } from '../../utils/I18N'

// The custom element tag for the visual editor. HorizonCard.getConfigElement() creates this tag;
// importing the const from the card also anchors this module in the bundle so its @customElement
// side effect is never tree-shaken.
export const HORIZON_CARD_EDITOR_TAG = 'horizon-card-editor'

// Every field toggle the editor exposes, with its effective default. The four per-body azimuth/
// elevation keys are shown instead of the shared `azimuth`/`elevation` shorthand so each toggle maps
// 1:1 to a config key (no shared-vs-per-body coupling). Defaults mirror Constants.DEFAULT_CONFIG.fields
// (sun times default on; positions and moon extras default off).
const FIELD_DEFAULTS: Record<string, boolean> = {
  sunrise: true, sunset: true, dawn: true, noon: true, dusk: true,
  sun_azimuth: false, moon_azimuth: false, sun_elevation: false, moon_elevation: false,
  moonrise: false, moonset: false, moon_phase: false
}

// Top-level booleans that default to true (so the editor omits them from the written config when on).
const DEFAULT_TRUE_BOOLEANS = ['sun', 'moon', 'graph', 'sunrise_sunset_lines']

@customElement(HORIZON_CARD_EDITOR_TAG)
export class HorizonCardEditor extends LitElement {
  // Set by Home Assistant from outside, so it is a public property (not internal state).
  @property({ attribute: false })
  public accessor hass!: HomeAssistant

  @state()
  private accessor config!: IHorizonCardConfig

  // Cache the schema so its identity is stable across the frequent hass updates; only the label
  // language can change it, so rebuild only when that changes.
  private schemaCache?: readonly IHaFormSchemaNode[]
  private schemaLanguage?: string

  // Called by Home Assistant when the card editor mounts and whenever the config changes.
  public setConfig (config: IHorizonCardConfig): void {
    this.config = config
  }

  public override render (): TemplateResult {
    // Guard on hass too: HA does not guarantee it sets hass before the config, and ha-form needs it.
    if (!this.hass || !this.config) {
      return html``
    }

    const i18n = this.translator()
    const schema = this.schemaFor(i18n)
    const data = this.toFormData(this.config)

    // ha-form renders leaf field labels from computeLabel(schema); expandable titles and select
    // option labels are localized on the nodes themselves (see buildSchema).
    const computeLabel = (node: IHaFormSchemaNode): string =>
      node.name ? i18n.tr('editor_' + node.name) : ''

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${schema}
        .computeLabel=${computeLabel}
        @value-changed=${this.onValueChanged}
      ></ha-form>
    `
  }

  // The card's language: explicit config language wins, else the HA UI language, else English. Shared
  // by the translator and the schema-cache key so they can never diverge.
  private currentLanguage (): string {
    return this.config?.language ?? this.hass?.locale?.language ?? 'en'
  }

  // Build an I18N bound to the card's language. Only tr() is used here; the time/number args are
  // placeholders.
  private translator (): I18N {
    return new I18N(this.currentLanguage(), 'UTC', TimeFormat.language, NumberFormat.language)
  }

  private schemaFor (i18n: I18N): readonly IHaFormSchemaNode[] {
    const language = this.currentLanguage()
    if (this.schemaLanguage !== language || this.schemaCache === undefined) {
      this.schemaCache = this.buildSchema(i18n)
      this.schemaLanguage = language
    }
    return this.schemaCache
  }

  private buildSchema (i18n: I18N): readonly IHaFormSchemaNode[] {
    const bool = (name: string): IHaFormSchemaNode => ({ name, selector: { boolean: {} } })
    const num = (name: string, options: Record<string, unknown>): IHaFormSchemaNode =>
      ({ name, selector: { number: { mode: 'box', ...options } } })
    const select = (name: string, options: IHaFormSelectOption[]): IHaFormSchemaNode =>
      ({ name, selector: { select: { mode: 'dropdown', options } } })

    const tristate: IHaFormSelectOption[] = [
      { value: 'auto', label: i18n.tr('editor_opt_auto') },
      { value: 'on', label: i18n.tr('editor_opt_on') },
      { value: 'off', label: i18n.tr('editor_opt_off') }
    ]

    return [
      { name: 'title', selector: { text: {} } },
      { name: '', type: 'grid', schema: DEFAULT_TRUE_BOOLEANS.map(bool) },
      {
        type: 'expandable', title: i18n.tr('editor_section_fields'), schema: [
          { name: '', type: 'grid', schema: Object.keys(FIELD_DEFAULTS).map((name) => bool('field_' + name)) }
        ]
      },
      {
        type: 'expandable', title: i18n.tr('editor_section_advanced'), schema: [
          num('refresh_period', { min: 0, unit_of_measurement: 's' }),
          select('southern_flip', tristate),
          num('moon_phase_rotation', { unit_of_measurement: '°' }),
          select('dark_mode', tristate),
          select('language', this.languageOptions(i18n))
        ]
      },
      {
        type: 'expandable', title: i18n.tr('editor_section_location'), schema: [
          { name: '', type: 'grid', schema: [num('latitude', { step: 'any' }), num('longitude', { step: 'any' })] },
          num('elevation', { unit_of_measurement: 'm' }),
          { name: 'time_zone', selector: { text: {} } },
          select('time_format', [
            { value: 'auto', label: i18n.tr('editor_opt_auto') },
            { value: 'language', label: i18n.tr('editor_tf_language') },
            { value: '12', label: i18n.tr('editor_tf_12') },
            { value: '24', label: i18n.tr('editor_tf_24') }
          ]),
          select('number_format', [
            { value: 'auto', label: i18n.tr('editor_opt_auto') },
            { value: 'language', label: i18n.tr('editor_nf_language') },
            { value: 'comma_decimal', label: i18n.tr('editor_nf_comma_decimal') },
            { value: 'decimal_comma', label: i18n.tr('editor_nf_decimal_comma') },
            { value: 'space_comma', label: i18n.tr('editor_nf_space_comma') },
            { value: 'system', label: i18n.tr('editor_nf_system') },
            { value: 'none', label: i18n.tr('editor_nf_none') }
          ])
        ]
      },
      {
        type: 'expandable', title: i18n.tr('editor_section_debug'), schema: [
          num('debug_level', { min: 0, max: 2 })
        ]
      }
    ]
  }

  private languageOptions (i18n: I18N): IHaFormSelectOption[] {
    const languages = Object.keys(Constants.LOCALIZATION_LANGUAGES).map((code) => ({
      value: code,
      // Each language JSON declares its own English display name in `languageName`.
      label: (Constants.LOCALIZATION_LANGUAGES[code] as Record<string, string>).languageName ?? code
    })).sort((a, b) => a.label.localeCompare(b.label))
    return [{ value: 'auto', label: i18n.tr('editor_opt_auto') }, ...languages]
  }

  // Read: card config -> flat ha-form data. Seeds effective values so toggles reflect the true
  // defaults, flattens `fields.*` to `field_*` (mirroring expandedFieldConfig's shared-key fallback),
  // and represents the tri-state options and the auto-inheriting selects as strings.
  private toFormData (config: IHorizonCardConfig): THorizonCardEditorData {
    const fieldsOff = config.fields === false
    const fields = (typeof config.fields === 'object' && config.fields) ? config.fields : {}

    const fieldValue = (name: string, shared?: string): boolean => {
      if (fieldsOff) {
        return false
      }
      const own = fields[name]
      const inherited = shared ? fields[shared] : undefined
      return own ?? inherited ?? FIELD_DEFAULTS[name]
    }

    return {
      title: config.title,
      sun: config.sun ?? true,
      moon: config.moon ?? true,
      graph: config.graph ?? true,
      sunrise_sunset_lines: config.sunrise_sunset_lines ?? true,

      field_sunrise: fieldValue('sunrise'),
      field_sunset: fieldValue('sunset'),
      field_dawn: fieldValue('dawn'),
      field_noon: fieldValue('noon'),
      field_dusk: fieldValue('dusk'),
      field_sun_azimuth: fieldValue('sun_azimuth', 'azimuth'),
      field_moon_azimuth: fieldValue('moon_azimuth', 'azimuth'),
      field_sun_elevation: fieldValue('sun_elevation', 'elevation'),
      field_moon_elevation: fieldValue('moon_elevation', 'elevation'),
      field_moonrise: fieldValue('moonrise'),
      field_moonset: fieldValue('moonset'),
      field_moon_phase: fieldValue('moon_phase'),

      refresh_period: config.refresh_period,
      southern_flip: config.southern_flip === undefined ? 'auto' : (config.southern_flip ? 'on' : 'off'),
      moon_phase_rotation: config.moon_phase_rotation,
      dark_mode: config.dark_mode === undefined ? 'auto' : (config.dark_mode ? 'on' : 'off'),
      language: config.language ?? 'auto',

      latitude: config.latitude,
      longitude: config.longitude,
      elevation: config.elevation,
      time_zone: config.time_zone,
      time_format: config.time_format ?? 'auto',
      number_format: config.number_format ?? 'auto',

      debug_level: config.debug_level ?? 0
    }
  }

  private readonly onValueChanged = (ev: CustomEvent): void => {
    ev.stopPropagation()
    if (!this.config) {
      return
    }
    const data = (ev.detail?.value ?? {}) as THorizonCardEditorData
    const config = this.toConfig(data)
    this.dispatchEvent(new CustomEvent('config-changed', {
      bubbles: true,
      composed: true,
      detail: { config }
    }))
  }

  // Write: flat ha-form data -> a minimal card config. Starts from the current config so unmanaged
  // keys (view_layout, grid_options, uix/card_mod styling, ...) are preserved, then sets or removes
  // each managed key. A key equal to its default is omitted so the stored YAML stays as small as a
  // hand-written one. Never emits a config setConfig would reject (lat/long paired; language whitelisted).
  private toConfig (data: THorizonCardEditorData): IHorizonCardConfig {
    const config: Record<string, unknown> = { ...this.config }
    const has = (value: unknown): boolean => value !== undefined && value !== null && value !== ''
    // Numeric fields additionally reject NaN so a bad value is never serialized into the config.
    const hasNumber = (value: unknown): boolean => has(value) && !Number.isNaN(Number(value))

    // Top-level booleans (default true): keep only when turned off.
    for (const key of DEFAULT_TRUE_BOOLEANS) {
      const value = Boolean(data[key])
      if (value === true) {
        delete config[key]
      } else {
        config[key] = value
      }
    }

    // Fields: keep only the per-body toggles that differ from their default; drop the object if empty.
    const fields: Record<string, boolean> = {}
    for (const [name, fallback] of Object.entries(FIELD_DEFAULTS)) {
      const value = Boolean(data['field_' + name])
      if (value !== fallback) {
        fields[name] = value
      }
    }
    if (Object.keys(fields).length > 0) {
      config.fields = fields
    } else {
      delete config.fields
    }

    // Tri-state selects: auto -> inherit (omit), on/off -> explicit boolean.
    for (const key of ['southern_flip', 'dark_mode']) {
      const value = data[key]
      if (value === 'on') {
        config[key] = true
      } else if (value === 'off') {
        config[key] = false
      } else {
        delete config[key]
      }
    }

    // Numbers with a constant default: omit when equal to it.
    const setDefaultedNumber = (key: string, fallback: number): void => {
      const value = data[key]
      if (hasNumber(value) && Number(value) !== fallback) {
        config[key] = Number(value)
      } else {
        delete config[key]
      }
    }
    setDefaultedNumber('refresh_period', 20)
    setDefaultedNumber('debug_level', 0)

    // Numbers whose default is not a constant (moon_phase_rotation is latitude-derived; elevation
    // inherits from HA): keep any set value, including 0.
    for (const key of ['moon_phase_rotation', 'elevation']) {
      const value = data[key]
      if (hasNumber(value)) {
        config[key] = Number(value)
      } else {
        delete config[key]
      }
    }

    // Latitude and longitude must be set together (the card rejects a lone one). If the user typed
    // only one in the form, default the other from the Home Assistant location. This keeps the
    // emitted config valid AND, because ha-form is driven from the config, stops the just-typed
    // coordinate from being wiped when HA echoes the config back through setConfig.
    const hasLat = hasNumber(data.latitude)
    const hasLon = hasNumber(data.longitude)
    if (hasLat || hasLon) {
      const latitude = hasLat ? Number(data.latitude) : this.hass?.config?.latitude
      const longitude = hasLon ? Number(data.longitude) : this.hass?.config?.longitude
      if (typeof latitude === 'number' && !isNaN(latitude) && typeof longitude === 'number' && !isNaN(longitude)) {
        config.latitude = latitude
        config.longitude = longitude
      } else {
        delete config.latitude
        delete config.longitude
      }
    } else {
      delete config.latitude
      delete config.longitude
    }

    // Free-text and auto-inheriting selects.
    if (has(data.time_zone)) {
      config.time_zone = data.time_zone
    } else {
      delete config.time_zone
    }
    for (const key of ['language', 'time_format', 'number_format']) {
      const value = data[key]
      if (has(value) && value !== 'auto') {
        config[key] = value
      } else {
        delete config[key]
      }
    }
    if (has(data.title)) {
      config.title = data.title
    } else {
      delete config.title
    }

    // Preserve the card type Home Assistant stored (e.g. 'custom:horizon-card').
    config.type = this.config?.type ?? 'horizon-card'
    return config as IHorizonCardConfig
  }
}
