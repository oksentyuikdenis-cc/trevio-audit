import { Button } from '../ui/Button'
import { CTA_HREF, CTA_LABEL, HEADINGS, PILOT } from '../data/content'
import './Cta.css'

const { cta } = HEADINGS

export function Cta() {
  return (
    <section className="section surface-dark cta" id="apply" data-motion-group>
      <div className="container cta__inner">
        <h2 className="h2 cta__title" data-motion="rise">
          {cta.title}
        </h2>
        <p className="prose cta__lead" data-motion="rise">
          {cta.lead}
        </p>

        <div className="cta__actions" data-motion="rise">
          <Button href={CTA_HREF}>{CTA_LABEL}</Button>
        </div>

        <p className="cta__fine nums" data-motion="rise">
          {PILOT.slots} slots · no card · you can leave with your data at any point
        </p>
      </div>
    </section>
  )
}
