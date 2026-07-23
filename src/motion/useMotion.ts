import { useEffect, useRef } from 'react'

/** Nothing may stay hidden longer than this, whatever the observer does. */
const FAILSAFE_MS = 2000

/**
 * Stagger ceiling — a safety net, not the main mechanism. Lists that should
 * not stagger carry one `data-motion` on the container instead of one per
 * row, so this only catches a group that grew longer than its author meant.
 */
const MAX_STEPS = 8

const COUNT_MS = 900

/**
 * The whole motion system's runtime: one observer for the entire page.
 *
 * It does three things, and they are deliberately in one place rather than in
 * three hooks — a second observer would mean a second set of failure modes to
 * get right, and the reveal, the stagger and the counters all need to fire on
 * exactly the same signal to stay in step.
 *
 *   1. Assigns each element its stagger index, scoped to its group.
 *   2. Reveals `[data-motion]` elements as they enter the viewport.
 *   3. Starts any counter on the element it just revealed.
 *
 * Written as progressive enhancement: the CSS only hides anything once `mo`
 * is on <html>, which this hook adds. Three things break that chain in
 * practice and all three are handled:
 *
 *  - No IntersectionObserver → everything is revealed immediately.
 *  - The page is loaded in a background tab. Observers do not deliver
 *    callbacks while a document is hidden, so the page would otherwise be
 *    blank on first switch to it.
 *  - Anything else unforeseen → the failsafe timer reveals what is left.
 *
 * The failure mode of an entrance must never be invisible content.
 */
export function useMotion<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Bars are excluded from observation: scaled to zero they have zero area
    // and can never satisfy a threshold, so they are driven by their revealed
    // ancestor in CSS instead. They still get an index above, for the stagger.
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>('[data-motion]:not([data-motion="bar"])'),
    )
    if (targets.length === 0) return

    // ---- Stagger indices, scoped per group -------------------------------
    // A group is any element carrying `data-motion-group`; its motion
    // descendants count 0, 1, 2… in document order. Anything outside a group
    // stays at 0 and enters without delay. Authors never hand-write a delay,
    // which is what keeps the rhythm identical across eleven sections.
    //
    // `data-motion-base` offsets a nested sequence so it continues the
    // parent's count instead of restarting and overtaking the container it
    // lives in. It is an attribute rather than a CSS variable on purpose:
    // custom properties inherit, so a container declaring a base for its
    // children would delay itself by the same amount and arrive after its own
    // contents. Folding it in here keeps `--mo-i` absolute and the CSS trivial.
    const groups = Array.from(root.querySelectorAll<HTMLElement>('[data-motion-group]'))
    for (const group of groups) {
      const base = Number(group.dataset.motionBase ?? 0) || 0

      // Own only what no nested group has claimed, and filter before counting
      // so the indices come out contiguous. Counting first and skipping after
      // would let a nested sequence inflate the index of every later sibling —
      // the two secondary cards below the insight card jumped to step 8 that
      // way, and only survived because the ceiling caught them.
      //
      // The lookup starts at the parent, not at the element: `closest` matches
      // the element itself, so anything that is both a motion target and a
      // group — the insight card, the channel list — would name itself as its
      // own owner and never receive an index at all. It would then enter at
      // step 0 while its own contents waited, the exact inversion of what the
      // offset exists to prevent.
      const members = Array.from(group.querySelectorAll<HTMLElement>('[data-motion]')).filter(
        (el) => el.parentElement?.closest('[data-motion-group]') === group,
      )

      members.forEach((el, i) => {
        el.style.setProperty('--mo-i', String(Math.min(i, MAX_STEPS) + base))
      })
    }

    const reveal = (el: HTMLElement) => {
      el.classList.add('is-in')
      startCount(el, reduced)
    }

    /**
     * The failsafe drops the `mo` gate rather than just marking everything
     * revealed.
     *
     * Adding `is-in` alone is not enough to guarantee anything is on screen:
     * the element is still hidden by the gate and only becomes visible when a
     * transition runs. A transition needs a compositor tick, and the whole
     * reason the failsafe fired is that something in that chain is not
     * behaving. Under a stalled animation clock the transition holds its start
     * value — `fill: backwards` during the delay — and the page paints blank
     * with every element correctly marked as revealed.
     *
     * Removing the gate deletes the hidden state itself, so the final layout
     * is what the browser paints with no transition involved at all. Bars fall
     * back to the section's own `scaleX(--mo-scale)` and land at full length.
     */
    const revealAll = () => {
      targets.forEach(reveal)
      document.documentElement.classList.remove('mo')
    }

    if (typeof IntersectionObserver === 'undefined') {
      revealAll()
      return
    }

    document.documentElement.classList.add('mo')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          reveal(entry.target as HTMLElement)
          observer.unobserve(entry.target)
        }
      },
      // Reveal once the element is 12% into view rather than at the very
      // edge, so motion happens where the reader is looking.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.1 },
    )

    targets.forEach((el) => observer.observe(el))

    let failsafe = window.setTimeout(() => {
      revealAll()
      observer.disconnect()
    }, FAILSAFE_MS)

    // A tab that starts hidden gets its timers throttled too, so restart the
    // clock the moment it actually becomes visible. Tracked in one slot and
    // replaced rather than stacked — every switch back would otherwise queue
    // another timer that outlives the component.
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      window.clearTimeout(failsafe)
      failsafe = window.setTimeout(revealAll, FAILSAFE_MS)
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      window.clearTimeout(failsafe)
      document.removeEventListener('visibilitychange', onVisible)
      observer.disconnect()
    }
  }, [])

  return ref
}

/**
 * Counts an element up to the number in `data-count`.
 *
 * The element already renders its final value in markup, so this only ever
 * replaces text that is about to be replaced again — if JS never runs, if
 * motion is reduced, or if the number fails to parse, the correct figure is
 * already on screen and nothing here touches it. The last frame restores the
 * original string verbatim rather than reformatting, so whatever separators
 * or suffixes the markup used survive exactly.
 *
 * Text is the one thing in this system that is not GPU-composited. It is
 * affordable here because the type is set in tabular numerals: every digit
 * is the same width, so the element's box never changes and the count cannot
 * reflow the row it sits in.
 */
function startCount(el: HTMLElement, reduced: boolean) {
  const raw = el.dataset.count
  if (raw === undefined || el.dataset.counted === 'true') return

  const to = Number(raw)
  if (!Number.isFinite(to)) return

  el.dataset.counted = 'true'
  const final = el.textContent ?? ''
  if (reduced) return

  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min((now - start) / COUNT_MS, 1)
    // Ease-out cubic: fast enough to read as a total being computed, slow
    // enough at the end that the final value settles rather than snaps.
    const eased = 1 - (1 - t) ** 3
    if (t < 1) {
      el.textContent = Math.round(to * eased).toLocaleString('en-US')
      requestAnimationFrame(tick)
    } else {
      el.textContent = final
    }
  }
  requestAnimationFrame(tick)
}
