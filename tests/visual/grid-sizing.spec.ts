import { expect, test } from '@playwright/test'

declare global {
  interface Window {
    setContainerWidth: (width: number) => void
    renderCard: (config: Record<string, unknown>) => Promise<unknown>
    measureCardHeight: () => number
  }
}

// The card is rendered as a full-width (12 column) Sections-view card.
const CONTAINER_WIDTH = 492

// getGridOptions() intentionally omits `rows` so the card sizes to its rendered
// content (issue #192) rather than being quantized to whole grid rows. These tests
// therefore render each configuration at a stable width and pin the drawing with a
// screenshot; the moon cases additionally guard the disc geometry for #82 and #142.

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

test.describe('Sections view rendering', () => {
  for (const { name, config } of cases) {
    test(`renders ${name}`, async ({ page }, testInfo) => {
      await page.goto('/tests/visual/harness.html')
      await page.evaluate((width) => window.setContainerWidth(width), CONTAINER_WIDTH)
      await page.evaluate((cardConfig) => window.renderCard(cardConfig), config)

      // Record the rendered height so unexpected size changes surface in the report.
      const measuredHeight = await page.evaluate(() => window.measureCardHeight())
      testInfo.annotations.push({
        type: 'measurement',
        description: `height=${measuredHeight.toFixed(2)}px`
      })

      await expect(page.locator('#container')).toHaveScreenshot(`${name}.png`)
    })
  }
})
