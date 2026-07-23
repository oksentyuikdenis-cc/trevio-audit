import { Card } from '../ui/Card'
import { SectionHead } from '../ui/SectionHead'
import { HEADINGS } from '../data/content'
import { INSIGHTS } from '../data/clusters'
import './Insight.css'

const { insight } = HEADINGS

const [lead, ...rest] = INSIGHTS

/**
 * Interface assembly — the one place the motion is doing an explaining job
 * rather than a polishing one.
 *
 * The card's parts arrive in the order the product produces them: what was
 * read, what was found, why, what it costs, and the conversations proving it.
 * A reader who never consciously registers the animation still absorbs that
 * the evidence comes attached to the claim rather than after it, which is the
 * single thing this page is trying to say.
 *
 * `data-motion-base="5"` continues the section's count instead of restarting
 * at zero, so the contents assemble after the card has arrived rather than
 * racing the container they live inside.
 */
export function Insight() {
  return (
    <section className="section" id="insight" data-motion-group>
      <div className="container">
        <SectionHead eyebrow={insight.eyebrow} title={insight.title} lead={insight.lead} />

        {/* Stated, not buried in the FAQ. Inventing traction would undermine
            the one thing this product sells. */}
        <p className="insight__label" data-motion="rise">
          Fictional workspace · illustrative figures
        </p>

        <Card
          size="lg"
          className="insight__card"
          data-motion="assemble"
          data-motion-group
          data-motion-base="5"
        >
          <div>
            <p className="insight__scope nums" data-motion="rise">
              {lead.scope}
            </p>
            <h3 className="h3 insight__title" data-motion="rise">
              {lead.title}
            </h3>
            <p className="prose insight__summary" data-motion="rise">
              {lead.summary}
            </p>

            <ul className="insight__impact nums" data-motion="rise">
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
            <p className="insight__evidence-head" data-motion="rise">
              Evidence
            </p>
            <ul className="insight__quotes" data-motion="rise">
              {lead.evidence.map((item) => (
                <li className="insight__quote" key={item.source}>
                  <p className="insight__quote-text">“{item.quote}”</p>
                  <p className="insight__quote-source">{item.source}</p>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <ul className="insight__rest">
          {rest.map((item) => (
            <li key={item.id}>
              <Card variant="quiet" data-motion="lift">
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
      </div>
    </section>
  )
}
