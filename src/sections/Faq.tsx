import { SectionHead } from '../ui/SectionHead'
import { FAQ, HEADINGS } from '../data/content'
import './Faq.css'

const { faq } = HEADINGS

export function Faq() {
  return (
    <section className="section surface-1" id="faq" data-motion-group>
      <div className="container">
        <SectionHead eyebrow={faq.eyebrow} title={faq.title} />

        <div className="faq__list" data-motion="lift">
          {FAQ.map((item) => (
            <details className="faq__item" key={item.q}>
              <summary className="faq__q">
                {item.q}
                <svg className="faq__sign" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </summary>
              <p className="faq__a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
