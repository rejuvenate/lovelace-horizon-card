import './components/horizonCard'

// The placeholder below is replaced with the git tag by the release CI (see the "Stamp the release
// version" steps in .github/workflows/release.yaml and prerelease.yaml), since the version lives in
// the GitHub tag, not package.json. A local or dev build keeps the placeholder and reports "dev".
// It must survive bundling verbatim, so keep it a plain string literal (the build has no minifier).
const CARD_VERSION = '__HORIZON_CARD_VERSION__'
const version = CARD_VERSION.startsWith('__') ? 'dev' : CARD_VERSION
const REPOSITORY = 'https://github.com/rejuvenate/lovelace-horizon-card'

// eslint-disable-next-line no-console
console.info(
  `%c🌅 HORIZON-CARD %c ${version} %c ${REPOSITORY}`,
  'color:#fff;background:#3b5566;font-weight:bold;padding:2px 6px;border-radius:5px 0 0 5px',
  'color:#222;background:#f5cb5c;font-weight:bold;padding:2px 6px;border-radius:0 5px 5px 0',
  'color:inherit;background:none'
)
