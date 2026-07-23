import type { CSSProperties } from 'react'
import { SectionHead } from '../ui/SectionHead'
import { HEADINGS } from '../data/content'
import { SOURCES, VOLUME_TOTAL, VOLUME_WINDOW_DAYS, CUSTOMER_COUNT } from '../data/sources'
import { CLUSTERS, LONG_TAIL_SHARE } from '../data/clusters'
import './Chaos.css'

const { chaos } = HEADINGS

const pct = (n: number) => `${Math.round(n * 100)}%`

/** The widest channel sets the bar scale, so the smallest is still visible. */
const MAX_SHARE = Math.max(...SOURCES.map((s) => s.share))

/**
 * Charts and counters — the section where motion carries information rather
 * than polish.
 *
 * The nine bars fill in sequence because that sequence is the claim: nine
 * channels, measured one after another, which is the work the reader is being
 * told they cannot do by hand. The rows themselves arrive together — animating
 * the labels as well would double the element count and say nothing.
 *
 * The counters run to 2,847 and 412 for the same reason: a number that lands
 * instantly is a fact, a number that accumulates is a volume. That is the
 * distinction this section exists to make.
 */
export function Chaos() {
  return (
    <section className="section" id="problem" data-motion-group>
      <div className="container">
        <SectionHead eyebrow={chaos.eyebrow} title={chaos.title} lead={chaos.lead} />

        <div className="chaos__grid">
          <ul className="chaos__channels" data-motion="rise" data-motion-group data-motion-base="4">
            {SOURCES.map((source) => (
              <li className="chaos__channel" key={source.id}>
                <div>
                  <div className="chaos__channel-name">{source.name}</div>
                  <div className="chaos__channel-detail">{source.detail}</div>
                </div>
                <div className="chaos__track" aria-hidden="true">
                  <div
                    className="chaos__fill"
                    data-motion="bar"
                    style={{ '--mo-scale': source.share / MAX_SHARE } as CSSProperties}
                  />
                </div>
                <div className="chaos__share nums">{pct(source.share)}</div>
              </li>
            ))}
          </ul>

          <div>
            <div className="chaos__stats">
              <div>
                {/* The markup already holds the final value; the counter only
                    replaces text it is about to restore. If JS never runs the
                    correct figure is on screen regardless. */}
                <div className="chaos__stat nums" data-motion="rise" data-count={VOLUME_TOTAL}>
                  {VOLUME_TOTAL.toLocaleString('en-US')}
                </div>
                <div className="chaos__stat-label">
                  messages in the last {VOLUME_WINDOW_DAYS} days
                </div>
              </div>
              <div>
                <div className="chaos__stat nums" data-motion="rise" data-count={CUSTOMER_COUNT}>
                  {CUSTOMER_COUNT}
                </div>
                <div className="chaos__stat-label">customers behind them</div>
              </div>
            </div>

            <p className="prose" data-motion="rise">
              Read end to end that is a working week, and it would have to be redone the
              moment the next batch lands. So it does not get read — it gets sampled, and
              the sample is whichever channel the person doing it already had open.
            </p>

            <ul className="chaos__themes" data-motion="rise">
              {CLUSTERS.map((cluster) => (
                <li
                  className={`chaos__theme${cluster.promoted ? ' chaos__theme--promoted' : ''}`}
                  key={cluster.id}
                >
                  {cluster.label}
                </li>
              ))}
            </ul>

            <p className="chaos__tail nums" data-motion="rise">
              Those six themes account for {pct(1 - LONG_TAIL_SHARE)} of the volume. The
              remaining {pct(LONG_TAIL_SHARE)} is a long tail that never forms a theme, and
              stays searchable rather than being forced into one.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
