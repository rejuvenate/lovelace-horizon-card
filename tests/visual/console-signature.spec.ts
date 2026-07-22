import { expect, test } from '@playwright/test'

// The bundle logs a name + version signature to the console when it loads (#227), so a user can
// confirm the resource loaded and which version. A local/CI build leaves the version placeholder
// unstamped and reports "dev"; the release CI replaces it with the git tag.
test('logs a version signature to the console on load', async ({ page }) => {
  const messages: string[] = []
  page.on('console', (msg) => messages.push(msg.text()))

  await page.goto('/tests/visual/harness.html')
  await page.waitForFunction(() => Array.isArray((window as { customCards?: unknown[] }).customCards))

  const signature = messages.find((m) => m.toUpperCase().includes('HORIZON-CARD'))
  expect(signature).toBeTruthy()
  expect(signature).toContain('dev')
  // The repository link is included for identification and issue tracking.
  expect(signature).toContain('https://github.com/rejuvenate/lovelace-horizon-card')
})
