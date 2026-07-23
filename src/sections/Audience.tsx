import { Card } from '../ui/Card'
import { SectionHead } from '../ui/SectionHead'
import { HEADINGS, ICP } from '../data/content'
import './Audience.css'

const { audience } = HEADINGS

export function Audience() {
  return (
    <section className="section surface-2" id="audience" data-motion-group>
      <div className="container">
        <SectionHead eyebrow={audience.eyebrow} title={audience.title} lead={audience.lead} />

        <div className="aud__grid">
          <ul className="aud__fits">
            {ICP.fits.map((fit) => (
              <li className="aud__fit" key={fit.title} data-motion="rise">
                <h3 className="h3 aud__fit-title">{fit.title}</h3>
                <p className="prose">{fit.body}</p>
              </li>
            ))}
          </ul>

          <Card data-motion="lift">
            <p className="aud__misfits-head">Not a fit</p>
            <ul className="aud__misfits">
              {ICP.misfits.map((misfit) => (
                <li className="aud__misfit" key={misfit}>
                  <span>{misfit}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  )
}
