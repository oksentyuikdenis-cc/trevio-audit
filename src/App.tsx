import { Nav } from './ui/Nav'
import { useMotion } from './motion/useMotion'
import { Hero } from './sections/Hero'
import { Insight } from './sections/Insight'
import { Chaos } from './sections/Chaos'
import { Steps } from './sections/Steps'
import { LiveAudit } from './sections/LiveAudit'
import { Comparison } from './sections/Comparison'
import { Audience } from './sections/Audience'
import { Pricing } from './sections/Pricing'
import { Faq } from './sections/Faq'
import { Cta } from './sections/Cta'
import { Footer } from './sections/Footer'

/**
 * Surface order, and the reason it is not negotiable:
 *
 *   paper ×5  →  surface-1, surface-2, surface-1, surface-1  →  dark ×2
 *
 * Five sections of paper, four of shifted warmth, then one dark block at the
 * very end covering the CTA and the footer. That single dark band is the
 * entire punctuation of the design — a second one anywhere higher spends it
 * for nothing and the page flattens out.
 *
 * The insight card is section two on purpose. It is the only place the
 * product is actually visible, and on the previous site it sat 4.5 screens
 * down where most visitors never reached it.
 *
 * Section five was a reserved slot for the 3D scene. It now holds a live audit
 * instead, and the open question about whether the scene survives the new
 * visual language is answered by that: the slot was sized to be judged in
 * place, and what it turned out to be worth was proof rather than decoration.
 * Two identical cards — section two on invented data and labelled fictional,
 * section five on a real corpus and labelled live — argue for the product more
 * than a particle field can. The scene weight this block was measuring stays
 * at zero.
 */
export function App() {
  // One observer for the page: reveals, stagger indices and counters all fire
  // off the same signal. See motion/useMotion.ts.
  const ref = useMotion<HTMLDivElement>()

  return (
    <div ref={ref}>
      <a className="skip-link" href="#insight">
        Skip to content
      </a>

      <Nav />

      <main>
        <Hero />
        <Insight />
        <Chaos />
        <Steps />
        <LiveAudit />

        <Comparison />
        <Audience />
        <Pricing />
        <Faq />

        <Cta />
      </main>

      <Footer />
    </div>
  )
}
