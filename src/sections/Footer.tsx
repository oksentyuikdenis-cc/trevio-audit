import type { CSSProperties } from 'react'
import wordmark from '../assets/trevio-wordmark.svg'
import { CTA_HREF } from '../data/content'
import './Footer.css'

export function Footer() {
  return (
    <footer className="footer surface-dark">
      <div className="container footer__inner">
        <span
          className="footer__wordmark"
          style={{ '--wordmark': `url(${wordmark})` } as CSSProperties}
          role="img"
          aria-label="Trevio"
        />

        <p className="footer__note">
          Pre-launch. Every figure on this page comes from a fictional workspace.
        </p>

        <ul className="footer__links">
          <li>
            <a className="footer__link" href="#faq">
              FAQ
            </a>
          </li>
          <li>
            <a className="footer__link" href={CTA_HREF}>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
