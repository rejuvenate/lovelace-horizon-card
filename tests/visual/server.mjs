// Minimal dependency-free static file server used by Playwright's webServer.
// Serves the repository root so the harness (tests/visual/harness.html) can
// load the built bundle at dist/lovelace-horizon-card.js.
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'

const root = resolve(process.argv[2] ?? '.')
const port = Number(process.env.PORT ?? 5050)

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${port}`)
    const requestedPath = decodeURIComponent(url.pathname)
    const filePath = join(root, normalize(requestedPath))

    if (!filePath.startsWith(root)) {
      res.writeHead(403).end('Forbidden')
      return
    }

    const body = await readFile(filePath)
    res.writeHead(200, { 'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end('Not found')
  }
})

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`static server serving ${root} on http://localhost:${port}`)
})
