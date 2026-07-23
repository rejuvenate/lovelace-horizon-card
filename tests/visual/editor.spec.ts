import { expect, test } from '@playwright/test'

declare global {
  interface Window {
    renderEditor: (config: Record<string, unknown>) => Promise<unknown>
    setField: (name: string, value: unknown) => Promise<void>
    getEmittedConfig: () => Record<string, unknown> | null
    getFieldValue: (name: string) => unknown
  }
}

// The editor renders a single <ha-form>. ha-form is a Home Assistant runtime element, so the harness
// stubs it (see editor-harness.html) and renders the real editor's schema as native controls. These
// tests therefore pin the editor STRUCTURE with a screenshot and assert the config-changed
// round-trip logic; the pixel-faithful HA look is covered separately by dev/ha-editor-verify (Stufe 2).

test.describe('Visual editor', () => {
  test('renders the full grouped editor structure', async ({ page }) => {
    await page.goto('/tests/visual/editor-harness.html')
    await page.evaluate(() => window.renderEditor({}))
    await expect(page.locator('#container')).toHaveScreenshot('editor-structure.png')
  })

  test.describe('config-changed round-trip', () => {
    const cases: { name: string, drive: string, expected: Record<string, unknown> }[] = [
      { name: 'a disabled default-on toggle', drive: 'moon:false', expected: { type: 'horizon-card', moon: false } },
      { name: 'a title', drive: 'title:My card', expected: { type: 'horizon-card', title: 'My card' } },
      { name: 'a single field off', drive: 'field_sunrise:false', expected: { type: 'horizon-card', fields: { sunrise: false } } },
      { name: 'a tri-state set to on', drive: 'southern_flip:on', expected: { type: 'horizon-card', southern_flip: true } },
      { name: 'a language override', drive: 'language:de', expected: { type: 'horizon-card', language: 'de' } }
    ]

    for (const { name, drive, expected } of cases) {
      test(`emits ${name} as a minimal config`, async ({ page }) => {
        await page.goto('/tests/visual/editor-harness.html')
        await page.evaluate(() => window.renderEditor({}))
        const [field, raw] = drive.split(':')
        const value = raw === 'true' ? true : raw === 'false' ? false : raw
        const config = await page.evaluate(async ([f, v]) => {
          await window.setField(f as string, v)
          return window.getEmittedConfig()
        }, [field, value] as const)
        expect(config).toEqual(expected)
      })
    }

    // Regression guard for the controlled-component wipe: ha-form is driven from the config, so a
    // lone coordinate must NOT be dropped (which would clear the field on the setConfig echo before
    // the user can type the second one). The mock hass location is latitude 52.5, longitude 13.4.
    test('fills a lone coordinate from the HA location and never wipes the typed value', async ({ page }) => {
      await page.goto('/tests/visual/editor-harness.html')
      await page.evaluate(() => window.renderEditor({}))

      const afterLatOnly = await page.evaluate(async () => {
        await window.setField('latitude', 10)
        return { config: window.getEmittedConfig(), shown: window.getFieldValue('latitude') }
      })
      // Longitude is defaulted from the HA location, and the typed latitude survives the echo.
      expect(afterLatOnly.config).toEqual({ type: 'horizon-card', latitude: 10, longitude: 13.4 })
      expect(String(afterLatOnly.shown)).toEqual('10')

      const afterBoth = await page.evaluate(async () => {
        await window.setField('longitude', 20)
        return window.getEmittedConfig()
      })
      expect(afterBoth).toEqual({ type: 'horizon-card', latitude: 10, longitude: 20 })
    })
  })
})
