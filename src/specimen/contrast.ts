/**
 * WCAG 2.1 relative luminance and contrast ratio.
 *
 * Lives in the specimen rather than in a utils folder because the page it
 * serves is the point: printing the real ratio next to every swatch is what
 * stops a token whose name says "tertiary text" from being used as text when
 * it computes to 2.19:1. A number on screen argues better than a comment.
 */

function channel(value: number): number {
  const c = value / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

export function luminance(hex: string): number {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrast(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  const [light, dark] = la > lb ? [la, lb] : [lb, la]
  return (light + 0.05) / (dark + 0.05)
}

export type Verdict = 'AAA' | 'AA' | 'AA large' | 'fail'

export function verdict(ratio: number): Verdict {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA large'
  return 'fail'
}
