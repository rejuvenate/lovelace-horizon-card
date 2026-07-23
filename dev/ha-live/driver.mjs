// Playwright driver for dev/ha-live/verify.sh. Runs inside the horizon-card-visual image (which has
// Playwright + a matching Chromium), joined to the compose network so it reaches Home Assistant at
// http://homeassistant:8123. It waits for HA, finishes onboarding over the API, logs in with a
// browser, then screenshots the target (a dashboard, a single card, or the visual editor) into /out.
//
// Fatal (non-zero exit): HA never ready, onboarding/login fails, no card renders, or the page throws
// an uncaught JS error. Benign console warnings/errors from the HA frontend are recorded but do not
// fail the run.
import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

const env = process.env
const HA_URL = (env.HA_URL || 'http://homeassistant:8123').replace(/\/$/, '')
const CLIENT = HA_URL + '/'
const HA_USER = env.HA_USER || 'dev'
const HA_PASS = env.HA_PASS || 'ha-live-dev'
const HA_LANG = env.HA_LANG || 'en'
const MODE = env.MODE || 'dashboard'
const EDITOR_TYPE = env.EDITOR_TYPE || 'horizon-card'
const OUT = env.OUT || '/out'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const log = (msg) => console.log(`[driver] ${msg}`)

async function waitForHomeAssistant () {
  for (let i = 0; i < 90; i++) {
    try {
      const res = await fetch(`${HA_URL}/api/onboarding`)
      if (res.status === 200) { return res.json() }
    } catch { /* not up yet */ }
    await sleep(2000)
  }
  throw new Error('Home Assistant did not become ready within ~180s')
}

// Finish onboarding headlessly. HA only marks the instance onboarded once user, core_config,
// analytics AND integration are all done; a fresh browser login otherwise lands on the wizard.
async function onboard (steps) {
  if (steps.every((step) => step.done)) { log('already onboarded'); return }

  const userRes = await fetch(`${HA_URL}/api/onboarding/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT, name: 'Dev', username: HA_USER, password: HA_PASS, language: HA_LANG })
  })
  if (!userRes.ok) { throw new Error(`onboarding/users -> HTTP ${userRes.status}`) }
  const user = await userRes.json()
  if (!user.auth_code) { throw new Error('onboarding/users returned no auth_code') }

  const tokenRes = await fetch(`${HA_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'authorization_code', code: user.auth_code, client_id: CLIENT })
  })
  if (!tokenRes.ok) { throw new Error(`auth/token -> HTTP ${tokenRes.status}`) }
  const token = await tokenRes.json()
  if (!token.access_token) { throw new Error('auth/token returned no access_token') }

  const headers = { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' }
  const finalSteps = [
    ['/api/onboarding/core_config', '{}'],
    ['/api/onboarding/analytics', '{}'],
    ['/api/onboarding/integration', JSON.stringify({ client_id: CLIENT, redirect_uri: `${CLIENT}?auth_callback=1` })]
  ]
  for (const [path, body] of finalSteps) {
    const res = await fetch(`${HA_URL}${path}`, { method: 'POST', headers, body })
    if (!res.ok) { throw new Error(`${path} -> HTTP ${res.status}`) }
  }
  log('onboarding complete')
}

async function login (page) {
  await page.goto(HA_URL, { waitUntil: 'domcontentloaded' })
  // The login form lives in the frontend's shadow DOM; Playwright locators pierce open shadow roots.
  // These accessible names are the English labels (context locale is en-US, onboarding language en);
  // they would need adjusting for a Home Assistant version that renamed them or a non-en language.
  await page.getByRole('textbox', { name: 'Username' }).fill(HA_USER)
  await page.getByRole('textbox', { name: 'Password' }).fill(HA_PASS)
  await page.getByRole('button', { name: 'Log in' }).click()
  // Wait until the dashboard shell is up.
  await page.locator('home-assistant').waitFor({ state: 'attached', timeout: 30000 })
  await page.waitForFunction(() => !location.pathname.startsWith('/auth'), null, { timeout: 30000 })
}

async function screenshotDashboard (page, report) {
  // Wait for at least one card of ours to render (fatal if none appears).
  await page.locator(`${EDITOR_TYPE}`).first().waitFor({ state: 'attached', timeout: 30000 })
  await sleep(1500) // let the two-phase graph calculation settle

  const full = `${OUT}/00-dashboard.png`
  await page.screenshot({ path: full, fullPage: true })
  report.screenshots.push(full)
  log(`wrote ${full}`)

  // Per-card screenshots are best-effort: a slicing failure must not fail the run.
  try {
    const cards = page.locator('hui-view hui-card')
    const count = await cards.count()
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      if (!(await card.isVisible())) { continue }
      const file = `${OUT}/${String(i + 1).padStart(2, '0')}-card.png`
      await card.screenshot({ path: file })
      report.screenshots.push(file)
    }
    log(`wrote ${count} per-card screenshots`)
  } catch (err) {
    report.warnings.push(`per-card screenshots skipped: ${err.message}`)
  }
}

async function screenshotEditor (page, report) {
  // The card resource is loaded (a card of this type is on the dashboard), so getConfigElement is
  // defined. Mount the editor with the live hass and expand every section, then screenshot it.
  const mounted = await page.evaluate(async (type) => {
    const ctor = customElements.get(type)
    if (!ctor || typeof ctor.getConfigElement !== 'function') {
      return { ok: false, reason: `${type} has no getConfigElement (bundle without an editor?)` }
    }
    const ha = document.querySelector('home-assistant')
    const editor = await ctor.getConfigElement()
    const container = document.createElement('div')
    container.id = 'ha-live-editor'
    container.style.cssText = 'position:fixed;top:0;left:0;z-index:99999;width:400px;padding:16px;' +
      'background:var(--card-background-color,#fff);color:var(--primary-text-color,#000);box-sizing:border-box;'
    container.appendChild(editor)
    document.body.appendChild(container)
    editor.hass = ha && ha.hass
    editor.setConfig({ type: `custom:${type}` })
    return { ok: true }
  }, EDITOR_TYPE)

  if (!mounted.ok) { throw new Error(mounted.reason) }
  await sleep(2000) // let ha-form lazy-load its selectors

  // Expand any collapsible sections so the whole form is visible.
  await page.evaluate(() => {
    const editor = document.querySelector('#ha-live-editor *')
    const form = editor && editor.shadowRoot && editor.shadowRoot.querySelector('ha-form')
    if (!form || !form.shadowRoot) { return }
    form.shadowRoot.querySelectorAll('ha-form-expandable').forEach((exp) => {
      const panel = exp.shadowRoot && exp.shadowRoot.querySelector('ha-expansion-panel')
      if (panel) { panel.expanded = true }
    })
  })
  await sleep(1000)

  const file = `${OUT}/editor.png`
  await page.locator('#ha-live-editor').screenshot({ path: file })
  report.screenshots.push(file)
  log(`wrote ${file}`)
}

async function main () {
  await mkdir(OUT, { recursive: true })
  const report = { mode: MODE, haUrl: HA_URL, screenshots: [], pageErrors: [], consoleErrors: [], warnings: [] }

  log('waiting for Home Assistant...')
  const steps = await waitForHomeAssistant()
  await onboard(steps)

  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] })
  const context = await browser.newContext({ locale: 'en-US', viewport: { width: 1280, height: 900 } })
  const page = await context.newPage()
  page.on('pageerror', (err) => report.pageErrors.push(String(err.message || err)))
  page.on('console', (msg) => { if (msg.type() === 'error') { report.consoleErrors.push(msg.text()) } })

  try {
    log('logging in...')
    await login(page)
    if (MODE === 'editor') {
      await screenshotEditor(page, report)
    } else {
      await screenshotDashboard(page, report)
    }
  } finally {
    await writeFile(`${OUT}/report.json`, JSON.stringify(report, null, 2))
    await browser.close()
  }

  if (report.pageErrors.length > 0) {
    log(`FAIL: ${report.pageErrors.length} uncaught page error(s):`)
    report.pageErrors.forEach((e) => log(`  ${e}`))
    process.exit(1)
  }
  log(`OK: ${report.screenshots.length} screenshot(s) in ${OUT}`)
  if (report.consoleErrors.length > 0) { log(`(${report.consoleErrors.length} benign console error(s) recorded in report.json)`) }
}

main().catch((err) => { console.error(`[driver] ${err.stack || err}`); process.exit(1) })
