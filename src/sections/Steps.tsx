import { SectionHead } from '../ui/SectionHead'
import { HEADINGS, STEPS } from '../data/content'
import './Steps.css'

const { steps } = HEADINGS

export function Steps() {
  return (
    <section className="section" id="how" data-motion-group>
      <div className="container">
        <SectionHead eyebrow={steps.eyebrow} title={steps.title} lead={steps.lead} />

        <ul className="steps__list">
          {STEPS.map((step, i) => (
            <li
              className={`steps__item${i === STEPS.length - 1 ? ' steps__item--last' : ''}`}
              key={step.index}
              data-motion="rise"
            >
              <span className="steps__index nums">{step.index}</span>
              <p className="steps__label">{step.label}</p>
              <h3 className="h3 steps__title">{step.title}</h3>
              <p className="prose">{step.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
