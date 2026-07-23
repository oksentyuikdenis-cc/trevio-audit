import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { SectionHead } from '../ui/SectionHead'
import { HEADINGS } from '../data/content'
import {
  BAKED_TARGETS,
  CACHED_AUDIT,
  fetchTargets,
  lookupBaked,
  probeAuditServer,
  runAudit,
  type AuditResult,
  type AuditTarget,
} from '../data/audit'
import './Insight.css'
import './LiveAudit.css'

const { liveAudit } = HEADINGS

/**
 * Section five. Formerly the reserved 3D slot.
 *
 * The slot was built to answer three questions before a scene was written:
 * where it lands in the scroll, what surface surrounds it, and what the page
 * weighs without it. The answer turned out to be that the space is worth more
 * as proof than as decoration — section two shows the output on invented data
 * and admits it, and this runs the identical card on whatever real product a
 * visitor names.
 *
 * Three rules hold this together:
 *
 *  1. It renders complete before any network call. The cached audit is
 *     imported, not fetched, so the offline build has a full card. A section
 *     that needed a server to have content would break the build's one promise.
 *  2. Card markup is Insight.css, imported above rather than reimplemented.
 *     If this section drew its own card, "same output format" would be a claim
 *     instead of a fact a reader can check in the stylesheet.
 *  3. The search bar is an upgrade and disappears without a server. What never
 *     disappears is the result and the ability to print it.
 */
export function LiveAudit() {
  const [audit, setAudit] = useState<AuditResult>(CACHED_AUDIT)
  const [canRun, setCanRun] = useState(false)
  const [targets, setTargets] = useState<AuditTarget[]>([])
  const [product, setProduct] = useState('')
  const [log, setLog] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abort = useRef<AbortController | null>(null)

  // Progressive enhancement, deliberately one-way: the search bar appears if a
  // run server answered and never disappears again. A control that vanishes
  // mid-session because one probe timed out is worse than one that fails
  // loudly when pressed.
  useEffect(() => {
    const controller = new AbortController()
    probeAuditServer(controller.signal).then((ok) => {
      if (!ok) return
      setCanRun(true)
      fetchTargets(controller.signal).then(setTargets)
    })
    return () => controller.abort()
  }, [])

  useEffect(() => () => abort.current?.abort(), [])

  async function run(term: string) {
    const query = term.trim()
    if (!query || running) return

    abort.current?.abort()
    setError(null)
    setLog([])

    // The bundle answers first. A baked name resolves with no network at all,
    // which is what makes this work on a phone that scanned the QR — and it is
    // also strictly better on stage, where a cached card appearing instantly
    // beats the same card after a minute of watching a log.
    //
    // The card stamps itself "Cached run", so nothing here pretends to be a
    // search that did not happen.
    const baked = lookupBaked(query)
    if (baked) {
      setAudit(baked)
      return
    }

    // Nothing baked matches, and there is no server to ask. Say so plainly and
    // leave the previous audit alone rather than implying it is the answer to
    // what was just typed.
    if (!canRun) {
      setError(
        `No audit of “${query}” travels with this page. The three above were computed in advance; ` +
          `auditing anything else runs the pipeline live, which needs the run server.`,
      )
      return
    }

    const controller = new AbortController()
    abort.current = controller
    setRunning(true)

    try {
      for await (const event of runAudit(query, controller.signal)) {
        if (event.type === 'progress') setLog((l) => [...l, event.message])
        else if (event.type === 'result') setAudit(event.result)
        else setError(event.message)
      }
    } catch (err) {
      // An abort is the user starting another run, not a failure worth showing.
      if ((err as Error).name !== 'AbortError') {
        setError('Could not reach the audit server. Showing the previous run.')
      }
    } finally {
      setRunning(false)
    }
  }

  // Baked names first — those answer with no network and are what a phone that
  // scanned the QR can actually use. A server adds whatever else it has baked,
  // deduplicated by slug so the same target does not appear twice.
  const chips: AuditTarget[] = [
    ...BAKED_TARGETS,
    ...targets.filter((t) => !BAKED_TARGETS.some((b) => b.slug === t.slug)),
  ]

  // Defensive on two fields that come off the wire.
  //
  // `insights[0]` was destructured unguarded and `meta.model` had .startsWith
  // called on it directly, so a result carrying zero insights — or one missing
  // model attribution — threw during render. There is no error boundary
  // anywhere in this app, so that is not a broken card: it is a white screen
  // where the whole page used to be, in front of a room. The server does try
  // not to send such a result, but "the other side promised" is not a reason
  // for the render path to be unable to survive one.
  const [lead, ...rest] = audit.insights ?? []
  const live = audit.meta.mode === 'live'
  const baseline = (audit.meta.model ?? '').startsWith('keyword baseline')

  return (
    <section className="section" id="live-audit" data-motion-group>
      <div className="container">
        <SectionHead eyebrow={liveAudit.eyebrow} title={liveAudit.title} lead={liveAudit.lead} />

        {/* The search bar is always here now, not only when a run server
            answered. The page is handed round on phones by QR, where a server
            is unreachable by construction — and a page that shows a reader one
            audit and no way to ask for another is a screenshot, not a tool.
            Three audits ship in the bundle and answer instantly with no
            network at all; a reachable server upgrades that to anything. */}
        <div className="audit__search" data-motion="rise">
          <input
            aria-label="Product to audit"
            className="audit__field"
            value={product}
            disabled={running}
            placeholder={canRun ? 'Name a product, an app, or a place…' : 'Trenitalia, Satispay, Notion…'}
            onChange={(e) => setProduct(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run(product)}
          />
          <Button onClick={() => run(product)}>{running ? 'Reading…' : 'Read it'}</Button>
        </div>

        {chips.length > 0 && (
          <p className="audit__suggest" data-motion="rise">
            <span>Instant:</span>
            {chips.map((t) => (
              <button
                key={t.slug}
                type="button"
                className="audit__chip"
                disabled={running}
                onClick={() => {
                  setProduct(t.productName)
                  run(t.productName)
                }}
              >
                {t.productName}
              </button>
            ))}
            <span>
              {canRun
                ? '— anything else runs live, in about a minute.'
                : '— these three are computed and travel with the page. Auditing anything else needs the run server.'}
            </span>
          </p>
        )}

        {/* Only on paper: the printed audit leaves as its own document and has
            to say what it is and where the numbers came from. */}
        <p className="audit__print-head">
          <strong>Trevio — feedback audit: {audit.meta.productName}</strong>
          <br />
          {/* The sources are named from what actually arrived, never assumed.
              This line used to read "public App Store reviews" on every audit;
              on Trenitalia, the one printed most often, 63% of the corpus came
              from Google Play. A report that misstates its own provenance is
              the exact failure the rest of this page argues against, and on
              paper it travels without anyone present to correct it. */}
          {audit.meta.volumeTotal.toLocaleString('en-US')} public reviews from{' '}
          {audit.sources.map((s) => s.name).join(', ')} over {audit.meta.windowDays} days, to{' '}
          {audit.meta.generatedAt.slice(0, 10)}. Every figure computed from the review rows; every
          quote verbatim. Themes and wording by {audit.meta.model}.
        </p>

        <div className="audit__bar" data-motion="rise">
          {/* Provenance, in the same pill Insight uses for its fictional-data
              admission. Read together, the two labels are the argument. */}
          <p className="audit__stamp">
            <span className="audit__dot" aria-hidden="true" />
            {live ? 'Live' : 'Cached run'} · {audit.meta.productName} ·{' '}
            {audit.meta.volumeTotal.toLocaleString('en-US')} reviews · {audit.meta.windowDays} days
            {baseline && ' · keyword baseline'}
            {/* Which model, and where it ran. The server has always computed
                this string — "Mistral mistral-large-latest · EU (Paris)" —
                specifically so the card could carry it, and the card was
                dropping it. For a product whose pitch is that customer data
                stays in Europe, the processing region is not metadata; it is
                the claim, and an audit that cannot say where it was computed
                is not evidence for it. */}
            {audit.meta.model && ` · ${audit.meta.model}`}
          </p>
        </div>

        {/* The selection ledger.
            This is the section's real claim. Anyone can pipe a thousand
            comments into a model; the argument here is that most of them were
            read and rejected, and an argument like that is worth nothing
            unless the count and the reasons are both on the page. */}
        {audit.meta.itemsRead && audit.meta.itemsRead > audit.meta.volumeTotal && (
          <p className="audit__ledger nums" data-motion="rise">
            <strong>{audit.meta.itemsRead.toLocaleString('en-US')}</strong> collected ·{' '}
            <strong>{audit.meta.volumeTotal.toLocaleString('en-US')}</strong> read closely
            {audit.meta.dropped?.length ? (
              <>
                {' — set aside: '}
                {audit.meta.dropped.map((d, i) => (
                  <span key={d.reason}>
                    {i > 0 && ', '}
                    {d.count.toLocaleString('en-US')} {d.reason}
                  </span>
                ))}
              </>
            ) : null}
            {audit.sources.length > 1 && (
              <>
                {' · from '}
                {audit.sources.map((s, i) => (
                  <span key={s.id}>
                    {i > 0 && ', '}
                    {s.name} {Math.round(s.share * 100)}%
                  </span>
                ))}
              </>
            )}
          </p>
        )}

        {log.length > 0 && (
          <ul className="audit__log" aria-live="polite">
            {log.map((line, i) => (
              <li key={`${i}-${line}`}>{line}</li>
            ))}
          </ul>
        )}

        {error && <p className="audit__error">{error}</p>}

        {!lead ? (
          // A result with no insights is a real outcome — a corpus can fail to
          // cluster above the noise floor — and saying so is the honest card.
          // Rendering the insight block regardless is what turned that outcome
          // into a white page.
          <Card size="lg" className="insight__card">
            <p className="prose">
              Nothing clustered above the noise floor for {audit.meta.productName}. The reviews were
              read; they did not agree on a theme often enough for a finding to be worth printing.
            </p>
          </Card>
        ) : (
        <Card size="lg" className="insight__card">
          <div>
            <p className="insight__scope nums">{lead.scope}</p>
            <h3 className="h3 insight__title">{lead.title}</h3>
            <p className="prose insight__summary">{lead.summary}</p>

            {/* The card's third register. Figures are measured, the summary
                describes what was read, and this is neither — it is a
                judgement about what to do, which no volume of reviews can
                establish. Marked as such rather than blended into the prose
                above it, because a recommendation that reads like a finding
                borrows credibility it has not earned. */}
            {lead.recommendation && (
              <div className="audit__advice">
                <p className="audit__advice-label">Suggested action — judgement, not measurement</p>
                <p className="audit__advice-text">{lead.recommendation}</p>
              </div>
            )}

            <ul className="insight__impact nums">
              {lead.impact.map((figure, i) => (
                <li key={figure.label}>
                  <div className={`insight__figure${i === 0 ? ' insight__figure--accent' : ''}`}>
                    {figure.value}
                  </div>
                  <div className="insight__figure-label">{figure.label}</div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="insight__evidence-head">Evidence</p>
            <ul className="insight__quotes">
              {lead.evidence.map((item) => (
                <li className="insight__quote" key={item.source + item.quote.slice(0, 24)}>
                  <p className="insight__quote-text">“{item.quote}”</p>
                  <p className="insight__quote-source">{item.source}</p>
                </li>
              ))}
            </ul>
          </div>
        </Card>
        )}

        <ul className="insight__rest">
          {rest.map((item) => (
            <li key={item.id}>
              <Card variant="quiet">
                <h3 className="h3 insight__rest-title">{item.title}</h3>
                <p className="insight__rest-scope nums">{item.scope}</p>
                <ul className="insight__rest-figures nums">
                  {item.impact.slice(0, 2).map((figure) => (
                    <li key={figure.label}>
                      <div className="insight__rest-figure">{figure.value}</div>
                      <div className="insight__rest-figure-label">{figure.label}</div>
                    </li>
                  ))}
                </ul>
              </Card>
            </li>
          ))}
        </ul>

        <div className="audit__actions">
          {/* Printing is the export. The browser's own PDF writer produces the
              artefact, so there is no second renderer to disagree with what is
              on screen — and it works offline, which a server-side one would
              not. See the @media print block in LiveAudit.css. */}
          <Button variant="secondary" size="sm" onClick={() => window.print()}>
            Save this audit as PDF
          </Button>
        </div>

        {/* Stated here rather than in the FAQ. A page whose argument is that
            claims must carry their limits does not get to bury its own. */}
        <p className="audit__note">
          Public reviews only — app stores, Google Maps, or feedback you paste in. No private or
          customer data. Every figure above is computed from the review rows; the model decides only
          which reviews belong together and writes the summary, so there is no path by which a
          number it invented reaches this card. That is also why nothing here is denominated in
          money: revenue at risk needs your CRM, not a public corpus, and a plausible dollar figure
          is exactly the kind of thing this product exists to stop you from believing.
        </p>
      </div>
    </section>
  )
}
