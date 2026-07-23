import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Button } from './Button'
import wordmark from '../assets/trevio-wordmark.svg'
import { CTA_LABEL, CTA_HREF } from '../data/content'
import './Nav.css'

const LINKS = [
  { href: '#insight', label: 'What it produces' },
  { href: '#how', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

/** Far enough that a touch bounce does not flicker the bar, close enough
 *  that the change feels like a response rather than a delay. */
const CONDENSE_AT = 24

export function Nav() {
  const [open, setOpen] = useState(false)
  const [condensed, setCondensed] = useState(false)
  const frame = useRef(0)

  /*
   * The bar is translucent so the paper reads through it at the top of the
   * page. The moment body text starts passing underneath, that translucency
   * stops being a texture and starts being a legibility problem — so the fill
   * firms up. This is the only reason the behaviour exists; it is not a
   * scroll effect.
   *
   * Only a crossing flips state, so this re-renders twice for a whole page of
   * scrolling rather than once per frame, and the measurement itself is
   * rAF-throttled so a fast wheel cannot queue a backlog of reads.
   */
  useEffect(() => {
    const measure = () => {
      frame.current = 0
      setCondensed(window.scrollY > CONDENSE_AT)
    }
    const onScroll = () => {
      if (frame.current) return
      frame.current = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // A menu that stays open behind you after a jump is a bug users blame
  // themselves for.
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('hashchange', close)
    return () => window.removeEventListener('hashchange', close)
  }, [open])

  return (
    <nav
      className={`nav${open ? ' is-open' : ''}${condensed ? ' is-condensed' : ''}`}
      data-motion="fade"
    >
      <div className="container nav__inner">
        <a className="nav__brand" href="#top" aria-label="Trevio — home">
          <span
            className="nav__wordmark"
            style={{ '--wordmark': `url(${wordmark})` } as CSSProperties}
          />
        </a>

        <ul className="nav__links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a className="nav__link" href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav__cta">
          <Button variant="secondary" size="sm" href={CTA_HREF}>
            {CTA_LABEL}
          </Button>
        </div>

        <button
          className="nav__toggle"
          type="button"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            {open ? (
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" />
            ) : (
              <path d="M2 5h14M2 13h14" stroke="currentColor" strokeWidth="1.5" />
            )}
          </svg>
        </button>
      </div>
    </nav>
  )
}
