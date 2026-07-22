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
    config: { fields: false }
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
  },
  {
    // Guard for `graph: false` (#179/#204): a values-only card must render its
    // fields with no graph and no leftover whitespace — and must NOT throw from
    // the sun-path geometry lookup, whose SVG element no longer exists.
    name: 'values-only-no-graph',
    config: {
      graph: false,
      fields: {
        sunrise: false, sunset: false, dawn: true, noon: true, dusk: true,
        azimuth: true, elevation: true, moonrise: true, moonset: true, moon_phase: true
      }
    }
  },
  {
    // Guard for `sun: false` (#126 "Moon only"): the graph renders the moon over
    // the horizon with no sun disc, no sun curve, no day/night shading and no
    // sunrise/sunset lines.
    name: 'moon-only-no-sun',
    config: {
      sun: false,
      fields: {
        sunrise: false, sunset: false, dawn: false, noon: false, dusk: false,
        moonrise: true, moonset: true, moon_phase: true
      }
    }
  },
  {
    // Guard for the night shading at low latitudes: near the equator scaleY ~ 1, so the fitted
    // frame reaches below the old fixed y=150 and the night fill must extend to the frame bottom
    // (no unshaded strip). All other cases are lat 52.5, which never exercises this.
    name: 'equator-with-moon',
    config: {
      latitude: 0,
      fields: { moonrise: true, moonset: true, moon_phase: true }
    }
  },
  {
    // Graph-crop override: a fixed extent above/below the horizon (via the CSS variables),
    // producing a fixed frame regardless of the fitted content. Uses the low winter sun so the
    // pinned frame stays clean instead of clipping a high summer arc.
    name: 'graph-crop-fixed',
    config: {
      now: '2023-12-21T13:00:00Z',
      latitude: 65,
      fields: false,
      _cssVars: { '--hc-graph-above-horizon': '55', '--hc-graph-below-horizon': '35' }
    }
  },
  {
    // Cropping disabled: setting the classic 84 above / 66 below reproduces the old fixed
    // 0 0 550 150 frame.
    name: 'graph-crop-off',
    config: {
      fields: false,
      _cssVars: { '--hc-graph-above-horizon': '84', '--hc-graph-below-horizon': '66' }
    }
  },
  {
    // sunrise_sunset_lines: false hides the vertical sunrise/sunset lines; the sun path and shading stay.
    name: 'graph-sunrise-sunset-lines-off',
    config: {
      fields: false,
      sunrise_sunset_lines: false
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
