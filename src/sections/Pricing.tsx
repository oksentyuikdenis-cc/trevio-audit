import { Card } from '../ui/Card'
import { SectionHead } from '../ui/SectionHead'
import { HEADINGS, PILOT, PRICING_MODEL } from '../data/content'
import './Pricing.css'

const { pricing } = HEADINGS

export function Pricing() {
  return (
    <section className="section surface-1" id="pricing" data-motion-group>
      <div className="container">
        <SectionHead eyebrow={pricing.eyebrow} title={pricing.title} lead={pricing.lead} />

        <div className="pri__grid">
          <Card size="lg" data-motion="lift">
            <p className="pri__slots nums">{PILOT.slots} slots</p>
            <h3 className="h3 pri__pilot-headline">{PILOT.headline}</h3>
            <p className="prose">{PILOT.body}</p>

            <div className="pri__terms">
              <div>
                <p className="pri__terms-head">You get</p>
                <ul className="pri__term-list">
                  {PILOT.gives.map((give) => (
                    <li key={give}>{give}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="pri__terms-head">We ask</p>
                <ul className="pri__term-list">
                  {PILOT.asks.map((ask) => (
                    <li key={ask}>{ask}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <div data-motion="rise">
            <p className="pri__model-head">What the price will be based on</p>
            <ul className="pri__lines">
              {PRICING_MODEL.charges.map((charge) => (
                <li className="pri__line" key={charge.label}>
                  <div className="pri__line-label">{charge.label}</div>
                  <div className="pri__line-note">{charge.note}</div>
                </li>
              ))}
            </ul>

            <p className="pri__model-head">What it will never be based on</p>
            <ul className="pri__lines">
              {PRICING_MODEL.never.map((item) => (
                <li className="pri__line pri__line--never" key={item.label}>
                  <div className="pri__line-label">{item.label}</div>
                  <div className="pri__line-note">{item.note}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
