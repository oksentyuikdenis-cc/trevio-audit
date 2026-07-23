import type { ReactNode } from 'react'
import './Button.css'

type Variant = 'primary' | 'secondary'
type Size = 'sm' | 'md'

interface Props {
  children: ReactNode
  variant?: Variant
  size?: Size
  /** Renders an anchor instead of a button. Links navigate; buttons act. */
  href?: string
  onClick?: () => void
  className?: string
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
}: Props) {
  const classes = ['btn', `btn--${variant}`, size === 'sm' ? 'btn--sm' : '', className]
    .filter(Boolean)
    .join(' ')

  if (href) {
    return (
      <a className={classes} href={href}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} type="button" onClick={onClick}>
      {children}
    </button>
  )
}
