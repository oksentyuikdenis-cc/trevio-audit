/**
 * The nine channels the fictional workspace ingests, and the volume figures
 * every counter on the page reads from.
 *
 * One dataset feeds the copy, the counters and (later) the 3D scene, so the
 * numbers on the page can never disagree with the picture behind them.
 * Changing the scenario is a one-file edit.
 */

export interface Source {
  id: string
  name: string
  detail: string
  /** Share of total inbound volume. The nine sum to 1. */
  share: number
}

export const VOLUME_TOTAL = 2847
export const VOLUME_WINDOW_DAYS = 14
export const CUSTOMER_COUNT = 412

export const SOURCES: Source[] = [
  { id: 'support', name: 'Support tickets', detail: 'Zendesk', share: 0.24 },
  { id: 'reviews', name: 'App store reviews', detail: 'iOS · Android', share: 0.16 },
  { id: 'chat', name: 'Live chat', detail: 'Intercom', share: 0.14 },
  { id: 'sales', name: 'Sales calls', detail: 'Gong transcripts', share: 0.11 },
  { id: 'community', name: 'Community', detail: 'Reddit · Discord', share: 0.1 },
  { id: 'social', name: 'Social', detail: 'X · LinkedIn', share: 0.09 },
  { id: 'surveys', name: 'Surveys & NPS', detail: 'Delighted', share: 0.07 },
  { id: 'tickets', name: 'Issue trackers', detail: 'Jira · Linear', share: 0.055 },
  { id: 'docs', name: 'Docs & notes', detail: 'Notion · CRM', share: 0.045 },
]

/**
 * Raw hex per channel, kept for WebGL — which cannot resolve CSS custom
 * properties — and for nothing else.
 *
 * Deliberately NOT used to colour-code the channel list on the page. Murano's
 * light range is a narrow band of warm neutrals; nine saturated dots would be
 * the one thing on the page arguing with the palette. If the 3D scene lands,
 * this is the map it paints particles with.
 */
export const SOURCE_HEX: Record<string, string> = {
  support: '#6C9BEF',
  reviews: '#E8A33D',
  chat: '#7F8FF4',
  sales: '#4FB477',
  community: '#E5626A',
  social: '#B57BDC',
  surveys: '#4FC3C7',
  tickets: '#D98C3D',
  docs: '#9C9CA6',
}
