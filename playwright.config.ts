import { defineConfig, devices } from '@playwright/test'

// Port for the bundled static file server (see tests/visual/server.mjs).
const PORT = 5050
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: 'tests/visual',
  // Visual specs render the built bundle and compare screenshots, so keep runs
  // serial for stable measurements and deterministic baselines.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list']],
  expect: {
    // Baselines are generated in the Linux Playwright container; allow a tiny
    // amount of anti-aliasing noise so runs on the same image stay stable.
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 }
  },
  use: {
    baseURL: BASE_URL
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: `node tests/visual/server.mjs .`,
    url: `${BASE_URL}/tests/visual/harness.html`,
    reuseExistingServer: !process.env.CI,
    env: { PORT: String(PORT) }
  }
})
