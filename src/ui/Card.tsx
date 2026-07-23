import type { HTMLAttributes, ReactNode } from 'react'
import './Card.css'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Large cards get the 20px radius; the default 8px carries everything else. */
  size?: 'md' | 'lg'
  variant?: 'solid' | 'quiet'
  lift?: boolean
}

export function Card({
  children,
  size = 'md',
  variant = 'solid',
  lift = false,
  className = '',
  // Everything else passes through so a card can carry `data-motion` and
  // `data-motion-group` without the motion system needing to know that Card
  // exists. Components declare intent; the system never special-cases them.
  ...rest
}: Props) {
  const classes = [
    'card',
    size === 'lg' ? 'card--lg' : '',
    variant === 'quiet' ? 'card--quiet' : '',
    lift ? 'card--lift' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}
