import './SectionHead.css'

interface Props {
  eyebrow?: string
  /** Two beats, second one shorter. See the copy pattern in the design code. */
  title: string
  lead?: string
  wide?: boolean
}

export function SectionHead({ eyebrow, title, lead, wide = false }: Props) {
  /* Eyebrow, heading, lead — always in that order, always one stagger step
     apart. The rhythm of a section opening is identical everywhere on the
     page because it is written once, here, rather than per section. */
  return (
    <div className={`sec-head${wide ? ' sec-head--wide' : ''}`}>
      {eyebrow && (
        <p className="eyebrow sec-head__eyebrow" data-motion="rise">
          {eyebrow}
        </p>
      )}
      <h2 className="h2" data-motion="rise">
        {title}
      </h2>
      {lead && (
        <p className="prose sec-head__lead" data-motion="rise">
          {lead}
        </p>
      )}
    </div>
  )
}
