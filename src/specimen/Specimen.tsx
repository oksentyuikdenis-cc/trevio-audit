import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { contrast, verdict } from './contrast'

/**
 * Read a token's value out of the stylesheet.
 *
 * This page used to keep its own copy of every hex, and the copy drifted: it
 * was still showing text-body as #6D6864 long after tokens.css had moved to
 * #696460 — so the one page whose job is to catch an unsafe colour was
 * rendering a comfortable ratio for a value that had already been rejected for
 * failing AA on surface-2. The header promises these ratios are computed
 * rather than copied from a table; that is only true if the hex comes from the
 * stylesheet too. A duplicated token is a token that will eventually be wrong.
 */
function token(name: string): string {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(`--mur-${name}`)
    .trim()
  return raw.toUpperCase()
}

/**
 * `on` is the token whose background the ratio is measured against, or null
 * for tokens that are never allowed to carry text. Keep this list in step with
 * the colour tokens in tokens.css — `MISSING` in the hex column means a name
 * here has no matching token, which is itself worth seeing.
 */
const COLOURS: { name: string; on: string | null; note: string }[] = [
  { name: 'paper', on: null, note: 'body base' },
  { name: 'surface-1', on: null, note: 'lighter section' },
  { name: 'surface-2', on: null, note: 'warmer section' },
  { name: 'surface-3', on: null, note: 'warmer section, alternate' },
  { name: 'card', on: null, note: 'card fill' },
  { name: 'ink', on: 'paper', note: 'primary text' },
  { name: 'ink-warm', on: 'paper', note: 'dark block' },
  { name: 'text-body', on: 'surface-2', note: 'secondary text — measured on its worst surface' },
  { name: 'accent', on: 'paper', note: 'burnt amber — decorative accent' },
  { name: 'accent-moss', on: 'paper', note: 'SEMANTIC ONLY — our figure vs theirs' },
  { name: 'accent-tint', on: null, note: 'quiet fill behind a chip or quote' },
  { name: 'line', on: 'paper', note: 'HAIRLINE ONLY — never text' },
  { name: 'line-soft', on: null, note: 'divider inside a card' },
  { name: 'sage', on: null, note: 'decorative fill only' },
  { name: 'dark', on: null, note: 'the one dark block' },
  { name: 'dark-deep', on: null, note: 'footer, a hair below the CTA' },
  { name: 'on-dark', on: 'dark', note: 'text on the dark block' },
  { name: 'on-dark-body', on: 'dark', note: 'secondary on dark' },
]

const TYPE = [
  { cls: 'display', label: 'display · 74.8/82.2 · w600 · ls -0.02em', text: 'Your customers already told you.' },
  { cls: 'h2', label: 'h2 · 35.7/44.6 · w500', text: 'Three steps, and the last one is the point.' },
  { cls: 'h3', label: 'h3 · 22/28.6 · w500', text: 'Duplicates merge before you see them' },
  { cls: 'eyebrow', label: 'eyebrow · 18.6/27 · w400', text: 'Feedback intelligence for product teams' },
  { cls: 'small', label: 'small · 15/22.5 · w400', text: '34 conversations · 19 customers · last 14 days' },
]

const RADII = [
  { name: 'sm · 8px', value: '8px' },
  { name: 'md · 12px', value: '12px' },
  { name: 'lg · 20px', value: '20px' },
  { name: 'xl · 80px', value: '80px' },
  { name: 'pill', value: '999px' },
]

const MOTION = [
  { name: 'rise', moves: 'opacity + 12px', use: 'text, headings, list items — the default' },
  { name: 'lift', moves: 'opacity + 6px', use: 'tables, full-width cards, large blocks' },
  { name: 'fade', moves: 'opacity only', use: 'the nav, and anything already in position' },
  { name: 'assemble', moves: 'opacity + 6px + scale .994', use: 'the insight card, and nothing else' },
  { name: 'bar', moves: 'scaleX from 0', use: 'chart columns — never an animated width' },
  { name: 'data-count', moves: 'text, tabular figures', use: 'the two volume counters' },
]

const SPACE = [
  { name: '1 · 8', px: 8 },
  { name: '2 · 12', px: 12 },
  { name: '3 · 16', px: 16 },
  { name: '4 · 25.6', px: 25.6 },
  { name: '5 · 32', px: 32 },
  { name: '6 · 64', px: 64 },
]

export function Specimen() {
  return (
    <div className="spec">
      <div className="container">
        <header className="spec__title">
          <p className="eyebrow">Murano — design code</p>
          <h1 className="display">Every token, rendered.</h1>
          <p className="prose" style={{ marginTop: 16 }}>
            Values measured from the reference at 1280px. Contrast ratios below are computed
            from the hex values on this page, not copied from a table — if a token stops being
            safe as text, this page says so before a section does.
          </p>
        </header>

        {/* ---------- Colour ---------- */}
        <section className="spec__block">
          <h2 className="spec__block-title">Colour</h2>
          <ul className="spec__swatches">
            {COLOURS.map((colour) => {
              const hex = token(colour.name)
              const against = colour.on ? token(colour.on) : null
              const ratio = hex && against ? contrast(hex, against) : null
              const grade = ratio === null ? null : verdict(ratio)
              return (
                <li key={colour.name}>
                  <div className="spec__swatch-chip" style={{ background: hex || 'transparent' }} />
                  <div className="spec__swatch-name">{colour.name}</div>
                  <div className="spec__swatch-hex nums">{hex || 'MISSING'}</div>
                  <div
                    className={`spec__swatch-ratio nums${grade === 'fail' ? ' spec__swatch-ratio--fail' : ''}`}
                  >
                    {ratio === null
                      ? colour.note
                      : `${ratio.toFixed(2)}:1 on ${colour.on} · ${grade} · ${colour.note}`}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        {/* ---------- Type ---------- */}
        <section className="spec__block">
          <h2 className="spec__block-title">Type — Inter Variable, weights 400/500/600</h2>
          {TYPE.map((row) => (
            <div className="spec__type-row" key={row.cls}>
              <div className="spec__type-meta nums">{row.label}</div>
              <div className={row.cls}>{row.text}</div>
            </div>
          ))}
          <div className="spec__type-row">
            <div className="spec__type-meta">
              700 is forbidden — the @font-face clamps the axis, so this &lt;strong&gt; renders
              at 600 rather than bold
            </div>
            <p>
              A paragraph at body size with <strong>a bold run inside it</strong> to prove the
              clamp holds.
            </p>
          </div>
        </section>

        {/* ---------- Buttons ---------- */}
        <section className="spec__block">
          <h2 className="spec__block-title">Buttons — always pill, always weight 400</h2>
          <div className="spec__row">
            <Button>Apply as a design partner</Button>
            <Button variant="secondary">See what it produces</Button>
            <Button size="sm">Small</Button>
            <Button variant="secondary" size="sm">
              Small secondary
            </Button>
          </div>
          <div
            className="spec__row surface-dark"
            style={{ marginTop: 16, padding: 24, borderRadius: 20 }}
          >
            <Button>On the dark block</Button>
            <Button variant="secondary">Secondary</Button>
          </div>
        </section>

        {/* ---------- Cards ---------- */}
        <section className="spec__block">
          <h2 className="spec__block-title">Cards — depth is a hairline, not a shadow</h2>
          <ul className="spec__cards">
            <li>
              <Card>
                <div className="spec__swatch-name">Default · 8px</div>
                <p className="small" style={{ color: 'var(--mur-text-body)' }}>
                  Card fill, hairline border, no shadow.
                </p>
              </Card>
            </li>
            <li>
              <Card size="lg">
                <div className="spec__swatch-name">Large · 20px</div>
                <p className="small" style={{ color: 'var(--mur-text-body)' }}>
                  For large blocks only. On something small it reads as a pill.
                </p>
              </Card>
            </li>
            <li>
              <Card variant="quiet">
                <div className="spec__swatch-name">Quiet</div>
                <p className="small" style={{ color: 'var(--mur-text-body)' }}>
                  Transparent fill, softer rule.
                </p>
              </Card>
            </li>
            <li>
              <Card lift>
                <div className="spec__swatch-name">Lifted</div>
                <p className="small" style={{ color: 'var(--mur-text-body)' }}>
                  The one shadow in the system. Use almost never.
                </p>
              </Card>
            </li>
          </ul>
        </section>

        {/* ---------- Surfaces ---------- */}
        <section className="spec__block">
          <h2 className="spec__block-title">
            Surfaces — layers are 2–5 units of warmth, not contrast
          </h2>
          <ul className="spec__surfaces">
            <li className="spec__surface" style={{ background: 'var(--mur-paper)' }}>
              paper
            </li>
            <li className="spec__surface" style={{ background: 'var(--mur-surface-1)' }}>
              surface-1
            </li>
            <li className="spec__surface" style={{ background: 'var(--mur-surface-2)' }}>
              surface-2
            </li>
            <li className="spec__surface" style={{ background: 'var(--mur-surface-3)' }}>
              surface-3
            </li>
            <li className="spec__surface" style={{ background: 'var(--mur-card)' }}>
              card
            </li>
            <li className="spec__surface surface-dark">dark · the one block</li>
          </ul>
        </section>

        {/* ---------- Radii and space ---------- */}
        <section className="spec__block">
          <h2 className="spec__block-title">Radii</h2>
          <ul className="spec__radii">
            {RADII.map((r) => (
              <li className="spec__radius" key={r.name} style={{ borderRadius: r.value }}>
                {r.name}
              </li>
            ))}
          </ul>
        </section>

        <section className="spec__block">
          <h2 className="spec__block-title">Space — 8 · 12 · 16 · 25.6 · 32 · 64</h2>
          <ul className="spec__space">
            {SPACE.map((s) => (
              <li key={s.name}>
                <div className="spec__space-bar" style={{ width: s.px, height: s.px }} />
                <div className="spec__space-label nums">{s.name}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Motion ---------- */}
        <section className="spec__block">
          <h2 className="spec__block-title">Motion — six variants, one observer</h2>
          <p className="prose" style={{ marginBottom: 25.6 }}>
            Components declare intent with <code>data-motion</code> and never write their own
            keyframes. Only <code>opacity</code> and <code>transform</code> animate, so nothing
            here touches layout or paint. The hidden state exists only once JS has confirmed it
            can un-hide it — every failure path leaves the page readable rather than blank.
          </p>
          <table className="spec__table">
            <thead>
              <tr>
                <th scope="col">Variant</th>
                <th scope="col">What moves</th>
                <th scope="col">Used for</th>
              </tr>
            </thead>
            <tbody>
              {MOTION.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.moves}</td>
                  <td>{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="small" style={{ marginTop: 25.6, color: 'var(--mur-text-body)' }}>
            Stagger is one step of 60ms per element, assigned by the hook and capped at 8.
            A nested sequence carries <code>data-motion-base</code> so it continues its
            parent&rsquo;s count instead of overtaking the container it sits in. Entrances run
            520ms on <code>cubic-bezier(.16, 1, .3, 1)</code>; interaction feedback runs 120–160ms.
            Nothing bounces and nothing scales beyond 0.994.
          </p>
        </section>

        <section className="spec__block">
          <h2 className="spec__block-title">Rhythm</h2>
          <p className="prose">
            A section is <code>padding-block: 76.8px</code>, constant, with no special cases
            except the hero. Resisting per-section tuning is what makes the page read as one
            document rather than nine stacked ones.
          </p>
        </section>
      </div>
    </div>
  )
}
