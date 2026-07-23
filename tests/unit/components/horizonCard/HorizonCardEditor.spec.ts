import type { HomeAssistant } from 'custom-card-helpers'
import { NumberFormat, TimeFormat } from 'custom-card-helpers'

import de from '../../../../src/assets/localization/languages/de.json'
import en from '../../../../src/assets/localization/languages/en.json'
import { HorizonCard } from '../../../../src/components/horizonCard'
import { HORIZON_CARD_EDITOR_TAG, HorizonCardEditor } from '../../../../src/components/horizonCard/HorizonCardEditor'
import type { IHorizonCardConfig } from '../../../../src/types'
import { I18N } from '../../../../src/utils/I18N'

const HASS = { locale: { language: 'en' }, config: { latitude: 52.5, longitude: 13.4 } } as unknown as HomeAssistant

const makeEditor = (config: IHorizonCardConfig): HorizonCardEditor => {
  const editor = new HorizonCardEditor()
  editor.hass = HASS
  editor.setConfig(config)
  return editor
}

// Convenience wrappers around the private read/write methods (mirrors how HorizonCard.spec.ts
// reaches into private members via index access).
const toFormData = (editor: HorizonCardEditor, config: IHorizonCardConfig) =>
  (editor as any)['toFormData'](config)
const toConfig = (editor: HorizonCardEditor, data: Record<string, unknown>) =>
  (editor as any)['toConfig'](data)

describe('HorizonCardEditor', () => {
  describe('card wiring', () => {
    it('getConfigElement returns the editor custom element', async () => {
      const element = await HorizonCard.getConfigElement()
      expect(element.tagName.toLowerCase()).toEqual(HORIZON_CARD_EDITOR_TAG)
    })

    it('getStubConfig returns an empty config (every option has a default)', () => {
      expect(HorizonCard.getStubConfig()).toEqual({})
    })
  })

  describe('toFormData (config -> flat form data)', () => {
    it('seeds the effective defaults for a bare config', () => {
      const data = toFormData(makeEditor({ type: 'horizon-card' }), { type: 'horizon-card' })
      expect(data.sun).toEqual(true)
      expect(data.moon).toEqual(true)
      expect(data.graph).toEqual(true)
      expect(data.sunrise_sunset_lines).toEqual(true)
      expect(data.field_sunrise).toEqual(true)
      expect(data.field_dusk).toEqual(true)
      expect(data.field_sun_azimuth).toEqual(false)
      expect(data.field_moon_phase).toEqual(false)
      expect(data.southern_flip).toEqual('auto')
      expect(data.dark_mode).toEqual('auto')
      expect(data.language).toEqual('auto')
      expect(data.time_format).toEqual('auto')
      expect(data.number_format).toEqual('auto')
      expect(data.debug_level).toEqual(0)
      expect(data.latitude).toBeUndefined()
    })

    it('maps fields:false to every field toggle off', () => {
      const data = toFormData(makeEditor({ type: 'horizon-card' }), { type: 'horizon-card', fields: false })
      for (const key of ['field_sunrise', 'field_sunset', 'field_dawn', 'field_noon', 'field_dusk',
        'field_sun_azimuth', 'field_moon_azimuth', 'field_sun_elevation', 'field_moon_elevation',
        'field_moonrise', 'field_moonset', 'field_moon_phase']) {
        expect(data[key]).toEqual(false)
      }
    })

    it('expands the shared azimuth/elevation shorthand onto both per-body toggles', () => {
      const config: IHorizonCardConfig = { type: 'horizon-card', fields: { azimuth: true, elevation: true } }
      const data = toFormData(makeEditor(config), config)
      expect(data.field_sun_azimuth).toEqual(true)
      expect(data.field_moon_azimuth).toEqual(true)
      expect(data.field_sun_elevation).toEqual(true)
      expect(data.field_moon_elevation).toEqual(true)
    })

    it('lets an explicit per-body toggle override the shared shorthand (own wins, even when false)', () => {
      // Guards the `own ?? inherited ?? default` precedence: `??` (not `||`) is required so an
      // explicit false is honoured over an inherited true.
      const config: IHorizonCardConfig = { type: 'horizon-card', fields: { azimuth: true, sun_azimuth: false } }
      const data = toFormData(makeEditor(config), config)
      expect(data.field_sun_azimuth).toEqual(false)
      expect(data.field_moon_azimuth).toEqual(true)
    })

    it('represents the tri-state options as auto/on/off', () => {
      const on = toFormData(makeEditor({ type: 'horizon-card' }), { type: 'horizon-card', southern_flip: true, dark_mode: false })
      expect(on.southern_flip).toEqual('on')
      expect(on.dark_mode).toEqual('off')
    })
  })

  describe('toConfig (flat form data -> minimal config)', () => {
    const roundTrip = (config: IHorizonCardConfig) => {
      const editor = makeEditor(config)
      return toConfig(editor, toFormData(editor, config))
    }

    it('reduces a default form to just the card type', () => {
      expect(roundTrip({ type: 'horizon-card' })).toEqual({ type: 'horizon-card' })
    })

    it('keeps a disabled default-on toggle and drops it again when re-enabled', () => {
      expect(roundTrip({ type: 'horizon-card', moon: false })).toEqual({ type: 'horizon-card', moon: false })
      expect(roundTrip({ type: 'horizon-card', moon: true })).toEqual({ type: 'horizon-card' })
    })

    it('round-trips a title and drops an empty one', () => {
      expect(roundTrip({ type: 'horizon-card', title: 'Sun' })).toEqual({ type: 'horizon-card', title: 'Sun' })
      expect(roundTrip({ type: 'horizon-card', title: '' })).toEqual({ type: 'horizon-card' })
    })

    it('strips numbers equal to their constant default but keeps meaningful values including 0', () => {
      expect(roundTrip({ type: 'horizon-card', refresh_period: 20 })).toEqual({ type: 'horizon-card' })
      expect(roundTrip({ type: 'horizon-card', refresh_period: 0 })).toEqual({ type: 'horizon-card', refresh_period: 0 })
      expect(roundTrip({ type: 'horizon-card', debug_level: 0 })).toEqual({ type: 'horizon-card' })
      expect(roundTrip({ type: 'horizon-card', debug_level: 2 })).toEqual({ type: 'horizon-card', debug_level: 2 })
      expect(roundTrip({ type: 'horizon-card', moon_phase_rotation: 0 })).toEqual({ type: 'horizon-card', moon_phase_rotation: 0 })
      expect(roundTrip({ type: 'horizon-card', elevation: 0 })).toEqual({ type: 'horizon-card', elevation: 0 })
    })

    it('fills a lone coordinate from the HA location so the config is always valid', () => {
      // Both set: kept as-is.
      expect(roundTrip({ type: 'horizon-card', latitude: 10, longitude: 20 }))
        .toEqual({ type: 'horizon-card', latitude: 10, longitude: 20 })
      // Only latitude typed in the form: longitude is defaulted from hass.config (13.4) so a lone
      // coordinate is never emitted and the typed value is not wiped on the setConfig echo.
      const editor = makeEditor({ type: 'horizon-card' })
      const data = { ...toFormData(editor, { type: 'horizon-card' }), latitude: 10 }
      const config = toConfig(editor, data)
      expect(config.latitude).toEqual(10)
      expect(config.longitude).toEqual(13.4)
    })

    it('fills latitude from the HA location when only longitude is typed (symmetric)', () => {
      const editor = makeEditor({ type: 'horizon-card' })
      const data = { ...toFormData(editor, { type: 'horizon-card' }), longitude: 20 }
      const config = toConfig(editor, data)
      expect(config.longitude).toEqual(20)
      expect(config.latitude).toEqual(52.5)
    })

    it('drops a lone coordinate when the HA location is unavailable', () => {
      const editor = new HorizonCardEditor()
      editor.hass = { locale: { language: 'en' } } as unknown as HomeAssistant
      editor.setConfig({ type: 'horizon-card' })
      const data = { ...toFormData(editor, { type: 'horizon-card' }), latitude: 10 }
      const config = toConfig(editor, data)
      expect(config.latitude).toBeUndefined()
      expect(config.longitude).toBeUndefined()
    })

    it('never serializes NaN for a numeric field', () => {
      const editor = makeEditor({ type: 'horizon-card' })
      const base = toFormData(editor, { type: 'horizon-card' })
      for (const key of ['refresh_period', 'debug_level', 'elevation', 'moon_phase_rotation', 'latitude']) {
        const config = toConfig(editor, { ...base, [key]: NaN }) as Record<string, unknown>
        expect(config[key]).toBeUndefined()
      }
    })

    it('round-trips explicit time and number format selections and omits auto', () => {
      const editor = makeEditor({ type: 'horizon-card' })
      const base = toFormData(editor, { type: 'horizon-card' })
      expect(toConfig(editor, { ...base, time_format: '24' }).time_format).toEqual('24')
      expect(toConfig(editor, { ...base, number_format: 'comma_decimal' }).number_format).toEqual('comma_decimal')
      expect(toConfig(editor, { ...base, time_format: 'auto' }).time_format).toBeUndefined()
      expect(toConfig(editor, { ...base, number_format: 'auto' }).number_format).toBeUndefined()
    })

    it('normalizes the shared azimuth shorthand to explicit per-body keys', () => {
      expect(roundTrip({ type: 'horizon-card', fields: { azimuth: true } }))
        .toEqual({ type: 'horizon-card', fields: { sun_azimuth: true, moon_azimuth: true } })
    })

    it('maps the tri-state selects back to omit / true / false', () => {
      expect(roundTrip({ type: 'horizon-card', southern_flip: true })).toEqual({ type: 'horizon-card', southern_flip: true })
      expect(roundTrip({ type: 'horizon-card', dark_mode: false })).toEqual({ type: 'horizon-card', dark_mode: false })
    })

    it('preserves the stored card type and unmanaged keys', () => {
      const config = { type: 'custom:horizon-card', view_layout: { position: 'sidebar' } } as unknown as IHorizonCardConfig
      const result = toConfig(makeEditor(config), toFormData(makeEditor(config), config))
      expect(result.type).toEqual('custom:horizon-card')
      expect((result as any).view_layout).toEqual({ position: 'sidebar' })
    })
  })

  describe('config-changed event', () => {
    it('emits a minimal config with the changed value', () => {
      const config: IHorizonCardConfig = { type: 'horizon-card' }
      const editor = makeEditor(config)
      const emitted: IHorizonCardConfig[] = []
      editor.addEventListener('config-changed', (ev) => emitted.push((ev as CustomEvent).detail.config))

      const data = { ...toFormData(editor, config), moon: false, title: 'My card' }
      ;(editor as any)['onValueChanged'](new CustomEvent('value-changed', { detail: { value: data } }))

      expect(emitted).toHaveLength(1)
      expect(emitted[0]).toEqual({ type: 'horizon-card', moon: false, title: 'My card' })
    })
  })

  describe('localization completeness (acceptance gate)', () => {
    it('has an en.json key for every schema label and select option', () => {
      const editor = makeEditor({ type: 'horizon-card' })
      const i18n = new I18N('en', 'UTC', TimeFormat.language, NumberFormat.language)
      const schema = (editor as any)['buildSchema'](i18n)
      const missing: string[] = []
      const fallbackMarker = 'doesn\'t have a valid translation'

      const walk = (nodes: any[]) => {
        for (const node of nodes) {
          if (typeof node.title === 'string' && node.title.includes(fallbackMarker)) {
            missing.push(`title:${node.title}`)
          }
          if (node.schema) {
            walk(node.schema)
          } else if (node.name) {
            if ((en as any)['editor_' + node.name] === undefined) {
              missing.push('editor_' + node.name)
            }
            const options = node.selector?.select?.options
            if (Array.isArray(options)) {
              for (const option of options) {
                if (typeof option.label === 'string' && option.label.includes(fallbackMarker)) {
                  missing.push(`option:${node.name}:${option.value}`)
                }
              }
            }
          }
        }
      }
      walk(schema as any[])

      expect(missing).toEqual([])
    })

    it('de.json defines exactly the same editor_* keys as en.json', () => {
      const editorKeys = (obj: Record<string, unknown>) =>
        Object.keys(obj).filter((k) => k.startsWith('editor_')).sort()
      expect(editorKeys(de as Record<string, unknown>)).toEqual(editorKeys(en as Record<string, unknown>))
    })
  })
})
