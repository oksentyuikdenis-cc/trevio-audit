import { Button } from '../ui/Button'
import { CTA_HREF, CTA_LABEL, HEADINGS } from '../data/content'
import { SOURCES } from '../data/sources'
import './Hero.css'

const { hero } = HEADINGS

/**
 * The hero is also the page-load sequence: it is in view at load, so the
 * observer fires immediately and the group's stagger becomes the entrance.
 * There is no separate load animation and no delay before content — five
 * steps at 60ms is 240ms end to end, which is under the threshold where a
 * reader notices they are waiting.
 *
 * The channel list enters as one unit rather than nine. Staggering it would
 * add 540ms and, worse, would animate the least important thing on the screen
 * for longer than the headline.
 */
export function Hero() {
  return (
    <section className="section hero" id="top" data-motion-group>
      <div className="container hero__inner">
        <p className="eyebrow" data-motion="rise">
          {hero.eyebrow}
        </p>

        <h1 className="display hero__title" data-motion="rise">
          {hero.title}
          <span className="hero__beat">{hero.titleBeat}</span>
        </h1>

        <p className="prose hero__lead" data-motion="rise">
          {hero.lead}
        </p>

        <div className="hero__actions" data-motion="rise">
          <Button href={CTA_HREF}>{CTA_LABEL}</Button>
          <Button variant="secondary" href="#insight">
            See what it produces
          </Button>
        </div>

        <ul className="hero__channels" data-motion="rise">
          {SOURCES.map((source) => (
            <li className="hero__channel" key={source.id}>
              {source.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
