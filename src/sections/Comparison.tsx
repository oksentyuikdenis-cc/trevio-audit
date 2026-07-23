import { SectionHead } from '../ui/SectionHead'
import { COMPARISON, HEADINGS } from '../data/content'
import './Comparison.css'

const { comparison } = HEADINGS

export function Comparison() {
  return (
    <section className="section surface-1" id="comparison" data-motion-group>
      <div className="container">
        <SectionHead
          eyebrow={comparison.eyebrow}
          title={comparison.title}
          lead={comparison.lead}
        />

        {/* The table enters as one object. Staggering five rows would animate
            a comparison the reader wants to scan, not watch assemble. */}
        <div data-motion="lift">
          <table className="cmp">
            <thead>
              <tr>
                <th scope="col">What</th>
                <th scope="col">By hand</th>
                <th scope="col">With Trevio</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.metric}>
                  <td>
                    <div className="cmp__metric">{row.metric}</div>
                    <div className="cmp__note">{row.note}</div>
                  </td>
                  <td className="cmp__manual" data-label="By hand">
                    {row.manual}
                  </td>
                  <td className="cmp__trevio" data-label="With Trevio">
                    {row.trevio}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
