import { expect, test } from '@playwright/test'

declare global {
  interface Window {
    renderCard: (config: Record<string, unknown>) => Promise<unknown>
  }
}

// Proves the themeable-variable fix: a graph colour resolves — through the use-site
// var(--token, fallback) chain — from a Home Assistant theme (a value set on an ancestor of the
// card host, like :root), from card-mod/Uix (a value on ha-card inside the shadow), and from the
// built-in default. Before the fix the tokens were declared on :host, which masked the theme case.

const GRAPH_ONLY = { fields: false }

async function strokeOf (page, selector: string) {
  return page.evaluate((sel) => {
    const card = document.getElementById('card') as HTMLElement & { shadowRoot: ShadowRoot }
    const el = card.shadowRoot.querySelector(sel)
    return el ? getComputedStyle(el).stroke : null
  }, selector)
}

test.describe('themeable graph colours', () => {
  test('default resolves to the accent colour', async ({ page }) => {
    await page.goto('/tests/visual/harness.html')
    await page.evaluate((c) => window.renderCard(c), GRAPH_ONLY)
    expect(await strokeOf(page, '.horizon-card-sunrise-line')).toBe('rgb(215, 215, 215)') // #d7d7d7
  })

  test('a theme value on an ancestor (like :root) applies', async ({ page }) => {
    await page.goto('/tests/visual/harness.html')
    await page.addStyleTag({ content: '#container { --hc-sunrise-line-color: rgb(255, 0, 0); }' })
    await page.evaluate((c) => window.renderCard(c), GRAPH_ONLY)
    expect(await strokeOf(page, '.horizon-card-sunrise-line')).toBe('rgb(255, 0, 0)')
  })

  test('a card-mod value on ha-card applies', async ({ page }) => {
    await page.goto('/tests/visual/harness.html')
    await page.evaluate((c) => window.renderCard(c), GRAPH_ONLY)
    await page.evaluate(() => {
      const card = document.getElementById('card') as HTMLElement & { shadowRoot: ShadowRoot }
      const haCard = card.shadowRoot.querySelector('ha-card') as HTMLElement
      haCard.style.setProperty('--hc-sunrise-line-color', 'rgb(0, 0, 255)')
    })
    expect(await strokeOf(page, '.horizon-card-sunrise-line')).toBe('rgb(0, 0, 255)')
  })

  test('the time arrow defaults to the horizon-line colour', async ({ page }) => {
    await page.goto('/tests/visual/harness.html')
    // Only the horizon-line colour is set (not the arrow's own) — the arrow should follow it.
    await page.addStyleTag({ content: '#container { --hc-horizon-line-color: rgb(0, 128, 0); }' })
    await page.evaluate((c) => window.renderCard(c), GRAPH_ONLY)
    expect(await strokeOf(page, '.horizon-card-time-arrow')).toBe('rgb(0, 128, 0)')
  })
})
