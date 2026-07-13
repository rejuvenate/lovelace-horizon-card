import { expect, test } from '@playwright/test'

declare global {
  interface Window {
    setContainerWidth: (width: number) => void
    renderCard: (config: Record<string, unknown>) => Promise<unknown>
    getGridOptions: () => { rows: number, columns: number, min_rows: number, min_columns: number }
    measureCardHeight: () => number
  }
}

// The card is measured at a full-width (12 column) Sections-view card.
const CONTAINER_WIDTH = 492

// Grid geometry used by getGridOptions(): a 12-column grid where each cell is
// 56px tall with an 8px gap, so rows = ceil((pxHeight + 8) / 64).
const rowsForHeight = (heightPx: number): number => Math.ceil((heightPx + 8) / 64)

// Invariant: getGridOptions() must never UNDER-report rows, or the card would be
// clipped in the Sections grid. Over-reporting (a little extra whitespace) is
// acceptable, so we assert modelRows >= the rows the card actually renders into.

const cases: { name: string, config: Record<string, unknown> }[] = [
  {
    name: 'graph-only',
    config: { fields: { sunrise: false, sunset: false, dawn: false, noon: false, dusk: false } }
  },
  {
    name: 'default-fields',
    config: {}
  },
  {
    name: 'default-fields-with-title',
    config: { title: 'Sunrise & Sunset' }
  },
  {
    name: 'all-fields-with-moon',
    config: {
      title: 'Sunrise & Sunset',
      fields: { azimuth: true, elevation: true, moonrise: true, moonset: true, moon_phase: true }
    }
  },
  {
    name: 'moon-only',
    config: {
      fields: {
        sunrise: false, sunset: false, dawn: false, noon: false, dusk: false,
        moonrise: true, moonset: true, moon_phase: true
      }
    }
  },
  {
    // Guard for #82: southern_flip must mirror the moon disc geometrically
    // (about the viewBox centre), exactly like the sun. This is the only
    // visual coverage for the flipped-moon position.
    name: 'southern-flip-with-moon',
    config: {
      southern_flip: true,
      fields: { azimuth: true, elevation: true, moonrise: true, moonset: true, moon_phase: true }
    }
  },
  {
    // Guard for #142: in deep winter at a high latitude the sun curve is
    // strongly compressed (scaleY << 1); the moon disc must compress with it
    // and stay inside the frame instead of detaching/clipping.
    name: 'winter-high-latitude-with-moon',
    config: {
      now: '2023-12-21T13:00:00Z',
      latitude: 65,
      fields: { azimuth: true, elevation: true, moonrise: true, moonset: true, moon_phase: true }
    }
  }
]

test.describe('getGridOptions height model', () => {
  for (const { name, config } of cases) {
    test(`rendered card height matches getGridOptions() rows for ${name}`, async ({ page }, testInfo) => {
      await page.goto('/tests/visual/harness.html')
      await page.evaluate((width) => window.setContainerWidth(width), CONTAINER_WIDTH)
      await page.evaluate((cardConfig) => window.renderCard(cardConfig), config)

      const measuredHeight = await page.evaluate(() => window.measureCardHeight())
      const modelRows = await page.evaluate(() => window.getGridOptions().rows)
      const measuredRows = rowsForHeight(measuredHeight)

      // Record the numbers so divergence between the model and reality is visible.
      testInfo.annotations.push({
        type: 'measurement',
        description: `height=${measuredHeight.toFixed(2)}px measuredRows=${measuredRows} modelRows=${modelRows}`
      })

      expect(modelRows).toBeGreaterThanOrEqual(measuredRows)

      await expect(page.locator('#container')).toHaveScreenshot(`${name}.png`)
    })
  }
})
